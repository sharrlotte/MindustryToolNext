import ReconnectingWebSocket, { CloseEvent, ErrorEvent, Event } from 'reconnecting-websocket';

import { Message } from '@/types/response/Message';
import { User } from '@/types/response/User';

export type SocketState = 'connecting' | 'connected' | 'disconnecting' | 'disconnected';
export type SocketRoom = 'SERVER' | 'LOG' | string;
export type SocketError = { error: { message: string } };
export type EventHandler = (data: any | SocketError, event: MessageEvent) => void;

type BaseSocketEvent = { id: string };

type SocketEvent = BaseSocketEvent &
  (
    | { method: 'GET_MESSAGE'; room: string; data: Message[] }
    | { method: 'MESSAGE'; room: string; data: Message }
    | { method: 'ROOM_MESSAGE'; room: string; data: Message }
    | { method: 'GET_MEMBER'; room: string; data: User[] }
    | { method: 'LAST_MESSAGE'; room: string; data: Message }
  );

type MessagePayload =
  | { method: 'MESSAGE'; data: string }
  | { method: 'SERVER_MESSAGE'; data: string }
  | { method: 'GET_MESSAGE'; cursor: string | null; size: number }
  | { method: 'JOIN_ROOM'; data: string }
  | { method: 'LEAVE_ROOM'; data: string }
  | { method: 'GET_MEMBER'; page: number; size: number }
  | { method: 'LAST_MESSAGE' };

export type MessageMethod = MessagePayload['method'];

type PromiseReceiver = { resolve: (value: unknown) => void; reject: (reason: any) => void };

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type SocketResult<T> = Extract<SocketEvent, { method: T }>['data'] | SocketError;

type Task =
  | {
      room: string;
    }
  | {
      request: any;
    };

export default class SocketClient {
  private tasks: Task[] = [];
  private socket: ReconnectingWebSocket | null = null;
  private handlers: Record<string, EventHandler> = {};
  private errors: ((event: ErrorEvent) => void)[] = [];
  private connects: ((event: Event) => void)[] = [];
  private disconnects: ((event: CloseEvent) => void)[] = [];
  private room: string = '';
  private rooms: string[] = [];
  private requests: Record<string, PromiseReceiver> = {};
  private url: string;
  private isProcessing = false;

  constructor(url: string) {
    this.url = url;

    setInterval(async () => await this.processTask(), 10);
  }

  private async processTask() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this.tasks.length !== 0) {
      const task = this.tasks.shift();

      if (task) {
        if ('room' in task) {
          const id = genId();
          const promise = new Promise<any>((resolve, reject) => {
            this.requests[id] = { resolve, reject };

            if (!this.socket) {
              throw new Error('Socket is not connected');
            }

            this.socket.send(
              JSON.stringify({
                id,
                method: 'JOIN_ROOM',
                data: task.room,
                room: task.room,
                acknowledge: true,
              }),
            );

            setTimeout(() => {
              delete this.requests[id];
              reject(`Request timeout: join room ${task.room}`);
            }, 10000);
          });

          await promise;
          this.rooms.push(task.room);
        } else {
          if (!this.socket) {
            throw new Error('Socket is not connected');
          }
          this.socket.send(task.request);
        }
      }
    }

    this.isProcessing = false;
  }

  public connect() {
    if (this.socket) {
      return this.socket;
    }

    const instant = new ReconnectingWebSocket(this.url);

    this.socket = instant;

    this.socket.onmessage = async (event) => {
      try {
        const data = event.data;
        const message = JSON.parse(data);

        if (!message.method || !message.id) return;

        const handler = this.handlers[message.method + message.room];
        if (handler) {
          if (message.method === 'Error') {
            handler({ error: { message: message.message } }, event);
          } else {
            handler(message.data, event);
          }
        }

        const request = this.requests[message.id];
        if (request) {
          if (message.method === 'Error') {
            request.reject(message.message);
          } else {
            request.resolve(message.data);
          }
          delete this.requests[message.id];
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    };

    this.socket.onerror = (event) => this.errors.forEach((error) => error(event));
    this.socket.onopen = (event) => {
      this.rooms = [];
      this.connects.forEach((connect) => connect(event));
    };
    this.socket.onclose = (event) => {
      this.rooms = [];
      this.disconnects.forEach((disconnect) => disconnect(event));
    };

    return instant;
  }

  public async onMessage<T extends SocketEvent['method']>(method: T, handler: (data: SocketResult<T>) => void) {
    this.handlers[method + this.room] = handler;

    if (this.room && !this.rooms.includes(this.room)) {
      try {
        this.joinRoom(this.room);
      } catch (err) {
        console.error('Error joining room:', err);
      }
    }
    this.room = '';
  }

  public onRoom(room: SocketRoom) {
    this.room = room;
    return this;
  }

  public async send(payload: MessagePayload) {
    if (this.room && !this.rooms.includes(this.room)) {
      this.tasks.push({ room: this.room });
    }

    const json = JSON.stringify({ ...payload, room: this.room });
    this.tasks.push({ request: json });

    this.room = '';

    return json;
  }

  public async await<T extends MessagePayload>(payload: T): Promise<SocketResult<T['method']>> {
    if (this.room && !this.rooms.includes(this.room)) {
      this.tasks.push({ room: this.room });
    }

    const id = genId();
    const promise = new Promise<any>((resolve, reject) => {
      this.requests[id] = { resolve, reject };

      const json = JSON.stringify({ id, ...payload, room: this.room, acknowledge: true });

      this.tasks.push({ request: json });

      this.room = '';

      setTimeout(() => {
        delete this.requests[id];

        reject(`Request timeout: ${json}`);
      }, 10000);
    });

    return await promise;
  }

  public async joinRoom(room: string) {
    this.tasks.push({ room: room });
  }

  public onConnect(handler: (event: Event) => void) {
    this.connects.push(handler);
  }

  public onDisconnect(handler: (event: CloseEvent) => void) {
    this.disconnects.push(handler);
  }

  public onError(handler: (event: ErrorEvent) => void) {
    this.errors.push(handler);
  }

  public close() {
    if (this.socket && this.socket.readyState === this.socket.OPEN) {
      this.socket.close();
    }
  }

  public getState(): SocketState {
    if (!this.socket) return 'disconnected';

    switch (this.socket.readyState) {
      case this.socket.CONNECTING:
        return 'connecting';
      case this.socket.OPEN:
        return 'connected';
      case this.socket.CLOSING:
        return 'disconnecting';
      case this.socket.CLOSED:
        return 'disconnected';
      default:
        return 'disconnected';
    }
  }
}
