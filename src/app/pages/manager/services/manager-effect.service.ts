import { effect, Injectable } from '@angular/core';
import { ManagerRepoService } from './manager-repo.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ManagerStoreService } from './manager-store.service';
import { Action } from 'src/app/models/action.model';
import { ActionListValidRefuseModal } from '../modals/action-list-valid-refuse.modal';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { PdfDisplayModal } from '../../modals/pdf-display.modal';
import { DomSanitizer } from '@angular/platform-browser';
import { addMonths, subMonths } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class ManagerEffectService {
  constructor(
    private dialog: MatDialog,
    private managerRepo: ManagerRepoService,
    private utils: UtilsService,
    private managerStore: ManagerStoreService,
    private sanitizer: DomSanitizer
  ) {
    effect(
      () => {
        this.getRecap(this.managerStore.currentDateRecap());
      },
      { allowSignalWrites: true }
    );
  }

  previousMonth(): void {
    this.managerStore.currentDateRecap.update((currentDateRecap) =>
      subMonths(currentDateRecap, 1)
    );
  }
  nextMonth(): void {
    this.managerStore.currentDateRecap.update((currentDateRecap) =>
      addMonths(currentDateRecap, 1)
    );
  }

  managerGetHistoriqueActionList(date: Date): void {
    this.utils.changeIsLoading(true);
    this.managerRepo
      .managerGetHistoriqueActionList(date.getFullYear())
      .subscribe(
        (historiqueActionList) => {
          this.utils.changeIsLoading(false);
          this.managerStore.historiqueActionList.set(historiqueActionList);
        },
        () => {
          this.utils.changeIsLoading(false);
        }
      );
  }

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

  validAction(action: Action): void {
    this.utils.changeIsLoading(true);
    this.managerRepo.validAction(action).subscribe(
      (actionList) => {
        this.utils.changeIsLoading(false);
        this.managerStore.actionList.set(actionList);
        this.getRecap(this.managerStore.currentDateRecap());
      },
      () => {
        this.utils.changeIsLoading(false);
      }
    );
  }

  refuseAction(action: Action): void {
    this.utils.changeIsLoading(true);
    this.managerRepo.refuseAction(action).subscribe(
      (actionList) => {
        this.utils.changeIsLoading(false);
        this.managerStore.actionList.set(actionList);
        this.getRecap(this.managerStore.currentDateRecap());
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

  getRecap(date: Date): void {
    this.utils.changeIsLoading(true);
    this.managerRepo
      .getRecap(
        (date.getMonth() < 9
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) +
          '-' +
          date.getFullYear()
      )
      .subscribe(
        (recapByContratDayAppList) => {
          this.utils.changeIsLoading(false);
          this.managerStore.recapByContratDayAppList.set(
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

  openActionListValidRefuseModal(
    action: Action,
    type: 'valid' | 'refuse' | 'watch'
  ) {
    this.dialog.open(ActionListValidRefuseModal, {
      data: {
        action,
        type
      }
    });
  }

  openPdfDisplayModal(idPdf: number): void {
    this.utils.changeIsLoading(true);
    this.managerRepo.getPdfById(idPdf).subscribe(
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
}
