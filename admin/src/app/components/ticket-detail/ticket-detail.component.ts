import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { Ticket, UpdateTicketDto, TicketStatus, TicketPriority } from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent implements OnInit {
  ticket: Ticket | null = null;
  loading = false;
  error: string | null = null;
  updating = false;
  
  updateForm: FormGroup;

  statusOptions = [
    { value: TicketStatus.OPEN, label: 'Aberto' },
    { value: TicketStatus.IN_PROGRESS, label: 'Em Progresso' },
    { value: TicketStatus.RESOLVED, label: 'Resolvido' },
    { value: TicketStatus.CLOSED, label: 'Fechado' }
  ];

  priorityOptions = [
    { value: TicketPriority.LOW, label: 'Baixa' },
    { value: TicketPriority.MEDIUM, label: 'Média' },
    { value: TicketPriority.HIGH, label: 'Alta' },
    { value: TicketPriority.URGENT, label: 'Urgente' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.updateForm = this.fb.group({
      status: ['', Validators.required],
      priority: ['', Validators.required],
      assignedTo: ['']
    });
  }

  ngOnInit(): void {
    this.loadTicket();
  }

  loadTicket(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'ID do ticket não encontrado';
      return;
    }

    this.loading = true;
    this.error = null;

    this.ticketService.getTicket(id).subscribe({
      next: (ticket) => {
        this.ticket = ticket;
        this.updateForm.patchValue({
          status: ticket.status,
          priority: ticket.priority,
          assignedTo: ticket.assignedTo || ''
        });
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar ticket';
        this.loading = false;
        console.error('Error loading ticket:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.updateForm.invalid || !this.ticket) {
      return;
    }

    this.updating = true;
    const updateDto: UpdateTicketDto = this.updateForm.value;

    this.ticketService.updateTicket(this.ticket._id!, updateDto).subscribe({
      next: (updatedTicket) => {
        this.ticket = updatedTicket;
        this.updating = false;
        this.showSnackBar('Ticket atualizado com sucesso', 'success');
      },
      error: (error) => {
        this.updating = false;
        this.showSnackBar('Erro ao atualizar ticket', 'error');
        console.error('Error updating ticket:', error);
      }
    });
  }

  deleteTicket(): void {
    if (!this.ticket) return;

    if (confirm('Tem certeza que deseja excluir este ticket? Esta ação não pode ser desfeita.')) {
      this.ticketService.deleteTicket(this.ticket._id!).subscribe({
        next: () => {
          this.showSnackBar('Ticket excluído com sucesso', 'success');
          this.router.navigate(['/tickets']);
        },
        error: (error) => {
          this.showSnackBar('Erro ao excluir ticket', 'error');
          console.error('Error deleting ticket:', error);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/tickets']);
  }

  private showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleString('pt-BR');
  }

  getStatusLabel(status: TicketStatus): string {
    const option = this.statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  }

  getPriorityLabel(priority: TicketPriority): string {
    const option = this.priorityOptions.find(opt => opt.value === priority);
    return option ? option.label : priority;
  }

  getHistoryActionLabel(action: string): string {
    const labels: { [key: string]: string } = {
      'created': 'Criado',
      'status_changed': 'Status alterado',
      'priority_changed': 'Prioridade alterada',
      'assigned': 'Responsável atribuído'
    };
    return labels[action] || action;
  }

  getHistoryIcon(action: string): string {
    const icons: { [key: string]: string } = {
      'created': 'add_circle',
      'status_changed': 'swap_horiz',
      'priority_changed': 'priority_high',
      'assigned': 'person_add'
    };
    return icons[action] || 'edit';
  }

  trackByIndex(index: number): number {
    return index;
  }
}
