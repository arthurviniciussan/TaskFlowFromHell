import { TaskPriority, TaskStatus } from './task.enums';

export interface TaskResponse {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null;
}

export interface TaskStatusUpdate {
  status: TaskStatus;
}
