import { Component, computed, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserApp } from '../../models/user.model';
import { UserListDumb } from '../dumbs/user-app-list.dumb';
import { AdminServerService } from './services/admin-server.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Abonnement } from 'src/app/models/user-connected.model';

@Component({
  template: `
    <div class="px-6 lg:px-8 py-20 h-full bg-foreground">
      <div class="container space-y-20">
        <!-- HEADER -->
        <div class="space-y-12">
          <div class="text-center">
            <div class="text-2xl font-medium">alaisedeiz</div>
            <div class="text-5xl font-extrabold">
              Jusqu'au 1er mai, tout est gratuit ! Profitez en !
            </div>
            <div class="text-xl font-medium mt-3">
              Sélectionnez l'abonnement que vous voulez en cliquant dessus, ça
              n'engage à rien !
            </div>
          </div>
        </div>
        <!-- PRICING -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            class=" rounded-2xl border"
            [ngClass]="
              currentAbonnement() &&
              currentAbonnement() === Abonnement.ESSENTIEL
                ? 'ring-primary-500 relative ring-2'
                : ''
            "
            (click)="selectAbonnement(Abonnement.ESSENTIEL)">
            @if (
              currentAbonnement() &&
              currentAbonnement() === Abonnement.ESSENTIEL
            ) {
              <div class="text-center">
                <div
                  class="absolute inline-block rounded-full bg-primary-500 text-on-primary-500 font-semibold text-xs px-4 py-2 -translate-y-[50%] -translate-x-[50%]">
                  Mon abonnement
                </div>
              </div>
            }
            <div class="mx-8 py-8 space-y-4 border-b">
              <div class="text-2xl font-bold">Essentiel</div>
              <div>
                <span class="text-5xl font-extrabold">Gratuit</span>
              </div>
              <div class="text-gray-500 font-medium">
                Pour gérer jusqu'à 5 employés
              </div>
              <!-- <button
                class="w-full"
                color="primary"
                mat-flat-button
                type="button">
                Je veux en savoir plus
              </button> -->
            </div>

            <div class="px-8 py-8 space-y-4">
              <div class="flex items-center font-semibold gap-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check"></mat-icon>
                <div>Module Abscences</div>
              </div>

              <div class="flex items-center gap-3 text-sm ms-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check_box"></mat-icon>
                <div>
                  Gestion des abscences (calendrier, demande,
                  validation/refus...)
                </div>
              </div>
              <div class="flex items-center gap-3 text-sm ms-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check_box"></mat-icon>
                <div>Compte des jours de congés/RTT...</div>
              </div>
              <div class="flex items-center gap-3 text-sm ms-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check_box_outline_blank"></mat-icon>
                <div>
                  Envoi d'email sur demande et confirmation/refus d'une abscence
                </div>
              </div>
              <div class="flex items-center gap-3 text-sm ms-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check_box_outline_blank"></mat-icon>
                <div>Insertion de pièces jointes</div>
              </div>
              <div class="flex items-center gap-3 text-sm ms-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check_box_outline_blank"></mat-icon>
                <div>Téléchargement d'excels</div>
              </div>
              <div class="flex items-center font-semibold gap-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check"></mat-icon>
                <div>Module Planning</div>
              </div>
              <div class="flex items-center gap-3 text-sm ms-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check_box"></mat-icon>
                <div>Gestion des plannings</div>
              </div>
              <div class="flex items-center gap-3 text-sm ms-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check_box"></mat-icon>
                <div>Compte des heures hebdomadaires et mensuelles</div>
              </div>
              <div class="flex items-center gap-3 text-sm ms-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check_box_outline_blank"></mat-icon>
                <div>Envoi hebdomadaire du planning par email</div>
              </div>
              <div class="flex items-center gap-3 text-sm ms-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check_box_outline_blank"></mat-icon>
                <div>Téléchargement d'excels</div>
              </div>
            </div>
          </div>
          <div
            class=" rounded-2xl border"
            [ngClass]="
              currentAbonnement() && currentAbonnement() === Abonnement.PRO
                ? 'ring-primary-500 relative ring-2'
                : ''
            "
            (click)="selectAbonnement(Abonnement.PRO)">
            @if (
              currentAbonnement() && currentAbonnement() === Abonnement.PRO
            ) {
              <div class="text-center">
                <div
                  class="absolute inline-block rounded-full bg-primary-500 text-on-primary-500 font-semibold text-xs px-4 py-2 -translate-y-[50%] -translate-x-[50%]">
                  Mon abonnement
                </div>
              </div>
            }

            <div class="mx-8 py-8 space-y-4 border-b">
              <div class="text-2xl font-bold">Pro</div>
              <div>
                <span class="text-5xl font-extrabold line-through">30€</span>
                <span class="text-xl font-semibold">/mois</span>
              </div>
              <div>
                <span class="text-xl font-semibold text-primary-500"
                  >Offert jusqu'au 1er mai</span
                >
              </div>
              <div class="text-gray-500 font-medium">
                Pour gérer jusqu'à 10 employés
              </div>
              <!-- <button
                class="w-full"
                color="primary"
                mat-flat-button
                type="button">
                Je veux en savoir plus
              </button> -->
            </div>
            <div class="px-8 py-8 space-y-4">
              <div class="flex items-center font-semibold gap-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check"></mat-icon>
                <div>Module Abscences</div>
              </div>

              <div class="flex items-center gap-3 text-sm ms-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check_box"></mat-icon>
                <div>
                  Gestion des abscences (calendrier, demande,
                  validation/refus...)
                </div>
              </div>
              <div class="flex items-center gap-3 text-sm ms-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check_box"></mat-icon>
                <div>Compte des jours de congés/RTT...</div>
              </div>
              <div class="flex items-center gap-3 text-sm ms-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check_box"></mat-icon>
                <div>
                  Envoi d'email sur demande et confirmation/refus d'une abscence
                </div>
              </div>
              <div class="flex items-center gap-3 text-sm ms-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check_box"></mat-icon>
                <div>Insertion de pièces jointes</div>
              </div>
              <div class="flex items-center gap-3 text-sm ms-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check_box"></mat-icon>
                <div>3 Téléchargements d'excel par mois</div>
              </div>
              <div class="flex items-center font-semibold gap-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check"></mat-icon>
                <div>Module Planning</div>
              </div>
              <div class="flex items-center gap-3 text-sm ms-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check_box"></mat-icon>
                <div>Gestion des plannings</div>
              </div>
              <div class="flex items-center gap-3 text-sm ms-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check_box"></mat-icon>
                <div>Compte des heures hebdomadaires et mensuelles</div>
              </div>
              <div class="flex items-center gap-3 text-sm ms-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check_box"></mat-icon>
                <div>Envoi hebdomadaire du planning par email</div>
              </div>
              <div class="flex items-center gap-3 text-sm ms-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check_box"></mat-icon>
                <div>3 Téléchargements d'excels</div>
              </div>
            </div>
          </div>

          <div
            class=" rounded-2xl border"
            [ngClass]="
              currentAbonnement() && currentAbonnement() === Abonnement.PREMIUM
                ? 'ring-primary-500 relative ring-2'
                : ''
            "
            (click)="selectAbonnement(Abonnement.PREMIUM)">
            @if (
              currentAbonnement() && currentAbonnement() === Abonnement.PREMIUM
            ) {
              <div class="text-center">
                <div
                  class="absolute inline-block rounded-full bg-primary-500 text-on-primary-500 font-semibold text-xs px-4 py-2 -translate-y-[50%] -translate-x-[50%]">
                  Mon abonnement
                </div>
              </div>
            }
            <div class="mx-8 py-8 space-y-4 border-b">
              <div class="text-2xl font-bold">Premium</div>
              <div>
                <span class="text-5xl font-extrabold line-through">100€</span>
                <span class="text-xl font-semibold">/mois</span>
              </div>
              <div>
                <span class="text-xl font-semibold text-primary-500"
                  >Offert jusqu'au 1er mai</span
                >
              </div>
              <div class="text-gray-500 font-medium">
                Pour gérer jusqu'à 100 employés
              </div>
              <!-- <button
                class="w-full"
                color="primary"
                mat-flat-button
                type="button">
                Je veux en savoir plus
              </button> -->
            </div>

            <div class="px-8 py-8 space-y-4">
              <div class="flex items-center font-semibold gap-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check"></mat-icon>
                <div>Module Abscences</div>
              </div>

              <div class="flex items-center gap-3 text-sm ms-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check_box"></mat-icon>
                <div>
                  Gestion des abscences (calendrier, demande,
                  validation/refus...)
                </div>
              </div>
              <div class="flex items-center gap-3 text-sm ms-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check_box"></mat-icon>
                <div>Compte des jours de congés/RTT...</div>
              </div>
              <div class="flex items-center gap-3 text-sm ms-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check_box"></mat-icon>
                <div>
                  Envoi d'email sur demande et confirmation/refus d'une abscence
                </div>
              </div>
              <div class="flex items-center gap-3 text-sm ms-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check_box"></mat-icon>
                <div>Insertion de pièces jointes</div>
              </div>
              <div class="flex items-center gap-3 text-sm ms-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check_box"></mat-icon>
                <div>Téléchargements d'excel illimité</div>
              </div>
              <div class="flex items-center font-semibold gap-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check"></mat-icon>
                <div>Module Planning</div>
              </div>
              <div class="flex items-center gap-3 text-sm ms-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check_box"></mat-icon>
                <div>Gestion des plannings</div>
              </div>
              <div class="flex items-center gap-3 text-sm ms-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check_box"></mat-icon>
                <div>Compte des heures hebdomadaires et mensuelles</div>
              </div>
              <div class="flex items-center gap-3 text-sm ms-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check_box"></mat-icon>
                <div>Envoi hebdomadaire du planning par email</div>
              </div>
              <div class="flex items-center gap-3 text-sm ms-3">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check_box"></mat-icon>
                <div>Téléchargements d'excels illimité</div>
              </div>
            </div>
          </div>

          <!-- <div>
          <vex-pricing-testimonials></vex-pricing-testimonials>
        </div> -->

          <!-- <div>
          <vex-pricing-faq></vex-pricing-faq>
        </div> -->
        </div>
      </div>
    </div>
  `,
  animations: [],
  standalone: true,
  imports: [MatIconModule, CommonModule]
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
}
