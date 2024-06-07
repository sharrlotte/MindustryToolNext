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
type BaseSocketEvent = {
  id: string;
};

type SocketEvent = BaseSocketEvent &
  (
    | {
        method: 'GET_MESSAGE';
        room: string;
        data: string[];
      }
    | {
        method: 'MESSAGE';
        room: string;
        data: string;
      }
    | {
        method: 'SERVER_MESSAGE';
        room: string;
        data: string;
      }
    | {
        method: 'ROOM_MESSAGE';
        room: string;
        data: string;
      }
  );

type BaseMessagePayload = {};

type MessagePayload = BaseMessagePayload &
  (
    | {
        method: 'MESSAGE';
        data: string;
      }
    | {
        method: 'SERVER_MESSAGE';
        data: string;
      }
    | {
        method: 'GET_MESSAGE';
        page: number;
        items: number;
      }
    | {
        method: 'JOIN_ROOM';
        data: string;
      }
    | {
        method: 'LEAVE_ROOM';
        data: string;
      }
  );

type PromiseReceiver = {
  resolve: (value: unknown) => void;
  reject: (reason: any) => void;
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

export default class SocketClient {
  private socket: ReconnectingWebSocket;

  static instance: SocketClient;

  handlers: Record<string, EventHandler> = {};

  private errors: ((event: ErrorEvent) => void)[] = [];
  private connects: ((event: Event) => void)[] = [];
  private disconnects: ((event: CloseEvent) => void)[] = [];

  private room: string = '';

  private requests: Record<string, PromiseReceiver> = {};

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

        if (message.id) {
          const { resolve } = this.requests[message.id];
          resolve(message.data);
        }

        const handler = this.handlers[message.method + message.room];

        if (!handler) {
          return;
        }

        handler(message.data, event);
      } catch (error) {}
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
  public async await<T extends MessagePayload>(
    payload: T,
  ): Promise<Extract<SocketEvent, { method: T['method'] }>['data']> {
    const id = genId();
    this.socket.send(
      JSON.stringify({ id, ...payload, room: this.room, acknowledge: true }),
    );
    this.room = '';

    const promise = new Promise<any>((resolve, reject) => {
      this.requests[id] = { resolve, reject };

      const timeout = setTimeout(() => {
        reject('Request timeout');

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
