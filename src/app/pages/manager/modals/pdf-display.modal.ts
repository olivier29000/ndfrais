import { Component, computed, Inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { ManagerServerService } from '../services/manager-server.service';
import { ActionListDumb } from '../../dumbs/action-list.dumb';
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
import { PdfDisplayDumb } from '../../dumbs/pdf-display.dumb';

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
      <dumb-pdf-display [pdfData]="data.pdfData"></dumb-pdf-display>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close type="button" (click)="close()">
        Ok
      </button>
    </mat-dialog-actions>
  </form>`,
  standalone: true,
  imports: [
    MatListModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    PdfDisplayDumb
  ]
})
export class PdfDisplayModal {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { pdfData: SafeResourceUrl },
    private dialogRef: MatDialogRef<PdfDisplayModal>
  ) {}

  close() {
    this.dialogRef.close();
  }
}
