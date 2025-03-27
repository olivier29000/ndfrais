import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { ServerService } from '../services/server.service';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

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
          <h2 class="title m-0">Connexion ndfrais</h2>
        </div>

        <div class="p-6 flex flex-col gap-4">
          <div class="flex flex-col">
            <mat-form-field class="flex-1">
              <mat-label>E-Mail ou nom d'utilisateur</mat-label>
              <input [(ngModel)]="email" name="email" matInput required />
              <mat-error>Indiquez un email ou un nom d'utilisateur </mat-error>
            </mat-form-field>
            <mat-form-field class="flex-1">
              <mat-label>Mot de passe</mat-label>
              <input
                [type]="passwordType"
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
                <mat-icon
                  *ngIf="passwordVisible"
                  svgIcon="mat:visibility"></mat-icon>
                <mat-icon
                  *ngIf="!passwordVisible"
                  svgIcon="mat:visibility_off"></mat-icon>
              </button>
              <mat-error>Indiquez un mot de passe </mat-error>
            </mat-form-field>
          </div>

          <div class="flex items-center justify-between">
            <a [routerLink]="['/forgot-password']" class="caption"
              >J'ai oublié mon mot de passe</a
            >
          </div>

          <button
            (click)="authentification()"
            color="primary"
            mat-raised-button
            type="button">
            Me connecter
          </button>

          <p class="text-secondary text-center">
            Vous n'avez pas encore de compte ?<br />
            <a [routerLink]="['/create-account']"
              >Cliquez ici pour en créer un</a
            >
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp400ms],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatCheckboxModule,
    RouterLink,
    MatSnackBarModule
  ]
})
export class LoginPage implements OnInit {
  email = '';
  password = '';

  passwordType = 'password';
  passwordVisible = false;

  constructor(
    private cd: ChangeDetectorRef,
    private serverService: ServerService
  ) {}

  ngOnInit(): void {}

  authentification() {
    this.serverService.authentification(this.email, this.password);
  }
  toggleVisibility() {
    if (this.passwordVisible) {
      this.passwordType = 'password';
      this.passwordVisible = false;
      this.cd.markForCheck();
    } else {
      this.passwordType = 'text';
      this.passwordVisible = true;
      this.cd.markForCheck();
    }
  }
}
