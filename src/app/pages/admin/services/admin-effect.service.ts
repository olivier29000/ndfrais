import { Injectable } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { Action } from 'src/app/models/action.model';
import { MatDialog } from '@angular/material/dialog';
import { AdminRepoService } from './admin-repo.service';
import { AdminStoreService } from './admin-store.service';
import { ContratUserApp } from 'src/app/models/contrat-employe.model';
import { UserApp } from 'src/app/models/user.model';
import { CreateUpdateUserModal } from '../modals/create-update-user.modal';
import { CreateUpdateContratModal } from '../modals/create-update-contrat.modal';

@Injectable({
  providedIn: 'root'
})
export class AdminEffectService {
  constructor(
    private dialog: MatDialog,
    private adminRepo: AdminRepoService,
    private adminStore: AdminStoreService,
    private utils: UtilsService
  ) {}

  getContratListByUserId(idUserApp: string): void {
    this.utils.changeIsLoading(true);
    this.adminRepo.getContratListByUserId(idUserApp).subscribe(
      (adminContratList) => {
        this.utils.changeIsLoading(false);
        this.adminStore.adminContratList.set(
          adminContratList.map((c) => ({
            ...c,
            dateBegin: new Date(c.dateBegin),
            dateEnd: new Date(c.dateEnd)
          }))
        );
      },
      () => {
        this.utils.changeIsLoading(false);
      }
    );
  }

  createContrat(contratEmploye: ContratUserApp): void {
    this.utils.changeIsLoading(true);
    this.adminRepo.createContrat(contratEmploye).subscribe(
      (adminContratList) => {
        this.utils.changeIsLoading(false);
        this.adminStore.adminContratList.set(adminContratList);
      },
      () => {
        this.utils.changeIsLoading(false);
      }
    );
  }

  updateContrat(contratEmploye: ContratUserApp): void {
    this.utils.changeIsLoading(true);
    this.adminRepo.updateContrat(contratEmploye).subscribe(
      (adminContratList) => {
        this.utils.changeIsLoading(false);
        this.adminStore.adminContratList.set(adminContratList);
      },
      () => {
        this.utils.changeIsLoading(false);
      }
    );
  }

  createUserApp(userApp: UserApp): void {
    this.utils.changeIsLoading(true);
    this.adminRepo.createUserApp(userApp).subscribe(
      (userAppList) => {
        this.utils.changeIsLoading(false);
        this.adminStore.userAppList.set(userAppList.map((u) => new UserApp(u)));
      },
      () => {
        this.utils.changeIsLoading(false);
      }
    );
  }

  updateUserApp(userApp: UserApp): void {
    this.utils.changeIsLoading(true);
    this.adminRepo.updateUserApp(userApp).subscribe(
      (userAppList) => {
        this.utils.changeIsLoading(false);
        this.adminStore.userAppList.set(userAppList.map((u) => new UserApp(u)));
      },
      () => {
        this.utils.changeIsLoading(false);
      }
    );
  }

  getUserAppList(): void {
    this.utils.changeIsLoading(true);
    this.adminRepo.getUserAppList().subscribe(
      (userAppList) => {
        this.utils.changeIsLoading(false);
        this.adminStore.userAppList.set(userAppList.map((u) => new UserApp(u)));
      },
      () => {
        this.utils.changeIsLoading(false);
      }
    );
  }

  getAllContrat(): void {
    this.utils.changeIsLoading(true);
    this.adminRepo.getAllContrat().subscribe(
      (adminAllContratList) => {
        this.utils.changeIsLoading(false);
        this.adminStore.adminAllContratList.set(adminAllContratList);
      },
      () => {
        this.utils.changeIsLoading(false);
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
        this.createUserApp(userApp);
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
}
