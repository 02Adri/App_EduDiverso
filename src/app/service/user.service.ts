import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppUser, Role } from '../models/library.models';

const USER_KEY = 'virtual_library_user_v1';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser?: AppUser;
  private user$ = new BehaviorSubject<AppUser | undefined>(undefined);

  constructor() {
    this.load();
  }

  private save() {
    localStorage.setItem(USER_KEY, JSON.stringify(this.currentUser || null));
  }

  private load() {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      this.currentUser = undefined;
      this.user$.next(undefined);
      return;
    }
    try {
      this.currentUser = JSON.parse(raw) as AppUser;
      this.user$.next(this.currentUser);
    } catch {
      this.currentUser = undefined;
      this.user$.next(undefined);
    }
  }

  login(name: string, role: Role) {
    this.currentUser = { name, role };
    this.save();
    this.user$.next(this.currentUser);
  }

  logout() {
    this.currentUser = undefined;
    this.save();
    this.user$.next(undefined);
  }

  setUser(user: AppUser) {
    this.currentUser = user;
    this.save();
    this.user$.next(this.currentUser);
  }

  getUser(): AppUser | undefined {
    return this.currentUser;
  }

  getRole(): Role | 'invitado' {
    return this.currentUser?.role ?? 'invitado';
  }

  isFacilitator(): boolean {
    return this.getRole() === 'facilitador';
  }

  // 👉 observable para que otros componentes/directivas reaccionen
  userChanges(): Observable<AppUser | undefined> {
    return this.user$.asObservable();
  }
}
