import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HomeStateService {
  showExtraButtons = false;
  showLogoutButton = false;
  constructor() {}
}
