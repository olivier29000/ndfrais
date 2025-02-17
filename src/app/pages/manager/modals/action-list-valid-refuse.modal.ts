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
import { Action, ActionDisplay } from 'src/app/models/action.model';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

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
      <dumb-action-list
        [actionList]="[data.action]"
        [withActions]="false"
        [columns]="columns"
        class="sm:col-span-2"></dumb-action-list>
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
    ActionListDumb,
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
export class ActionListValidRefuseModal implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { action: Action; type: 'valid' | 'refuse' | 'watch' },
    private dialogRef: MatDialogRef<ActionListValidRefuseModal>,
    private managerServer: ManagerServerService
  ) {}

  ngOnInit() {}
  validAction(): void {
    this.managerServer.validAction(this.data.action);
    this.dialogRef.close();
  }
  refuseAction(): void {
    this.managerServer.refuseAction(this.data.action);
    this.dialogRef.close();
  }
  close() {
    this.dialogRef.close();
  }

  columns: TableColumn<ActionDisplay>[] = [
    {
      label: 'de',
      property: 'user',
      type: 'text'
    },
    {
      label: 'du',
      property: 'from',
      type: 'text'
    },
    {
      label: 'au',
      property: 'to',
      type: 'text'
    },
    {
      label: 'Nb jours concernés',
      property: 'nbJours',
      type: 'text'
    },
    {
      label: 'Ancien statut',
      property: 'ancienStatut',
      type: 'text',
      cssClasses: ['font-medium']
    },
    {
      label: 'Nouveau Statut',
      property: 'nouveauStatut',
      type: 'text',
      cssClasses: ['font-medium']
    },
    {
      label: 'Notes',
      property: 'notes',
      type: 'text',
      cssClasses: ['font-medium']
    },
    {
      label: 'Justificatif',
      property: 'idPdf',
      type: 'number',
      cssClasses: ['font-medium']
    }
  ];
}
