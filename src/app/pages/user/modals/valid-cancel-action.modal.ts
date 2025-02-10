import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { NgIf } from '@angular/common';
import { UserApp } from 'src/app/models/user.model';
import { MatSelectModule } from '@angular/material/select';
import { Action } from 'src/app/models/action.model';
import { ServerService } from 'src/app/services/server.service';
import { UserServerService } from '../services/user-server.service';
import { ActionListDumb } from '../../dumbs/action-list.dumb';

@Component({
  template: `<form>
    <div class="flex items-center" mat-dialog-title>
      <h2 class="headline m-0 flex-auto">Confirmation</h2>

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
      <table class="w-full" mat-table matSort>
        <thead>
          <tr>
            <th mat-header-cell mat-sort-header>de</th>
            <th mat-header-cell mat-sort-header>du</th>
            <th mat-header-cell mat-sort-header>au</th>
            <th mat-header-cell mat-sort-header>Ancien statut</th>
            <th mat-header-cell mat-sort-header>Nouveau Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ data.action.userAppAction.nom }}</td>
            <td>{{ data.action.dayAppList[0].date }}</td>
            <td>
              {{
                data.action.dayAppList[data.action.dayAppList.length - 1].date
              }}
            </td>
            <td>{{ data.action.dayAppList[0].workState }}</td>
            <td>{{ data.action.workState }}</td>
          </tr>
        </tbody>
      </table>

      <mat-divider class="text-border"></mat-divider>
      <!-- Champ de fichier sans <mat-form-field> -->
      <div class="file-input-container my-3">
        <label class="mat-form-field-label">Pièce justificative : </label>
        <input
          type="file"
          class="btn btn-gradient active"
          (change)="onFileSelected($event)"
          accept="application/pdf" />
      </div>
      <mat-divider class="text-border"></mat-divider>
      <mat-form-field class="flex-auto">
        <mat-label>Notes</mat-label>
        <textarea
          [(ngModel)]="data.action.notes"
          name="notes"
          matInput></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close type="button" (click)="close()">
        Annuler
      </button>
      <button
        color="primary"
        mat-flat-button
        type="submit"
        (click)="validAction()">
        Confirmer
      </button>
    </mat-dialog-actions>
  </form> `,
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class ValidCancelActionModal implements OnInit {
  pdfData: Blob | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { action: Action },
    private dialogRef: MatDialogRef<ValidCancelActionModal>,
    private userServer: UserServerService
  ) {}

  ngOnInit() {}

  validAction() {
    this.dialogRef.close(this.data.action);
  }

  close() {
    this.dialogRef.close();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.data.action.file = input.files[0];
    }
  }

  //   onSubmit(): void {
  //     if (!this.file) return;

  //     const formData = new FormData();
  //     formData.append('file', this.file);
  //     this.serverService.postCV(formData);
  //   }
}
