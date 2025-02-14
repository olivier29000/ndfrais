import { Injectable, signal, WritableSignal } from '@angular/core';
import { Action } from 'src/app/models/action.model';
import { ContratUserApp } from 'src/app/models/contrat-employe.model';
import { DayApp } from 'src/app/models/day-app.model';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  constructor() {}
  historiqueActionList: WritableSignal<Action[]> = signal([]);
  currentYearHistorique: WritableSignal<Date> = signal(new Date());
  userDayAppList: WritableSignal<DayApp[]> = signal([]);
  userCurrentContrat: WritableSignal<ContratUserApp | undefined> =
    signal(undefined);
}
