import { WebSocket } from 'partysocket';
import { ErrorEvent } from 'partysocket/ws';

import { Message } from '@/types/response/Message';
import { Notification } from '@/types/response/Notification';

export type SocketState = 'connecting' | 'connected' | 'disconnecting' | 'disconnected';
export type SocketRoom = 'SERVER' | 'LOG' | string;
export type SocketError = { error: { message: string } };
export type EventHandler = (data: any | SocketError, event: MessageEvent) => void;

type BaseSocketEvent = { id: string };

type SocketEvent = BaseSocketEvent &
  (
    | { method: 'NOTIFICATION'; room: string; data: Notification } //
    | { method: 'MESSAGE'; room: string; data: Message }
  );

type MessagePayload = { method: 'MESSAGE'; data: string } | { method: 'JOIN' };

export type MessageMethod = MessagePayload['method'];

type PromiseReceiver = { timeout: any; resolve: (value: unknown) => void; reject: (reason: any) => void };

export type SocketResult<T> = Extract<SocketEvent, { method: T }>['data'] | SocketError;

export default class SocketClient {
  private socket: WebSocket | null = null;
  private handlers: Record<string, EventHandler[]> = {};
  private errors: ((event: ErrorEvent) => void)[] = [];
  private connects: ((event: Event) => void)[] = [];
  private disconnects: ((event: CloseEvent) => void)[] = [];
  private room: string = '';
  private requests: Record<string, PromiseReceiver> = {};
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  public connect() {
    if (this.socket) {
      if (this.socket.readyState !== this.socket.OPEN) {
        this.socket.reconnect();
      }
      return this.socket;
    }

    const instance = new WebSocket(this.url);

    this.socket = instance;

    window.addEventListener('beforeunload', () => {
      instance.onclose = function () {}; // disable onclose handler first
      instance.close();
    });

    this.socket.onmessage = async (event) => {
      try {
        const data = event.data;
        const message = JSON.parse(data);

        if (!message.method) throw new Error('Invalid message method: ' + message);

        const handlers = this.handlers[message.method + message.room];

        if (handlers) {
          if (message.method === 'Error') {
            handlers.forEach((handler) => handler({ error: { message: message.message } }, event));
          } else {
            handlers.forEach((handler) => handler(message.data, event));
          }
        } else {
          if (message.id === undefined) throw new Error('Invalid message id: ' + JSON.stringify(message));

          const request = this.requests[message.id];

          if (request) {
            if (message.method === 'Error') {
              request.reject(message.message);
            } else {
              request.resolve(message.data);
            }
            clearTimeout(request.timeout);

            delete this.requests[message.id];
          }
        }
      } catch (error) {
        //
      }
    };

    this.socket.onerror = (event) => this.errors.forEach((error) => error(event));
    this.socket.onopen = (event) => this.connects.forEach((connect) => connect(event));
    this.socket.onclose = (event) => this.disconnects.forEach((disconnect) => disconnect(event));

    return instance;
  }

  public onMessage<T extends SocketEvent['method']>(method: T, handler: (data: SocketResult<T>) => void) {
    const room = `${this.room}`;
    this.room = '';

    const handlers = this.handlers[method + room];

    if (handlers) {
      handlers.push(handler);
    } else {
      this.handlers[method + room] = [handler];
    }

    return () => {
      this.onRoom(room).remove(method, handler);
    };
  }

  public remove<T extends SocketEvent['method']>(method: T, handler: (data: SocketResult<T>) => void) {
    const handlers = this.handlers[method + this.room];

    if (handlers) {
      this.handlers[method + this.room] = handlers.filter((h) => h !== handler);
    }
    this.room = '';
  }

  public onRoom(room: SocketRoom) {
    this.room = room;

    return this;
  }

  public async send(payload: MessagePayload) {
    const json = JSON.stringify({ ...payload, room: this.room });
    this.socket?.send(json);

    this.room = '';

    return json;
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

  public async close() {
    this.connects = [];
    this.disconnects = [];

    if (this.socket) {
      if (this.getState() === 'connected') {
        this.socket.close();
      } else {
        this.socket.onopen = () => {
          this.socket?.close();
        };
      }
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
