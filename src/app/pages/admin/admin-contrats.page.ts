import {
  AfterViewInit,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  Input,
  OnInit,
  signal,
  ViewChild,
  WritableSignal
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
import { aioTableData } from '../data/aio-table-data';
import { UserApp } from '../../models/user.model';
import { ServerService } from '../../services/server.service';
import { UserListDumb } from '../dumbs/user-app-list.dumb';
import { ActivatedRoute } from '@angular/router';
import { ContratListDumb } from '../dumbs/contrat-list.dumb';
import { ContratUserApp } from '../../models/contrat-employe.model';

@Component({
  template: `<dumb-contrat-list
    (createContratModal)="createContratModal()"
    (updateContratModal)="updateContratModal($event)"
    [contratEmployeList]="adminContratList()"
    [userApp]="currentUserApp()"></dumb-contrat-list>`,
  animations: [],
  standalone: true,
  imports: [ContratListDumb]
})
export class AdminContratsPage {
  currentUserApp: WritableSignal<UserApp | undefined> = signal(undefined);
  idUserApp: WritableSignal<string | undefined> = signal(undefined);
  adminContratList = this.server.adminContratList;
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idUserApp = params.get('idUserApp');
      if (idUserApp) {
        this.idUserApp.set(idUserApp);
      }
    });
  }

  createContratModal(): void {
    const currentUserApp = this.currentUserApp();
    if (currentUserApp) {
      this.server.createContratModal(currentUserApp);
    }
  }

  updateContratModal(contrat: ContratUserApp) {
    this.server.updateContratModal(contrat);
  }

  constructor(
    private dialog: MatDialog,
    private server: ServerService,
    private route: ActivatedRoute
  ) {
    effect(
      () => {
        const idUserApp = this.idUserApp();
        const userAppList = this.server.userAppList();
        if (idUserApp && userAppList.length > 0) {
          this.currentUserApp.set(
            userAppList.find((u) => u.id === Number(idUserApp))
          );
          this.server.getContratListByUserId(idUserApp);
        }
      },
      { allowSignalWrites: true }
    );
  }
}
