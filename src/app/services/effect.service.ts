import { Injectable, signal, WritableSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StoreService } from './store.service';
import { RepoService } from './repo.service';
import { Router, UrlTree } from '@angular/router';
import Swal from 'sweetalert2';
import { catchError, map, Observable, of } from 'rxjs';
import { Email } from '../models/email.model';
import { EmailSupportModal } from './modals/email-support.modal';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class EffectService {
  constructor(
    private store: StoreService,
    private repo: RepoService,
    private utils: UtilsService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  authentification(email: string, password: string): void {
    this.store.isLoading.set(true);
    this.repo.authentification(email, password).subscribe(
      (userConnected) => {
        this.store.userConnected.set(userConnected);
        this.store.isLoading.set(false);
        this.router.navigate(['tickets']);
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

  creationCompte(email: string, password: string): void {
    this.store.isLoading.set(true);
    this.repo.creationCompte(email, password).subscribe(
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

  getUserContratList(): void {
    this.repo.getUserContratList().subscribe(
      (userAllContratList) => {
        this.store.isLoading.set(false);
        this.store.userAllContratList.set(
          userAllContratList.map((c) => ({
            ...c,
            dateBegin: this.utils.getStart(c.dateBegin),
            dateEnd: this.utils.getStart(c.dateEnd)
          }))
        );
      },
      () => {
        this.store.isLoading.set(false);
      }
    );
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

  getOrganigramme(): void {
    this.repo.getOrganigramme().subscribe(
      (dataTreeNode) => {
        this.store.isLoading.set(false);
        this.store.dataTreeNode.set(dataTreeNode);
      },
      () => {
        this.store.isLoading.set(false);
      }
    );
  }

  sendEmail(email: Email): void {
    this.store.isLoading.set(true);
    this.repo.sendEmail(email).subscribe(
      () => {
        this.store.isLoading.set(false);
      },
      () => {
        this.store.isLoading.set(false);
      }
    );
  }

  verifDispoNomEntreprise(nomEntreprise: string): void {
    this.repo.verifDispoNomEntreprise(nomEntreprise).subscribe(
      () => {
        this.store.canChooseNomEntreprise.set(true);
      },
      () => {
        this.store.canChooseNomEntreprise.set(false);
        return of();
      }
    );
  }

  openSendEmailModal(mode: 'bug' | 'information' | 'fonctionnality') {
    this.dialog.open(EmailSupportModal, {
      data: {
        mode
      }
    });
  }
}
