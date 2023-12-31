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

export default class SocketClient {
  socket: ReconnectingWebSocket;

  private static instance: SocketClient | undefined;

  public message?: (data: any, event: MessageEvent) => void;
  public error?: (event: ErrorEvent) => void;
  public connect?: (event: Event) => void;
  public disconnect?: (event: CloseEvent) => void;

  constructor(url: string) {
    this.socket = new ReconnectingWebSocket(url);

    if (SocketClient.instance) {
      SocketClient.instance.close();
    }

    SocketClient.instance = this;

    this.socket.onmessage = (event) => {
      try {
        if (this.message) {
          this.message(JSON.parse(event.data), event);
        }
      } catch (error) {
        console.error(event);
      }
    };
    this.socket.onerror = (event) => {
      if (this.error) this.error(event);
      if (this.message == null) {
        this.close();
      }
    };
    this.socket.onopen = (event) => {
      if (this.connect) this.connect(event);
    };
    this.socket.onclose = (event) => {
      if (this.disconnect) this.disconnect(event);
    };
  }

  public send(payload: MessagePayload) {
    this.socket.send(JSON.stringify(payload));
  }

  public close() {
    this.send({
      method: 'DISCONNECT',
    });
    this.socket.onclose = () => {};
    this.socket.onerror = () => {
      this.close();
    };
    this.socket.onmessage = () => {
      this.close();
    };
    this.socket.onopen = () => {
      this.close();
    };
    setTimeout(() => this.socket.close(), 1000);
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

type MessagePayload =
  | {
      method: 'MESSAGE';
      data: string;
    }
  | {
      method: 'DISCONNECT';
    }
  | {
      method: 'LOAD';
    };
