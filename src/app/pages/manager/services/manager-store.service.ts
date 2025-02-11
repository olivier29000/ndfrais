import { Injectable, signal, WritableSignal } from '@angular/core';
import { ContratUserApp } from 'src/app/models/contrat-employe.model';
import { Action } from 'src/app/models/action.model';
import { DayApp } from 'src/app/models/day-app.model';

@Injectable({
  providedIn: 'root'
})
export class ManagerStoreService {
  constructor() {}

  contratUserAppList: WritableSignal<ContratUserApp[]> = signal([]);
  actionList: WritableSignal<Action[]> = signal([]);
  currentDateRecap: WritableSignal<Date> = signal(new Date());
  recapByContratDayAppList: WritableSignal<
    { contrat: ContratUserApp; dayAppList: DayApp[] }[]
  > = signal([]);
}
