import { IPost } from './post.model';
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
@Injectable({
  providedIn: 'root',
})
export class SocketIoService {
  private socket: any;
  init() {
    this.socket = io('http://localhost:3000');
  }
  onCreatePost_Io(post: IPost, room: string) {
    this.socket.emit('onCreatePost', { post, room });
  }
  onDeletePost_Io(id: string, room: string) {
    this.socket.emit('onDeletePost', { id, room });
  }
  onUpdatePost_Io(post: IPost, room: string) {
    this.socket.emit('onUpdatePost', { post, room });
  }

  leaveRoom(room: string) {
    console.log('leave');

    this.socket.emit('leave', room);
  }
  joinRoom(room: string) {
    console.log('join');

    this.socket.emit('join', room);
  }
  get socketIO() {
    return this.socket;
  }
}
