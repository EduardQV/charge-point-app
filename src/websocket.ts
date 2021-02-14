import * as http from 'http';
import WebSocket from 'ws';
import { Event, EventType } from './api/models/message.model';

class WebSocketServer {
  private _wss: WebSocket.Server;

  constructor(httpServer: http.Server) {
    this._wss = new WebSocket.Server({ server: httpServer });
    this.onConnection();
  }

  get wss(): WebSocket.Server {
    return this._wss;
  }

  private onConnection() {
    this._wss.on('connection', (ws: WebSocket) => {
      const event: Event = {
        event: EventType.Connection,
        message: 'You have connected to the charge-point-app WebSocket'
      };

      ws.send(JSON.stringify(event));
    });
  }
}

export default WebSocketServer;
