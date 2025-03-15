import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Tag } from 'src/app/models/tag.model';

@Component({
  selector: 'dumb-edit-create-tag',
  template: `
    <div class="flex flex-col sm:flex-row">
      <mat-form-field class="flex-auto">
        <mat-label>sujet</mat-label>
        @if (oldTag.colorName) {
          <input
            cdkFocusInitial
            [(ngModel)]="oldTag.colorName"
            disabled
            name="poste"
            matInput />
        } @else {
          <input
            cdkFocusInitial
            [(ngModel)]="newTag.colorName"
            name="poste"
            matInput />
        }

        <mat-icon matIconPrefix svgIcon="mat:person"></mat-icon>
      </mat-form-field>
      <mat-form-field class="flex-auto">
        <mat-label>titre</mat-label>
        @if (oldTag.colorName) {
          <input
            cdkFocusInitial
            [(ngModel)]="oldTag.title"
            name="poste"
            matInput />
        } @else {
          <input
            cdkFocusInitial
            [(ngModel)]="newTag.title"
            name="poste"
            matInput />
        }

        <mat-icon matIconPrefix svgIcon="mat:person"></mat-icon>
      </mat-form-field>
      <mat-form-field class="flex-auto">
        <mat-label>Couleur</mat-label>

        @if (oldTag.colorName !== '') {
          <input
            cdkFocusInitial
            type="color"
            disabled
            [(ngModel)]="oldTag.color"
            name="poste"
            matInput />
        } @else {
          <input
            cdkFocusInitial
            type="color"
            [(ngModel)]="newTag.color"
            name="poste"
            matInput />
        }
        <mat-icon matIconPrefix svgIcon="mat:person"></mat-icon>
      </mat-form-field>
      <div class="flex justify-content-around align-items-center h-100">
        <button mat-button mat-dialog-close type="button" (click)="cancel()">
          Cancel
        </button>
        <button color="primary" mat-flat-button type="submit" (click)="valid()">
          Créer
        </button>
      </div>
    </div>
  `,
  styles: [``],
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class NewTagDumb {
  oldTag: Tag = {
    title: '',
    color: '',
    colorName: ''
  };

  newTag: Tag = {
    title: '',
    color: '',
    colorName: ''
  };

  @Input() typeTag: 'employe' | 'event' = 'employe';

  @Input()
  set tag(value: Tag) {
    this.oldTag = { ...value };
    this.newTag = { ...value };
  }

  @Output() validTagOutput = new EventEmitter<Tag>();
  @Output() cancelOutput = new EventEmitter<void>();

  valid(): void {
    console.log(this.newTag);
    console.log(this.oldTag);
    if (this.newTag.title && this.newTag.colorName && this.newTag.color) {
      this.validTagOutput.emit(this.newTag);
    } else if (
      this.oldTag.title &&
      this.oldTag.colorName &&
      this.oldTag.color
    ) {
      this.validTagOutput.emit(this.oldTag);
    }
  }

  cancel(): void {
    this.cancelOutput.emit();
  }
}
