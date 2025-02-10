import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { MatMenuModule } from '@angular/material/menu';
import { Action } from 'src/app/models/action.model';

interface ActionDisplay {
  id: number;
  from: Date;
  to: Date;
  ancienStatut: string;
  nouveauStatut: string;
}
@Component({
  selector: 'dumb-action-list',
  template: `
    <div class="card overflow-hidden w-full flex flex-col">
      <div class="border-b py-2 px-6 flex items-center">
        <h2 class="m-0 title flex-auto">{{ title }}</h2>
      </div>
      <div class="overflow-auto">
        <table [dataSource]="dataSource" class="w-full" mat-table matSort>
          <!-- Colonnes définies dynamiquement -->
          <ng-container *ngFor="let column of columns">
            <ng-container
              *ngIf="column.type === 'text'"
              [matColumnDef]="column.property">
              <th *matHeaderCellDef mat-header-cell mat-sort-header>
                <span>
                  {{ column.label }}
                </span>
              </th>
              <td *matCellDef="let row" [ngClass]="column.cssClasses" mat-cell>
                <span class="flex justify-center items-center">
                  {{ row[column.property] }}
                </span>
              </td>
            </ng-container>

            <ng-container
              *ngIf="column.label === 'Justificatif'"
              [matColumnDef]="column.property">
              <th *matHeaderCellDef mat-header-cell mat-sort-header>
                {{ column.label }}
              </th>
              <td mat-cell *matCellDef="let row">
                @if (row[column.property]) {
                  <button
                    mat-icon-button
                    (click)="openPdfOutput(row[column.property])">
                    <mat-icon svgIcon="mat:attach_file"></mat-icon>
                  </button>
                }
              </td>
            </ng-container>
          </ng-container>

          <!-- Colonne d'action -->
          <ng-container matColumnDef="action">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let row">
              <button mat-icon-button (click)="validActionOutput(row)">
                <mat-icon svgIcon="mat:check"></mat-icon>
              </button>
              <button mat-icon-button (click)="refuseActionOutput(row)">
                <mat-icon svgIcon="mat:close"></mat-icon>
              </button>
              <button mat-icon-button>
                <mat-icon svgIcon="mat:remove_red_eye"></mat-icon>
              </button>
            </td>
          </ng-container>

          <tr *matHeaderRowDef="visibleColumns" mat-header-row></tr>
          <tr *matRowDef="let row; columns: visibleColumns" mat-row></tr>
        </table>
      </div>
    </div>
  `,
  styles: [``],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    NgFor,
    NgIf,
    NgClass,
    MatTooltipModule,
    MatMenuModule
  ]
})
export class ActionListDumb implements OnInit, OnChanges, AfterViewInit {
  @Input({ required: true }) actionList!: Action[];
  @Input() pageSize = 6;
  @Input() title = 'Validations';

  @Output() clickAction = new EventEmitter<Action>();
  @Output() validAction = new EventEmitter<Action>();
  @Output() refuseAction = new EventEmitter<Action>();
  @Output() openPdfById = new EventEmitter<number>();
  visibleColumns!: Array<keyof ActionDisplay | string>;
  dataSource = new MatTableDataSource<ActionDisplay>();

  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  constructor() {}

  validActionOutput(row: ActionDisplay): void {
    const action = this.actionList.find((a) => a.id === row.id);
    if (action) {
      this.validAction.emit(action);
    }
  }

  refuseActionOutput(row: ActionDisplay): void {
    const action = this.actionList.find((a) => a.id === row.id);
    if (action) {
      this.refuseAction.emit(action);
    }
  }

  openPdfOutput(idPdf: number) {
    this.openPdfById.emit(idPdf);
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

  clickActionOutput(row: ActionDisplay): void {
    // Traitement de l'action sur la ligne
    console.log("Bouton d'action cliqué sur la ligne :", row);
    const action = this.actionList.find((a) => a.id === row.id);
    if (action) {
      this.clickAction.emit(action);
    }
  }

  ngOnInit() {
    this.visibleColumns = this.columns.map((column) => column.property);
    if (!this.visibleColumns.includes('action')) {
      this.visibleColumns.push('action');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['actionList']) {
      this.dataSource.data = this.actionList.map((currentAction) => ({
        id: currentAction.id,
        user:
          currentAction.userAppAction.nom +
          ' ' +
          currentAction.userAppAction.prenom,
        from: currentAction.dayAppList[0].date,
        to: currentAction.dayAppList[currentAction.dayAppList.length - 1].date,
        ancienStatut: currentAction.dayAppList[0].workState,
        nouveauStatut: currentAction.workState,
        notes: currentAction.notes,
        idPdf: currentAction.idPdf,
        nbJours: currentAction.dayAppList.length
      }));
    }
  }

  ngAfterViewInit() {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
}
