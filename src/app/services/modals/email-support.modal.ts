import { Component, effect, Inject, OnInit } from '@angular/core';
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
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { ServerService } from '../server.service';
import { title } from 'process';
import { ContactPreference, Email } from 'src/app/models/email.model';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRadioModule } from '@angular/material/radio';
import Swal from 'sweetalert2';

@Component({
  template: `<form>
    <div class="flex items-center" mat-dialog-title>
      <h2 class="headline m-0 flex-auto">
        {{ email.title }}
      </h2>

      <button
        class="text-secondary"
        mat-dialog-close
        mat-icon-button
        type="button">
        <mat-icon svgIcon="mat:close"></mat-icon>
      </button>
    </div>

    <mat-divider class="text-border"></mat-divider>

    <div class="container">
      <div>
        <label class="mt-2 block"
          >Décrivez le mieux possible, indiquez le contexte.</label
        >
        <mat-dialog-content class="flex flex-col">
          <mat-form-field class="flex-auto">
            <mat-label>Notes</mat-label>
            <textarea
              [(ngModel)]="email.content"
              name="notes"
              matInput></textarea>
          </mat-form-field>
        </mat-dialog-content>
      </div>

      <div>
        <label class="my-2 block"
          >Sur une échelle de 1 à 9, à quel point votre requête est importante
          pour l'appli ?</label
        >
        <mat-button-toggle-group
          name="ingredients"
          [(ngModel)]="email.echelle"
          aria-label="echelle"
          name="echelle">
          <mat-button-toggle disabled> Pas important </mat-button-toggle>
          <mat-button-toggle [value]="0"> 0 </mat-button-toggle>
          <mat-button-toggle [value]="1"> 1 </mat-button-toggle>
          <mat-button-toggle [value]="2"> 2 </mat-button-toggle>
          <mat-button-toggle [value]="3"> 3 </mat-button-toggle>
          <mat-button-toggle [value]="4"> 4 </mat-button-toggle>
          <mat-button-toggle [value]="5"> 5 </mat-button-toggle>
          <mat-button-toggle [value]="6"> 6 </mat-button-toggle>
          <mat-button-toggle [value]="7"> 7 </mat-button-toggle>
          <mat-button-toggle [value]="8"> 8 </mat-button-toggle>
          <mat-button-toggle [value]="9"> 9 </mat-button-toggle>
          <mat-button-toggle disabled> Très important </mat-button-toggle>
        </mat-button-toggle-group>
      </div>

      <div>
        <label class="my-2 block">Accepteriez vous d'être contacté ? </label>
        <mat-radio-group
          [(ngModel)]="email.contactPreference"
          name="contactPreference">
          @for (item of ContactPreference | keyvalue; track $index) {
            <mat-radio-button class="radio" [value]="item.value">
              {{
                item.value === ContactPreference.NO
                  ? 'non merci ;)'
                  : item.value === ContactPreference.EMAIL
                    ? 'email'
                    : item.value === ContactPreference.TELEPHONE
                      ? 'téléphone'
                      : ''
              }}
            </mat-radio-button>
          }
        </mat-radio-group>
        @if (email.contactPreference === ContactPreference.TELEPHONE) {
          <mat-form-field class="sm:ml-4 flex-auto">
            <mat-label>Numéro de téléphone</mat-label>
            <input
              cdkFocusInitial
              [(ngModel)]="email.contact"
              name="contact"
              type="text"
              matInput />

            <mat-icon matIconPrefix svgIcon="mat:person"></mat-icon>
          </mat-form-field>
        }
      </div>
    </div>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close type="button">Annuler</button>
      <button
        color="primary"
        mat-flat-button
        type="submit"
        (click)="sendEmail()">
        Envoyer
      </button>
    </mat-dialog-actions>
  </form> `,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatRadioModule
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
export class EmailSupportModal implements OnInit {
  ContactPreference = ContactPreference;
  modeEmail!: 'bug' | 'information' | 'fonctionnality';

  email: Email = {
    title: '',
    content: '',
    imageBase64: '',
    echelle: 1,
    contactPreference: ContactPreference.EMAIL,
    contact: ''
  };

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      imprimEcran: string;
      mode: 'bug' | 'information' | 'fonctionnality';
    },
    private dialogRef: MatDialogRef<EmailSupportModal>,
    private server: ServerService
  ) {}
  ngOnInit(): void {
    if (this.data.mode === 'bug') {
      this.email.title = 'Indiquer un bug';
    } else if (this.data.mode === 'information') {
      this.email.title = 'Demander une information';
    } else {
      this.email.title = 'Proposer une fonctionnalité';
    }
  }

  sendEmail(): void {
    this.server.sendEmail(this.email);
    Swal.fire({
      icon: 'success',
      title: 'Merci !',
      text: 'Vous avez reçu un email de confirmation. Merci de votre contribution, on travaille dessus et on vous donne des nouvelles très vite'
    });
    this.close();
  }

  close(): void {
    this.dialogRef.close();
  }
}
