import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../constants/api.constants';
import { TaskStatus } from '../models/task.enums';
import { TaskRequest } from '../models/task-request.model';
import { TaskResponse, TaskStatusUpdate } from '../models/task-response.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<TaskResponse[]> {
    return this.http.get<TaskResponse[]>(`${API_URL}/tasks`);
  }

  getById(id: number): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${API_URL}/tasks/${id}`);
  }

  getByStatus(status: TaskStatus): Observable<TaskResponse[]> {
    return this.http.get<TaskResponse[]>(`${API_URL}/tasks/status/${status}`);
  }

  create(task: TaskRequest): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(`${API_URL}/tasks/new`, task);
  }

  update(id: number, task: TaskRequest): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(`${API_URL}/tasks/${id}/update`, task);
  }

  updateStatus(id: number, status: TaskStatus): Observable<TaskResponse> {
    const body: TaskStatusUpdate = { status };
    return this.http.post<TaskResponse>(`${API_URL}/tasks/${id}/status`, body);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/tasks/${id}`);
  }
}
