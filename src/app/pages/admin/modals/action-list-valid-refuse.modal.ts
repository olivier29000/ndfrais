import { Component, computed, Inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
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
import { AdminServerService } from '../services/admin-server.service';

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
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close type="button" (click)="close()">
        Annuler
      </button>
      @if (data.type === 'valid') {
        <button color="primary" mat-flat-button (click)="validAction()">
          Confirmer la validation
        </button>
      } @else {
        <button color="accent" mat-flat-button (click)="refuseAction()">
          Confirmer le refus
        </button>
      }
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
    MatSelectModule
  ]
})
export class AdminActionListValidRefuseModal implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { action: Action; type: 'valid' | 'refuse' | 'watch' },
    private dialogRef: MatDialogRef<AdminActionListValidRefuseModal>,
    private adminServer: AdminServerService
  ) {}

  ngOnInit() {}
  validAction(): void {
    this.adminServer.validAction(this.data.action);
    this.dialogRef.close();
  }
  refuseAction(): void {
    this.adminServer.refuseAction(this.data.action);
    this.dialogRef.close();
  }
  close() {
    this.dialogRef.close();
  }
}
