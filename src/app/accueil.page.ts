import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  AsyncPipe,
  NgClass,
  NgForOf,
  NgIf,
  NgTemplateOutlet
} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component';
import { combineLatest, map, Observable } from 'rxjs';
import { VexConfig } from '@vex/config/vex-config.interface';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { VexConfigService } from '@vex/config/vex-config.service';
import { SidenavComponent } from './layouts/components/sidenav/sidenav.component';
import { ToolbarComponent } from './layouts/components/toolbar/toolbar.component';
import { FooterComponent } from './layouts/components/footer/footer.component';
import { QuickpanelComponent } from './layouts/components/quickpanel/quickpanel.component';
import { ConfigPanelToggleComponent } from './layouts/components/config-panel/config-panel-toggle/config-panel-toggle.component';
import { VexSidebarComponent } from '@vex/components/vex-sidebar/vex-sidebar.component';
import { ConfigPanelComponent } from './layouts/components/config-panel/config-panel.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SearchComponent } from './layouts/components/toolbar/search/search.component';
import { VexProgressBarComponent } from '@vex/components/vex-progress-bar/vex-progress-bar.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  template: `
    <div class="px-6 lg:px-8 py-20 h-full bg-foreground">
      <div class="container space-y-20">
        <!-- HEADER -->

        <div class=" px-8 text-center rounded-2xl">
          <div class="text-5xl font-extrabold mb-5">
            Besoin de simplifier le planning et les abscences de vos employés ?
          </div>
          <div class="text-2xl font-medium  mb-5">
            Plutôt qu'un long discours, je vous propose de regarder la première
            minute ou toute la vidéo ci-dessous pour découvrir le logiciel
            alaisedeiz
          </div>
          <div class="video-container">
            <iframe
              class="ql-video ql-align-center mx-auto"
              src="https://www.youtube.com/embed/vCFVyQ_HiWQ?autoplay=1&mute=1"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen>
            </iframe>
          </div>
        </div>
        <div class="space-y-12">
          <div class="text-center">
            <div class="text-2xl font-medium">Logiciel de gestion RH</div>
            <div class="text-5xl font-extrabold">alaisedeiz</div>
          </div>
        </div>
        <!-- PRICING -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 border">
          <div class="rounded-2xl">
            <div class="mx-8 py-8 space-y-4 border-b">
              <div class="text-2xl font-bold">Abonnement mensuel</div>
              <div>
                <span class="text-5xl font-extrabold">5€</span>
                <span class="text-xl font-semibold">/employé(e)/mois</span>
              </div>
              <div class="text-gray-500 font-medium">Prix avant offre</div>
              <!-- <button
                class="w-full"
                color="primary"
                mat-flat-button
                type="button">
                Je veux en savoir plus
              </button> -->
            </div>

            <div class="px-8 py-8 space-y-4">
              <div class="font-semibold">Bénéficiez de :</div>

              <div class="flex items-center gap-3 text-sm">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check"></mat-icon>
                <div>alaisedeiz - Gestion des abscences</div>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check"></mat-icon>
                <div>Assistance et accompagnement personnalisé</div>
              </div>
              <div
                class="flex items-center gap-3 text-sm"
                style="visibility: hidden;">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check"></mat-icon>
                <div>
                  Accès aux fonctionnalités à venir sans frais supplémentaires
                </div>
              </div>

              <hr />

              <div class="flex items-center gap-3 text-sm">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:add_shopping_cart"></mat-icon>
                <div>
                  Vos employés peuvent demander des abscences et y inclure des
                  pièces jointes
                </div>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:add_shopping_cart"></mat-icon>
                <div>
                  Les managers peuvent valider ou non et visualiser les
                  récapitulatifs
                </div>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:add_shopping_cart"></mat-icon>
                <div>
                  Un module admin vous donne accès à toutes les données et vous
                  permet de transmettre au comptable
                </div>
              </div>
            </div>
          </div>
          <div class="ring-2 ring-primary-500 rounded-2xl relative">
            <div class="text-center">
              <div
                class="absolute inline-block rounded-full bg-primary-500 text-on-primary-500 font-semibold text-xs px-4 py-2 -translate-y-[50%] -translate-x-[50%]">
                A NE PAS MANQUER
              </div>
            </div>

            <div class="mx-8 py-8 space-y-4 border-b">
              <div class="text-2xl font-bold">Offre de lancement</div>
              <div>
                <span class="text-5xl font-extrabold">2€</span>
                <span class="text-xl font-semibold">/employé(e)/mois</span>
              </div>
              <div class="text-gray-500 font-medium">
                Conçu pour les TPE, PME
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
              <div class="font-semibold">Bénéficiez de :</div>

              <div class="flex items-center gap-3 text-sm">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check"></mat-icon>
                <div>alaisedeiz - Gestion des abscences</div>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check"></mat-icon>
                <div>Assistance et accompagnement personnalisé</div>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check"></mat-icon>
                <div>
                  Accès aux fonctionnalités à venir sans frais supplémentaires
                </div>
              </div>

              <hr />

              <div class="flex items-center gap-3 text-sm">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:add_shopping_cart"></mat-icon>
                <div>
                  Vos employés peuvent demander des abscences et y inclure des
                  pièces jointes
                </div>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:add_shopping_cart"></mat-icon>
                <div>
                  Les managers peuvent valider ou non et visualiser les
                  récapitulatifs
                </div>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:add_shopping_cart"></mat-icon>
                <div>
                  Un module admin vous donne accès à toutes les données et vous
                  permet de transmettre au comptable
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border">
            <div class="mx-8 py-8 space-y-4 border-b">
              <div class="text-2xl font-bold">Personnalisation</div>
              <div>
                <span class="text-xl font-semibold">sur devis</span>
              </div>
              <div class="text-gray-500 font-medium">
                alaisedeiz + vos besoins spécifiques
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
              <div class="font-semibold">Bénéficiez de :</div>

              <div class="flex items-center gap-3 text-sm">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check"></mat-icon>
                <div>alaisedeiz - Gestion des abscences</div>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check"></mat-icon>
                <div>Accompagnement personnalisé</div>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:check"></mat-icon>
                <div>
                  Conception et développement de vos besoins spécifiques
                </div>
              </div>

              <hr />

              <div class="flex items-center gap-3 text-sm">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:add_shopping_cart"></mat-icon>
                <div>Toutes les fonctionnalités utiles de alaisedeiz</div>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <mat-icon
                  class="icon-sm text-primary-500"
                  style="overflow: visible;"
                  svgIcon="mat:add_shopping_cart"></mat-icon>
                <div>Conception et ajout de vos besoins</div>
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
        <div class="space-y-12">
          <div class="text-center">
            <div class="text-4xl font-extrabold">Questions / Réponses</div>
            <div class="text-gray-500 max-w-md mx-auto mt-4 font-medium">
              Vous ne trouvez pas votre réponse ici ? Appelez moi directement au
              06 99 89 22 42 ou écrivez moi sur lasbleis.olivier&#64;yahoo.fr
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            <div *ngFor="let item of items">
              <div class="text-lg font-medium">{{ item.label }}</div>
              <div class="text-gray-500 text-sm mt-1 leading-relaxed">
                {{ item.description }}
              </div>
            </div>
          </div>
        </div>
        <div
          class="rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          <div class="relative">
            <img
              class="object-cover h-full w-full"
              src="/assets/img/olivierlasbleis.jpg" />
            <div class="absolute inset-0 bg-gray-800/20"></div>
          </div>
          <div
            class="bg-gray-800 text-gray-100 px-10 py-12 flex flex-col gap-4">
            <div class="flex-auto">
              <div class="text-lg font-medium text-gray-300">Qui suis-je ?</div>
              <div class="text-4xl font-extrabold">
                Olivier LASBLEIS, développeur Quimpérois
              </div>
              <div class="text-gray-300 mt-3 leading-relaxed">
                Le principal à savoir c'est que je suis passionné par mon
                métier. Cela fait 6 ans que je suis développeur et cette
                activité me plaît car elle me permet de simplifier le travail
                des autres.
              </div>
              <div class="text-gray-300 mt-3 leading-relaxed">
                J'ai créé alaisedev.bzh après avoir remarqué que la gestion des
                abscences et du planning des employés peut être chronophage pour
                un manager, en plus de créer des tensions du coté des employés.
              </div>
              <div class="text-gray-300 mt-3 leading-relaxed">
                Je souhaite, via alaisedeiz.bzh, répondre à cette problématique
                au meilleur rapport qualité/prix. Vous pouvez me retrouver tous
                les jours à la cantine numérique de Quimper à travailler dessus.
              </div>
            </div>

            <a
              href="https://alaisedev.fr"
              target="_blank"
              rel="noopener noreferrer">
              <button class="flex-none" mat-flat-button type="button">
                <span>Visiter mon site internet</span>
                <mat-icon class="icon-xs" svgIcon="mat:open_in_new"></mat-icon>
              </button>
            </a>
          </div>
        </div>

        <div
          class="bg-gray-100 dark:bg-gray-800 border flex flex-col md:flex-row md:items-center gap-4 px-10 py-12 rounded-2xl">
          <div class="flex-auto">
            <div class="text-4xl font-extrabold">Envie d'en savoir plus ?</div>
            <div
              class="text-xl text-primary-700 dark:text-primary-500 font-extrabold mt-1">
              Appelez moi directement au 06 99 89 22 42 ou écrivez moi sur
              lasbleis.olivier&#64;yahoo.fr
            </div>
          </div>
        </div>
        <br />
        <br />
        <br />
      </div>
    </div>
  `,
  styles: [
    `
      .logo {
        position: absolute;
        top: 20px;
        left: 20px;
        height: 100px;
        width: 100px;
      }
      .video-container iframe {
        width: 100%;
        aspect-ratio: 16 / 9; /* Maintient le ratio de l'iframe */
        max-width: 100vw;
        max-height: 100vh;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp400ms],
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    NgForOf,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule
  ]
})
export class AccueilPage {
  isYearlyChecked: boolean = false;

  items: {
    icon: string;
    label: string;
    description: string;
  }[] = [
    {
      icon: 'mat:check',
      label: 'A quoi sert le logiciel web alaisedeiz ?',
      description:
        "C'est un outil disponible sur le web qui permet de gérer facilement le planning des abscences de vos employés. Concrétement, vos employés disposent d'un espace en ligne pour faire leur demandes d'abscences (congés, arrêts maladies...) et vos manager et vous disposez d'un espace pour visualiser les demandes en cours et l'historique."
    },
    {
      icon: 'mat:check',
      label: 'Quel intêret y a t-il pour moi et mes équipes ?',
      description:
        "Vous gagnez du temps, simplifiez votre organisation et la collecte des données pour votre comptabilité. Il est conçu pour que la saisie soit intuitive et permet de centraliser les données et de visualiser facilement les informations. Il est accessible de manière sécurisée de n'importe où"
    },
    {
      icon: 'mat:check',
      label: 'Quelles fonctionnalités vous prévoyez en plus ?',
      description:
        'Je prévois un calendrier pour les employés et ainsi simplifier le calcul hebdomadaire et mensuels des heures de travails. Si vous vous inscrivez, je serais aussi attentifs à vos propositions.'
    },
    {
      icon: 'mat:check',
      label: "Comment m'inscrire ou avoir plus d'informations ?",
      description:
        'Appelez moi directement au 06 99 89 22 42 ou écrivez moi sur lasbleis.olivier@yahoo.fr.'
    },
    {
      icon: 'mat:check',
      label:
        "Pourquoi je ne peux pas créer un compte directement et commencer à utiliser l'outil tout de suite ?",
      description:
        "Je ne veux pas surcharger les serveurs et je veux controller l'ajout de nouveau utilisateurs pour éviter les calculs inutiles qui ralentiraient les utilisateurs déjà présents."
    },
    {
      icon: 'mat:check',
      label: "Quel engagement je prends si je m'abonne",
      description:
        "Aucun, vous pouvez vous désabonner à tout moment, la seule chose que je vous demande c'est de me prévenir si vous avez un bug et de m'indiquer les axes d'améliorations. C'est dans mon intêret que alaisedeiz soit adapté à vos besoins"
    },
    {
      icon: 'mat:check',
      label: 'Quel engagement vous prenez de votre côté ?',
      description:
        "Dans le cadre de l'offre de lancement, je m'engage à vous accompagner pour configurer le logiciel, à vous former pour l'utiliser et à être disponible en visio ou par téléphone en semaine sur les heures de bureau. C'est, encore une fois, dans mon intêret de comprendre les difficultés et les besoins de ma clientèle."
    },
    {
      icon: 'mat:check',
      label:
        "2€ par employé, c'est vraiment pas cher, comment comptez vous offrir un service de qualité ?",
      description:
        "C'est une offre de lancement, le prix augmentera pour atteindre 5€ pour les futurs adhérents tandis que vous garderez cette offre là. Mon objectif est de capter une clientèle fidèle, de comprendre leurs besoins et de rajouter des fonctionnalités qui justifieront un prix plus élevé ensuite."
    },
    {
      icon: 'mat:check',
      label: 'Vous allez réussir à gérer ?',
      description:
        "J'ai l'habitude et c'est mon métier. Dans mon précédent travail j'avais la gestion d'un logiciel semblable utilisé par plus de quatre mille personnes quotidiennement. En 2021 j'ai créé le même type de logiciel pour une TPE de Combrit et il fonctionne parfaitement sans qu'il n'y ait eu aucune intervention de ma part."
    },
    {
      icon: 'mat:check',
      label: 'Pourquoi le nom alaisedeiz ?',
      description:
        'C\'est un clin d\'oeil à ma région la Bretagne, "deiz" signifie "jour" en breton et je fais référence à l\'expréssion "à l\'aise breizh" qu\'on m\'a souvent rappelée avec mon nom de famille "lasbleis". alaisedeiz, pour moi signifie que vous organiserez vos jours plus facilement.'
    }
  ];
}
