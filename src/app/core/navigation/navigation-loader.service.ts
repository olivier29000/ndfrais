import { Injectable } from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { NavigationItem } from './navigation-item.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationLoaderService {
  private readonly _items: BehaviorSubject<NavigationItem[]> =
    new BehaviorSubject<NavigationItem[]>([]);

  get items$(): Observable<NavigationItem[]> {
    return this._items.asObservable();
  }

  constructor(private readonly layoutService: VexLayoutService) {
    this.loadNavigation();
  }

  loadNavigation(): void {
    this._items.next([
      {
        type: 'subheading',
        label: 'Employé',
        children: [
          {
            type: 'link',
            label: 'Planning',
            route: '/',
            icon: 'mat:calendar_today',
            routerLinkActiveOptions: { exact: true }
          },
          {
            type: 'link',
            label: 'Congés',
            route: '/conges',
            icon: 'mat:card_travel',
            routerLinkActiveOptions: { exact: true }
          }
        ]
      },
      {
        type: 'subheading',
        label: 'Manager',
        children: [
          {
            type: 'link',
            label: 'Mes employés',
            route: '/manager/mes-employes',
            icon: 'mat:people',
            routerLinkActiveOptions: { exact: true }
          },
          {
            type: 'link',
            label: 'Validations',
            route: '/manager/notifications',
            icon: 'mat:thumbs_up_down',
            routerLinkActiveOptions: { exact: true }
          }
        ]
      },
      {
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
            type: 'link',
            label: 'Employés',
            route: '/admin/employes',
            icon: 'mat:people',
            routerLinkActiveOptions: { exact: true }
          },
          {
            type: 'link',
            label: 'Organigramme',
            route: '/admin/organigramme',
            icon: 'mat:bubble_chart',
            routerLinkActiveOptions: { exact: true }
          }
        ]
      }
    ]);
  }
}
