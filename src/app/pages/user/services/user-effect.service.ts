import { effect, Injectable } from '@angular/core';
import { UserRepoService } from './user-repo.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UserStoreService } from './user-store.service';
import { Action } from 'src/app/models/action.model';
import { ServerService } from 'src/app/services/server.service';
import { PdfDisplayModal } from '../../modals/pdf-display.modal';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { addMonths, subMonths } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class UserEffectService {
  constructor(
    private userRepo: UserRepoService,
    private userStore: UserStoreService,
    private utils: UtilsService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {
    effect(
      () => {
        this.getRecap(this.userStore.currentDateRecap());
      },
      { allowSignalWrites: true }
    );
  }
  getRecap(date: Date): void {
    this.utils.changeIsLoading(true);
    this.userRepo
      .getRecap(
        (date.getMonth() < 9
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) +
          '-' +
          date.getFullYear(),
        this.userStore.idContratUserApp() ?? ''
      )
      .subscribe(
        (recapByContratDayAppList) => {
          console.log(recapByContratDayAppList);
          this.utils.changeIsLoading(false);
          this.userStore.recapByContratDayAppList.set(
            recapByContratDayAppList.map((recapByContratDayApp) => ({
              ...recapByContratDayApp,
              dayAppList: recapByContratDayApp.dayAppList.map((d) => ({
                ...d,
                date: new Date(d.date)
              }))
            }))
          );
        },
        () => {
          this.utils.changeIsLoading(false);
        }
      );
  }
  previousMonth(): void {
    this.userStore.currentDateRecap.update((currentDateRecap) =>
      subMonths(currentDateRecap, 1)
    );
  }
  nextMonth(): void {
    this.userStore.currentDateRecap.update((currentDateRecap) =>
      addMonths(currentDateRecap, 1)
    );
  }

  userGetHistoriqueActionList(idContrat: string): void {
    this.utils.changeIsLoading(true);
    this.userRepo.userGetHistoriqueActionList(idContrat).subscribe(
      (historiqueActionList) => {
        this.utils.changeIsLoading(false);
        this.userStore.historiqueActionList.set(historiqueActionList);
      },
      () => {
        this.utils.changeIsLoading(false);
      }
    );
  }
  openPdfDisplayModal(idPdf: number): void {
    this.utils.changeIsLoading(true);
    this.userRepo.getPdfById(idPdf).subscribe(
      (pdfBlob) => {
        this.utils.changeIsLoading(false);
        const objectUrl = URL.createObjectURL(pdfBlob);
        this.dialog.open(PdfDisplayModal, {
          width: '90%',
          maxWidth: '1200px',
          data: {
            pdfData: this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl)
          }
        });

        // const objectUrl = window.URL.createObjectURL(pdfBlob);
        // window.open(objectUrl);
      },
      () => {
        this.utils.changeIsLoading(false);
      }
    );
  }

  getUserDayAppListByContratId(idContrat: string): void {
    this.utils.changeIsLoading(true);
    this.userRepo.getUserDayAppListByContratId(idContrat).subscribe(
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
