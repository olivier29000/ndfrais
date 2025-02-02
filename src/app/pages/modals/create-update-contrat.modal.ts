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
import { ContratEmploye } from 'src/app/models/contrat-employe.model';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { UserApp } from 'src/app/models/user.model';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
@Component({
  template: `<form>
      <div class="flex items-center" mat-dialog-title>
        @if (data.contrat) {
          <h2 class="headline m-0 flex-auto">
            {{ currentContrat.userApp.nomPrenom }} : {{ currentContrat.poste }}
          </h2>
        } @else {
          <h2 class="headline m-0 flex-auto">
            {{ currentContrat.userApp.nomPrenom }} : Nouveau contrat
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
          <mat-select [(ngModel)]="currentContrat.manager" name="manager">
            @for (contrat of data.contratList; track contrat) {
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
        <label class="mb-2 block">Jours de repos</label>
        <mat-button-toggle-group
          name="ingredients"
          aria-label="Ingredients"
          [ngModel]="['lundi', 'mercredi', 'samedi']"
          multiple>
          <mat-button-toggle value="lundi"> lundi </mat-button-toggle>
          <mat-button-toggle value="mardi"> mardi </mat-button-toggle>
          <mat-button-toggle value="mercredi"> mercredi </mat-button-toggle>
          <mat-button-toggle value="jeudi"> jeudi </mat-button-toggle>
          <mat-button-toggle value="vendredi"> vendredi </mat-button-toggle>
          <mat-button-toggle value="samedi"> samedi </mat-button-toggle>
          <mat-button-toggle value="dimanche"> dimanche </mat-button-toggle>
        </mat-button-toggle-group>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close type="button">Cancel</button>
        <button
          *ngIf="isCreateMode()"
          color="primary"
          mat-flat-button
          type="submit">
          Create Customer
        </button>
        <button
          *ngIf="isUpdateMode()"
          color="primary"
          mat-flat-button
          type="submit">
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
  ]
})
export class CreateUpdateContratModal implements OnInit {
  currentContrat: ContratEmploye = new ContratEmploye({
    poste: this.data?.contrat?.poste || '',
    dateBegin: this.data?.contrat?.dateBegin || new Date(),
    dateEnd: this.data?.contrat?.dateEnd || new Date(),
    dayWeekEndList: this.data?.contrat?.dayWeekEndList || [],
    nbJourCongeMois: this.data?.contrat?.nbJourCongeMois || 0,
    nbJourRttMois: this.data?.contrat?.nbJourRttMois || 0,
    nbHeureSemaine: this.data?.contrat?.nbHeureSemaine || 0,
    manager: this.data?.contrat?.manager || undefined,
    userApp: this.data?.contrat?.manager || this.data?.userApp
  });
  mode: 'create' | 'update' = 'create';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      userApp: UserApp;
      contrat: ContratEmploye;
      contratList: ContratEmploye[];
    },
    private dialogRef: MatDialogRef<CreateUpdateContratModal>
  ) {}

  ngOnInit() {
    if (this.data?.contrat) {
      this.mode = 'update';
    } else {
      this.mode = 'create';
    }
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
