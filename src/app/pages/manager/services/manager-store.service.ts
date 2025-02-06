import { Injectable, signal, WritableSignal } from '@angular/core';
import { ContratUserApp } from 'src/app/models/contrat-employe.model';
import { DayAppAction } from 'src/app/models/day-app-action.model';

@Injectable({
  providedIn: 'root'
})
export class ManagerStoreService {
  constructor() {}

  contratUserAppList: WritableSignal<ContratUserApp[]> = signal([]);
  dayAppActionList: WritableSignal<DayAppAction[]> = signal([]);
}
