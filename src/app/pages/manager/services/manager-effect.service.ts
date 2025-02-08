import { Injectable } from '@angular/core';
import { ManagerRepoService } from './manager-repo.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ManagerStoreService } from './manager-store.service';
import { Action } from 'src/app/models/action.model';
import { ActionListValidRefuseModal } from '../modals/action-list-valid-refuse.modal';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Injectable({
  providedIn: 'root'
})
export class ManagerEffectService {
  constructor(
    private managerRepo: ManagerRepoService,
    private utils: UtilsService,
    private managerStore: ManagerStoreService,
    private _bottomSheet: MatBottomSheet
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

  validActionList(actionList: Action[]): void {
    this.utils.changeIsLoading(true);
    this.managerRepo.validActionList(actionList).subscribe(
      (actionList) => {
        this.utils.changeIsLoading(false);
        this.managerStore.actionList.set(actionList);
      },
      () => {
        this.utils.changeIsLoading(false);
      }
    );
  }

  refuseActionList(actionList: Action[]): void {
    this.utils.changeIsLoading(true);
    this.managerRepo.refuseActionList(actionList).subscribe(
      (actionList) => {
        this.utils.changeIsLoading(false);
        this.managerStore.actionList.set(actionList);
      },
      () => {
        this.utils.changeIsLoading(false);
      }
    );
  }
  getActionListByUserApp(): void {
    this.utils.changeIsLoading(true);
    this.managerRepo.getActionListByUserApp().subscribe(
      (actionList) => {
        this.utils.changeIsLoading(false);
        this.managerStore.actionList.set(actionList);
      },
      () => {
        this.utils.changeIsLoading(false);
      }
    );
  }

  openActionListValidRefuseModal() {
    this._bottomSheet.open(ActionListValidRefuseModal);
  }
}
