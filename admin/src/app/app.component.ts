import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from './services/websocket.service';
import { TicketService } from './services/ticket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Admin - Mini Dashboard Suporte';
  private subscriptions: Subscription[] = [];

  constructor(
    private websocketService: WebSocketService,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    this.setupWebSocketListeners();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.websocketService.disconnect();
  }

  private setupWebSocketListeners(): void {
    // Listen for ticket created events
    this.subscriptions.push(
      this.websocketService.onTicketCreated().subscribe(ticket => {
        this.ticketService.addTicket(ticket);
      })
    );

    // Listen for ticket updated events
    this.subscriptions.push(
      this.websocketService.onTicketUpdated().subscribe(ticket => {
        this.ticketService.updateTicketInList(ticket);
      })
    );

    // Listen for ticket deleted events
    this.subscriptions.push(
      this.websocketService.onTicketDeleted().subscribe(data => {
        this.ticketService.removeTicketFromList(data.id);
      })
    );
  }
}


