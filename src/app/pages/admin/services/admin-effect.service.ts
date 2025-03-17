import { effect, Injectable } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { Action } from 'src/app/models/action.model';
import { MatDialog } from '@angular/material/dialog';
import { AdminRepoService } from './admin-repo.service';
import { AdminStoreService } from './admin-store.service';
import { ContratUserApp } from 'src/app/models/contrat-employe.model';
import { UserApp } from 'src/app/models/user.model';
import { CreateUpdateUserModal } from '../modals/create-update-user.modal';
import { CreateUpdateContratModal } from '../modals/create-update-contrat.modal';
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfWeek,
  format,
  startOfWeek,
  subDays,
  subMonths
} from 'date-fns';
import { AdminActionListValidRefuseModal } from '../modals/action-list-valid-refuse.modal';
import { PdfDisplayModal } from '../../modals/pdf-display.modal';
import { DomSanitizer } from '@angular/platform-browser';
import { WEEK_STATE, WORK_STATE } from 'src/app/models/day-app.model';
import { CalendarEvent } from 'angular-calendar';
import { fr } from 'date-fns/locale';
import { of } from 'rxjs';
import { Abonnement, Role } from 'src/app/models/user-connected.model';
import Swal from 'sweetalert2';
import { PlanningUserModal } from '../modals/planning-user.modal';
import { Tag } from 'src/app/models/tag.model';
import { CreateEventModal } from '../modals/createEvent.modal';

@Injectable({
  providedIn: 'root'
})
export class AdminEffectService {
  constructor(
    private dialog: MatDialog,
    private adminRepo: AdminRepoService,
    private adminStore: AdminStoreService,
    private utils: UtilsService,
    private sanitizer: DomSanitizer
  ) {}

  verifDispoPseudo(pseudo: string): void {
    this.adminRepo.verifDispoPseudo(pseudo).subscribe(
      () => {
        this.adminStore.canChoosePseudo.set(true);
      },
      () => {
        this.adminStore.canChoosePseudo.set(false);
        return of();
      }
    );
  }
  selectAbonnement(abonnement: Abonnement): void {
    this.utils.changeIsLoading(true);
    this.adminRepo.selectAbonnement(abonnement).subscribe(
      (userConnected) => {
        this.utils.userConnected.set(userConnected);
        this.utils.changeIsLoading(false);
      },
      (error) => {
        this.utils.changeIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error
        });
      }
    );
  }
  openPlanningUserModal(date: Date): void {
    this.calendarViewDateChange(date);
    this.dialog.open(PlanningUserModal, {
      width: '90%',
      maxWidth: '1200px'
    });
  }
  sendEmailContact(contact: string): void {
    this.adminRepo.sendEmailContact(contact).subscribe(
      () => {
        this.utils.changeIsLoading(false);
        Swal.fire({
          title: 'Merci !',
          text: 'Nous vous contacterons bientôt.',
          icon: 'success'
        });
      },
      (error) => {
        this.utils.changeIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error
        });
      }
    );
  }
  calendarViewDateChange(viewDate: Date): void {
    this.adminStore.calendarViewDate.set(viewDate);
  }

  openActionListValidRefuseModal(
    action: Action,
    type: 'valid' | 'refuse' | 'watch'
  ) {
    this.dialog.open(AdminActionListValidRefuseModal, {
      data: {
        action,
        type
      }
    });
  }
  getAllEventByContratListAndPeriod(start: Date, end: Date): void {
    this.adminRepo
      .getAllEventByContratIdListAndPeriod(
        start,
        end,
        this.adminStore.adminAllContratList().reduce((acc, c) => {
          if (c.id) {
            acc.push(c.id);
          }
          return acc;
        }, [] as number[])
      )
      .subscribe((allEventList) => {
        this.adminStore.allEventList.set(
          allEventList.map((event) => ({
            ...event,
            start: this.utils.getStart(event.start),
            end: this.utils.getEnd(event.end)
          }))
        );
      });
  }

  getAllEventByContratIdAndPeriod(
    start: Date,
    end: Date,
    contratId: string
  ): void {
    this.adminRepo
      .getAllEventByContratIdAndPeriod(start, end, contratId)
      .subscribe((eventList) => {
        console.log(eventList);
        return this.adminStore.eventList.set([
          ...eventList.map((event) => ({
            ...event,
            start: this.utils.getStart(event.start),
            end: this.utils.getEnd(event.end)
          }))
        ]);
      });
  }

  getRecapContrat(date: Date, idContrat: number): void {
    this.utils.changeIsLoading(true);
    const dateStrList: string[] = [
      ...new Set(
        [startOfWeek(date), endOfWeek(date)].map(
          (d) =>
            (d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) +
            '-' +
            d.getFullYear()
        )
      )
    ];
    this.adminRepo.getRecapContrat(dateStrList, idContrat + '').subscribe(
      (recapListCurrentContrat) => {
        this.utils.changeIsLoading(false);
        this.adminStore.recapListCurrentContrat.set(
          recapListCurrentContrat.map((recapCurrentContrat) => ({
            ...recapCurrentContrat,
            dayAppList: recapCurrentContrat.dayAppList.map((d) => ({
              ...d,
              date: new Date(d.date)
            })),
            contrat: {
              ...recapCurrentContrat.contrat,
              dateBegin: new Date(recapCurrentContrat.contrat.dateBegin),
              dateEnd: new Date(recapCurrentContrat.contrat.dateEnd)
            }
          }))
        );
      },
      () => {
        this.utils.changeIsLoading(false);
      }
    );
  }

  addEventTag(tag: Tag): void {
    this.utils.changeIsLoading(true);
    this.adminRepo.addTag(tag).subscribe(() => {
      this.utils.changeIsLoading(false);
      this.getEventTagMap();
    });
  }
  getEventTagMap(): void {
    this.utils.changeIsLoading(true);
    this.adminRepo.getTagMap().subscribe((tagMap) => {
      this.utils.changeIsLoading(false);
      this.adminStore.tagMap.set(tagMap);
    });
  }

  openCreateEventModal(event: CalendarEvent, contratId: string): void {
    this.dialog
      .open(CreateEventModal, {
        width: '90%',
        maxWidth: '1200px',
        data: {
          event
        }
      })
      .afterClosed()
      .subscribe((newEvent) => {
        if (newEvent) {
          this.createNewEvent(newEvent, contratId);
        }
      });
  }

  deleteEvent(event: CalendarEvent, contratId: string) {
    this.adminRepo.deleteEvent(event).subscribe(() => {
      const currentDateRecap = new Date(this.adminStore.currentDateRecap());
      const calendarViewDate = new Date(this.adminStore.calendarViewDate());
      this.getAllEventByContratIdAndPeriod(
        startOfWeek(calendarViewDate, { locale: fr }),
        endOfWeek(calendarViewDate, { locale: fr }),
        contratId
      );
      this.getAllEventByContratListAndPeriod(
        startOfWeek(currentDateRecap, { locale: fr }),
        endOfWeek(currentDateRecap, { locale: fr })
      );
      this.getRecap(currentDateRecap);
      this.getRecapContrat(calendarViewDate, Number(contratId));
    });
  }

  createNewEvent(event: CalendarEvent, contratId: string): void {
    this.adminRepo.createNewEvent(event, contratId).subscribe(
      () => {
        const currentDateRecap = new Date(this.adminStore.currentDateRecap());
        const calendarViewDate = new Date(this.adminStore.calendarViewDate());
        this.getAllEventByContratIdAndPeriod(
          startOfWeek(calendarViewDate, { locale: fr }),
          endOfWeek(calendarViewDate, { locale: fr }),
          contratId
        );
        this.getAllEventByContratListAndPeriod(
          startOfWeek(currentDateRecap, { locale: fr }),
          endOfWeek(currentDateRecap, { locale: fr })
        );
        this.getRecap(currentDateRecap);
        this.getRecapContrat(calendarViewDate, Number(contratId));
      },
      (error) => {
        this.utils.changeIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error
        });
      }
    );
  }
  copyPasteWeek(dateToCopy: Date, dateToPaste: Date, contratId: string): void {
    this.adminRepo
      .copyPasteWeek(dateToCopy, dateToPaste, contratId)
      .subscribe(() => {
        this.getAllEventByContratIdAndPeriod(
          startOfWeek(dateToPaste, { locale: fr }),
          endOfWeek(dateToPaste, { locale: fr }),
          contratId
        );
        this.getRecapContrat(
          startOfWeek(dateToPaste, { locale: fr }),
          Number(contratId)
        );
        const currentDateRecap = new Date(this.adminStore.currentDateRecap());
        this.getRecap(currentDateRecap);
        this.getAllEventByContratListAndPeriod(
          startOfWeek(currentDateRecap, { locale: fr }),
          endOfWeek(currentDateRecap, { locale: fr })
        );
      });
  }
  openPdfDisplayModal(idPdf: number): void {
    this.utils.changeIsLoading(true);
    this.adminRepo.getPdfById(idPdf).subscribe(
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
      (error) => {
        this.utils.changeIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error
        });
      }
    );
  }
  getActionList(): void {
    this.utils.changeIsLoading(true);
    this.adminRepo.getActionList().subscribe(
      (actionList) => {
        this.utils.changeIsLoading(false);
        this.adminStore.actionList.set(
          actionList.map((a) => ({
            ...a,
            date: new Date(a.date),
            dayAppList: a.dayAppList.map((d) => ({
              ...d,
              date: new Date(d.date)
            }))
          }))
        );
      },
      (error) => {
        this.utils.changeIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error
        });
      }
    );
  }
  getRecap(date: Date): void {
    this.utils.changeIsLoading(true);
    this.adminRepo
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
          this.adminStore.recapByContratDayAppList.set(
            recapByContratDayAppList.map((recapByContratDayApp) => ({
              ...recapByContratDayApp,
              dayAppList: recapByContratDayApp.dayAppList.map((d) => ({
                ...d,
                date: new Date(d.date)
              })),
              contrat: {
                ...recapByContratDayApp.contrat,
                dateBegin: new Date(recapByContratDayApp.contrat.dateBegin),
                dateEnd: new Date(recapByContratDayApp.contrat.dateEnd)
              }
            }))
          );
        },
        (error) => {
          this.utils.changeIsLoading(false);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error
          });
        }
      );
  }
  getExcelRecap(date: Date) {
    this.utils.changeIsLoading(true);
    this.adminRepo
      .getExcelRecap(
        (date.getMonth() < 9
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) +
          '-' +
          date.getFullYear()
      )
      .subscribe(
        (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download =
            format(Date.now(), 'yyyyMMddHHmmss') + '_planifique.pro' + '.csv';
          a.click();
          window.URL.revokeObjectURL(url);
          this.utils.changeIsLoading(false);
        },
        (error) => {
          this.utils.changeIsLoading(false);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error
          });
        }
      );
  }
  previousMonth(): void {
    this.adminStore.currentDateRecap.update((currentDateRecap) =>
      subMonths(currentDateRecap, 1)
    );
  }
  nextMonth(): void {
    this.adminStore.currentDateRecap.update((currentDateRecap) =>
      addMonths(currentDateRecap, 1)
    );
  }
  validAction(action: Action): void {
    this.utils.changeIsLoading(true);
    this.adminRepo.validAction(action).subscribe(
      (actionList) => {
        this.utils.changeIsLoading(false);
        this.adminStore.actionList.set(
          actionList.map((a) => ({
            ...a,
            date: new Date(a.date),
            dayAppList: a.dayAppList.map((d) => ({
              ...d,
              date: new Date(d.date)
            }))
          }))
        );
        this.getRecap(this.adminStore.currentDateRecap());
      },
      (error) => {
        this.utils.changeIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error
        });
      }
    );
  }

  refuseAction(action: Action): void {
    this.utils.changeIsLoading(true);
    this.adminRepo.refuseAction(action).subscribe(
      (actionList) => {
        this.utils.changeIsLoading(false);
        this.adminStore.actionList.set(
          actionList.map((a) => ({
            ...a,
            date: new Date(a.date),
            dayAppList: a.dayAppList.map((d) => ({
              ...d,
              date: new Date(d.date)
            }))
          }))
        );
        this.getRecap(this.adminStore.currentDateRecap());
      },
      (error) => {
        this.utils.changeIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error
        });
      }
    );
  }
  getDayAppListByContratId(idContrat: string): void {
    this.utils.changeIsLoading(true);
    this.adminRepo.getDayAppListByContratId(idContrat).subscribe(
      (dayAppList) => {
        this.utils.changeIsLoading(false);
        if (dayAppList.length > 0) {
          this.adminStore.dayAppList.set(
            eachDayOfInterval({
              start: subDays(new Date(dayAppList[0].date), 15),
              end: subDays(new Date(dayAppList[0].date), 1)
            })
              .map((day) => ({
                id: -1,
                date: day,
                weekState: WEEK_STATE.NORMAL,
                workState: WORK_STATE.HORS_CONTRAT
              }))
              .concat(
                dayAppList.map((d) => ({
                  ...d,
                  date: new Date(d.date)
                }))
              )
              .concat(
                eachDayOfInterval({
                  start: addDays(
                    new Date(dayAppList[dayAppList.length - 1].date),
                    1
                  ),
                  end: addDays(
                    new Date(dayAppList[dayAppList.length - 1].date),
                    15
                  )
                }).map((day) => ({
                  id: -1,
                  date: day,
                  weekState: WEEK_STATE.NORMAL,
                  workState: WORK_STATE.HORS_CONTRAT
                }))
              )
          );
        } else {
          this.adminStore.dayAppList.set([]);
        }
      },
      (error) => {
        this.utils.changeIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error
        });
      }
    );
  }
  getCalendarDayAppListByContrat(selectedContrat: ContratUserApp | undefined) {
    if (selectedContrat) {
      this.getDayAppListByContratId(selectedContrat.id + '');
    } else {
      this.adminStore.dayAppList.set([]);
    }
  }

  getContratListByUserId(idUserApp: string): void {
    this.utils.changeIsLoading(true);
    this.adminRepo.getContratListByUserId(idUserApp).subscribe(
      (adminContratList) => {
        this.utils.changeIsLoading(false);
        this.adminStore.adminContratList.set(
          adminContratList.map((c) => ({
            ...c,
            dateBegin: this.utils.getStart(c.dateBegin),
            dateEnd: this.utils.getEnd(c.dateEnd)
          }))
        );
      },
      (error) => {
        this.utils.changeIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error
        });
      }
    );
  }

  createContrat(contratEmploye: ContratUserApp): void {
    this.utils.changeIsLoading(true);
    this.adminRepo.createContrat(contratEmploye).subscribe(
      (adminContratList) => {
        this.utils.changeIsLoading(false);
        this.adminStore.adminContratList.set(
          adminContratList.map((c) => ({
            ...c,
            dateBegin: this.utils.getStart(c.dateBegin),
            dateEnd: this.utils.getEnd(c.dateEnd)
          }))
        );
      },
      (error) => {
        this.utils.changeIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error
        });
      }
    );
  }

  updateContrat(contratEmploye: ContratUserApp): void {
    this.utils.changeIsLoading(true);
    this.adminRepo.updateContrat(contratEmploye).subscribe(
      (adminContratList) => {
        this.utils.changeIsLoading(false);
        this.adminStore.adminContratList.set(
          adminContratList.map((c) => ({
            ...c,
            dateBegin: this.utils.getStart(c.dateBegin),
            dateEnd: this.utils.getEnd(c.dateEnd)
          }))
        );
      },
      (error) => {
        this.utils.changeIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error
        });
      }
    );
  }

  createUserApp(userApp: UserApp): void {
    this.utils.changeIsLoading(true);
    this.adminRepo.createUserApp(userApp).subscribe(
      (userAppList) => {
        this.utils.changeIsLoading(false);
        this.adminStore.userAppList.set(
          userAppList.map((u) => {
            const userApp = new UserApp(u);
            (userApp.contratUserApp.dateBegin = this.utils.getStart(
              userApp.contratUserApp.dateBegin
            )),
              (userApp.contratUserApp.dateEnd = this.utils.getEnd(
                userApp.contratUserApp.dateEnd
              ));
            return userApp;
          })
        );
      },
      (error) => {
        this.utils.changeIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error
        });
      }
    );
  }

  updateUserApp(userApp: UserApp): void {
    this.utils.changeIsLoading(true);
    this.adminRepo.updateUserApp(userApp).subscribe(
      (userAppList) => {
        this.utils.changeIsLoading(false);
        this.adminStore.userAppList.set(
          userAppList.map((u) => {
            const userApp = new UserApp(u);
            (userApp.contratUserApp.dateBegin = this.utils.getStart(
              userApp.contratUserApp.dateBegin
            )),
              (userApp.contratUserApp.dateEnd = this.utils.getEnd(
                userApp.contratUserApp.dateEnd
              ));
            return userApp;
          })
        );
      },
      (error) => {
        this.utils.changeIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error
        });
      }
    );
  }

  changeEnabled(userApp: UserApp) {
    userApp.enabled = !userApp.enabled;
    this.updateUserApp(userApp);
  }

  getUserAppList(): void {
    this.utils.changeIsLoading(true);
    this.adminRepo.getUserAppList().subscribe(
      (userAppList) => {
        this.utils.changeIsLoading(false);
        this.adminStore.userAppList.set(
          userAppList.map((u) => {
            const userApp = new UserApp(u);
            (userApp.contratUserApp.dateBegin = this.utils.getStart(
              userApp.contratUserApp.dateBegin ?? new Date()
            )),
              (userApp.contratUserApp.dateEnd = this.utils.getEnd(
                userApp.contratUserApp.dateEnd ?? new Date()
              ));
            return userApp;
          })
        );
      },
      (error) => {
        this.utils.changeIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error
        });
      }
    );
  }

  adminGetHistoriqueActionList(date: Date): void {
    this.utils.changeIsLoading(true);
    this.adminRepo.adminGetHistoriqueActionList(date.getFullYear()).subscribe(
      (historiqueActionList) => {
        this.utils.changeIsLoading(false);
        this.adminStore.historiqueActionList.set(
          historiqueActionList.map((a) => ({
            ...a,
            date: new Date(a.date),
            dayAppList: a.dayAppList.map((d) => ({
              ...d,
              date: new Date(d.date)
            }))
          }))
        );
      },
      (error) => {
        this.utils.changeIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error
        });
      }
    );
  }

  getAllContrat(): void {
    this.utils.changeIsLoading(true);
    this.adminRepo.getAllContrat().subscribe(
      (adminAllContratList) => {
        this.utils.changeIsLoading(false);
        this.adminStore.adminAllContratList.set(
          adminAllContratList.map((c) => ({
            ...c,
            dateBegin: this.utils.getStart(c.dateBegin),
            dateEnd: this.utils.getEnd(c.dateEnd)
          }))
        );
      },
      (error) => {
        this.utils.changeIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error
        });
      }
    );
  }

  createUserModal() {
    this.dialog
      .open(CreateUpdateUserModal, {
        data: {
          userAppList: this.adminStore.userAppList()
        }
      })
      .afterClosed()
      .subscribe((userApp: UserApp) => {
        if (userApp) {
          this.createUserApp(userApp);
        }
      });
  }

  updateUserModal(userApp: UserApp) {
    this.dialog
      .open(CreateUpdateUserModal, {
        data: {
          userApp: userApp, // Utilisation d'un seul objet avec toutes les données
          userAppList: this.adminStore.userAppList()
        }
      })
      .afterClosed()
      .subscribe((updatedUserApp) => {
        if (updatedUserApp) {
          this.updateUserApp(updatedUserApp);
        }
      });
  }

  createContratModal(userApp: UserApp): void {
    this.getAllContrat();
    this.dialog
      .open(CreateUpdateContratModal, {
        data: {
          userApp
        }
      })
      .afterClosed()
      .subscribe((contrat: ContratUserApp) => {
        if (contrat) {
          this.createContrat(contrat);
        }
      });
  }

  updateContratModal(contrat: ContratUserApp) {
    this.getAllContrat();
    this.dialog
      .open(CreateUpdateContratModal, {
        data: {
          contrat
        }
      })
      .afterClosed()
      .subscribe((contrat: ContratUserApp) => {
        if (contrat) {
          this.updateContrat(contrat);
        }
      });
  }

  archiveUnarchiveContrat(contrat: ContratUserApp) {
    contrat.archived = !contrat.archived;
    this.updateContrat(contrat);
  }
}
