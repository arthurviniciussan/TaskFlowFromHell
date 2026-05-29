import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, finalize, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { TaskResponse } from '../../../core/models/task-response.model';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TaskService } from '../../../core/services/task.service';
import { ThemeService } from '../../../core/services/theme.service';
import { TaskFilterValues, TaskFiltersComponent } from '../task-filters/task-filters.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskListComponent } from '../task-list/task-list.component';

@Component({
  selector: 'app-task-dashboard',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    TaskFiltersComponent,
    TaskListComponent,
  ],
  templateUrl: './task-dashboard.component.html',
  styleUrl: './task-dashboard.component.scss',
})
export class TaskDashboardComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);

  readonly username = this.authService.getUsername() ?? 'Usuário';
  readonly isDark = this.themeService.isDark;
  readonly loading = signal(true);

  private readonly tasksSubject = new BehaviorSubject<TaskResponse[]>([]);
  private readonly filtersSubject = new BehaviorSubject<TaskFilterValues>({
    search: '',
    status: '',
    priority: '',
  });

  readonly filteredTasks = toSignal(
    combineLatest([this.tasksSubject, this.filtersSubject]).pipe(
      map(([tasks, filters]) => this.applyFilters(tasks, filters)),
    ),
    { initialValue: [] as TaskResponse[] },
  );

  readonly taskCount = computed(() => this.filteredTasks()?.length ?? 0);

  ngOnInit(): void {
    this.loadTasks();
  }

  onFiltersChange(filters: TaskFilterValues): void {
    this.filtersSubject.next(filters);
  }

  openCreateDialog(): void {
    this.openTaskDialog();
  }

  onEdit(task: TaskResponse): void {
    this.openTaskDialog(task);
  }

  onDeleted(id: number): void {
    this.tasksSubject.next(this.tasksSubject.value.filter((t) => t.id !== id));
  }

  onStatusChanged(updated: TaskResponse): void {
    this.upsertTask(updated);
  }

  logout(): void {
    this.authService.logout();
    this.notification.success('Sessão encerrada.');
    this.router.navigate(['/login']);
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  private loadTasks(): void {
    this.loading.set(true);
    this.taskService
      .getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (tasks) => this.tasksSubject.next(tasks),
      });
  }

  private openTaskDialog(task?: TaskResponse): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '480px',
      data: { task },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.upsertTask(result);
      }
    });
  }

  private upsertTask(task: TaskResponse): void {
    const tasks = [...this.tasksSubject.value];
    const index = tasks.findIndex((t) => t.id === task.id);
    if (index >= 0) {
      tasks[index] = task;
    } else {
      tasks.unshift(task);
    }
    this.tasksSubject.next(tasks);
  }

  private applyFilters(tasks: TaskResponse[], filters: TaskFilterValues): TaskResponse[] {
    const search = filters.search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch = !search || task.title.toLowerCase().includes(search);
      const matchesStatus = !filters.status || task.status === filters.status;
      const matchesPriority = !filters.priority || task.priority === filters.priority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }
}
