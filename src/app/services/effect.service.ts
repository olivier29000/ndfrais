import { Injectable, signal, WritableSignal } from '@angular/core';
import { DayApp } from '../models/day-app.model';
import { DayBdd } from '../models/day-bdd.model';
import { UserApp } from '../models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { CreateUpdateUserModal } from '../pages/modals/create-update-user.modal';
import { StoreService } from './store.service';
import { RepoService } from './repo.service';
import { ContratEmploye } from '../models/contrat-employe.model';
import { CreateUpdateContratModal } from '../pages/modals/create-update-contrat.modal';

@Injectable({
  providedIn: 'root'
})
export class EffectService {
  constructor(
    private dialog: MatDialog,
    private store: StoreService,
    private repo: RepoService
  ) {}
  getContratListByUserId(idUserApp: string): void {
    this.repo.getContratListByUserId(idUserApp).subscribe(
      (adminContratList) => {
        this.store.isLoading.set(false);
        this.store.adminContratList.set(adminContratList);
      },
      () => {
        this.store.isLoading.set(false);
      }
    );
  }

  createContrat(contratEmploye: ContratEmploye): void {
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

  updateContrat(contratEmploye: ContratEmploye): void {
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

  createUserApp(userApp: UserApp): void {
    this.repo.createUserApp(userApp).subscribe(
      (userAppList) => {
        this.store.isLoading.set(false);
        this.store.userAppList.set(userAppList);
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
        this.store.userAppList.set(userAppList);
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
        this.store.userAppList.set(userAppList);
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

  createUserModal() {
    this.dialog
      .open(CreateUpdateUserModal, {
        data: {
          userAppList: this.store.userAppList()
        }
      })
      .afterClosed()
      .subscribe((userApp: UserApp) => {});
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
      .subscribe((updatedUserApp) => {});
  }

  createContratModal(userApp: UserApp): void {
    this.dialog
      .open(CreateUpdateContratModal, {
        data: {
          userApp,
          contratList: this.store.adminAllContratList()
        }
      })
      .afterClosed()
      .subscribe((userApp: UserApp) => {});
  }

  updateContratModal(contrat: ContratEmploye) {
    this.dialog
      .open(CreateUpdateContratModal, {
        data: {
          contrat,
          contratList: this.store.adminAllContratList()
        }
      })
      .afterClosed()
      .subscribe((userApp: UserApp) => {});
  }
}
