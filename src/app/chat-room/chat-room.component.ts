import { Component } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { UserType } from '../Types/User';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [],
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent {
  private hubConnection: signalR.HubConnection | null = null;
  messages: string[] = [];
  username: string = 'test';

  constructor() { }

  ngOnInit(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`ws://localhost:5137/chat?username=${encodeURIComponent(this.username)}`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();

    this.hubConnection.start()
      .then(() => console.log('Connected to SignalR hub'))
      .catch(err => console.error('Error connecting to SignalR hub:', err));

    this.hubConnection.on('receiveActiveUserList', (users: UserType) => {
      // TODO: update UI for active users
      console.log(users);
    });

    this.hubConnection.on('receiveMessage', (username: string, message: string) => {
      this.messages.push(`${username}: ${message}`);
    });
    
    this.hubConnection.on('error', (error: string) => {
      console.log(error);
    });
  }

  sendMessage(message: string): void {
    if (this.hubConnection) {
      this.hubConnection.invoke('SendMessage', message)
        .catch(err => console.error('Error sending message:', err));
    }
  }

  ngOnDestroy(): void {
    if (this.hubConnection) {
      this.hubConnection.stop()
        .catch(err => console.error('Error stopping SignalR hub connection:', err));
    }
  }
}
