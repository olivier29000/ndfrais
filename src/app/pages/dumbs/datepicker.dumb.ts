import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  computed,
  inject,
  signal
} from '@angular/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import {
  MatDatepickerInputEvent,
  MatDatepickerIntl,
  MatDatepickerModule
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Moment } from 'moment';
import 'moment/locale/fr';

/** @title Datepicker with different locale */
@Component({
  selector: 'dumb-datepicker',
  standalone: true,
  template: `
    <input
      matInput
      [matDatepicker]="dp"
      (dateChange)="emitDate($event)"
      style="width:0px" />
    <mat-datepicker-toggle matIconSuffix [for]="dp"></mat-datepicker-toggle>
    <mat-datepicker #dp></mat-datepicker>
  `,
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    { provide: MAT_DATE_LOCALE, useValue: 'fr' },

    // Moment can be provided globally to your app by adding `provideMomentDateAdapter`
    // to your app config. We provide it at the component level here, due to limitations
    // of our example generation script.
    provideMomentDateAdapter()
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatepickerDumb {
  @Output() dateOutput = new EventEmitter<Date>();
  private readonly _locale = signal(inject<unknown>(MAT_DATE_LOCALE));

  emitDate(event: MatDatepickerInputEvent<Moment>) {
    const moment: Moment | null = event.value;
    if (moment) this.dateOutput.emit(moment.toDate());
  }
}
