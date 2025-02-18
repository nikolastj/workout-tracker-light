import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FullScreenLoaderComponent } from './shared/full-screen-loader.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, FullScreenLoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private auth: AuthService) {
    this.isLoading = this.auth.loading$;
  }
  isLoading;
  title = 'workout-tracker-light';
}
