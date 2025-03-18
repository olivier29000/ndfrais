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
import { UserApp } from 'src/app/models/user.model';
import { MatSelectModule } from '@angular/material/select';
import { environment } from 'src/environment/environment';
import { ContratUserApp } from 'src/app/models/contrat-employe.model';

@Component({
  selector: 'dumb-user-app-list',
  template: `<vex-page-layout>
      <vex-page-layout-content class="-mt-6 container">
        <div class="card overflow-auto -mt-16" style="margin-top : 50px">
          <div
            class="bg-app-bar px-6 h-16 border-b sticky left-0 flex items-center">
            <h2
              class="title my-0 ltr:pr-4 rtl:pl-4 ltr:mr-4 rtl:ml-4 ltr:border-r rtl:border-l hidden sm:block flex-none">
              <span *ngIf="selection.isEmpty()">{{ title }}</span>
              <span *ngIf="selection.hasValue()"
                >{{ selection.selected.length }} UserApp<span
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
              matTooltip="Add UserApp"
              type="button"
              (click)="createUserModalOutput()">
              <mat-icon svgIcon="mat:add"></mat-icon>
            </button>
          </div>
          <ng-content></ng-content>
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
                <td
                  *matCellDef="let row"
                  [ngClass]="column.cssClasses"
                  mat-cell>
                  @if (
                    row.contratUserApp[column.property] &&
                    column.property === 'token'
                  ) {
                    <button
                      class="ml-4 flex-none"
                      mat-icon-button
                      matTooltip="Copier le lien"
                      type="button"
                      (click)="sendEmailLink(row.contratUserApp, row)">
                      <mat-icon svgIcon="mat:alternate_email"></mat-icon>
                    </button>
                    <button
                      class="ml-4 flex-none"
                      mat-icon-button
                      matTooltip="Copier le lien"
                      type="button"
                      (click)="
                        copyToClipboard(row.contratUserApp[column.property])
                      ">
                      <mat-icon svgIcon="mat:phonelink"></mat-icon>
                    </button>
                  } @else if (row.contratUserApp[column.property]) {
                    {{ row.contratUserApp[column.property] }}
                  } @else {
                    {{ row[column.property] }}
                  }
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
                  @if (row.contratUserApp) {
                    {{
                      row.contratUserApp[column.property]
                        | date: 'dd/MM/yyyy' : '' : 'fr'
                    }}
                  }
                </td>
              </ng-container>
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
            <!-- Action Column -->
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
                  [matMenuTriggerData]="{ UserApp: row }"
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

            <!-- Insère ici le contenu passé -->
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
      <ng-template let-UserApp="UserApp" matMenuContent>
        @if (UserApp.enabled) {
          <button mat-menu-item (click)="selectRow(UserApp)">
            <mat-icon svgIcon="mat:remove_red_eye"></mat-icon>
            <span>Voir</span>
          </button>
          <button mat-menu-item (click)="updateUserModalOutput(UserApp)">
            <mat-icon svgIcon="mat:edit"></mat-icon>
            <span>Modifier</span>
          </button>
          <button mat-menu-item (click)="changeEnabledOutput(UserApp)">
            <mat-icon svgIcon="mat:delete"></mat-icon>
            <span>Désactiver</span>
          </button>
        } @else {
          <button mat-menu-item (click)="changeEnabledOutput(UserApp)">
            <mat-icon svgIcon="mat:delete"></mat-icon>
            <span>Activer</span>
          </button>
        }
      </ng-template>
    </mat-menu> `,
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
export class UserListDumb implements AfterViewInit {
  copyToClipboard(text: string): void {
    navigator.clipboard
      .writeText(`${environment.urlFrontEnd}/employe/${text}`)
      .then(() => {
        console.log('Texte copié dans le presse-papiers !');
      })
      .catch((err) => {
        console.error('Échec de la copie :', err);
      });
  }

  sendEmailLink(contratUserApp: ContratUserApp, userApp: UserApp): void {
    this.sendEmailLinkOutput.emit({ ...contratUserApp, email: userApp.email });
  }
  columns: TableColumn<UserApp>[] = [
    {
      label: 'Nom Prénom',
      property: 'nomPrenom',
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
      label: 'Poste',
      property: 'poste',
      type: 'text',
      visible: true,
      cssClasses: ['font-medium']
    },
    {
      label: 'Lien',
      property: 'token',
      type: 'text',
      visible: true,
      cssClasses: ['font-medium']
    },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  @Input() title = '';
  @Output() createUserModal = new EventEmitter<void>();
  @Output() updateUserModal = new EventEmitter<UserApp>();
  @Output() changeEnabled = new EventEmitter<UserApp>();
  @Output() selectContrat = new EventEmitter<UserApp>();
  @Output() sendEmailLinkOutput = new EventEmitter<
    ContratUserApp & { email: string }
  >();

  selectedUser: UserApp | undefined = undefined;
  selectRow(row: UserApp): void {
    this.selectedUser = row;
    this.selectContrat.emit(this.selectedUser);
  }
  changeEnabledOutput(userApp: UserApp): void {
    this.changeEnabled.emit(userApp);
  }
  createUserModalOutput(): void {
    this.createUserModal.emit();
  }

  updateUserModalOutput(userApp: UserApp): void {
    this.updateUserModal.emit(userApp);
  }
  dataSource!: MatTableDataSource<UserApp, MatPaginator>;
  contratManagerList: UserApp[] = [];
  @Input()
  set userAppList(value: UserApp[]) {
    const dataSource: MatTableDataSource<UserApp> = new MatTableDataSource();
    dataSource.data = value;
    this.dataSource = dataSource;
    this.contratManagerList = value;
  }
  selection = new SelectionModel<UserApp>(true, []);

  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  constructor() {}
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

  toggleColumnVisibility(column: TableColumn<UserApp>, event: Event) {
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
