import { Component, Inject, OnInit } from '@angular/core';
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
import { NgIf } from '@angular/common';
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
import { ServerService } from 'src/app/services/server.service';

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
  template: `<form>
      <div class="flex items-center" mat-dialog-title>
        @if (currentContrat.userApp) {
          <h2 class="headline m-0 flex-auto">
            {{ currentContrat.userApp.nomPrenom }} : {{ currentContrat.poste }}
          </h2>
        } @else {
          <h2 class="headline m-0 flex-auto">
            {{ data.userApp.nomPrenom }} : Nouveau contrat
          </h2>
        }

        <button
          [matMenuTriggerFor]="settingsMenu"
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
        <div class="flex flex-col sm:flex-row">
          <mat-form-field class="flex-auto">
            <mat-label>Poste</mat-label>
            <input
              cdkFocusInitial
              [(ngModel)]="currentContrat.poste"
              name="poste"
              matInput />

            <mat-icon matIconPrefix svgIcon="mat:person"></mat-icon>
          </mat-form-field>
        </div>

        <mat-form-field>
          <mat-label>Date de début</mat-label>
          <input
            [matDatepicker]="datepickerRefdateBegin"
            [(ngModel)]="currentContrat.dateBegin"
            matInput
            name="dateBegin" />
          <mat-datepicker-toggle
            [for]="datepickerRefdateBegin"
            class="block"
            matIconPrefix></mat-datepicker-toggle>
          <mat-datepicker #datepickerRefdateBegin></mat-datepicker>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Date de fin</mat-label>
          <input
            [matDatepicker]="datepickerRefdateEnd"
            [(ngModel)]="currentContrat.dateEnd"
            matInput
            name="dateEnd" />
          <mat-datepicker-toggle
            [for]="datepickerRefdateEnd"
            class="block"
            matIconPrefix></mat-datepicker-toggle>
          <mat-datepicker #datepickerRefdateEnd></mat-datepicker>
        </mat-form-field>

        <mat-form-field class="flex-auto">
          <mat-label>Manager</mat-label>
          <mat-select
            [(ngModel)]="currentContrat.contratManager"
            name="contratManager">
            @for (contrat of adminAllContratList(); track contrat) {
              @if (currentContrat.userApp.id !== contrat.userApp.id) {
                <mat-option [value]="contrat">{{
                  contrat.userApp.nom +
                    ' ' +
                    contrat.userApp.prenom +
                    ' ' +
                    contrat.poste
                }}</mat-option>
              }
            }
          </mat-select>

          <mat-icon matIconPrefix svgIcon="mat:phone"></mat-icon>
        </mat-form-field>
        <div class="flex flex-col sm:flex-row">
          <mat-form-field class="sm:ml-4 flex-auto">
            <mat-label>Cumul de congés par mois</mat-label>
            <input
              cdkFocusInitial
              [(ngModel)]="currentContrat.nbJourCongeMois"
              name="nbJourCongeMois"
              type="number"
              matInput />

            <mat-icon matIconPrefix svgIcon="mat:person"></mat-icon>
          </mat-form-field>

          <mat-form-field class="sm:ml-4 flex-auto">
            <mat-label>Cumul de RTT par mois</mat-label>
            <input
              cdkFocusInitial
              [(ngModel)]="currentContrat.nbJourRttMois"
              name="nbJourRttMois"
              type="number"
              matInput />

            <mat-icon matIconPrefix svgIcon="mat:person"></mat-icon>
          </mat-form-field>
          <mat-form-field class="sm:ml-4 flex-auto">
            <mat-label>Nb heures par semaines</mat-label>
            <input
              cdkFocusInitial
              [(ngModel)]="currentContrat.nbHeureSemaine"
              name="nbHeureSemaine"
              type="number"
              matInput />

            <mat-icon matIconPrefix svgIcon="mat:person"></mat-icon>
          </mat-form-field>
        </div>

        <div class="flex flex-col sm:flex-row">
          <label class="mb-2 block">Jours de repos</label>
          <mat-button-toggle-group
            name="ingredients"
            aria-label="Ingredients"
            [(ngModel)]="currentContrat.dayOfWeekReposList"
            multiple>
            <mat-button-toggle value="MONDAY"> lundi </mat-button-toggle>
            <mat-button-toggle value="TUESDAY"> mardi </mat-button-toggle>
            <mat-button-toggle value="WEDNESDAY"> mercredi </mat-button-toggle>
            <mat-button-toggle value="THURSDAY"> jeudi </mat-button-toggle>
            <mat-button-toggle value="FRIDAY"> vendredi </mat-button-toggle>
            <mat-button-toggle value="SATURDAY"> samedi </mat-button-toggle>
            <mat-button-toggle value="SUNDAY"> dimanche </mat-button-toggle>
          </mat-button-toggle-group>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close type="button">Cancel</button>
        <button
          *ngIf="isCreateMode()"
          color="primary"
          mat-flat-button
          type="submit"
          (click)="save()">
          Create Customer
        </button>
        <button
          *ngIf="isUpdateMode()"
          color="primary"
          mat-flat-button
          type="submit"
          (click)="save()">
          Update Customer
        </button>
      </mat-dialog-actions>
    </form>

    <mat-menu #settingsMenu="matMenu" xPosition="before" yPosition="below">
      <button mat-menu-item>
        <mat-icon svgIcon="mat:print"></mat-icon>
        <span>Print</span>
      </button>

      <button mat-menu-item>
        <mat-icon svgIcon="mat:download"></mat-icon>
        <span>Export</span>
      </button>

      <button mat-menu-item>
        <mat-icon svgIcon="mat:delete"></mat-icon>
        <span>Delete</span>
      </button>
    </mat-menu> `,
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    NgIf,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonToggleModule
  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }
  ]
})
export class CreateUpdateContratModal implements OnInit {
  currentContrat: ContratUserApp = new ContratUserApp({
    poste: this.data?.contrat?.poste || '',
    dateBegin: this.data?.contrat?.dateBegin || new Date(),
    dateEnd: this.data?.contrat?.dateEnd || new Date(),
    dayOfWeekReposList: this.data?.contrat?.dayOfWeekReposList || [],
    nbJourCongeMois: this.data?.contrat?.nbJourCongeMois || 0,
    nbJourRttMois: this.data?.contrat?.nbJourRttMois || 0,
    nbHeureSemaine: this.data?.contrat?.nbHeureSemaine || 0,
    contratManager: this.data?.contrat?.contratManager || undefined,
    userApp: this.data?.contrat?.userApp
      ? new UserApp(this.data?.contrat?.userApp)
      : this.data?.userApp
  });
  mode: 'create' | 'update' = 'create';
  adminAllContratList = this.server.adminAllContratList;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      userApp: UserApp;
      contrat: ContratUserApp;
    },
    private dialogRef: MatDialogRef<CreateUpdateContratModal>,
    private server: ServerService
  ) {}

  ngOnInit() {
    if (this.data?.contrat) {
      this.mode = 'update';
    } else {
      this.mode = 'create';
    }
    console.log(this.mode);
  }

  save() {
    if (this.mode === 'create') {
      this.createContrat();
    } else if (this.mode === 'update') {
      this.updateContrat();
    }
  }

  createContrat() {
    this.dialogRef.close(this.currentContrat);
  }

  updateContrat() {
    if (!this.data?.contrat) {
      throw new Error(
        'Contrat ID does not exist, this contrat cannot be updated'
      );
    }

    this.dialogRef.close(this.currentContrat);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
