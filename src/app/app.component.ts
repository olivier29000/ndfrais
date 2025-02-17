import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ServerService } from './services/server.service';

@Component({
  selector: 'vex-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent {
  constructor() {}
}
