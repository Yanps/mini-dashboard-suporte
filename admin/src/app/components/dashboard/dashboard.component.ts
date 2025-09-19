import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { TicketStats, TicketStatus, TicketPriority } from '../../models/ticket.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: TicketStats | null = null;
  loading = false;
  error: string | null = null;

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

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.error = null;

    this.ticketService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar estatísticas';
        this.loading = false;
        console.error('Error loading stats:', error);
      }
    });
  }

  getStatusEntries(): Array<{ key: string; value: number; label: string }> {
    if (!this.stats) return [];
    
    return Object.entries(this.stats.byStatus).map(([key, value]) => ({
      key,
      value,
      label: this.statusLabels[key] || key
    }));
  }

  getPriorityEntries(): Array<{ key: string; value: number; label: string }> {
    if (!this.stats) return [];
    
    return Object.entries(this.stats.byPriority).map(([key, value]) => ({
      key,
      value,
      label: this.priorityLabels[key] || key
    }));
  }

  refresh(): void {
    this.loadStats();
  }
}


