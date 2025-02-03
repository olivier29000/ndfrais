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
      (createUserModal)="createUserModal()"
      (updateUserModal)="updateUserModal($event)"
      [userAppList]="userAppList()"></dumb-user-app-list>
  `,
  animations: [],
  standalone: true,
  imports: [UserListDumb]
})
export class AdminUsersPage implements OnInit {
  userAppList = this.server.userAppList;
  createUserModal(): void {
    this.server.createUser();
  }

  updateUserModal(userApp: UserApp) {
    this.server.updateUserModal(userApp);
  }
  constructor(
    private dialog: MatDialog,
    private server: ServerService
  ) {}
  ngOnInit(): void {
    this.server.getUserAppList();
  }
}
