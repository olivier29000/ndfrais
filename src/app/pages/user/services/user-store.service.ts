import { Injectable, signal, WritableSignal } from '@angular/core';
import { ContratUserApp } from 'src/app/models/contrat-employe.model';
import { DayApp } from 'src/app/models/day-app.model';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  constructor() {}
  userDayAppList: WritableSignal<DayApp[]> = signal([]);
  userCurrentContrat: WritableSignal<ContratUserApp | undefined> =
    signal(undefined);
}
