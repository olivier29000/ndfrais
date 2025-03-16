import { computed, Injectable } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

import { UnloggedStoreService } from './unlogged-store.service';
import { UnloggedEffectService } from './unlogged-effect.service';

@Injectable({
  providedIn: 'root'
})
export class UnloggedServerService {
  constructor(
    private store: UnloggedStoreService,
    private effect: UnloggedEffectService,
    private utils: UtilsService
  ) {}

  calendarViewDate = this.store.calendarViewDate;
  calendarViewDateChange(viewDate: Date): void {
    this.effect.calendarViewDateChange(viewDate);
  }

  recapListCurrentContrat = this.store.recapListCurrentContrat;
  eventList = this.store.eventList;
  getAllEventBytokenContratAndPeriod(
    start: Date,
    end: Date,
    contratId: string
  ): void {
    this.effect.getAllEventBytokenContratAndPeriod(start, end, contratId);
  }
  getRecapContratBytokenContrat(date: Date, tokenContrat: string): void {
    this.effect.getRecapContratBytokenContrat(date, tokenContrat);
  }
  tokenContrat = this.store.tokenContrat;
  selectedContrat = computed(() => {
    const recapListCurrentContrat = this.recapListCurrentContrat();
    if (recapListCurrentContrat && recapListCurrentContrat.length > 0) {
      return recapListCurrentContrat[0].contrat;
    }
  });
}
