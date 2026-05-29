import { Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="loading" [class.inline]="inline()">
      <mat-spinner [diameter]="diameter()"></mat-spinner>
      @if (message()) {
        <p>{{ message() }}</p>
      }
    </div>
  `,
  styles: `
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 3rem;
      color: var(--text-muted);
    }

    .loading.inline {
      padding: 1.5rem;
    }

    p {
      margin: 0;
      font-size: 0.95rem;
    }
  `,
})
export class LoadingSpinnerComponent {
  readonly message = input('Carregando...');
  readonly diameter = input(48);
  readonly inline = input(false);
}
