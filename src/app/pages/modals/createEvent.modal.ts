import { Component, computed, Inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { ManagerServerService } from '../manager/services/manager-server.service';
import { ActionListDumb } from '../dumbs/action-list.dumb';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { Action } from 'src/app/models/action.model';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SafeResourceUrl } from '@angular/platform-browser';
import { PdfDisplayDumb } from '../dumbs/pdf-display.dumb';
import { CalendarEvent } from 'angular-calendar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { InputDateHourMinuteDumb } from '../dumbs/input-date-hour-minute.dumb';

@Component({
  template: `<form>
    <div class="flex items-center" mat-dialog-title>
      <h2 class="headline m-0 flex-auto">Confirmation</h2>

      <button
        (click)="close()"
        class="text-secondary"
        mat-icon-button
        type="button">
        <mat-icon svgIcon="mat:more_vert"></mat-icon>
      </button>

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
      <div class="flex flex-col sm:flex-row">
        <mat-form-field class="flex-auto">
          <mat-label>Titre</mat-label>
          <input
            cdkFocusInitial
            [(ngModel)]="calendarEvent.title"
            name="poste"
            matInput />

          <mat-icon matIconPrefix svgIcon="mat:person"></mat-icon>
        </mat-form-field>
      </div>

      <dumb-input-date-hour-minute
        [(date)]="calendarEvent.start"></dumb-input-date-hour-minute>
      <dumb-input-date-hour-minute
        [(date)]="calendarEvent.end"></dumb-input-date-hour-minute>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close type="button" (click)="close()">
        Cancel
      </button>
      <button
        color="primary"
        mat-flat-button
        type="submit"
        (click)="createEvent()">
        Créer
      </button>
    </mat-dialog-actions>
  </form>`,
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    FormsModule,
    MatMenuModule,
    MatDividerModule,
    MatInputModule,
    MatButtonModule,
    InputDateHourMinuteDumb
  ]
})
export class CreateEventModal {
  calendarEvent: CalendarEvent = {
    id: this.data?.event?.id || undefined,
    title: this.data?.event?.title || '',
    start: this.data?.event?.start || new Date(),
    end: this.data?.event?.end || new Date()
  };
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { event: CalendarEvent },
    private dialogRef: MatDialogRef<CreateEventModal>
  ) {}
  createEvent() {
    this.dialogRef.close(this.calendarEvent);
  }
  close() {
    this.dialogRef.close();
  }
}
