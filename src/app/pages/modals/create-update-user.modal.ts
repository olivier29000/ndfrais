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
import { UserApp } from 'src/app/models/user.model';
import { MatSelectModule } from '@angular/material/select';

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
          <mat-label>Nom d'utilisateur</mat-label>
          <input [(ngModel)]="currentUserApp.pseudo" name="pseudo" matInput />

          <mat-icon matIconPrefix svgIcon="mat:edit_location"></mat-icon>
        </mat-form-field>
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
    MatSelectModule
  ]
})
export class CreateUpdateUserModal implements OnInit {
  currentUserApp: UserApp = new UserApp({
    id: this.data?.userApp?.id || null,
    nom: this.data?.userApp?.nom || '',
    prenom: this.data?.userApp?.prenom || '',
    pseudo: this.data?.userApp?.pseudo || '',
    email: this.data?.userApp?.email || '',
    telephone: this.data?.userApp?.telephone || '',
    notes: this.data?.userApp?.notes || '',
    imageBase64: this.data?.userApp?.imageBase64 || undefined
  });

  mode: 'create' | 'update' = 'create';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { userApp: UserApp; userAppList: UserApp[] },
    private dialogRef: MatDialogRef<CreateUpdateUserModal>
  ) {}

  ngOnInit() {
    if (this.data?.userApp) {
      this.mode = 'update';
    } else {
      this.mode = 'create';
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
