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
            Plutôt qu'un long discour, je vous propose de regarde cette vidéo de
            3 minutes pour découvrir le logiciel alaisedeiz
          </div>
          <iframe
            height="560"
            width="1000"
            class="ql-video ql-align-center mx-auto"
            src="https://www.youtube.com/embed/2pFdfjz7wNc?autoplay=1&mute=1"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen>
          </iframe>
        </div>
        <div class="space-y-12">
          <div class="text-center">
            <div class="text-2xl font-medium">Logiciel de gestion RH</div>
            <div class="text-5xl font-extrabold">alaisedeiz.bzh</div>
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
              <button
                class="w-full"
                color="primary"
                mat-flat-button
                type="button">
                Je veux en savoir plus
              </button>
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
              <button
                class="w-full"
                color="primary"
                mat-flat-button
                type="button">
                Je veux en savoir plus
              </button>
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
              <button
                class="w-full"
                color="primary"
                mat-flat-button
                type="button">
                Je veux en savoir plus
              </button>
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

            <button class="flex-none" mat-flat-button type="button">
              <span>Visiter mon site internet</span>
              <mat-icon class="icon-xs" svgIcon="mat:open_in_new"></mat-icon>
            </button>
          </div>
        </div>

        <div
          class="bg-gray-100 dark:bg-gray-800 border flex flex-col md:flex-row md:items-center gap-4 px-10 py-12 rounded-2xl">
          <div class="flex-auto">
            <div class="text-4xl font-extrabold">Envie d'en savoir plus ?</div>
            <div
              class="text-xl text-primary-700 dark:text-primary-500 font-extrabold mt-1">
              Laissez votre contact et obtenez un rdv sur vos disponibilités
            </div>
          </div>

          <button color="primary" mat-raised-button type="button">
            Get Started
          </button>
          <button mat-stroked-button type="button">Learn more</button>
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
      label: 'Quick & easy integration',
      description:
        'Simple to set up and integrate with popular tools such as Angular, React, Vue, Symfony and Laravel. Supports single-page applications and hash-based routing.'
    },
    {
      icon: 'mat:check',
      label: 'Open and flexible API',
      description:
        'Simple to set up and integrate with popular tools and applications, our open APIs make the tracking process as easy and intuitive as possible.'
    },
    {
      icon: 'mat:check',
      label: 'Email financial reports',
      description:
        'Keep an eye on your traffic with weekly reports. Get pre-read articles up to a month before publication. Be able to pay for your own advertising, if necessary.'
    },
    {
      icon: 'mat:check',
      label: 'Flexible proxy scripts',
      description:
        'You can set up a proxy to change the file access rights for a specific folder, if the user has some special permissions which allows modification.'
    },
    {
      icon: 'mat:check',
      label: 'You own your data',
      description:
        'We only store the stuff you tell us to. And we take your privacy very seriously. Because of this, we only store the data we need to do our jobs for you. '
    },
    {
      icon: 'mat:check',
      label: 'Optimized workflows',
      description:
        'The best way to do things is not to do them. Automate things with our included Workflow-Manager. Enjoy easy creation of complex business operations.'
    },
    {
      icon: 'mat:check',
      label: 'Developer platform',
      description:
        'Dig deep into the code and watch the magic happen. You’ll also learn a bit about JavaScript’s event loop, closures, async functions, promises, arrays, strings and much more.'
    },
    {
      icon: 'mat:check',
      label: 'Third party integrations',
      description:
        "Connect third-party products like Amazon Echo, Sonos speakers, and games consoles. It's a good way to synchronize all your devices into a single app."
    }
  ];
}
