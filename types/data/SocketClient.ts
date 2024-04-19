import ReconnectingWebSocket, {
  Event,
  ErrorEvent,
  CloseEvent,
} from 'reconnecting-websocket';

export type SocketState =
  | 'connecting'
  | 'connected'
  | 'disconnecting'
  | 'disconnected';

export type SocketRoom = 'SERVER' | 'LOG' | string;

export type EventHandler = (data: any, event: MessageEvent) => void;

type SocketEvent =
  | {
      method: 'LOAD';
      room: string;
      data: string[];
    }
  | {
      method: 'MESSAGE';
      room: string;
      data: string;
    }
  | {
      method: 'ROOM_MESSAGE';
      room: string;
      data: string;
    };

type MessagePayload =
  | {
      method: 'MESSAGE';
      data: string;
    }
  | {
      method: 'LOAD';
    }
  | {
      method: 'AUTHORIZATION';
      data: string;
    }
  | {
      method: 'JOIN_ROOM';
      data: string;
    }
  | {
      method: 'LEAVE_ROOM';
      data: string;
    };

export default class SocketClient {
  private socket: ReconnectingWebSocket;

  static instance: SocketClient;

  handlers: Record<string, EventHandler> = {};

  private errors: ((event: ErrorEvent) => void)[] = [];
  private connects: ((event: Event) => void)[] = [];
  private disconnects: ((event: CloseEvent) => void)[] = [];

  private room: string = '';

  public onMessage<T extends SocketEvent['method']>(
    method: T,
    handler: (data: Extract<SocketEvent, { method: T }>['data']) => void,
  ) {
    this.handlers[method + this.room] = handler;
    this.room = '';
  }

  public onRoom(room: SocketRoom) {
    this.room = room;

    return this;
  }

  constructor(url: string) {
    this.socket = new ReconnectingWebSocket(url);

    this.socket.onmessage = async (event) => {
      try {
        const data = event.data;
        const message = JSON.parse(data);

        const handler = this.handlers[message.method + message.room];

        if (!handler) {
          return;
        }

        handler(message.data, event);
      } catch (error) {
        console.error(error);
      }
    };
    this.socket.onerror = (event) => {
      this.errors.forEach((error) => error(event));
    };
    this.socket.onopen = (event) => {
      this.connects.forEach((connect) => connect(event));
    };
    this.socket.onclose = (event) => {
      this.disconnects.forEach((disconnect) => disconnect(event));
    };

    SocketClient.instance?.close();
    SocketClient.instance = this;
  }

  public send(payload: MessagePayload) {
    this.socket.send(JSON.stringify({ ...payload, room: this.room }));
    this.room = '';
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
    this.socket.close();
  }

  public getState(): SocketState {
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
