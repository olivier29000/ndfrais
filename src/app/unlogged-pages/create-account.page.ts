import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';

@Component({
  template: `
    <div
      class="w-full h-full bg-pattern flex flex-col items-center justify-center">
      <div @fadeInUp class="card overflow-hidden w-full max-w-md">
        <div class="p-6 pb-0 flex flex-col items-center justify-center">
          <div class="fill-current text-center">
            <img class="w-16" src="assets/img/logo/logo.svg" />
          </div>
        </div>

        <div class="text-center mt-4">
          <h2 class="title m-0">Register for an account</h2>
          <h4 class="body-2 text-secondary m-0">
            Simply fill out the form below
          </h4>
        </div>

        <div class="p-6 flex flex-col gap-4 flex-auto flex flex-col">
          <div>
            <mat-form-field class="flex-1 block">
              <mat-label>Entreprise</mat-label>
              <input
                [(ngModel)]="entreprise"
                name="entreprise"
                matInput
                required />
            </mat-form-field>
            <mat-form-field class="flex-1 block">
              <mat-label>E-Mail</mat-label>
              <input [(ngModel)]="email" name="email" matInput required />
            </mat-form-field>

            <mat-form-field class="flex-1 block">
              <mat-label>Password</mat-label>
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
              <mat-label>Password (Confirm)</mat-label>
              <input
                [type]="inputType"
                [(ngModel)]="passwordConfirm"
                name="passwordConfirm"
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
          </div>

          <div class="flex items-center justify-center">
            <mat-checkbox class="caption"
              >I accept the <a>terms and conditions.</a></mat-checkbox
            >
          </div>
          <button
            (click)="creationCompte()"
            color="primary"
            mat-raised-button
            type="button">
            CREATE ACCOUNT
          </button>
          <p class="text-secondary text-center">
            Already have an account?<br />
            <a [routerLink]="['/login']">Sign in here</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [``],
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
    RouterLink
  ]
})
export class CreateAccountPage {
  inputType = 'password';
  visible = false;
  entreprise = '';
  email = '';
  password = '';
  passwordConfirm = '';

  constructor(
    private serverService: ServerService,
    private cd: ChangeDetectorRef
  ) {}

  creationCompte(): void {
    this.serverService.creationCompte(
      this.email,
      this.entreprise,
      this.password
    );
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
