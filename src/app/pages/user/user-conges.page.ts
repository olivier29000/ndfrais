import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserServerService } from './services/user-server.service';
@Component({
  template: ``,
  styles: [``],
  standalone: true,
  imports: [CommonModule]
})
export class UserCongesPage {
  constructor(private userServer: UserServerService) {}
}
