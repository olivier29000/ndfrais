import {
  Component,
  computed,
  effect,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AdminServerService } from './services/admin-server.service';
import { CalendarDumb } from '../dumbs/calendar/calendar.dumb';
import { CalendarNavSmart } from './smarts/calendar-nav.smart';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ContratUserApp } from 'src/app/models/contrat-employe.model';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { endOfWeek, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarNavDumb } from '../dumbs/calendar/calendar-nav.dumb';
import { AdminRecapSmart } from './smarts/admin-recap-smart';
import { SelectTagDumb } from '../dumbs/select-tag-list.dumb';
import { Tag } from 'src/app/models/tag.model';
import { CommonModule } from '@angular/common';
interface Display {
  label: string;
  visible: boolean;
}
@Component({
  template: `
    <vex-page-layout>
      <vex-page-layout-content class="-mt-6">
        <div class="card -mt-16" style="margin-top : 50px">
          <div
            class="bg-app-bar px-6 h-16 border-b sticky left-0 flex items-center">
            <span class="flex-1"></span>
            <button
              [matMenuTriggerFor]="columnFilterMenu"
              class="ml-4 flex-none"
              mat-icon-button
              matTooltip="Filter Columns"
              type="button">
              <mat-icon svgIcon="mat:filter_list"></mat-icon>
            </button>
          </div>
          <div class="px-6">
            <div id="recap" class="relative">
              <button
                class="absolute right-0 top-0 ml-4 flex-none"
                mat-icon-button
                matTooltip="Filter Columns"
                type="button"
                (click)="printSection('recap')">
                <mat-icon svgIcon="mat:print"></mat-icon>
              </button>
              <smart-admin-recap
                [contratList]="displayedContratList()"></smart-admin-recap>
            </div>
            @if (withFilter) {
              <div
                class="my-1 px-6 flex flex-col sm:flex-row items-stretch sm:items-start gap-6">
                <div class="me-3 flex flex-wrap m-3 ">
                  @for (contrat of displayedContratList(); track contrat) {
                    <div
                      class="flex mx-3"
                      (click)="toggleContratVisibility(contrat, $event)">
                      <div
                        class="card flex items-center mt-3 px-2 py-3"
                        style="width:130px"
                        [style.border]="
                          '3px solid ' +
                          convertHexToRgba(contrat.color || '#000000', 1)
                        ">
                        <button class="mat-menu-item block">
                          <mat-checkbox
                            [ngModel]="contrat.visible"
                            color="primary">
                          </mat-checkbox>
                        </button>
                        <div class="flex-auto">
                          <h4 class="body-2 m-0 leading-snug">
                            {{ contrat.poste }}
                          </h4>
                          <h5 class="text-secondary m-0 caption leading-none">
                            {{ contrat.userApp.nom }}
                            {{ contrat.userApp.prenom }}
                          </h5>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
              <div
                class="my-1 px-6 flex flex-col sm:flex-row items-stretch sm:items-start gap-6">
                <div class="me-3 flex flex-wrap m-3 ">
                  @for (contrat of undisplayedContratList(); track contrat) {
                    <div
                      class="flex mx-3"
                      (click)="toggleContratVisibility(contrat, $event)">
                      <div
                        class="card flex items-center mt-3 px-2 py-3"
                        style="width:130px"
                        [style.border]="
                          '3px solid ' +
                          convertHexToRgba(contrat.color || '#000000', 1)
                        ">
                        <button class="mat-menu-item block">
                          <mat-checkbox
                            [ngModel]="contrat.visible"
                            color="primary">
                          </mat-checkbox>
                        </button>
                        <div class="flex-auto">
                          <h4 class="body-2 m-0 leading-snug">
                            {{ contrat.poste }}
                          </h4>
                          <h5 class="text-secondary m-0 caption leading-none">
                            {{ contrat.userApp.nom }}
                            {{ contrat.userApp.prenom }}
                          </h5>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
              <div
                class="my-1 px-6 flex flex-col sm:flex-row items-stretch sm:items-start gap-6">
                <div class="me-3 flex flex-wrap m-3 ">
                  @for (tag of selectedTagList(); track tag) {
                    <a
                      (click)="unSelectTag(tag)"
                      tabindex="0"
                      class="label label-light m-1 p-2 items-center"
                      [ngStyle]="{ color: tag.color, border: '1px solid' }">
                      <button class="mat-menu-item block">
                        <mat-checkbox [checked]="true" color="primary">
                        </mat-checkbox>
                      </button>
                      {{ tag.title }}
                    </a>
                  }
                </div>
              </div>
              <div
                class="my-1 px-6 flex flex-col sm:flex-row items-stretch sm:items-start gap-6">
                <div class="me-3 flex flex-wrap m-3 ">
                  @for (tag of unselectedTagList(); track tag) {
                    <a
                      (click)="selectTag(tag)"
                      tabindex="0"
                      class="flex label label-light m-1 p-2 items-center"
                      [ngStyle]="{ color: tag.color, border: '1px solid' }">
                      <button class="mat-menu-item block">
                        <mat-checkbox [checked]="false" color="primary">
                        </mat-checkbox>
                      </button>
                      <span>
                        {{ tag.title }}
                      </span>
                    </a>
                  }
                </div>
              </div>
              <!-- <dumb-select-tag
                [availableTagList]="tagMap()"
                [selectedTagList]="selectedTagList()"
                (selectTagOutput)="selectTag($event)"
                [canCreateAdd]="false"
                (unSelectTagOutput)="unSelectTag($event)"></dumb-select-tag> -->

              <div class="flex justify-center my-5">
                <div class="text-center">
                  <small (click)="clickFilter()" tabindex="0"
                    >Masquer les filtres</small
                  >
                </div>
              </div>
            } @else {
              <div class="flex justify-center my-5">
                <div class="text-center">
                  <small (click)="clickFilter()" tabindex="0"
                    >Afficher les filtres</small
                  >
                </div>
              </div>
            }

            <div id="calendar" class="relative">
              <button
                class="absolute right-0 top-0 ml-4 flex-none"
                mat-icon-button
                matTooltip="Filter Columns"
                type="button"
                (click)="printSection('calendar')">
                <mat-icon svgIcon="mat:print"></mat-icon>
              </button>
              <dumb-calendar-nav
                [viewDate]="viewDate()"
                (viewDateOutput)="
                  calendarViewDateChange($event)
                "></dumb-calendar-nav>

              <app-calendar
                [viewDate]="viewDate()"
                [events]="allEventList()"></app-calendar>
            </div>
          </div></div></vex-page-layout-content
    ></vex-page-layout>
    <mat-menu #columnFilterMenu="matMenu" xPosition="before" yPosition="below">
      @for (contrat of availableContratList(); track contrat) {
        <button class="mat-menu-item block">
          <mat-checkbox
            (click)="toggleContratVisibility(contrat, $event)"
            [ngModel]="contrat.visible"
            color="primary">
            {{ contrat.poste }}-{{ contrat.userApp.nom }}
            {{ contrat.userApp.prenom }}
          </mat-checkbox>
        </button>
      }
    </mat-menu>
  `,
  animations: [],
  styles: [``],
  standalone: true,
  imports: [
    SelectTagDumb,
    CommonModule,
    AdminRecapSmart,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    CalendarDumb,
    CalendarNavDumb,
    MatMenuModule,
    MatIconModule,
    MatCheckboxModule,
    FormsModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatTabsModule
  ]
})
export class AdminPlanningsPage implements OnInit {
  //currentDateRecap
  withFilter = false;
  clickFilter(): void {
    this.withFilter = !this.withFilter;
  }
  printSection(sectionId: string) {
    const printContent = document.getElementById(sectionId);
    if (!printContent) {
      console.error('Élément introuvable !');
      return;
    }

    const originalContent = document.body.innerHTML;

    // Remplace le contenu du `body` par uniquement la section à imprimer
    document.body.innerHTML = printContent.innerHTML;

    window.print();

    // Restaurer le contenu initial après l'impression
    document.body.innerHTML = originalContent;
  }

  stateEvents: 'prevu' | 'declare' = 'prevu';
  viewDate = this.adminServer.currentDateRecap;
  calendarViewDateChange(date: Date) {
    this.viewDate.set(date);
  }
  tagMap = this.adminServer.tagMap;
  selectedTagList: WritableSignal<Tag[]> = signal([]);
  unselectedTagList = computed(() =>
    Object.values(this.tagMap())
      .flat()
      .filter((tag) => {
        return !this.selectedTagList().some((t) => t.id === tag.id);
      })
  );
  ngOnInit(): void {
    this.adminServer.getEventTagMap();
  }

  selectTag(tag: Tag): void {
    const selectedTagList = this.selectedTagList();
    if (!selectedTagList.some((t) => t.id === tag.id)) {
      this.selectedTagList.set(selectedTagList.concat(tag));
    }
  }

  unSelectTag(tag: Tag): void {
    this.selectedTagList.set(
      this.selectedTagList().filter((t) => t.id !== tag.id)
    );
  }

  availableContratList: WritableSignal<
    (ContratUserApp & { visible: boolean })[]
  > = signal([]);
  displayedContratList = computed(() => {
    return this.availableContratList().filter((c) => c.visible);
  });
  undisplayedContratList = computed(() => {
    return this.availableContratList().filter((c) => !c.visible);
  });
  allEventList = computed(() => {
    let allEventList = this.adminServer.allEventList();
    const selectedTagList = this.selectedTagList();
    if (selectedTagList.length > 0) {
      allEventList = allEventList.filter((event) =>
        selectedTagList.some(
          (tag) =>
            event.meta?.tagList &&
            event.meta.tagList.some((t) => t.id === tag.id)
        )
      );
    }
    return allEventList.filter((e) =>
      this.displayedContratList().some(
        (c) => c.id && c.id === e.meta?.contratUserApp?.id
      )
    );
  });
  constructor(private adminServer: AdminServerService) {
    effect(
      () =>
        this.availableContratList.set(
          this.adminServer
            .adminAllContratList()
            .map((c) => ({ ...c, visible: true }))
        ),
      { allowSignalWrites: true }
    );
    effect(
      () => {
        const viewDate = this.viewDate();
        this.adminServer.getAllEventByContratListAndPeriod(
          startOfWeek(viewDate, { locale: fr }),
          endOfWeek(viewDate, { locale: fr })
        );
      },
      { allowSignalWrites: true }
    );
    effect(
      () => {
        const currentDateRecap = this.adminServer.currentDateRecap();
        if (currentDateRecap) {
          this.adminServer.getRecap(currentDateRecap);
        }
      },
      { allowSignalWrites: true }
    );
  }

  toggleContratVisibility(
    contrat: ContratUserApp & { visible: boolean },
    event: Event
  ) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.availableContratList.set([
      ...this.availableContratList().map((c) =>
        c.id === contrat.id ? { ...c, visible: !c.visible } : c
      )
    ]);
  }

  convertHexToRgba(colorHexa: string, opacity: number): string {
    const hex = colorHexa.replace('#', '');
    // Convertir en valeurs RGB
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    // Retourner le format rgba
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
}
