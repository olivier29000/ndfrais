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

  askAction(action: Action, idContrat: string): void {
    this.utils.changeIsLoading(true);
    let file: File | undefined = undefined;
    if (action.file) {
      file = action.file;
      action.file = undefined;
    }
    this.userRepo.askAction(action).subscribe(
      (action) => {
        if (file) {
          this.userRepo.uploadPdf(file, action.id).subscribe(
            () => {
              this.utils.changeIsLoading(false);
              this.getUserDayAppListByContratId(idContrat);
            },
            () => {
              this.utils.changeIsLoading(false);
            }
          );
        } else {
          this.utils.changeIsLoading(false);
          this.getUserDayAppListByContratId(idContrat);
        }
      },
      () => {
        this.utils.changeIsLoading(false);
      }
    );
  }
}
