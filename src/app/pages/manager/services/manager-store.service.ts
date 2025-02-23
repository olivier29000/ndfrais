import { Injectable, signal, WritableSignal } from '@angular/core';
import { ContratUserApp } from 'src/app/models/contrat-employe.model';
import { Action } from 'src/app/models/action.model';
import { DayApp } from 'src/app/models/day-app.model';
import { CalendarEvent } from 'angular-calendar';

@Injectable({
  providedIn: 'root'
})
export class ManagerStoreService {
  constructor() {}

  historiqueActionList: WritableSignal<Action[]> = signal([]);
  currentYearHistorique: WritableSignal<Date> = signal(new Date());
  contratUserAppList: WritableSignal<ContratUserApp[]> = signal([]);
  actionList: WritableSignal<Action[]> = signal([]);
  currentDateRecap: WritableSignal<Date> = signal(new Date());
  recapByContratDayAppList: WritableSignal<
    { contrat: ContratUserApp; dayAppList: DayApp[] }[]
  > = signal([]);
  eventList: WritableSignal<CalendarEvent[]> = signal([]);
}
