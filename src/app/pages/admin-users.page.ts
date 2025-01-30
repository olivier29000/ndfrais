import {
  AfterViewInit,
  Component,
  computed,
  DestroyRef,
  inject,
  Input,
  OnInit,
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';
import { aioTableData } from './data/aio-table-data';
import { UserApp } from '../models/user.model';
import { ServerService } from '../services/server.service';
import { UserListDumb } from './dumbs/user-app-list.dumb';

@Component({
  template: `
    <dumb-user-app-list
      [dataSource]="dataSource()"
      [columns]="columns"></dumb-user-app-list>
  `,
  animations: [],
  standalone: true,
  imports: [UserListDumb]
})
export class AdminUsersPage {
  columns: TableColumn<UserApp>[] = [
    {
      label: 'Checkbox',
      property: 'checkbox',
      type: 'checkbox',
      visible: true
    },
    { label: 'Image', property: 'image', type: 'image', visible: true },
    {
      label: 'Nom Prénom',
      property: 'nomPrenom',
      type: 'text',
      visible: true,
      cssClasses: ['font-medium']
    },
    {
      label: 'Email',
      property: 'email',
      type: 'text',
      visible: true,
      cssClasses: ['text-secondary', 'font-medium']
    },
    {
      label: 'Telephone',
      property: 'telephone',
      type: 'text',
      visible: false,
      cssClasses: ['text-secondary', 'font-medium']
    },
    {
      label: 'Manager',
      property: 'manager',
      type: 'user',
      visible: true,
      cssClasses: ['text-secondary', 'font-medium']
    },
    {
      label: 'Notes',
      property: 'notes',
      type: 'text',
      visible: true,
      cssClasses: ['text-secondary', 'font-medium']
    },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];

  dataSource = computed(() => {
    const dataSource: MatTableDataSource<UserApp> = new MatTableDataSource();
    dataSource.data = this.server.userAppList();
    return dataSource;
  });

  constructor(
    private dialog: MatDialog,
    private server: ServerService
  ) {}
}
