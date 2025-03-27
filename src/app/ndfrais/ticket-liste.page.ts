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
          style="display: none;"
          capture="environment" />
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
    const file: File = event.target.files[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onload = (loadEvent: any) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');

          const MAX_WIDTH = 1024;
          const scale = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scale;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const compressedFile = new File([blob], file.name, {
                    type: file.type
                  });
                  this.server.uploadTicket(compressedFile); // Upload image réduite
                }
              },
              file.type,
              0.8
            ); // 0.8 = qualité (80%)
          }
        };

        img.src = loadEvent.target.result;
      };

      reader.readAsDataURL(file);
    } else {
      console.error('No image file selected!');
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
