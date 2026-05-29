import { DatePipe } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { finalize } from 'rxjs';
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  TASK_STATUS_OPTIONS,
  TaskStatus,
} from '../../../core/models/task.enums';
import { TaskResponse } from '../../../core/models/task-response.model';
import { NotificationService } from '../../../core/services/notification.service';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-card',
  imports: [
    DatePipe,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  private readonly taskService = inject(TaskService);
  private readonly notification = inject(NotificationService);

  readonly task = input.required<TaskResponse>();
  readonly edit = output<TaskResponse>();
  readonly deleted = output<number>();
  readonly statusChanged = output<TaskResponse>();

  readonly statusOptions = TASK_STATUS_OPTIONS;
  readonly statusLabels = STATUS_LABELS;
  readonly priorityLabels = PRIORITY_LABELS;
  readonly updatingStatus = signal(false);
  readonly deleting = signal(false);

  onEdit(): void {
    this.edit.emit(this.task());
  }

  onDelete(): void {
    if (this.deleting()) {
      return;
    }

    this.deleting.set(true);
    this.taskService
      .delete(this.task().id)
      .pipe(finalize(() => this.deleting.set(false)))
      .subscribe({
        next: () => {
          this.notification.success('Tarefa excluída.');
          this.deleted.emit(this.task().id);
        },
      });
  }

  onStatusChange(status: TaskStatus): void {
    if (status === this.task().status || this.updatingStatus()) {
      return;
    }

    this.updatingStatus.set(true);
    this.taskService
      .updateStatus(this.task().id, status)
      .pipe(finalize(() => this.updatingStatus.set(false)))
      .subscribe({
        next: (updated) => {
          this.notification.success('Status atualizado.');
          this.statusChanged.emit(updated);
        },
      });
  }

  statusClass(status: TaskStatus): string {
    return `status-${status.toLowerCase().replace('_', '-')}`;
  }

  priorityClass(priority: string): string {
    return `priority-${priority.toLowerCase()}`;
  }
}
