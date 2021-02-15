import WebSocket from 'ws';
import * as http from 'http';
import WebSocketServer from '../src/websocketserver';
import { Event, EventType } from '../src/api/models/event.model';
jest.mock('ws');
jest.mock('http');

describe('Unit test for WebSocketServer', () => {
  const server: WebSocketServer = new WebSocketServer(new http.Server());

  describe('Unit test for send function', () => {
    const sendSpy = jest.spyOn(WebSocket.prototype, 'send');

    describe('Given event', () => {
      const event: Event = {
        event: EventType.Connection,
        message: 'Test message.'
      };

      beforeEach(() => {
        sendSpy.mockClear();
      });

      describe('When there are clients connected', () => {
        beforeEach(() => {
          const clients: Set<WebSocket> = new Set();
          clients.add(new WebSocket(''));
          clients.add(new WebSocket(''));
          jest.spyOn(WebSocketServer.prototype, 'clients', 'get').mockReturnValue(clients);
        });

        it('Then send the event to clients', () => {
          server.send(event);

          expect(sendSpy).toHaveBeenCalledTimes(2);
          expect(sendSpy).toHaveBeenCalledWith(JSON.stringify(event));
        });
      });

      describe('When there NO are clients connected', () => {
        beforeEach(() => {
          jest.spyOn(WebSocketServer.prototype, 'clients', 'get').mockReturnValue(new Set());
        });

        it('Then NOT send events', () => {
          server.send(event);

          expect(sendSpy).not.toHaveBeenCalled();
        });
      });
    });

    describe('Given event and client', () => {
      const client: WebSocket = new WebSocket('');
      const event: Event = {
        event: EventType.Connection,
        message: 'Test message.'
      };

      describe('When get the client', () => {
        beforeEach(() => {
          sendSpy.mockClear();
        });

        it('Then send the event to client', () => {
          server.send(event, client);

          expect(sendSpy).toHaveBeenCalledTimes(1);
          expect(sendSpy).toHaveBeenCalledWith(JSON.stringify(event));
        });
      });
    });

    describe('Given event and clients', () => {
      const clients: Set<WebSocket> = new Set();
      clients.add(new WebSocket(''));
      clients.add(new WebSocket(''));
      const event: Event = {
        event: EventType.Connection,
        message: 'Test message.'
      };

      describe('When get the clients', () => {
        beforeEach(() => {
          sendSpy.mockClear();
        });

        it('Then send the events', () => {
          server.send(event, clients);

          expect(sendSpy).toHaveBeenCalledTimes(2);
          expect(sendSpy).toHaveBeenCalledWith(JSON.stringify(event));
        });
      });
    });
  });
});
