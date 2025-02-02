import { Injectable } from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import {
  NavigationDropdown,
  NavigationItem,
  NavigationLink
} from './navigation-item.interface';
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

  constructor(private readonly layoutService: VexLayoutService) {}

  addItem(itemListToAdd: NavigationLink[], itemWhereAdd: NavigationItem): void {
    this._items.next(
      this._items.getValue().map((item) => {
        if (item.label === itemWhereAdd.label && item.type === 'dropdown') {
          item.children = itemListToAdd;
        }
        return item;
      })
    );
  }

  loadNavigation(navigationItemList: NavigationItem[]): void {
    this._items.next(navigationItemList);
  }
}
