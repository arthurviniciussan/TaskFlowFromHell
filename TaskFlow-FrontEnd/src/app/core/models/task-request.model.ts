import { TaskPriority } from './task.enums';

export interface TaskRequest {
  title: string;
  description: string;
  priority: TaskPriority;
}
