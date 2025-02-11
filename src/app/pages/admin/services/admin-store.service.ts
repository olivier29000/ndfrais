import { effect, Injectable, signal, WritableSignal } from '@angular/core';
import { Action } from 'src/app/models/action.model';
import { ContratUserApp } from 'src/app/models/contrat-employe.model';
import { DayApp } from 'src/app/models/day-app.model';
import { Role } from 'src/app/models/user-connected.model';
import { UserApp } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class AdminStoreService {
  constructor(private utils: UtilsService) {
    effect(
      () => {
        const userConnected = this.utils.userConnected();
        if (userConnected?.roleList.includes(Role.ROLE_ADMIN)) {
          const userAppList = this.userAppList();
          this.utils.pushChildrenAdmin(userAppList);
        }
      },
      { allowSignalWrites: true }
    );
  }
  adminAllContratList: WritableSignal<ContratUserApp[]> = signal([]);
  adminContratList: WritableSignal<ContratUserApp[]> = signal([]);
  userAppList: WritableSignal<UserApp[]> = signal([]);
  currentDateRecap: WritableSignal<Date> = signal(new Date());
  recapByContratDayAppList: WritableSignal<
    { contrat: ContratUserApp; dayAppList: DayApp[] }[]
  > = signal([]);
  actionList: WritableSignal<Action[]> = signal([]);
}
