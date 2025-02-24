import { Injectable, signal, WritableSignal } from '@angular/core';
import { WEEK_STATE, DayApp, WORK_STATE } from '../models/day-app.model';
import { DayBdd } from '../models/day-bdd.model';
import { navigationItemManager, StoreService } from './store.service';
import { NavigationService } from '../core/navigation/navigation.service';
import {
  NavigationItem,
  NavigationLink,
  NavigationSubheading
} from '../core/navigation/navigation-item.interface';
import { ContratUserApp } from '../models/contrat-employe.model';
import { UserApp } from '../models/user.model';
import { subMinutes } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor(
    private store: StoreService,
    private readonly navigationService: NavigationService
  ) {}

  userConnected = this.store.userConnected;

  changeIsLoading(value: boolean): void {
    this.store.isLoading.set(value);
  }

  getWeekState(
    date: Date,
    ferieList: Date[],
    weekendDays: number[]
  ): WEEK_STATE {
    if (ferieList.some((d) => d.getTime() === date.getTime())) {
      return WEEK_STATE.FERIE;
    }
    if (weekendDays.includes(date.getDay())) {
      return WEEK_STATE.WEEK_END;
    }
    return WEEK_STATE.NORMAL;
  }

  loadNavigation(navigationItemList: NavigationItem[]): void {
    this.navigationService.loadNavigation(navigationItemList);
  }

  pushManagerNbActionList(nbActionList: number): void {
    this.store.navigationItemList.update((navigationItemList) => {
      return navigationItemList.map((nav) => {
        if (nav.label === navigationItemManager.label) {
          return {
            ...nav,
            children: navigationItemManager.children.map((c) => {
              if (c.label === 'Validations') {
                return {
                  ...c,
                  badge: {
                    value: nbActionList > 0 ? nbActionList + '' : '',
                    bgClass: 'bg-green-600',
                    textClass: 'text-white'
                  }
                };
              }

              return c;
            })
          };
        } else {
          return nav;
        }
      });
    });
    this.store.navigationItemList();
  }

  pushChildrenAdmin(
    userAppList: (UserApp & { nbAction: number })[],
    nbActionList: number
  ): void {
    this.store.navigationItemList.update((navigationItemList) => {
      return navigationItemList.map((nav) => {
        if (nav.label === navigationItemAdmin.label) {
          return {
            ...nav,
            children: navigationItemAdmin.children.map((c) => {
              if (c.label === 'Contrats') {
                return {
                  ...c,
                  children: userAppList.map((userApp) => ({
                    type: 'link',
                    label: userApp.nomPrenom,
                    route: '/admin/contrats/' + userApp.id,
                    routerLinkActiveOptions: { exact: false },
                    badge: {
                      value: userApp.nbAction > 0 ? userApp.nbAction + '' : '',
                      bgClass: 'bg-green-600',
                      textClass: 'text-white'
                    }
                  }))
                };
              } else if (c.label === 'Congés' && c.type === 'dropdown') {
                const nbActionListStr =
                  nbActionList > 0 ? nbActionList + '' : '';
                return {
                  ...c,
                  children: c.children.map((sub) => {
                    if (sub.label === 'Validations') {
                      return {
                        ...sub,
                        badge: {
                          value: nbActionListStr,
                          bgClass: 'bg-green-600',
                          textClass: 'text-white'
                        }
                      };
                    }
                    return sub;
                  }),
                  badge: {
                    value: nbActionListStr,
                    bgClass: 'bg-green-600',
                    textClass: 'text-white'
                  }
                };
              }
              return c;
            })
          };
        } else {
          return nav;
        }
      });
    });
  }

  pushChildrenUser(contratUserAppList: ContratUserApp[]): void {
    this.store.navigationItemList.update((navigationItemList) => {
      const navContratList: NavigationItem[] = contratUserAppList.map(
        (userAppContrat) => {
          const item: NavigationItem = {
            type: 'subheading',
            label: userAppContrat.poste,
            children: [
              {
                type: 'link',
                label: 'Congés',
                route: '/user/conges/' + userAppContrat.id,
                icon: 'mat:card_travel',
                routerLinkActiveOptions: { exact: true }
              }
            ]
          };
          return item;
        }
      );
      return navContratList.concat(navigationItemList);
    });
  }

  addItem(itemListToAdd: NavigationLink[], itemWhereAdd: NavigationItem): void {
    this.navigationService.addItem(itemListToAdd, itemWhereAdd);
  }

  getWorkState(
    date: Date,
    ferieList: Date[],
    weekendDays: number[],
    dayListBdd: DayBdd[]
  ): WORK_STATE {
    if (ferieList.some((d) => d.getTime() === date.getTime())) {
      return WORK_STATE.REPOS;
    }
    if (weekendDays.includes(date.getDay())) {
      return WORK_STATE.REPOS;
    }
    return WORK_STATE.TRAVAIL;
  }

  getStart(start: Date): Date {
    return subMinutes(new Date(start), new Date().getTimezoneOffset());
  }

  getEnd(end: Date | undefined): Date {
    return subMinutes(
      end ? new Date(end) : new Date(),
      new Date().getTimezoneOffset()
    );
  }

  getDateString(date: Date): string {
    return (
      (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
      '-' +
      (date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      '-' +
      date.getFullYear()
    );
  }
}

export const navigationItemAdmin: NavigationSubheading = {
  type: 'subheading',
  label: 'Admin',
  children: [
    {
      type: 'link',
      label: 'Users',
      route: '/admin/users',
      icon: 'mat:person_pin',
      routerLinkActiveOptions: { exact: true }
    },
    {
      type: 'dropdown',
      label: 'Contrats',
      icon: 'mat:people',
      children: []
    },
    {
      type: 'dropdown',
      label: 'Congés',
      icon: 'mat:people',
      children: [
        {
          type: 'link',
          label: 'Recap',
          route: '/admin/recap',
          icon: 'mat:assignment',
          routerLinkActiveOptions: { exact: true }
        },
        {
          type: 'link',
          label: 'Validations',
          route: '/admin/validations',
          icon: 'mat:thumbs_up_down',
          badge: {
            value: '',
            bgClass: 'bg-green-600',
            textClass: 'text-white'
          },
          routerLinkActiveOptions: { exact: true }
        },
        {
          type: 'link',
          label: 'Historique',
          route: '/admin/historique',
          icon: 'mat:account_balance',
          routerLinkActiveOptions: { exact: true }
        }
      ]
    },
    {
      type: 'link',
      label: 'Plannings',
      route: '/admin/plannings',
      icon: 'mat:assignment',
      routerLinkActiveOptions: { exact: true }
    },
    {
      type: 'link',
      label: 'Abonnement',
      route: '/admin/abonnement',
      icon: 'mat:add_shopping_cart',
      routerLinkActiveOptions: { exact: true }
    }
  ]
};
