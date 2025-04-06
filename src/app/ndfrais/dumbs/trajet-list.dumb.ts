import {
  AfterViewInit,
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Trajet } from '../models/trajet.model';

@Component({
  selector: 'dumb-trajet-list',
  template: `<vex-page-layout>
    <vex-page-layout-content class="-mt-6 container">
      <div class="card overflow-auto -mt-16" style="margin-top : 50px">
        <div
          class="bg-app-bar px-6 h-16 border-b sticky left-0 flex items-center">
          <h2
            class="title my-0 ltr:pr-4 rtl:pl-4 ltr:mr-4 rtl:ml-4 ltr:border-r rtl:border-l flex-none">
            <span>{{ trajetList.length }} trajets : {{ total }} km </span>
          </h2>

          <span class="flex-1"></span>

          <ng-content></ng-content>
        </div>
        <table
          @stagger
          [dataSource]="dataSource"
          class="w-full"
          mat-table
          matSort>
          <!--- Note that these columns can be defined in any order.
                The actual rendered columns are set as a property on the row definition" -->

          <!-- Image Column -->
          <ng-container matColumnDef="image">
            <th *matHeaderCellDef mat-header-cell></th>
            <td *matCellDef="let row" class="w-8 min-w-8 p-0" mat-cell>
              <img
                [src]="row['imageBase64']"
                class="avatar h-8 w-8 align-middle" />
            </td>
          </ng-container>

          <!-- Text Columns -->
          <ng-container
            *ngFor="let column of columns; trackBy: trackByProperty">
            <ng-container
              *ngIf="column.type === 'text'"
              [matColumnDef]="column.property">
              <th
                *matHeaderCellDef
                class="uppercase"
                mat-header-cell
                mat-sort-header>
                {{ column.label }}
              </th>
              @if (column.label === 'Départ') {
                <td
                  *matCellDef="let row"
                  [ngClass]="column.cssClasses"
                  mat-cell>
                  {{ row.depart.displayed }}
                </td>
              } @else if (column.label === 'Arrivée') {
                <td
                  *matCellDef="let row"
                  [ngClass]="column.cssClasses"
                  mat-cell>
                  {{ row.arrive.displayed }}
                </td>
              } @else {
                <td
                  *matCellDef="let row"
                  [ngClass]="column.cssClasses"
                  mat-cell>
                  {{ row[column.property] }}
                </td>
              }
            </ng-container>
            <ng-container
              *ngIf="column.type === 'date'"
              [matColumnDef]="column.property">
              <th
                *matHeaderCellDef
                class="uppercase"
                mat-header-cell
                mat-sort-header>
                {{ column.label }}
              </th>
              <td *matCellDef="let row" [ngClass]="column.cssClasses" mat-cell>
                {{ row[column.property] | date: 'dd/MM/yyyy' : '' : 'fr' }}
              </td>
            </ng-container>
            <ng-container
              *ngIf="column.type === 'number'"
              [matColumnDef]="column.property">
              <th
                *matHeaderCellDef
                class="uppercase"
                mat-header-cell
                mat-sort-header>
                {{ column.label }}
              </th>
              <td *matCellDef="let row" [ngClass]="column.cssClasses" mat-cell>
                {{ row[column.property] | number: '1.2-2' }} km
              </td>
            </ng-container>
          </ng-container>

          <!-- Action Column -->
          <ng-container matColumnDef="actions">
            <th *matHeaderCellDef mat-header-cell mat-sort-header></th>
            <td *matCellDef="let row" class="w-10 text-secondary" mat-cell></td>
          </ng-container>

          <tr *matHeaderRowDef="visibleColumns" mat-header-row></tr>

          <tr
            *matRowDef="let row; columns: visibleColumns"
            @fadeInUp
            class="hover:bg-hover transition duration-400 ease-out-swift cursor-pointer"
            mat-row
            (click)="updateTrajetOutput(row)"></tr>

          <!-- Insère ici le contenu passé -->
        </table>
      </div>
    </vex-page-layout-content>
  </vex-page-layout> `,
  animations: [fadeInUp400ms, stagger40ms],
  standalone: true,
  imports: [
    CommonModule,
    VexPageLayoutComponent,
    MatButtonToggleModule,
    ReactiveFormsModule,
    VexPageLayoutContentDirective,
    NgIf,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    NgFor,
    NgClass,
    MatPaginatorModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class TrajetListDumb {
  columns: TableColumn<Trajet>[] = [
    {
      label: 'Titre',
      property: 'titre',
      type: 'text',
      visible: true,
      cssClasses: ['font-medium']
    },
    // {
    //   label: 'Départ',
    //   property: 'displayedDepart',
    //   type: 'text',
    //   visible: true,
    //   cssClasses: ['font-medium']
    // },
    // {
    //   label: 'Arrivée',
    //   property: 'displayedArrive',
    //   type: 'text',
    //   visible: true,
    //   cssClasses: ['font-medium']
    // },
    {
      label: 'Date',
      property: 'dateTrajet',
      type: 'date',
      visible: true,
      cssClasses: ['font-medium']
    },
    {
      label: 'nbkm',
      property: 'nbkm',
      type: 'number',
      visible: true,
      cssClasses: ['font-medium']
    }
  ];

  @Output() updateTrajet = new EventEmitter<Trajet>();

  selectedUser: Trajet | undefined = undefined;

  updateTrajetOutput(trajet: Trajet): void {
    this.updateTrajet.emit(trajet);
  }

  total: string = '0';
  _trajetList!: Trajet[];
  dataSource!: MatTableDataSource<Trajet, MatPaginator>;
  @Input()
  set trajetList(value: Trajet[]) {
    this._trajetList = value;
    const dataSource: MatTableDataSource<Trajet> = new MatTableDataSource();
    dataSource.data = value;
    this.dataSource = dataSource;
    this.total = value.reduce((acc, t) => acc + t.nbkm, 0).toFixed(0);
  }

  get trajetList(): Trajet[] {
    return this._trajetList;
  }

  constructor() {}

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }
}
