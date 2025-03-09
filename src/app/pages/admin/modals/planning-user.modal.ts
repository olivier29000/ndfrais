import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Inject,
  OnInit
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { ContratUserApp } from 'src/app/models/contrat-employe.model';
import {
  MatNativeDateModule,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  NativeDateAdapter
} from '@angular/material/core';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { UserApp } from 'src/app/models/user.model';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AdminServerService } from '../services/admin-server.service';
import { WORK_STATE } from 'src/app/models/day-app.model';
import { WorkStateDumb } from '../../dumbs/work-state.dumb';
import { Subject } from 'rxjs';
import { AdminContratSmart } from '../smarts/admin-contrat.smart';

export class CustomDateAdapter extends NativeDateAdapter {
  override parse(value: any): Date | null {
    if (typeof value === 'string' && value.length === 10) {
      const [day, month, year] = value.split('/').map(Number);
      return new Date(year, month - 1, day);
    }
    return super.parse(value);
  }

  override format(date: Date, displayFormat: string): string {
    if (displayFormat === 'input') {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return super.format(date, displayFormat);
  }
}

export const CUSTOM_DATE_FORMATS = {
  parse: { dateInput: 'DD/MM/YYYY' },
  display: {
    dateInput: 'dd/MM/yyyy',
    monthYearLabel: 'MMMM yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM yyyy'
  }
};

@Component({
  template: `
    <div class="flex items-center" mat-dialog-title>
      <h2 class="headline m-0 flex-auto">{{ selectedContrat()?.poste }}</h2>

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
      <smart-admin-contrat
        [currentContrat]="selectedContrat()"></smart-admin-contrat>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close type="button" (click)="close()">
        OK
      </button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [
    CommonModule,
    AdminContratSmart,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    MatButtonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }
  ]
})
export class PlanningUserModal {
  selectedContrat = this.adminServer.selectedContrat;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      userApp: UserApp;
      contrat: ContratUserApp;
    },
    private dialogRef: MatDialogRef<PlanningUserModal>,
    private adminServer: AdminServerService
  ) {}
  close() {
    this.dialogRef.close();
  }
}
