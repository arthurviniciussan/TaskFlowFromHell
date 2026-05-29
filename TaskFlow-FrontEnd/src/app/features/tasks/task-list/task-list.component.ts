import { Component, input, output } from '@angular/core';
import { TaskResponse } from '../../../core/models/task-response.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-task-list',
  imports: [TaskCardComponent, LoadingSpinnerComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  readonly tasks = input.required<TaskResponse[]>();
  readonly loading = input(false);

  readonly edit = output<TaskResponse>();
  readonly deleted = output<number>();
  readonly statusChanged = output<TaskResponse>();
}
