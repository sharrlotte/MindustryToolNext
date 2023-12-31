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

  public message?: (data: any, event: MessageEvent) => void;
  public error?: (event: ErrorEvent) => void;
  public connect?: (event: Event) => void;
  public disconnect?: (event: CloseEvent) => void;

  constructor(url: string) {
    this.socket = new ReconnectingWebSocket(url);
    this.socket.onmessage = (event) => {
      try {
        if (this.message) this.message(JSON.parse(event.data), event);
      } catch (error) {
        console.error(event);
      }
    };
    this.socket.onerror = (event) => {
      if (this.error) this.error(event);
      if (this.message == null) {
        this.socket.close();
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
    this.socket.onerror = () => {};
    this.socket.onmessage = () => {};
    this.socket.onopen = () => {};
    this.socket.close();
  }

  public getState(): SocketState {
    switch (this.socket.readyState) {
      case 0:
        return 'connecting';
      case 1:
        return 'connected';
      case 2:
        return 'disconnecting';
      case 3:
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
