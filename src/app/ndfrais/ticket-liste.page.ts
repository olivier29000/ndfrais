import { Component } from '@angular/core';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TicketListDumb } from './dumbs/ticket-list.dumb';
import { NavMonthDumb } from './dumbs/nav-month.dumb';
import { ServerService } from './services/server.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Ticket } from './models/ticket.model';
import { Trajet } from './models/trajet.model';
import { TrajetListDumb } from './dumbs/trajet-list.dumb';

@Component({
  template: `
    <dumb-nav-month [currentDate]="currentDate()"></dumb-nav-month>
    <div class="container grid grid-cols-2 gap-4">
      <dumb-ticket-list
        [ticketList]="ticketList()"
        (updateTicket)="updateTicketModal($event)">
        <input
          type="file"
          #fileInput
          (change)="onFileSelected($event)"
          accept="image/*"
          style="display: none;" />
        <button
          class="ml-4 flex-none"
          color="primary"
          mat-mini-fab
          matTooltip="Add Ticket"
          type="button"
          (click)="fileInput.click()">
          <mat-icon svgIcon="mat:add"></mat-icon>
        </button>
      </dumb-ticket-list>
      <dumb-trajet-list
        [trajetList]="trajetList()"
        (updateTrajet)="updateTrajetModal($event)">
        <button
          class="ml-4 flex-none"
          color="primary"
          mat-mini-fab
          matTooltip="Add Ticket"
          type="button"
          (click)="newTrajetModal()">
          <mat-icon svgIcon="mat:add"></mat-icon>
        </button>
      </dumb-trajet-list>
    </div>
  `,
  animations: [fadeInUp400ms, stagger40ms],
  standalone: true,
  imports: [
    CommonModule,
    TicketListDumb,
    TrajetListDumb,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    NavMonthDumb
  ]
})
export class TicketListPage {
  selectedFile: File | null = null;
  constructor(private server: ServerService) {}

  ticketList = this.server.ticketList;
  trajetList = this.server.trajetList;
  onFileSelected(event: any): void {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.server.uploadTicket(selectedFile);
    } else {
      console.error('No file selected!');
    }
  }

  updateTicketModal(ticket: Ticket): void {
    this.server.updateTicketModal(ticket);
  }

  updateTrajetModal(trajet: Trajet): void {
    this.server.updateTrajetModal(trajet);
  }

  newTrajetModal(): void {
    this.server.createTrajetModal();
  }

  currentDate = this.server.currentDate;
}
