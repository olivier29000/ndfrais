import {
  AfterViewInit,
  Component,
  computed,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl
} from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import {
  MatCheckboxChange,
  MatCheckboxModule
} from '@angular/material/checkbox';
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
import { ContratUserApp } from 'src/app/models/contrat-employe.model';
import { UserApp } from 'src/app/models/user.model';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'dumb-contrat-list',
  template: `<vex-page-layout>
      <vex-page-layout-content class="-mt-6 container">
        <div class="card overflow-auto -mt-16" style="margin-top : 50px">
          <div
            class="bg-app-bar px-6 h-16 border-b sticky left-0 flex items-center">
            <h2
              class="title my-0 ltr:pr-4 rtl:pl-4 ltr:mr-4 rtl:ml-4 ltr:border-r rtl:border-l hidden sm:block flex-none">
              <span *ngIf="selection.isEmpty()"
                >{{ contratEmployeList.length }} {{ title }} :
                {{ userApp?.nomPrenom }}</span
              >
              <span *ngIf="selection.hasValue()"
                >{{ selection.selected.length }} ContratUserApp<span
                  *ngIf="selection.selected.length > 1"
                  >s</span
                >
                selected</span
              >
            </h2>

            <div
              *ngIf="selection.hasValue()"
              class="mr-4 pr-4 border-r flex-none">
              <button
                color="primary"
                mat-icon-button
                matTooltip="Delete selected"
                type="button">
                <mat-icon svgIcon="mat:delete"></mat-icon>
              </button>

              <button
                color="primary"
                mat-icon-button
                matTooltip="Another action"
                type="button">
                <mat-icon svgIcon="mat:folder"></mat-icon>
              </button>
            </div>

            <span class="flex-1"></span>

            <button
              [matMenuTriggerFor]="columnFilterMenu"
              class="ml-4 flex-none"
              mat-icon-button
              matTooltip="Filter Columns"
              type="button">
              <mat-icon svgIcon="mat:filter_list"></mat-icon>
            </button>

            <button
              class="ml-4 flex-none"
              color="primary"
              mat-mini-fab
              matTooltip="Add ContratUserApp"
              type="button"
              (click)="createContratModalOutput()">
              <mat-icon svgIcon="mat:add"></mat-icon>
            </button>
          </div>
          <table
            @stagger
            [dataSource]="dataSource"
            class="w-full"
            mat-table
            matSort>
            <ng-container matColumnDef="checkbox">
              <th *matHeaderCellDef mat-header-cell></th>
              <td *matCellDef="let row" class="w-4" mat-cell>
                <mat-checkbox
                  (change)="selectRow($event, row)"
                  [checked]="selectedContrat?.id === row.id"
                  color="primary">
                </mat-checkbox>
              </td>
            </ng-container>

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
                *ngIf="column.type === 'badge'"
                [matColumnDef]="column.property">
                <th *matHeaderCellDef mat-header-cell mat-sort-header>
                  {{ column.label }}
                </th>
                <td
                  *matCellDef="let row"
                  [ngClass]="column.cssClasses"
                  mat-cell>
                  @if (row['nbActions'] > 0) {
                    <button
                      class="m-2 bg-green-600 text-white shadow-xl hover:shadow-lg h-screen flex items-center justify-center"
                      color="primary"
                      mat-icon-button
                      type="button"
                      style="height: 30px; width: 30px;">
                      <span class="align-middle" style="font-size : 12px;">{{
                        row['nbActions']
                      }}</span>
                    </button>
                    <!-- <a class="vex-sidenav-item" matRipple>
                      <span
                        class="vex-sidenav-item__badge bg-green-600 text-white"
                        >{{ row['nbActions'] }}</span
                      >
                    </a> -->
                  }
                </td>
              </ng-container>
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

                <td
                  *matCellDef="let row"
                  [ngClass]="column.cssClasses"
                  mat-cell>
                  {{ row[column.property] }}
                </td>
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
                <td
                  *matCellDef="let row"
                  [ngClass]="column.cssClasses"
                  mat-cell>
                  {{ row[column.property] | date: 'dd/MM/yyyy' : '' : 'fr' }}
                </td>
              </ng-container>
              <ng-container
                *ngIf="column.type === 'dayOfWeekReposList'"
                [matColumnDef]="column.property">
                <th
                  *matHeaderCellDef
                  class="uppercase"
                  mat-header-cell
                  mat-sort-header>
                  {{ column.label }}
                </th>
                <td
                  *matCellDef="let row"
                  [ngClass]="column.cssClasses"
                  mat-cell>
                  @for (dayWeekEnd of row[column.property]; track dayWeekEnd) {
                    {{ dayWeekEnd }}
                  }
                </td>
              </ng-container>
            </ng-container>
            <!-- Date Columns -->
            <ng-container
              *ngFor="let column of columns; trackBy: trackByProperty">
            </ng-container>

            <!-- Contact Column -->
            <ng-container matColumnDef="contact">
              <th *matHeaderCellDef mat-header-cell mat-sort-header></th>
              <td *matCellDef="let row" mat-cell>
                <div class="flex">
                  <a
                    (click)="$event.stopPropagation()"
                    class="w-8 h-8 p-0 leading-none flex items-center justify-center hover:bg-hover text-primary-600 bg-primary-600/10"
                    mat-icon-button>
                    <mat-icon class="icon-sm" svgIcon="mat:phone"></mat-icon>
                  </a>

                  <a
                    (click)="$event.stopPropagation()"
                    class="w-8 h-8 p-0 leading-none flex items-center justify-center ml-1 hover:bg-hover text-teal-600 bg-teal/10"
                    mat-icon-button>
                    <mat-icon class="icon-sm" svgIcon="mat:mail"></mat-icon>
                  </a>

                  <a
                    (click)="$event.stopPropagation()"
                    class="w-8 h-8 p-0 leading-none flex items-center justify-center ml-1 hover:bg-hover text-green-600 bg-green-600/10"
                    mat-icon-button>
                    <mat-icon class="icon-sm" svgIcon="mat:map"></mat-icon>
                  </a>
                </div>
              </td>
            </ng-container>

            <!-- Label Column -->
            <ng-container matColumnDef="labels">
              <th
                *matHeaderCellDef
                class="uppercase"
                mat-header-cell
                mat-sort-header>
                Labels
              </th>
              <td *matCellDef="let row" mat-cell>
                <div
                  (click)="$event.stopPropagation()"
                  class="flex items-center gap-1">
                  <div
                    *ngFor="let label of row.labels"
                    [ngClass]="[label.textClass, label.bgClass]"
                    class="rounded px-2 py-1 font-medium text-xs flex-none">
                    {{ label.text }}
                  </div>
                  <div
                    class="bg-base text-hint cursor-pointer hover:bg-hover flex-none flex items-center justify-center">
                    <mat-icon class="icon-sm" svgIcon="mat:add"></mat-icon>
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="contratManager">
              <th
                *matHeaderCellDef
                class="uppercase"
                mat-header-cell
                mat-sort-header>
                Manager
              </th>
              <td *matCellDef="let row" mat-cell>
                {{
                  row['contratManager']
                    ? row['contratManager'].nom +
                      ' ' +
                      row['contratManager'].prenom
                    : 'Aucun contratManager'
                }}
              </td>
            </ng-container>

            <!-- Action Column -->
            <ng-container matColumnDef="actions">
              <th *matHeaderCellDef mat-header-cell mat-sort-header></th>
              <td *matCellDef="let row" class="w-10 text-secondary" mat-cell>
                <button
                  (click)="$event.stopPropagation()"
                  [matMenuTriggerData]="{ ContratUserApp: row }"
                  [matMenuTriggerFor]="actionsMenu"
                  mat-icon-button
                  type="button">
                  <mat-icon svgIcon="mat:more_horiz"></mat-icon>
                </button>
              </td>
            </ng-container>
            <tr *matHeaderRowDef="visibleColumns" mat-header-row></tr>
            <tr
              *matRowDef="let row; columns: visibleColumns"
              @fadeInUp
              class="hover:bg-hover transition duration-400 ease-out-swift cursor-pointer"
              mat-row></tr>
          </table>
        </div>
      </vex-page-layout-content>
    </vex-page-layout>

    <mat-menu #columnFilterMenu="matMenu" xPosition="before" yPosition="below">
      <button
        (click)="toggleColumnVisibility(column, $event)"
        *ngFor="let column of columns"
        class="mat-menu-item block">
        <mat-checkbox
          (click)="$event.stopPropagation()"
          [(ngModel)]="column.visible"
          color="primary">
          {{ column.label }}
        </mat-checkbox>
      </button>
    </mat-menu>

    <mat-menu #actionsMenu="matMenu" xPosition="before" yPosition="below">
      <ng-template let-ContratUserApp="ContratUserApp" matMenuContent>
        @if (!ContratUserApp.archived) {
          <button
            mat-menu-item
            [routerLink]="
              '/admin/contrats/' +
              ContratUserApp.userApp.id +
              '/contrat-detail/' +
              ContratUserApp.id
            ">
            <mat-icon svgIcon="mat:remove_red_eye"></mat-icon>
            <span>Voir</span>
          </button>
          <button
            mat-menu-item
            (click)="updateContratModalOutput(ContratUserApp)">
            <mat-icon svgIcon="mat:edit"></mat-icon>
            <span>Modifier</span>
          </button>
          <button
            mat-menu-item
            (click)="archiveUnarchiveOutput(ContratUserApp)">
            <mat-icon svgIcon="mat:delete"></mat-icon>
            <span>Archiver</span>
          </button>
        } @else {
          <button
            mat-menu-item
            (click)="archiveUnarchiveOutput(ContratUserApp)">
            <mat-icon svgIcon="mat:delete"></mat-icon>
            <span>Restaurer</span>
          </button>
        }
      </ng-template>
    </mat-menu>`,
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
    MatSelectModule,
    RouterLink
  ]
})
export class ContratListDumb implements AfterViewInit {
  @Input() title = '';
  @Input() columns: TableColumn<ContratUserApp>[] = [
    {
      label: 'Checkbox',
      property: 'checkbox',
      type: 'checkbox',
      visible: true
    },
    {
      label: 'Poste',
      property: 'poste',
      type: 'text',
      visible: true,
      cssClasses: ['font-medium']
    },
    {
      label: 'Date de début',
      property: 'dateBegin',
      type: 'date',
      visible: true,
      cssClasses: ['font-medium']
    },
    {
      label: 'Date de fin',
      property: 'dateEnd',
      type: 'date',
      visible: true,
      cssClasses: ['font-medium']
    },
    {
      label: 'Jours de repos',
      property: 'dayOfWeekReposList',
      type: 'dayOfWeekReposList',
      visible: true,
      cssClasses: ['text-secondary', 'font-medium']
    },
    {
      label: 'cumul congés/mois',
      property: 'nbJourCongeMois',
      type: 'number',
      visible: false,
      cssClasses: ['text-secondary', 'font-medium']
    },
    {
      label: 'cumul rtt/mois',
      property: 'nbJourRttMois',
      type: 'number',
      visible: false,
      cssClasses: ['text-secondary', 'font-medium']
    },
    {
      label: 'heures/semaines',
      property: 'nbHeureSemaine',
      type: 'number',
      visible: false,
      cssClasses: ['text-secondary', 'font-medium']
    },
    {
      label: 'nb demandes',
      property: 'nbActions',
      type: 'badge',
      visible: true,
      cssClasses: ['font-medium']
    },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];

  selectedContrat: ContratUserApp | undefined = undefined;

  @Output() createContratModal = new EventEmitter<void>();
  @Output() selectedContratOutput = new EventEmitter<
    ContratUserApp | undefined
  >();
  @Output() updateContratModal = new EventEmitter<ContratUserApp>();
  @Output() archiveUnarchive = new EventEmitter<ContratUserApp>();
  createContratModalOutput(): void {
    this.createContratModal.emit();
  }

  selectRow(event: MatCheckboxChange, row: ContratUserApp): void {
    if (event.checked) {
      this.selectedContrat = row;
    } else {
      this.selectedContrat = undefined;
    }
    this.selectedContratOutput.emit(this.selectedContrat);
  }

  updateContratModalOutput(contratEmploye: ContratUserApp): void {
    this.updateContratModal.emit(contratEmploye);
  }
  archiveUnarchiveOutput(contratEmploye: ContratUserApp): void {
    this.archiveUnarchive.emit(contratEmploye);
  }
  dataSource!: MatTableDataSource<ContratUserApp, MatPaginator>;
  _contratEmployeList: ContratUserApp[] = [];
  @Input()
  set contratEmployeList(value: ContratUserApp[]) {
    const dataSource: MatTableDataSource<ContratUserApp> =
      new MatTableDataSource();
    dataSource.data = value || [];
    this.dataSource = dataSource;
    this._contratEmployeList = value;
  }
  get contratEmployeList(): ContratUserApp[] {
    return this._contratEmployeList;
  }
  @Input() userApp: UserApp | undefined;

  selection = new SelectionModel<ContratUserApp>(true, []);

  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  constructor() {
    registerLocaleData(localeFr);
  }
  ngAfterViewInit() {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  toggleColumnVisibility(column: TableColumn<ContratUserApp>, event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }
}
