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

  public message?: (event: MessageEvent<string>) => void;
  public error?: (event: ErrorEvent) => void;
  public connect?: (event: Event) => void;
  public disconnect?: (event: CloseEvent) => void;

  constructor(url: string) {
    this.socket = new ReconnectingWebSocket(url);
    this.socket.onmessage = (event) => {
      if (this.message) this.message(event);
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
  }

  public send(payload: MessagePayload) {
    this.socket.send(JSON.stringify(payload));
  }

  public close() {
    this.send({
      method: 'DISCONNECT',
    });
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

type MessageMethod = 'DISCONNECT' | 'MESSAGE';

type MessagePayload = {
  method: MessageMethod;
  data?: any;
};
