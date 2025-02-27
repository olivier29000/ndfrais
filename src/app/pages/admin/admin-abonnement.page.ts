import { Component, computed, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserApp } from '../../models/user.model';
import { UserListDumb } from '../dumbs/user-app-list.dumb';
import { AdminServerService } from './services/admin-server.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Abonnement } from 'src/app/models/user-connected.model';
import { AbonnementListDumb } from 'src/app/dumbs/abonnements.dumb';
import Swal from 'sweetalert2';

@Component({
  template: `
    <div class="px-6 lg:px-8 py-20 h-full bg-foreground">
      <div class="container space-y-20">
        <!-- HEADER -->
        <div class="space-y-12">
          <div class="text-center">
            <div class="text-2xl font-medium">alaisedeiz</div>
            <div class="text-5xl font-extrabold">
              Jusqu'au 1er juin, tout est gratuit ! Profitez en !
            </div>
            <div class="text-xl font-medium mt-3">
              Sélectionnez l'abonnement que vous voulez en cliquant dessus, ça
              n'engage à rien !
            </div>
          </div>
        </div>
        <hr />
        <!-- PRICING -->
        <dumb-abonnement-list
          [currentAbonnement]="currentAbonnement()"
          (clickAbonnementOutput)="selectAbonnement($event)"
          (clickContactOutput)="clickContact()"></dumb-abonnement-list>
      </div>
    </div>
  `,
  animations: [],
  standalone: true,
  imports: [MatIconModule, CommonModule, AbonnementListDumb]
})
export class AdminAbonnementPage {
  Abonnement = Abonnement;
  currentAbonnement = computed(
    () => this.adminServer.userConnected()?.abonnement
  );
  constructor(private adminServer: AdminServerService) {}

  selectAbonnement(abonnement: Abonnement): void {
    this.adminServer.selectAbonnement(abonnement);
  }
  clickContact(): void {
    Swal.fire({
      title:
        'Laissez-nous votre contact et on vous rappelle (téléphone ou email)',
      input: 'text',
      inputPlaceholder: 'Entrez votre e-mail ou votre numéro',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Envoyer',
      showLoaderOnConfirm: true,
      preConfirm: async (inputValue) => {
        // Expression régulière pour un email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Expression régulière pour un numéro de téléphone (10 à 15 chiffres avec option + au début)
        const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\d{10,15}$/;

        // Vérification de la validité
        if (!emailRegex.test(inputValue) && !phoneRegex.test(inputValue)) {
          return Swal.showValidationMessage(
            'Veuillez entrer un e-mail ou un numéro valide !'
          );
        }

        // Simulation d'une requête API fictive (ex: sauvegarde du contact)
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminServer.sendEmailContact(result.value);
      }
    });
  }
}
