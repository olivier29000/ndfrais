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
import { eachDayOfInterval, eachMonthOfInterval, format } from 'date-fns';
import { DayApp } from 'src/app/models/day-app.model';
import { DaySquareDumb } from './day-square.dumb';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TableColumn } from '@vex/interfaces/table-column.interface';
@Component({
  selector: 'dumb-action-list',
  template: `<div class="card overflow-hidden w-full flex flex-col">
    <div class="border-b py-2 px-6 flex items-center">
      <h2 class="m-0 title flex-auto">Recent Sales</h2>

      <button mat-icon-button type="button" (click)="validOutput()">
        <mat-icon class="text-secondary" svgIcon="mat:more_horiz"></mat-icon>
      </button>
    </div>

    <div class="overflow-auto">
      <table [dataSource]="dataSource" class="w-full" mat-table matSort>
        <!--- Note that these columns can be defined in any order.
            The actual rendered columns are set as a property on the row definition" -->

        <!-- Model Properties Column -->
        <ng-container *ngFor="let column of columns">
          <ng-container
            *ngIf="column.type === 'text'"
            [matColumnDef]="column.property">
            <th *matHeaderCellDef mat-header-cell mat-sort-header>
              {{ column.label }}
            </th>
            <td *matCellDef="let row" [ngClass]="column.cssClasses" mat-cell>
              {{ row[column.property] }}
            </td>
          </ng-container>

          <ng-container
            *ngIf="column.type === 'badge'"
            [matColumnDef]="column.property">
            <th *matHeaderCellDef mat-header-cell mat-sort-header>
              {{ column.label }}
            </th>
            <td *matCellDef="let row" [ngClass]="column.cssClasses" mat-cell>
              <div
                *ngIf="row[column.property] === 'ready'"
                class="w-3 h-3 rounded-full bg-green-600 cursor-pointer"
                matTooltip="Ready to ship"></div>
              <div
                *ngIf="row[column.property] === 'pending'"
                class="w-3 h-3 rounded-full bg-orange-600 cursor-pointer"
                matTooltip="Pending Payment"></div>
              <div
                *ngIf="row[column.property] === 'warn'"
                class="w-3 h-3 rounded-full bg-red-600 cursor-pointer"
                matTooltip="Missing Payment"></div>
            </td>
          </ng-container>
        </ng-container>

        <tr *matHeaderRowDef="visibleColumns" mat-header-row></tr>
        <tr *matRowDef="let row; columns: visibleColumns" mat-row></tr>
      </table>
    </div>
  </div> `,
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
    MatTooltipModule
  ]
})
export class ActionListDumb<T> implements OnInit, OnChanges, AfterViewInit {
  @Input({ required: true }) data!: T[];
  @Input({ required: true }) columns!: TableColumn<T>[];
  @Input() pageSize = 6;

  @Output() valid = new EventEmitter<void>();
  visibleColumns!: Array<keyof T | string>;
  dataSource = new MatTableDataSource<T>();

  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  constructor() {}
  validOutput(): void {
    this.valid.emit();
  }
  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns']) {
      this.visibleColumns = this.columns.map((column) => column.property);
    }

    if (changes['data']) {
      this.dataSource.data = this.data;
    }
  }

  ngAfterViewInit() {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
}
