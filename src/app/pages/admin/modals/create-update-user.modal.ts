import { Component, computed, effect, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
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
import { UserApp } from 'src/app/models/user.model';
import { MatSelectModule } from '@angular/material/select';
import { debounceTime, distinctUntilChanged, Subject, tap } from 'rxjs';
import { AdminServerService } from '../services/admin-server.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { WorkStateDumb } from '../../dumbs/work-state.dumb';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { WORK_STATE } from 'src/app/models/day-app.model';
import { ContratUserApp } from 'src/app/models/contrat-employe.model';
import { DatepickerDumb } from '../../dumbs/datepicker.dumb';

@Component({
  template: `<form>
      <div class="flex items-center" mat-dialog-title>
        <h2 *ngIf="currentUserApp.nomPrenom" class="headline m-0 flex-auto">
          {{ currentUserApp.nomPrenom }}
        </h2>
        <h2 *ngIf="!currentUserApp.nomPrenom" class="headline m-0 flex-auto">
          Nouvel Utilisateur
        </h2>

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
            <mat-label>Nom</mat-label>
            <input
              cdkFocusInitial
              [(ngModel)]="currentUserApp.nom"
              name="nom"
              matInput />

            <mat-icon matIconPrefix svgIcon="mat:person"></mat-icon>
          </mat-form-field>

          <mat-form-field class="sm:ml-6 flex-auto">
            <mat-label>Prénom</mat-label>
            <input [(ngModel)]="currentUserApp.prenom" name="prenom" matInput />

            <mat-icon matIconPrefix svgIcon="mat:person"></mat-icon>
          </mat-form-field>
        </div>

        <mat-form-field class="flex-auto">
          <mat-label>Email</mat-label>
          <input [(ngModel)]="currentUserApp.email" name="email" matInput />

          <mat-icon matIconPrefix svgIcon="mat:edit_location"></mat-icon>
        </mat-form-field>

        <mat-form-field class="flex-auto">
          <mat-label>Téléphone</mat-label>
          <input
            [(ngModel)]="currentUserApp.telephone"
            name="telephone"
            matInput />

          <mat-icon matIconPrefix svgIcon="mat:phone"></mat-icon>
        </mat-form-field>

        <mat-form-field class="flex-auto">
          <mat-label>Notes</mat-label>
          <textarea
            [(ngModel)]="currentUserApp.notes"
            name="notes"
            matInput></textarea>
        </mat-form-field>
        <div class="flex flex-col sm:flex-row">
          <mat-form-field class="flex-auto">
            <mat-label>Poste</mat-label>
            <input
              cdkFocusInitial
              [(ngModel)]="currentUserApp.contratUserApp.poste"
              name="poste"
              matInput />

            <mat-icon matIconPrefix svgIcon="mat:person"></mat-icon>
          </mat-form-field>
        </div>

        <div class="flex flex-col sm:flex-row">
          <mat-form-field class="flex-auto">
            <mat-label>Date de début</mat-label>
            <div class="flex">
              <dumb-datepicker
                #datepickerRefdateBegin
                [(date)]="
                  currentUserApp.contratUserApp.dateBegin
                "></dumb-datepicker>
              <input
                [value]="
                  currentUserApp.contratUserApp.dateBegin
                    | date: 'dd MMM yyyy' : '' : 'fr'
                "
                disabled
                matInput
                name="dateBegin" />
            </div>
          </mat-form-field>

          <mat-form-field class="flex-auto">
            <mat-label>Date de fin</mat-label>
            <div class="flex">
              <dumb-datepicker
                #datepickerRefdateBegin
                [(date)]="
                  currentUserApp.contratUserApp.dateEnd
                "></dumb-datepicker>
              <input
                [value]="
                  currentUserApp.contratUserApp.dateEnd
                    | date: 'dd MMM yyyy' : '' : 'fr'
                "
                disabled
                matInput
                name="dateEnd" />
            </div>
          </mat-form-field>
        </div>

        <div class="flex flex-col sm:flex-row">
          <mat-form-field class="sm:ml-4 flex-auto">
            <mat-label>Couleur</mat-label>
            <input
              matInput
              type="color"
              name="color"
              [(ngModel)]="currentUserApp.contratUserApp.color"
              (change)="refresh.next()" />

            <mat-icon matIconPrefix svgIcon="mat:person"></mat-icon>
          </mat-form-field>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close type="button">Annuler</button>
        <button
          *ngIf="isCreateMode()"
          color="primary"
          mat-flat-button
          type="submit"
          (click)="save()"
          [disabled]="currentUserApp.nom === ''">
          Créer utilisateur
        </button>
        <button
          *ngIf="isUpdateMode()"
          color="primary"
          mat-flat-button
          type="submit"
          (click)="save()">
          Modifier l'utilisateur
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
    CommonModule,
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
    MatButtonModule,
    ReactiveFormsModule,
    WorkStateDumb,
    MatDatepickerModule,
    MatButtonToggleModule,
    DatepickerDumb
  ],
  styles: [
    `
      .text-green {
        color: green;
      }

      .text-red {
        color: red;
      }
    `
  ]
})
export class CreateUpdateUserModal implements OnInit {
  refresh = new Subject<void>();
  workStateList = Object.values(WORK_STATE).filter(
    (state) =>
      ![WORK_STATE.REPOS, WORK_STATE.TRAVAIL, WORK_STATE.HORS_CONTRAT].includes(
        state
      )
  );

  currentContrat: ContratUserApp = {
    id: this.data?.userApp?.contratUserApp?.id || undefined,
    poste: this.data?.userApp?.contratUserApp?.poste || '',
    color: this.data?.userApp?.contratUserApp?.color || '',
    dateBegin: this.data?.userApp?.contratUserApp?.dateBegin
      ? new Date(this.data?.userApp?.contratUserApp?.dateBegin)
      : new Date(),
    dateEnd: this.data?.userApp?.contratUserApp?.dateEnd
      ? new Date(this.data?.userApp?.contratUserApp?.dateEnd)
      : new Date(),
    dayOfWeekReposList:
      this.data?.userApp?.contratUserApp?.dayOfWeekReposList || [],
    nbJourCongeMois: this.data?.userApp?.contratUserApp?.nbJourCongeMois || 0,
    nbJourRttMois: this.data?.userApp?.contratUserApp?.nbJourRttMois || 0,
    nbHeureSemaine: this.data?.userApp?.contratUserApp?.nbHeureSemaine || 0,
    contratManager:
      this.data?.userApp?.contratUserApp?.contratManager || undefined, // Temporairement null
    userApp: this.data?.userApp || null,
    archived: this.data?.userApp?.contratUserApp?.archived || false,
    workStateAvailableList:
      this.data?.userApp?.contratUserApp?.workStateAvailableList || [],
    compteJourConge: this.data?.userApp?.contratUserApp?.compteJourConge || 0,
    compteJourRtt: this.data?.userApp?.contratUserApp?.compteJourRtt || 0,
    compteJourRecup: this.data?.userApp?.contratUserApp?.compteJourRecup || 0,
    compteJourEnfantMalade:
      this.data?.userApp?.contratUserApp?.compteJourEnfantMalade || 0
  };
  currentUserApp: UserApp = new UserApp({
    id: this.data?.userApp?.id || null,
    nom: this.data?.userApp?.nom || '',
    prenom: this.data?.userApp?.prenom || '',
    pseudo: this.data?.userApp?.pseudo || '',
    email: this.data?.userApp?.email || '',
    telephone: this.data?.userApp?.telephone || '',
    notes: this.data?.userApp?.notes || '',
    imageBase64: this.data?.userApp?.imageBase64 || undefined,
    contratUserApp: this.currentContrat,
    enabled: this.data?.userApp?.enabled || false
  });

  adminAllContratList = computed(() => {
    const adminAllContratList = this.adminServer.adminAllContratList();
    this.currentUserApp.contratUserApp.contratManager =
      adminAllContratList.find(
        (contrat) =>
          contrat.id === this.data?.userApp?.contratUserApp.contratManager?.id
      ) || undefined;
    return adminAllContratList;
  });

  mode: 'create' | 'update' = 'create';
  canChoosePseudo = this.adminServer.canChoosePseudo;
  pseudo = new FormControl(this.data?.userApp?.pseudo);
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { userApp: UserApp; userAppList: UserApp[] },
    private dialogRef: MatDialogRef<CreateUpdateUserModal>,
    private adminServer: AdminServerService
  ) {
    effect(
      () => {
        this.pseudo.valueChanges
          .pipe(
            tap(() => this.adminServer.canChoosePseudo.set(undefined)),
            debounceTime(500),
            distinctUntilChanged()
          )
          .subscribe((res) => {
            if (res) {
              this.adminServer.verifDispoPseudo(res);
              this.currentUserApp.pseudo = res;
            }
          });
      },
      { allowSignalWrites: true }
    );
    effect(
      () => {
        if (this.isCreateMode()) {
          this.pseudo.enable();
        } else {
          this.pseudo.disable();
        }
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit() {
    this.adminServer.getAllContrat();
    if (this.data?.userApp) {
      this.mode = 'update';
    } else {
      this.mode = 'create';
    }
  }

  selectWorkState(workState: WORK_STATE): void {
    if (
      this.currentUserApp.contratUserApp.workStateAvailableList.includes(
        workState
      )
    ) {
      this.currentUserApp.contratUserApp.workStateAvailableList =
        this.currentUserApp.contratUserApp.workStateAvailableList.filter(
          (w) => w !== workState
        );
    } else {
      this.currentUserApp.contratUserApp.workStateAvailableList.push(workState);
    }
  }

  save() {
    if (this.mode === 'create') {
      this.createUserApp();
    } else if (this.mode === 'update') {
      this.updateUserApp();
    }
  }

  createUserApp() {
    this.dialogRef.close(this.currentUserApp);
  }

  updateUserApp() {
    if (!this.data?.userApp) {
      throw new Error(
        'UserApp ID does not exist, this userApp cannot be updated'
      );
    }

    this.dialogRef.close(this.currentUserApp);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
