import { effect, Injectable, signal, WritableSignal } from '@angular/core';
import { DayApp } from '../models/day-app.model';
import { DayBdd } from '../models/day-bdd.model';
import { UserApp } from '../models/user.model';
import {
  NavigationItem,
  NavigationSubheading
} from '../core/navigation/navigation-item.interface';
import { NavigationService } from '../core/navigation/navigation.service';
import { Role, UserConnected } from '../models/user-connected.model';
import { ContratUserApp } from '../models/contrat-employe.model';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  constructor(private readonly navigationService: NavigationService) {
    effect(() => {
      const userConnected = this.userConnected();
      if (userConnected) {
        const navigationItemList: NavigationItem[] = [];
        if (userConnected.roleList.includes(Role.ROLE_USER)) {
          navigationItemList.push(navigationItemUser);
        }
        if (userConnected.roleList.includes(Role.ROLE_MANAGER)) {
          navigationItemList.push(navigationItemManager);
        }
        if (userConnected.roleList.includes(Role.ROLE_ADMIN)) {
          const userAppList = this.userAppList();
          navigationItemList.push({
            ...navigationItemAdmin,
            children: navigationItemAdmin.children.map((child) => {
              if (child.type === 'dropdown' && child.label === 'Employés') {
                return {
                  ...child,
                  children: userAppList.map((userApp) => ({
                    type: 'link',
                    label: userApp.nomPrenom,
                    route: '/admin/employes/' + userApp.id,
                    routerLinkActiveOptions: { exact: false }
                  }))
                };
              } else {
                return child;
              }
            })
          });
        }
        this.navigationService.loadNavigation(navigationItemList);
      }
    });
  }

  adminContratList: WritableSignal<ContratUserApp[]> = signal([]);
  dayAppList: WritableSignal<DayApp[]> = signal([]);
  adminAllContratList: WritableSignal<ContratUserApp[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(false);
  navigationItemList: WritableSignal<NavigationItem[]> = signal([]);
  userConnected: WritableSignal<UserConnected | undefined> = signal(undefined);
  currentYear: WritableSignal<number> = signal(2025);
  dayListBdd: WritableSignal<DayBdd[]> = signal([]);
  weekendDays: WritableSignal<number[]> = signal([0, 6]);
  ferieList: WritableSignal<Date[]> = signal([
    new Date(2025, 2, 4),
    new Date(2025, 5, 4),
    new Date(2025, 6, 4)
  ]);

  userAppList: WritableSignal<UserApp[]> = signal([]);
}

const navigationItemUser: NavigationSubheading = {
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
};
const navigationItemManager: NavigationSubheading = {
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
};
const navigationItemAdmin: NavigationSubheading = {
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
      label: 'Employés',
      icon: 'mat:people',
      children: []
    },
    {
      type: 'link',
      label: 'Organigramme',
      route: '/admin/organigramme',
      icon: 'mat:bubble_chart',
      routerLinkActiveOptions: { exact: true }
    }
  ]
};

export const UserBddList = [
  {
    id: 0,
    imageBase64: 'assets/img/avatars/20.jpg',
    nom: 'Dejesus',
    prenom: 'Chang',
    telephone: '+32 (818) 580-3557',
    email: 'dejesus.chang@yourcompany.biz',
    notes: '',
    contratManager: undefined
  },
  {
    id: 1,
    imageBase64: 'assets/img/avatars/1.jpg',
    nom: 'Short',
    prenom: 'Lowe',
    telephone: '+11 (977) 574-3636',
    email: 'short.lowe@yourcompany.ca',
    notes: '',
    contratManager: {
      id: 0,
      imageBase64: 'assets/img/avatars/20.jpg',
      nom: 'Dejesus',
      prenom: 'Chang',
      telephone: '+32 (818) 580-3557',
      email: 'dejesus.chang@yourcompany.biz',
      notes: ''
    }
  },
  {
    id: 2,
    imageBase64: 'assets/img/avatars/2.jpg',
    nom: 'Antoinette',
    prenom: 'Carson',
    telephone: '+49 (969) 505-3323',
    email: 'antoinette.carson@yourcompany.net',
    notes: '',
    contratManager: {
      id: 0,
      imageBase64: 'assets/img/avatars/20.jpg',
      nom: 'Dejesus',
      prenom: 'Chang',
      telephone: '+32 (818) 580-3557',
      email: 'dejesus.chang@yourcompany.biz',
      notes: ''
    }
  },
  {
    id: 3,
    imageBase64: 'assets/img/avatars/3.jpg',
    nom: 'Lynnette',
    prenom: 'Adkins',
    telephone: '+48 (836) 545-3237',
    email: 'lynnette.adkins@yourcompany.info',
    notes: '',
    contratManager: {
      id: 1,
      imageBase64: 'assets/img/avatars/1.jpg',
      nom: 'Short',
      prenom: 'Lowe',
      telephone: '+11 (977) 574-3636',
      email: 'short.lowe@yourcompany.ca',
      notes: ''
    }
  },
  {
    id: 4,
    imageBase64: 'assets/img/avatars/4.jpg',
    nom: 'Patrica',
    prenom: 'Good',
    telephone: '+36 (955) 485-3652',
    email: 'patrica.good@yourcompany.me',
    notes: '',
    contratManager: {
      id: 1,
      imageBase64: 'assets/img/avatars/1.jpg',
      nom: 'Short',
      prenom: 'Lowe',
      telephone: '+11 (977) 574-3636',
      email: 'short.lowe@yourcompany.ca',
      notes: ''
    }
  },
  {
    id: 5,
    imageBase64: 'assets/img/avatars/5.jpg',
    nom: 'Kane',
    prenom: 'Koch',
    telephone: '+35 (983) 587-3423',
    email: 'kane.koch@yourcompany.org',
    notes: '',
    contratManager: {
      id: 3,
      imageBase64: 'assets/img/avatars/3.jpg',
      nom: 'Lynnette',
      prenom: 'Adkins',
      telephone: '+48 (836) 545-3237',
      email: 'lynnette.adkins@yourcompany.info',
      notes: ''
    }
  },
  {
    id: 6,
    imageBase64: 'assets/img/avatars/6.jpg',
    nom: 'Donovan',
    prenom: 'Gonzalez',
    telephone: '+47 (914) 469-3270',
    email: 'donovan.gonzalez@yourcompany.tv',
    notes: '',
    contratManager: {
      id: 0,
      imageBase64: 'assets/img/avatars/20.jpg',
      nom: 'Dejesus',
      prenom: 'Chang',
      telephone: '+32 (818) 580-3557',
      email: 'dejesus.chang@yourcompany.biz',
      notes: ''
    }
  },
  {
    id: 7,
    imageBase64: 'assets/img/avatars/7.jpg',
    nom: 'Sabrina',
    prenom: 'Logan',
    telephone: '+37 (896) 474-3143',
    email: 'sabrina.logan@yourcompany.co.uk',
    notes: '',
    contratManager: {
      id: 6,
      imageBase64: 'assets/img/avatars/6.jpg',
      nom: 'Donovan',
      prenom: 'Gonzalez',
      telephone: '+47 (914) 469-3270',
      email: 'donovan.gonzalez@yourcompany.tv',
      notes: ''
    }
  },
  {
    id: 8,
    imageBase64: 'assets/img/avatars/8.jpg',
    nom: 'Estela',
    prenom: 'Jordan',
    telephone: '+2 (993) 445-3626',
    email: 'estela.jordan@yourcompany.name',
    notes: '',
    contratManager: {
      id: 7,
      imageBase64: 'assets/img/avatars/7.jpg',
      nom: 'Sabrina',
      prenom: 'Logan',
      telephone: '+37 (896) 474-3143',
      email: 'sabrina.logan@yourcompany.co.uk',
      notes: ''
    }
  },
  {
    id: 9,
    imageBase64: 'assets/img/avatars/9.jpg',
    nom: 'Rosanna',
    prenom: 'Cross',
    telephone: '+12 (877) 563-2737',
    email: 'rosanna.cross@yourcompany.biz',
    notes: '',
    contratManager: {
      id: 8,
      imageBase64: 'assets/img/avatars/8.jpg',
      nom: 'Estela',
      prenom: 'Jordan',
      telephone: '+2 (993) 445-3626',
      email: 'estela.jordan@yourcompany.name',
      notes: ''
    }
  },
  {
    id: 10,
    imageBase64: 'assets/img/avatars/10.jpg',
    nom: 'Mary',
    prenom: 'Jane',
    telephone: '+15 (877) 334-2231',
    email: 'Mary.jane@yourcompany.biz',
    notes: '',
    contratManager: {
      id: 8,
      imageBase64: 'assets/img/avatars/8.jpg',
      nom: 'Estela',
      prenom: 'Jordan',
      telephone: '+2 (993) 445-3626',
      email: 'estela.jordan@yourcompany.name',
      notes: ''
    }
  }
];
