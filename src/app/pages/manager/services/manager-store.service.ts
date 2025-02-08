import { Injectable, signal, WritableSignal } from '@angular/core';
import { ContratUserApp } from 'src/app/models/contrat-employe.model';
import { Action } from 'src/app/models/action.model';

@Injectable({
  providedIn: 'root'
})
export class ManagerStoreService {
  constructor() {}

  contratUserAppList: WritableSignal<ContratUserApp[]> = signal([]);
  actionList: WritableSignal<Action[]> = signal([]);
  selectedActionList: WritableSignal<Action[]> = signal([]);
}
