import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ServerService } from './services/server.service';
import { LoadingDumb } from './pages/dumbs/loading.dumb';

@Component({
  selector: 'vex-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet, LoadingDumb]
})
export class AppComponent {
  constructor(private server: ServerService) {}
  isLoading = this.server.isLoading;
}
