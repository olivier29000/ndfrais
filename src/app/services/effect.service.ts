import { Injectable, signal, WritableSignal } from '@angular/core';
import { DayApp } from '../models/day-app.model';
import { DayBdd } from '../models/day-bdd.model';
import { UserApp } from '../models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { CreateUpdateUserModal } from '../pages/admin/modals/create-update-user.modal';
import { StoreService } from './store.service';
import { RepoService } from './repo.service';
import { ContratUserApp } from '../models/contrat-employe.model';
import { CreateUpdateContratModal } from '../pages/admin/modals/create-update-contrat.modal';
import { Router, UrlTree } from '@angular/router';
import Swal from 'sweetalert2';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EffectService {
  constructor(
    private dialog: MatDialog,
    private store: StoreService,
    private repo: RepoService,
    private router: Router
  ) {}

  authentification(email: string, password: string): void {
    this.store.isLoading.set(true);
    this.repo.authentification(email, password).subscribe(
      (userConnected) => {
        this.store.userConnected.set(userConnected);
        this.store.isLoading.set(false);
        this.router.navigate(['calendriers']);
      },
      (error: string) => {
        this.store.isLoading.set(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `${error}`
        });
      }
    );
  }

  logout(): void {
    this.store.isLoading.set(true);
    this.repo.logout().subscribe(
      () => {
        this.store.isLoading.set(false);
        window.location.href = '';
      },
      () => {
        this.store.isLoading.set(false);
        this.router.navigate(['']);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Erreur inconnu'
        });
      }
    );
  }

  creationCompte(email: string, entreprise: string, password: string): void {
    this.store.isLoading.set(true);
    this.repo.creationCompte(email, entreprise, password).subscribe(
      () => {
        this.store.isLoading.set(false);
        this.router.navigate(['']);
        Swal.fire({
          icon: 'success',
          title: 'Félicitation !',
          text: 'Votre compte a été créé, un email avec un lien de confirmation vient de vous être envoyé'
        });
      },
      (error: string) => {
        this.store.isLoading.set(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `${error}`
        });
      }
    );
  }

  fetchUserConnected(avaibilityUrl: string): void {
    this.store.isLoading.set(true);
    this.repo.fetchUserConnected(avaibilityUrl).subscribe(
      (userConnected) => {
        this.store.isLoading.set(false);
        this.store.userConnected.set(userConnected);
      },
      (error: string) => {
        this.store.isLoading.set(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `${error}`
        });
      }
    );
  }

  getContratListByUserId(idUserApp: string): void {
    this.repo.getContratListByUserId(idUserApp).subscribe(
      (adminContratList) => {
        this.store.isLoading.set(false);
        this.store.adminContratList.set(
          adminContratList.map((c) => ({
            ...c,
            dateBegin: new Date(c.dateBegin),
            dateEnd: new Date(c.dateEnd)
          }))
        );
      },
      () => {
        this.store.isLoading.set(false);
      }
    );
  }

  getDayAppListByContratId(idContrat: string): void {
    this.repo.getDayAppListByContratId(idContrat).subscribe(
      (dayAppList) => {
        this.store.isLoading.set(false);
        this.store.dayAppList.set(
          dayAppList.map((d) => ({
            ...d,
            date: new Date(d.date)
          }))
        );
      },
      () => {
        this.store.isLoading.set(false);
      }
    );
  }

  createContrat(contratEmploye: ContratUserApp): void {
    this.repo.createContrat(contratEmploye).subscribe(
      (adminContratList) => {
        this.store.isLoading.set(false);
        this.store.adminContratList.set(adminContratList);
      },
      () => {
        this.store.isLoading.set(false);
      }
    );
  }

  updateContrat(contratEmploye: ContratUserApp): void {
    this.repo.updateContrat(contratEmploye).subscribe(
      (adminContratList) => {
        this.store.isLoading.set(false);
        this.store.adminContratList.set(adminContratList);
      },
      () => {
        this.store.isLoading.set(false);
      }
    );
  }

  createUserApp(userApp: UserApp): void {
    this.repo.createUserApp(userApp).subscribe(
      (userAppList) => {
        this.store.isLoading.set(false);
        this.store.userAppList.set(userAppList.map((u) => new UserApp(u)));
      },
      () => {
        this.store.isLoading.set(false);
      }
    );
  }

  updateUserApp(userApp: UserApp): void {
    this.repo.updateUserApp(userApp).subscribe(
      (userAppList) => {
        this.store.isLoading.set(false);
        this.store.userAppList.set(userAppList.map((u) => new UserApp(u)));
      },
      () => {
        this.store.isLoading.set(false);
      }
    );
  }

  getUserAppList(): void {
    this.repo.getUserAppList().subscribe(
      (userAppList) => {
        this.store.isLoading.set(false);
        this.store.userAppList.set(userAppList.map((u) => new UserApp(u)));
      },
      () => {
        this.store.isLoading.set(false);
      }
    );
  }

  getUserConnected(): void {
    this.repo.getUserConnected().subscribe(
      (userConnected) => {
        this.store.isLoading.set(false);
        this.store.userConnected.set(userConnected);
      },
      () => {
        this.store.isLoading.set(false);
      }
    );
  }

  getAllContrat(): void {
    this.repo.getAllContrat().subscribe(
      (adminAllContratList) => {
        this.store.isLoading.set(false);
        console.log(adminAllContratList);
        this.store.adminAllContratList.set(adminAllContratList);
      },
      () => {
        this.store.isLoading.set(false);
      }
    );
  }

  createUserModal() {
    this.dialog
      .open(CreateUpdateUserModal, {
        data: {
          userAppList: this.store.userAppList()
        }
      })
      .afterClosed()
      .subscribe((userApp: UserApp) => {
        this.createUserApp(userApp);
      });
  }

  updateUserModal(userApp: UserApp) {
    this.dialog
      .open(CreateUpdateUserModal, {
        data: {
          userApp: userApp, // Utilisation d'un seul objet avec toutes les données
          userAppList: this.store.userAppList()
        }
      })
      .afterClosed()
      .subscribe((updatedUserApp) => {
        this.updateUserApp(updatedUserApp);
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
        this.createContrat(contrat);
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
        this.updateContrat(contrat);
      });
  }

  canActivate(): Observable<void | UrlTree> {
    this.store.isLoading.set(true);
    return this.repo.verifAuthenticate().pipe(
      map((userConnected) => {
        this.store.isLoading.set(false);
        this.store.userConnected.set(userConnected);
      }),
      catchError(() => {
        this.store.isLoading.set(false);
        return of(this.router.parseUrl(`login`));
      })
    );
  }
}
