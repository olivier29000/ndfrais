import { Injectable, signal, WritableSignal } from '@angular/core';
import { Action } from 'src/app/models/action.model';
import { ContratUserApp } from 'src/app/models/contrat-employe.model';
import { DayApp } from 'src/app/models/day-app.model';
import { UserApp } from 'src/app/models/user.model';
import { CalendarEvent } from 'calendar-utils';
import { startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Tag } from 'src/app/models/tag.model';
import { EventMeta } from 'src/app/models/meta-event.model';
@Injectable({
  providedIn: 'root'
})
export class UnloggedStoreService {
  constructor() {}
  calendarViewDate: WritableSignal<Date> = signal(
    startOfWeek(new Date(), { locale: fr })
  );
  recapListCurrentContrat: WritableSignal<
    | { contrat: ContratUserApp; dayAppList: DayApp[]; nbHours: number }[]
    | undefined
  > = signal(undefined);
  eventList: WritableSignal<CalendarEvent[]> = signal([]);
  currentDateRecap: WritableSignal<Date> = signal(
    startOfWeek(new Date(), { locale: fr })
  );
  tokenContrat: WritableSignal<string | undefined> = signal(undefined);
}
