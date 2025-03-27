import { effect, Injectable, signal, WritableSignal } from '@angular/core';
import { DayApp } from '../models/day-app.model';
import { DayBdd } from '../models/day-bdd.model';
import { UserApp } from '../models/user.model';
import {
  NavigationItem,
  NavigationSubheading
} from '../core/navigation/navigation-item.interface';
import { NavigationService } from '../core/navigation/navigation.service';
import { Role, UserConnected } from '../models/user-connected.model';
import { ContratUserApp } from '../models/contrat-employe.model';
import { navigationItemAdmin, UtilsService } from './utils.service';
import { TreeNode } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  constructor() {}
  canChooseNomEntreprise: WritableSignal<boolean | undefined> =
    signal(undefined);

  navigationItemList: WritableSignal<NavigationItem[]> = signal([]);
  userAllContratList: WritableSignal<ContratUserApp[]> = signal([]);
  managerContratList: WritableSignal<ContratUserApp[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(false);
  userConnected: WritableSignal<UserConnected | undefined> = signal(undefined);
  currentYear: WritableSignal<number> = signal(2025);
  dayListBdd: WritableSignal<DayBdd[]> = signal([]);
  weekendDays: WritableSignal<number[]> = signal([0, 6]);
  ferieList: WritableSignal<Date[]> = signal([
    new Date(2025, 2, 4),
    new Date(2025, 5, 4),
    new Date(2025, 6, 4)
  ]);
  dataTreeNode: WritableSignal<TreeNode[]> = signal([]);
}
