import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Ticket, CreateTicketDto, UpdateTicketDto, FilterTicketDto, TicketStats } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = `${environment.apiUrl}/tickets`;
  private ticketsSubject = new BehaviorSubject<Ticket[]>([]);
  public tickets$ = this.ticketsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllTickets(filters?: FilterTicketDto): Observable<Ticket[]> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof FilterTicketDto];
        if (value) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<Ticket[]>(this.apiUrl, { params });
  }

  getTicket(id: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
  }

  createTicket(ticket: CreateTicketDto): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, ticket);
  }

  updateTicket(id: string, updates: UpdateTicketDto): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.apiUrl}/${id}`, updates);
  }

  deleteTicket(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTicketsByEmail(email: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/by-email/${email}`);
  }

  getStats(): Observable<TicketStats> {
    return this.http.get<TicketStats>(`${this.apiUrl}/stats`);
  }

  // Update local tickets list
  updateTicketsList(tickets: Ticket[]): void {
    this.ticketsSubject.next(tickets);
  }

  // Get current tickets list
  getCurrentTickets(): Ticket[] {
    return this.ticketsSubject.value;
  }

  // Add ticket to local list
  addTicket(ticket: Ticket): void {
    const currentTickets = this.getCurrentTickets();
    this.ticketsSubject.next([ticket, ...currentTickets]);
  }

  // Update ticket in local list
  updateTicketInList(updatedTicket: Ticket): void {
    const currentTickets = this.getCurrentTickets();
    const index = currentTickets.findIndex(t => t._id === updatedTicket._id);
    if (index !== -1) {
      currentTickets[index] = updatedTicket;
      this.ticketsSubject.next([...currentTickets]);
    }
  }

  // Remove ticket from local list
  removeTicketFromList(ticketId: string): void {
    const currentTickets = this.getCurrentTickets();
    const filteredTickets = currentTickets.filter(t => t._id !== ticketId);
    this.ticketsSubject.next(filteredTickets);
  }
}


