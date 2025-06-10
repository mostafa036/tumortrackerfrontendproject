import * as signalR from '@microsoft/signalr';

class SignalRService {
  constructor() {
    this.connection = null;
    this.connectionPromise = null;
    this.messageListeners = new Set();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  async start() {
    try {
      if (this.connection?.state === signalR.HubConnectionState.Connected) {
        console.log('SignalR: Already connected');
        return true;
      }

      if (this.connectionPromise) {
        console.log('SignalR: Connection attempt in progress');
        return this.connectionPromise;
      }

      console.log('SignalR: Starting new connection');

      this.connectionPromise = new Promise(async (resolve, reject) => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            console.error('SignalR: No authentication token found');
            throw new Error('No authentication token found');
          }

          this.connection = new signalR.HubConnectionBuilder()
            .withUrl('/chatHub', {
              accessTokenFactory: () => token,
              transport: signalR.HttpTransportType.WebSockets,
              skipNegotiation: true,
              logger: signalR.LogLevel.Information
            })
            .withAutomaticReconnect({
              nextRetryDelayInMilliseconds: retryContext => {
                if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                  console.log('SignalR: Max reconnection attempts reached');
                  return null;
                }

                this.reconnectAttempts++;
                const delay = Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
                console.log(`SignalR: Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
                return delay;
              }
            })
            .configureLogging(signalR.LogLevel.Information)
            .build();

          // Set up message handler
          this.connection.on('ReceiveMessage', (senderId, message) => {
            console.log('SignalR: Message received', { senderId, message });
            this.messageListeners.forEach(listener => listener(senderId, message));
          });

          // Handle connection events
          this.connection.onreconnecting(error => {
            console.log('SignalR: Reconnecting...', error);
          });

          this.connection.onreconnected(connectionId => {
            console.log('SignalR: Reconnected', connectionId);
            this.reconnectAttempts = 0;
          });

          this.connection.onclose(error => {
            console.log('SignalR: Connection closed', error);
            this.connectionPromise = null;
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
              console.log('SignalR: Attempting to reconnect...');
              setTimeout(() => this.start(), 5000);
            }
          });

          await this.connection.start();
          console.log('SignalR: Connected successfully');
          this.reconnectAttempts = 0;
          resolve(true);
        } catch (error) {
          console.error('SignalR: Connection failed', error);
          this.connectionPromise = null;
          reject(error);
        }
      });

      return await this.connectionPromise;
    } catch (error) {
      console.error('SignalR: Start failed', error);
      this.connectionPromise = null;
      return false;
    }
  }

  stop() {
    if (this.connection) {
      this.connection.stop();
      this.connection = null;
      this.connectionPromise = null;
      this.reconnectAttempts = 0;
    }
  }

  addMessageListener(callback) {
    this.messageListeners.add(callback);
    return () => this.messageListeners.delete(callback);
  }

  async sendMessage(receiverId, message) {
    try {
      if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
        console.log('SignalR: Reconnecting before sending message');
        const connected = await this.start();
        if (!connected) {
          throw new Error('Failed to establish connection');
        }
      }

      console.log('SignalR: Sending message', { receiverId, message });
      await this.connection.invoke('SendMessage', receiverId, message);
      console.log('SignalR: Message sent successfully');
    } catch (error) {
      console.error('SignalR: Failed to send message', error);
      throw error;
    }
  }
}

export const signalRService = new SignalRService(); 