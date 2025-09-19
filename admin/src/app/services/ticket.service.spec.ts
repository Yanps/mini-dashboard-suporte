import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TicketService } from './ticket.service';
import { Ticket, CreateTicketDto, UpdateTicketDto, TicketStatus, TicketPriority } from '../models/ticket.model';

describe('TicketService', () => {
  let service: TicketService;
  let httpMock: HttpTestingController;

  const mockTicket: Ticket = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Test Ticket',
    description: 'Test Description',
    status: TicketStatus.OPEN,
    priority: TicketPriority.MEDIUM,
    requesterEmail: 'test@example.com',
    history: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TicketService]
    });
    service = TestBed.inject(TicketService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllTickets', () => {
    it('should return tickets', () => {
      const mockTickets = [mockTicket];

      service.getAllTickets().subscribe(tickets => {
        expect(tickets).toEqual(mockTickets);
      });

      const req = httpMock.expectOne('http://localhost:3000/tickets');
      expect(req.request.method).toBe('GET');
      req.flush(mockTickets);
    });

    it('should send filters as query parameters', () => {
      const filters = {
        status: TicketStatus.OPEN,
        priority: TicketPriority.HIGH,
        search: 'test'
      };

      service.getAllTickets(filters).subscribe();

      const req = httpMock.expectOne(req => req.url === 'http://localhost:3000/tickets');
      expect(req.request.params.get('status')).toBe(TicketStatus.OPEN);
      expect(req.request.params.get('priority')).toBe(TicketPriority.HIGH);
      expect(req.request.params.get('search')).toBe('test');
      req.flush([]);
    });
  });

  describe('getTicket', () => {
    it('should return a single ticket', () => {
      const ticketId = '507f1f77bcf86cd799439011';

      service.getTicket(ticketId).subscribe(ticket => {
        expect(ticket).toEqual(mockTicket);
      });

      const req = httpMock.expectOne(`http://localhost:3000/tickets/${ticketId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTicket);
    });
  });

  describe('createTicket', () => {
    it('should create a ticket', () => {
      const createDto: CreateTicketDto = {
        title: 'Test Ticket',
        description: 'Test Description',
        priority: TicketPriority.MEDIUM,
        requesterEmail: 'test@example.com'
      };

      service.createTicket(createDto).subscribe(ticket => {
        expect(ticket).toEqual(mockTicket);
      });

      const req = httpMock.expectOne('http://localhost:3000/tickets');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createDto);
      req.flush(mockTicket);
    });
  });

  describe('updateTicket', () => {
    it('should update a ticket', () => {
      const ticketId = '507f1f77bcf86cd799439011';
      const updateDto: UpdateTicketDto = {
        status: TicketStatus.IN_PROGRESS
      };
      const updatedTicket = { ...mockTicket, status: TicketStatus.IN_PROGRESS };

      service.updateTicket(ticketId, updateDto).subscribe(ticket => {
        expect(ticket).toEqual(updatedTicket);
      });

      const req = httpMock.expectOne(`http://localhost:3000/tickets/${ticketId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(updateDto);
      req.flush(updatedTicket);
    });
  });

  describe('deleteTicket', () => {
    it('should delete a ticket', () => {
      const ticketId = '507f1f77bcf86cd799439011';

      service.deleteTicket(ticketId).subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`http://localhost:3000/tickets/${ticketId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('getTicketsByEmail', () => {
    it('should return tickets by email', () => {
      const email = 'test@example.com';
      const mockTickets = [mockTicket];

      service.getTicketsByEmail(email).subscribe(tickets => {
        expect(tickets).toEqual(mockTickets);
      });

      const req = httpMock.expectOne(`http://localhost:3000/tickets/by-email/${email}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTickets);
    });
  });

  describe('getStats', () => {
    it('should return ticket statistics', () => {
      const mockStats = {
        byStatus: { open: 5, in_progress: 3, resolved: 2, closed: 1 },
        byPriority: { low: 2, medium: 6, high: 3, urgent: 0 },
        total: 11
      };

      service.getStats().subscribe(stats => {
        expect(stats).toEqual(mockStats);
      });

      const req = httpMock.expectOne('http://localhost:3000/tickets/stats');
      expect(req.request.method).toBe('GET');
      req.flush(mockStats);
    });
  });

  describe('local state management', () => {
    it('should update tickets list', () => {
      const tickets = [mockTicket];
      service.updateTicketsList(tickets);

      service.tickets$.subscribe(currentTickets => {
        expect(currentTickets).toEqual(tickets);
      });
    });

    it('should add ticket to list', () => {
      const newTicket = { ...mockTicket, _id: 'new-id', title: 'New Ticket' };
      
      service.updateTicketsList([mockTicket]);
      service.addTicket(newTicket);

      service.tickets$.subscribe(tickets => {
        expect(tickets).toHaveLength(2);
        expect(tickets[0]).toEqual(newTicket); // Should be first (newest)
        expect(tickets[1]).toEqual(mockTicket);
      });
    });

    it('should update ticket in list', () => {
      const updatedTicket = { ...mockTicket, status: TicketStatus.RESOLVED };
      
      service.updateTicketsList([mockTicket]);
      service.updateTicketInList(updatedTicket);

      service.tickets$.subscribe(tickets => {
        expect(tickets).toHaveLength(1);
        expect(tickets[0]).toEqual(updatedTicket);
      });
    });

    it('should remove ticket from list', () => {
      service.updateTicketsList([mockTicket]);
      service.removeTicketFromList(mockTicket._id!);

      service.tickets$.subscribe(tickets => {
        expect(tickets).toHaveLength(0);
      });
    });
  });
});

