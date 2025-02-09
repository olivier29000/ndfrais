import { Injectable } from '@angular/core';
import { UserRepoService } from './user-repo.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UserStoreService } from './user-store.service';
import { Action } from 'src/app/models/action.model';

@Injectable({
  providedIn: 'root'
})
export class UserEffectService {
  constructor(
    private userRepo: UserRepoService,
    private userStore: UserStoreService,
    private utils: UtilsService
  ) {}

  getUserDayAppListByContratId(idContrat: string): void {
    this.utils.changeIsLoading(true);
    this.userRepo.getUserDayAppListByContratId(idContrat).subscribe(
      (dayAppList) => {
        this.utils.changeIsLoading(false);
        console.log(dayAppList);
        this.userStore.userDayAppList.set(
          dayAppList.map((d) => ({
            ...d,
            date: new Date(d.date)
          }))
        );
      },
      () => {
        this.utils.changeIsLoading(false);
      }
    );
  }

  askAction(action: Action): void {
    this.utils.changeIsLoading(true);
    this.userRepo.askAction(action).subscribe(
      (dayAppList) => {
        this.utils.changeIsLoading(false);
        this.userStore.userDayAppList.set(
          dayAppList.map((d) => ({
            ...d,
            date: new Date(d.date)
          }))
        );
      },
      () => {
        this.utils.changeIsLoading(false);
      }
    );
  }
}
