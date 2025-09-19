import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { TicketService } from '../../services/ticket.service';
import { Ticket, FilterTicketDto, TicketStatus, TicketPriority, UpdateTicketDto } from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['title', 'status', 'priority', 'requesterEmail', 'assignedTo', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<Ticket>();
  
  loading = false;
  error: string | null = null;
  currentFilters: FilterTicketDto = {};
  
  private subscriptions: Subscription[] = [];

  statusLabels: { [key: string]: string } = {
    [TicketStatus.OPEN]: 'Aberto',
    [TicketStatus.IN_PROGRESS]: 'Em Progresso',
    [TicketStatus.RESOLVED]: 'Resolvido',
    [TicketStatus.CLOSED]: 'Fechado'
  };

  priorityLabels: { [key: string]: string } = {
    [TicketPriority.LOW]: 'Baixa',
    [TicketPriority.MEDIUM]: 'Média',
    [TicketPriority.HIGH]: 'Alta',
    [TicketPriority.URGENT]: 'Urgente'
  };

  statusOptions = Object.values(TicketStatus);
  priorityOptions = Object.values(TicketPriority);

  constructor(
    private ticketService: TicketService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.setupTableSorting();
    this.loadInitialFilters();
    this.subscribeToTicketUpdates();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private setupTableSorting(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Custom sorting for date fields
    this.dataSource.sortingDataAccessor = (data: Ticket, sortHeaderId: string) => {
      switch (sortHeaderId) {
        case 'createdAt':
          return new Date(data.createdAt || 0);
        case 'updatedAt':
          return new Date(data.updatedAt || 0);
        default:
          return (data as any)[sortHeaderId];
      }
    };
  }

  private loadInitialFilters(): void {
    // Check for query parameters
    this.route.queryParams.subscribe(params => {
      this.currentFilters = {
        status: params['status'] || '',
        priority: params['priority'] || '',
        requesterEmail: params['requesterEmail'] || '',
        assignedTo: params['assignedTo'] || '',
        search: params['search'] || ''
      };
      
      this.loadTickets();
    });
  }

  private subscribeToTicketUpdates(): void {
    this.subscriptions.push(
      this.ticketService.tickets$.subscribe(tickets => {
        this.dataSource.data = tickets;
      })
    );
  }

  onFiltersChanged(filters: FilterTicketDto): void {
    this.currentFilters = filters;
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading = true;
    this.error = null;

    this.ticketService.getAllTickets(this.currentFilters).subscribe({
      next: (tickets) => {
        this.dataSource.data = tickets;
        this.ticketService.updateTicketsList(tickets);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar tickets';
        this.loading = false;
        this.showSnackBar('Erro ao carregar tickets', 'error');
        console.error('Error loading tickets:', error);
      }
    });
  }

  onStatusChange(ticket: Ticket, newStatus: TicketStatus): void {
    const updateDto: UpdateTicketDto = { status: newStatus };
    
    this.ticketService.updateTicket(ticket._id!, updateDto).subscribe({
      next: (updatedTicket) => {
        this.showSnackBar('Status atualizado com sucesso', 'success');
      },
      error: (error) => {
        this.showSnackBar('Erro ao atualizar status', 'error');
        console.error('Error updating status:', error);
      }
    });
  }

  onPriorityChange(ticket: Ticket, newPriority: TicketPriority): void {
    const updateDto: UpdateTicketDto = { priority: newPriority };
    
    this.ticketService.updateTicket(ticket._id!, updateDto).subscribe({
      next: (updatedTicket) => {
        this.showSnackBar('Prioridade atualizada com sucesso', 'success');
      },
      error: (error) => {
        this.showSnackBar('Erro ao atualizar prioridade', 'error');
        console.error('Error updating priority:', error);
      }
    });
  }

  onAssignTicket(ticket: Ticket, assignedTo: string): void {
    const updateDto: UpdateTicketDto = { assignedTo };
    
    this.ticketService.updateTicket(ticket._id!, updateDto).subscribe({
      next: (updatedTicket) => {
        this.showSnackBar('Responsável atribuído com sucesso', 'success');
      },
      error: (error) => {
        this.showSnackBar('Erro ao atribuir responsável', 'error');
        console.error('Error assigning ticket:', error);
      }
    });
  }

  onAssignTicketEvent(ticket: Ticket, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.onAssignTicket(ticket, target.value);
  }

  viewTicket(ticket: Ticket): void {
    this.router.navigate(['/tickets', ticket._id]);
  }

  deleteTicket(ticket: Ticket): void {
    if (confirm('Tem certeza que deseja excluir este ticket?')) {
      this.ticketService.deleteTicket(ticket._id!).subscribe({
        next: () => {
          this.showSnackBar('Ticket excluído com sucesso', 'success');
        },
        error: (error) => {
          this.showSnackBar('Erro ao excluir ticket', 'error');
          console.error('Error deleting ticket:', error);
        }
      });
    }
  }

  refresh(): void {
    this.loadTickets();
  }

  private showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusLabel(status: TicketStatus): string {
    return this.statusLabels[status] || status;
  }

  getPriorityLabel(priority: TicketPriority): string {
    return this.priorityLabels[priority] || priority;
  }
}


