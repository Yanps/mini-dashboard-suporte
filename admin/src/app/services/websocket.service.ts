import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Ticket } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: SocketIOClient.Socket;
  private ticketCreatedSubject = new Subject<Ticket>();
  private ticketUpdatedSubject = new Subject<Ticket>();
  private ticketDeletedSubject = new Subject<{ id: string }>();

  constructor() {
    this.socket = socketIo(environment.wsUrl);
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.socket.on('ticketCreated', (ticket: Ticket) => {
      this.ticketCreatedSubject.next(ticket);
    });

    this.socket.on('ticketUpdated', (ticket: Ticket) => {
      this.ticketUpdatedSubject.next(ticket);
    });

    this.socket.on('ticketDeleted', (data: { id: string }) => {
      this.ticketDeletedSubject.next(data);
    });
  }

  onTicketCreated(): Observable<Ticket> {
    return this.ticketCreatedSubject.asObservable();
  }

  onTicketUpdated(): Observable<Ticket> {
    return this.ticketUpdatedSubject.asObservable();
  }

  onTicketDeleted(): Observable<{ id: string }> {
    return this.ticketDeletedSubject.asObservable();
  }

  joinRoom(room: string): void {
    this.socket.emit('joinRoom', room);
  }

  leaveRoom(room: string): void {
    this.socket.emit('leaveRoom', room);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}


