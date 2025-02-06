import { Injectable } from '@angular/core';
import { ManagerRepoService } from './manager-repo.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ManagerStoreService } from './manager-store.service';
import { DayAppAction } from 'src/app/models/day-app-action.model';

@Injectable({
  providedIn: 'root'
})
export class ManagerEffectService {
  constructor(
    private managerRepo: ManagerRepoService,
    private utils: UtilsService,
    private managerStore: ManagerStoreService
  ) {}

  getAllContratUserApp(): void {
    this.utils.changeIsLoading(true);
    this.managerRepo.getAllContratUserApp().subscribe(
      (contratUserAppList) => {
        this.utils.changeIsLoading(false);
        this.managerStore.contratUserAppList.set(contratUserAppList);
      },
      () => {
        this.utils.changeIsLoading(false);
      }
    );
  }

  validDayAppActionList(dayAppActionList: DayAppAction[]): void {
    this.utils.changeIsLoading(true);
    this.managerRepo.validDayAppActionList(dayAppActionList).subscribe(
      (dayAppActionList) => {
        this.utils.changeIsLoading(false);
        this.managerStore.dayAppActionList.set(dayAppActionList);
      },
      () => {
        this.utils.changeIsLoading(false);
      }
    );
  }

  refuseDayAppActionList(dayAppActionList: DayAppAction[]): void {
    this.utils.changeIsLoading(true);
    this.managerRepo.refuseDayAppActionList(dayAppActionList).subscribe(
      (dayAppActionList) => {
        this.utils.changeIsLoading(false);
        this.managerStore.dayAppActionList.set(dayAppActionList);
      },
      () => {
        this.utils.changeIsLoading(false);
      }
    );
  }
  getDayAppActionListByUserApp(): void {
    this.utils.changeIsLoading(true);
    this.managerRepo.getDayAppActionListByUserApp().subscribe(
      (dayAppActionList) => {
        this.utils.changeIsLoading(false);
        this.managerStore.dayAppActionList.set(dayAppActionList);
      },
      () => {
        this.utils.changeIsLoading(false);
      }
    );
  }
}
