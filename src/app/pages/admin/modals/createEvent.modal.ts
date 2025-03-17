import { Component, Inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { EventMeta } from '../../../models/meta-event.model';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { CalendarEvent } from 'angular-calendar';
import { InputDateHourMinuteDumb } from '../../dumbs/input-date-hour-minute.dumb';
import { SelectTagDumb } from '../../dumbs/select-tag-list.dumb';
import { Tag } from 'src/app/models/tag.model';
import { AdminServerService } from '../../admin/services/admin-server.service';

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

      <dumb-select-tag
        [availableTagList]="tagMap()"
        [selectedTagList]="calendarEvent.meta?.tagList ?? []"
        (selectTagOutput)="selectTag($event)"
        (unSelectTagOutput)="unSelectTag($event)"
        (createTagOutput)="createTag($event)"></dumb-select-tag>
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
        Valider
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
    InputDateHourMinuteDumb,
    SelectTagDumb
  ]
})
export class CreateEventModal implements OnInit {
  calendarEvent: CalendarEvent<EventMeta> = {
    id: this.data?.event?.id || undefined,
    title: this.data?.event?.title || '',
    start: this.data?.event?.start || new Date(),
    end: this.data?.event?.end || new Date(),
    meta: this.data?.event?.meta || { tagList: [] }
  };
  tagMap = this.adminServer.tagMap;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { event: CalendarEvent<EventMeta> },
    private dialogRef: MatDialogRef<CreateEventModal>,
    private adminServer: AdminServerService
  ) {}
  ngOnInit(): void {
    this.adminServer.getEventTagMap();
  }
  createEvent() {
    this.dialogRef.close(this.calendarEvent);
  }
  close() {
    this.dialogRef.close();
  }

  createTag(tag: Tag): void {
    this.adminServer.addEventTag(tag);
  }

  selectTag(tag: Tag): void {
    if (
      this.calendarEvent.meta &&
      !(this.calendarEvent.meta.tagList ?? []).some((t) => t.id === tag.id)
    ) {
      this.calendarEvent.meta.tagList = (
        this.calendarEvent.meta?.tagList ?? []
      ).concat(tag);
    }
  }

  unSelectTag(tag: Tag): void {
    if (this.calendarEvent.meta) {
      this.calendarEvent.meta.tagList = (
        this.calendarEvent.meta.tagList ?? []
      ).filter((t) => t.id !== tag.id);
    }
  }
}
