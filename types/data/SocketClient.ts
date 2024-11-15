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

export default class SocketClient {
  private socket: ReconnectingWebSocket | null = null;
  handlers: Record<string, EventHandler> = {};
  private errors: ((event: ErrorEvent) => void)[] = [];
  private connects: ((event: Event) => void)[] = [];
  private disconnects: ((event: CloseEvent) => void)[] = [];
  private room: string = '';
  private rooms: string[] = [];
  private requests: Record<string, PromiseReceiver> = {};
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  public connect() {
    if (this.socket && (this.socket.readyState === this.socket.OPEN || this.socket.readyState === this.socket.CONNECTING)) {
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
        this.rooms.push(this.room);
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
      return this.joinRoom(this.room).then(() => {
        this.rooms.push(this.room);

        const json = JSON.stringify({ ...payload, room: this.room });

        this.socket?.send(json);
        this.room = '';
        return json;
      });
    } else {
      const json = JSON.stringify({ ...payload, room: this.room });

      this.socket?.send(json);
      this.room = '';

      return json;
    }
  }

  public async joinRoom(room: string) {
    const id = genId();
    const promise = new Promise<any>((resolve, reject) => {
      this.requests[id] = { resolve, reject };
      this.socket?.send(
        JSON.stringify({
          id,
          method: 'JOIN_ROOM',
          data: room,
          room: room,
          acknowledge: true,
        }),
      );

      const timeout = setTimeout(() => {
        reject(`Request timeout: join room ${room}`);
        delete this.requests[id];
        return () => clearTimeout(timeout);
      }, 10000);
    });

    return await promise;
  }

  public async await<T extends MessagePayload>(payload: T): Promise<SocketResult<T['method']>> {
    const room = this.room;
    if (room && !this.rooms.includes(room)) {
      try {
        await this.joinRoom(room);
        this.rooms.push(room);
      } catch (err) {
        this.rooms = this.rooms.filter((r) => r !== room);
        console.error('Error joining room for await:', err);
      }
    }

    const id = genId();
    const promise = new Promise<any>((resolve, reject) => {
      this.requests[id] = { resolve, reject };
      const json = JSON.stringify({ id, ...payload, room, acknowledge: true });
      this.socket?.send(json);
      this.room = '';

      const timeout = setTimeout(() => {
        reject(`Request timeout: ${json}`);
        delete this.requests[id];
        return () => clearTimeout(timeout);
      }, 10000);
    });

    return await promise;
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
