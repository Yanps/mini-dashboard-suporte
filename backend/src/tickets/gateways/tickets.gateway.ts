import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:4200', 'http://localhost:3001'],
    credentials: true,
  },
})
export class TicketsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('TicketsGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, @MessageBody() room: string) {
    client.join(room);
    this.logger.log(`Client ${client.id} joined room: ${room}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, @MessageBody() room: string) {
    client.leave(room);
    this.logger.log(`Client ${client.id} left room: ${room}`);
  }

  // Methods to emit events
  emitTicketCreated(ticket: any) {
    this.server.emit('ticketCreated', ticket);
    this.logger.log(`Ticket created event emitted: ${ticket._id}`);
  }

  emitTicketUpdated(ticket: any) {
    this.server.emit('ticketUpdated', ticket);
    this.logger.log(`Ticket updated event emitted: ${ticket._id}`);
  }

  emitTicketDeleted(ticketId: string) {
    this.server.emit('ticketDeleted', { id: ticketId });
    this.logger.log(`Ticket deleted event emitted: ${ticketId}`);
  }

  // Emit to specific user by email
  emitToUser(userEmail: string, event: string, data: any) {
    this.server.to(userEmail).emit(event, data);
    this.logger.log(`Event ${event} emitted to user: ${userEmail}`);
  }
}


