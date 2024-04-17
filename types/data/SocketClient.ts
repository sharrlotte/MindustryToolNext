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

  public error?: (event: ErrorEvent) => void;
  public connect?: (event: Event) => void;
  public disconnect?: (event: CloseEvent) => void;

  private room: string = '';

  public onMessage<T extends SocketEvent['method']>(
    method: T,
    handler: (data: Extract<SocketEvent, { method: T }>['data']) => void,
  ) {
    this.handlers[method + this.room] = handler;
    this.room = '';
  }

  public onRoom(room: string) {
    this.room = room;
  }

  constructor(url: string) {
    this.socket = new ReconnectingWebSocket(url);

    this.socket.onmessage = async (event) => {
      try {
        const data = event.data;
        const message = JSON.parse(data);

        const handler = this.handlers[message.method];

        if (!handler) {
          return;
        }

        handler(message.data, event);
      } catch (error) {
        console.error(error);
      }
    };
    this.socket.onerror = (event) => {
      if (this.error) this.error(event);
    };
    this.socket.onopen = (event) => {
      if (this.connect) this.connect(event);
    };
    this.socket.onclose = (event) => {
      if (this.disconnect) this.disconnect(event);
    };

    SocketClient.instance?.close();
    SocketClient.instance = this;
  }

  public send(payload: MessagePayload) {
    this.socket.send(JSON.stringify({ ...payload, room: this.room }));
    this.room = '';
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
