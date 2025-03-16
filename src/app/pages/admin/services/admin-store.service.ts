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
export class AdminStoreService {
  constructor() {}
  adminAllContratList: WritableSignal<ContratUserApp[]> = signal([]);
  adminContratList: WritableSignal<ContratUserApp[]> = signal([]);
  selectedContrat: WritableSignal<ContratUserApp | undefined> =
    signal(undefined);
  userAppList: WritableSignal<UserApp[]> = signal([]);
  currentDateRecap: WritableSignal<Date> = signal(
    startOfWeek(new Date(), { locale: fr })
  );
  currentYearHistorique: WritableSignal<Date> = signal(new Date());
  recapByContratDayAppList: WritableSignal<
    { contrat: ContratUserApp; dayAppList: DayApp[]; nbHours: number }[]
  > = signal([]);

  recapListCurrentContrat: WritableSignal<
    | { contrat: ContratUserApp; dayAppList: DayApp[]; nbHours: number }[]
    | undefined
  > = signal(undefined);
  actionList: WritableSignal<Action[]> = signal([]);
  historiqueActionList: WritableSignal<Action[]> = signal([]);
  calendarViewDate: WritableSignal<Date> = signal(
    startOfWeek(new Date(), { locale: fr })
  );
  dayAppList: WritableSignal<DayApp[]> = signal([]);
  eventList: WritableSignal<CalendarEvent[]> = signal([]);
  allEventList: WritableSignal<CalendarEvent<EventMeta>[]> = signal([]);
  canChoosePseudo: WritableSignal<boolean | undefined> = signal(undefined);
  tagMap: WritableSignal<Record<string, Tag[]>> = signal({});
}
