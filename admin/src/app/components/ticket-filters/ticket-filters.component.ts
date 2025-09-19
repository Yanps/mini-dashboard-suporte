import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TicketStatus, TicketPriority, FilterTicketDto } from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-filters',
  templateUrl: './ticket-filters.component.html',
  styleUrls: ['./ticket-filters.component.scss']
})
export class TicketFiltersComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<FilterTicketDto>();
  
  filterForm: FormGroup;
  
  statusOptions = [
    { value: '', label: 'Todos os Status' },
    { value: TicketStatus.OPEN, label: 'Aberto' },
    { value: TicketStatus.IN_PROGRESS, label: 'Em Progresso' },
    { value: TicketStatus.RESOLVED, label: 'Resolvido' },
    { value: TicketStatus.CLOSED, label: 'Fechado' }
  ];

  priorityOptions = [
    { value: '', label: 'Todas as Prioridades' },
    { value: TicketPriority.LOW, label: 'Baixa' },
    { value: TicketPriority.MEDIUM, label: 'Média' },
    { value: TicketPriority.HIGH, label: 'Alta' },
    { value: TicketPriority.URGENT, label: 'Urgente' }
  ];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      status: [''],
      priority: [''],
      requesterEmail: [''],
      assignedTo: [''],
      search: ['']
    });
  }

  ngOnInit(): void {
    // Emit initial empty filters
    this.onFiltersChange();
    
    // Listen for form changes
    this.filterForm.valueChanges.subscribe(() => {
      this.onFiltersChange();
    });
  }

  onFiltersChange(): void {
    const formValue = this.filterForm.value;
    const filters: FilterTicketDto = {};

    // Only include non-empty values
    Object.keys(formValue).forEach(key => {
      const value = formValue[key];
      if (value && value.trim() !== '') {
        filters[key as keyof FilterTicketDto] = value.trim();
      }
    });

    this.filtersChanged.emit(filters);
  }

  clearFilters(): void {
    this.filterForm.reset();
    Object.keys(this.filterForm.controls).forEach(key => {
      this.filterForm.get(key)?.setValue('');
    });
  }

  hasActiveFilters(): boolean {
    const formValue = this.filterForm.value;
    return Object.values(formValue).some(value => value && (value as string).trim() !== '');
  }
}


