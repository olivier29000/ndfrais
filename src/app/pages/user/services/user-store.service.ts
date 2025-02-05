import { Injectable, signal, WritableSignal } from '@angular/core';
import { DayApp } from 'src/app/models/day-app.model';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  constructor() {}
  userDayAppList: WritableSignal<DayApp[]> = signal([]);
}
