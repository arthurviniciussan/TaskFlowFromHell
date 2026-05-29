import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { finalize } from 'rxjs';
import {
  PRIORITY_LABELS,
  TASK_PRIORITY_OPTIONS,
  TaskPriority,
} from '../../../core/models/task.enums';
import { TaskResponse } from '../../../core/models/task-response.model';
import { NotificationService } from '../../../core/services/notification.service';
import { TaskService } from '../../../core/services/task.service';

export interface TaskFormDialogData {
  task?: TaskResponse;
}

@Component({
  selector: 'app-task-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  private readonly notification = inject(NotificationService);
  private readonly dialogRef = inject(MatDialogRef<TaskFormComponent, TaskResponse>);
  readonly data = inject<TaskFormDialogData>(MAT_DIALOG_DATA);

  readonly loading = signal(false);
  readonly priorityOptions = TASK_PRIORITY_OPTIONS;
  readonly priorityLabels = PRIORITY_LABELS;

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    priority: [TaskPriority.MEDIUM, Validators.required],
  });

  get isEditMode(): boolean {
    return !!this.data.task;
  }

  ngOnInit(): void {
    if (this.data.task) {
      this.form.patchValue({
        title: this.data.task.title,
        description: this.data.task.description,
        priority: this.data.task.priority,
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const payload = this.form.getRawValue();
    const request$ = this.isEditMode
      ? this.taskService.update(this.data.task!.id, payload)
      : this.taskService.create(payload);

    request$.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (task) => {
        this.notification.success(
          this.isEditMode ? 'Tarefa atualizada com sucesso!' : 'Tarefa criada com sucesso!',
        );
        this.dialogRef.close(task);
      },
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
