import { Component, computed, effect, Inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { debounceTime, distinctUntilChanged, Subject, tap } from 'rxjs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { WORK_STATE } from 'src/app/models/day-app.model';
import { DatepickerDumb } from '../dumbs/datepicker.dumb';
import { Ticket } from '../models/ticket.model';
import { ServerService } from '../services/server.service';

@Component({
  template: `<form>
      <div class="flex items-center" mat-dialog-title>
        <h2 class="headline m-0 flex-auto">Ticket</h2>

        <button
          class="text-secondary"
          mat-dialog-close
          mat-icon-button
          type="button">
          <mat-icon svgIcon="mat:close"></mat-icon>
        </button>
      </div>

      <mat-divider class="text-border"></mat-divider>

      <mat-dialog-content class="flex flex-col">
        @if (currentTicket) {
          <img
            [src]="
              currentTicket.image
                ? 'data:image/jpeg;base64,' + currentTicket.image.base64
                : 'https://static.thenounproject.com/png/187803-200.png'
            "
            alt=""
            style="height: 50vh;" />
          <div class="flex flex-col sm:flex-row">
            <mat-form-field class="flex-auto">
              <mat-label>Nom</mat-label>
              <input
                cdkFocusInitial
                [(ngModel)]="currentTicket.titre"
                name="nom"
                matInput />

              <mat-icon matIconPrefix svgIcon="mat:person"></mat-icon>
            </mat-form-field>
            <mat-form-field class="flex-auto">
              <mat-label>Montant</mat-label>
              <input
                cdkFocusInitial
                [(ngModel)]="currentTicket.montant"
                name="nom"
                type="number"
                matInput />

              <mat-icon matIconPrefix svgIcon="mat:person"></mat-icon>
            </mat-form-field>
            <mat-form-field class="flex-auto">
              <mat-label>Date</mat-label>
              <div class="flex">
                <dumb-datepicker
                  #datepickerRefdateBegin
                  [(date)]="currentTicket.dateTicket"></dumb-datepicker>
                <input
                  [value]="
                    currentTicket.dateTicket | date: 'dd MMM yyyy' : '' : 'fr'
                  "
                  disabled
                  matInput
                  name="dateBegin" />
              </div>
            </mat-form-field>
          </div>

          <mat-form-field class="flex-auto">
            <mat-label>Notes</mat-label>
            <textarea
              [(ngModel)]="currentTicket.notes"
              name="notes"
              matInput></textarea>
          </mat-form-field>

          <div class="flex flex-col sm:flex-row"></div>
        }
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close type="button">Annuler</button>
        <button
          color="primary"
          mat-flat-button
          type="submit"
          (click)="updateTicket()">
          Valider
        </button>
      </mat-dialog-actions>
    </form>

    <mat-menu #settingsMenu="matMenu" xPosition="before" yPosition="below">
      <button mat-menu-item>
        <mat-icon svgIcon="mat:print"></mat-icon>
        <span>Print</span>
      </button>

      <button mat-menu-item>
        <mat-icon svgIcon="mat:download"></mat-icon>
        <span>Export</span>
      </button>

      <button mat-menu-item>
        <mat-icon svgIcon="mat:delete"></mat-icon>
        <span>Delete</span>
      </button>
    </mat-menu> `,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    NgIf,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    DatepickerDumb
  ],
  styles: [
    `
      .text-green {
        color: green;
      }

      .text-red {
        color: red;
      }
    `
  ]
})
export class UpdateTicketModal implements OnInit {
  refresh = new Subject<void>();
  currentTicket!: Ticket;
  currentTicketSignal = this.server.currentTicket;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { ticket: Ticket },
    private dialogRef: MatDialogRef<UpdateTicketModal>,
    private server: ServerService
  ) {
    effect(() => {
      const currentTicketSignal = this.currentTicketSignal();
      if (currentTicketSignal) {
        this.currentTicket = currentTicketSignal;
        this.server.getImageByTicketId(currentTicketSignal.id);
      }
    });
  }
  ngOnInit(): void {}

  updateTicket() {
    this.dialogRef.close(this.currentTicket);
  }
}
