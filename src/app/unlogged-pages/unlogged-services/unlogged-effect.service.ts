import { effect, Injectable } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { addMonths, endOfWeek, startOfWeek, subMonths } from 'date-fns';
import { DomSanitizer } from '@angular/platform-browser';
import { UnloggedStoreService } from './unlogged-store.service';
import { UnloggedRepoService } from './unlogged-repo.service';

@Injectable({
  providedIn: 'root'
})
export class UnloggedEffectService {
  constructor(
    private repo: UnloggedRepoService,
    private store: UnloggedStoreService,
    private utils: UtilsService,
    private sanitizer: DomSanitizer
  ) {}

  calendarViewDateChange(viewDate: Date): void {
    this.store.calendarViewDate.set(viewDate);
  }

  getAllEventBytokenContratAndPeriod(
    start: Date,
    end: Date,
    tokenContrat: string
  ): void {
    this.repo
      .getAllEventBytokenContratAndPeriod(start, end, tokenContrat)
      .subscribe((eventList) =>
        this.store.eventList.set([
          ...eventList.map((event) => ({
            ...event,
            start: this.utils.getStart(event.start),
            end: this.utils.getEnd(event.end)
          }))
        ])
      );
  }

  getRecapContratBytokenContrat(date: Date, tokenContrat: string): void {
    this.utils.changeIsLoading(true);
    const dateStrList: string[] = [
      ...new Set(
        [startOfWeek(date), endOfWeek(date)].map(
          (d) =>
            (d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) +
            '-' +
            d.getFullYear()
        )
      )
    ];
    this.repo
      .getRecapContratBytokenContrat(dateStrList, tokenContrat)
      .subscribe(
        (recapListCurrentContrat) => {
          this.utils.changeIsLoading(false);
          this.store.recapListCurrentContrat.set(
            recapListCurrentContrat.map((recapCurrentContrat) => ({
              ...recapCurrentContrat,
              dayAppList: recapCurrentContrat.dayAppList.map((d) => ({
                ...d,
                date: new Date(d.date)
              })),
              contrat: {
                ...recapCurrentContrat.contrat,
                dateBegin: new Date(recapCurrentContrat.contrat.dateBegin),
                dateEnd: new Date(recapCurrentContrat.contrat.dateEnd)
              }
            }))
          );
        },
        () => {
          this.utils.changeIsLoading(false);
        }
      );
  }

  previousMonth(): void {
    this.store.currentDateRecap.update((currentDateRecap) =>
      subMonths(currentDateRecap, 1)
    );
  }
  nextMonth(): void {
    this.store.currentDateRecap.update((currentDateRecap) =>
      addMonths(currentDateRecap, 1)
    );
  }
}
