import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
  TaskPriority,
  TaskStatus,
} from '../../../core/models/task.enums';

export interface TaskFilterValues {
  search: string;
  status: TaskStatus | '';
  priority: TaskPriority | '';
}

@Component({
  selector: 'app-task-filters',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './task-filters.component.html',
  styleUrl: './task-filters.component.scss',
})
export class TaskFiltersComponent {
  private readonly fb = inject(FormBuilder);

  readonly filtersChange = output<TaskFilterValues>();

  readonly statusOptions = TASK_STATUS_OPTIONS;
  readonly priorityOptions = TASK_PRIORITY_OPTIONS;
  readonly statusLabels = STATUS_LABELS;
  readonly priorityLabels = PRIORITY_LABELS;

  readonly form = this.fb.nonNullable.group({
    search: [''],
    status: ['' as TaskStatus | ''],
    priority: ['' as TaskPriority | ''],
  });

  constructor() {
    this.form.valueChanges.pipe(debounceTime(250), distinctUntilChanged()).subscribe(() => {
      this.emitFilters();
    });
    this.emitFilters();
  }

  clearFilters(): void {
    this.form.reset({ search: '', status: '', priority: '' });
  }

  private emitFilters(): void {
    this.filtersChange.emit(this.form.getRawValue());
  }
}
