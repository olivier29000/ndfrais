import { ChangeDetectorRef, Component, effect, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';

@Component({
  template: `
    <div
      class="w-full h-full bg-pattern flex flex-col items-center justify-center">
      <div @fadeInUp class="card overflow-hidden w-full max-w-md">
        <div class="p-6 pb-0 flex flex-col items-center justify-center">
          <div class="fill-current text-center">
            <img class="w-16" src="assets/img/logo/logo.png" />
          </div>
        </div>

        <div class="text-center mt-4">
          <h2 class="title m-0">Créer un compte planifique</h2>
          <h4 class="body-2 text-secondary m-0">C'est gratuit</h4>
        </div>

        <div class="p-6 flex flex-col gap-4 flex-auto flex flex-col">
          <div>
            <mat-form-field class="flex-1 block">
              <mat-label>E-Mail</mat-label>
              <input [(ngModel)]="email" name="email" matInput required />
            </mat-form-field>

            <mat-form-field class="flex-1 block">
              <mat-label>Mot de passe</mat-label>
              <input
                [type]="inputType"
                [(ngModel)]="password"
                name="password"
                matInput
                required />
              <button
                (click)="toggleVisibility()"
                mat-icon-button
                matIconSuffix
                matTooltip="Toggle Visibility"
                type="button">
                <mat-icon *ngIf="visible" svgIcon="mat:visibility"></mat-icon>
                <mat-icon
                  *ngIf="!visible"
                  svgIcon="mat:visibility_off"></mat-icon>
              </button>
            </mat-form-field>

            <mat-form-field class="flex-1 block">
              <mat-label>Confirmation du mot de passe</mat-label>
              <input
                [type]="inputType"
                [(ngModel)]="passwordConfirm"
                name="passwordConfirm"
                matInput
                required />
              @if (password !== passwordConfirm) {
                <mat-hint class="text-red"
                  >La confirmation est différente du mot de passe</mat-hint
                >
              }

              <button
                (click)="toggleVisibility()"
                mat-icon-button
                matIconSuffix
                matTooltip="Toggle Visibility"
                type="button">
                <mat-icon *ngIf="visible" svgIcon="mat:visibility"></mat-icon>
                <mat-icon
                  *ngIf="!visible"
                  svgIcon="mat:visibility_off"></mat-icon>
              </button>
            </mat-form-field>
          </div>

          <button
            (click)="creationCompte()"
            [disabled]="
              email === '' || password === '' || password !== passwordConfirm
            "
            color="primary"
            mat-raised-button
            type="button">
            Créer mon compte
          </button>
          <p class="text-secondary text-center">
            Vous êtes déjà inscrits ?<br />
            <a [routerLink]="['/login']">Connectez vous ici</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .text-green {
        color: green;
      }

      .text-red {
        color: red;
      }
    `
  ],
  animations: [fadeInUp400ms],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    NgIf,
    MatIconModule,
    MatCheckboxModule,
    RouterLink,
    ReactiveFormsModule
  ]
})
export class CreateAccountPage {
  inputType = 'password';
  visible = false;
  email = '';
  password = '';
  passwordConfirm = '';

  canChooseNomEntreprise = this.serverService.canChooseNomEntreprise;

  constructor(
    private serverService: ServerService,
    private cd: ChangeDetectorRef
  ) {}

  creationCompte(): void {
    this.serverService.creationCompte(this.email, this.password);
  }
  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }
}
