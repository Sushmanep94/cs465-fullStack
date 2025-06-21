

import { Injectable, Inject } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripDataService } from './trip-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authResp: AuthResponse = { token: '' };

  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripDataService: TripDataService
  ) {}

  // Get token from localStorage
  public getToken(): string {
    const token = this.storage.getItem('travlr-token');
    return token ? token : '';
  }

  // Save token to localStorage
  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  // Logout by clearing token
  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  // Check if token is present and not expired
  public isLoggedIn(): boolean {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
      } catch {
        return false;
      }
    }
    return false;
  }

  // Return current user info from JWT payload
  public getCurrentUser(): User {
    const token = this.getToken();
    const { email, name } = JSON.parse(atob(token.split('.')[1]));
    return { email, name } as User;
  }

  // Perform login and save token
  public login(user: User, passwd: string): void {
    this.tripDataService.login(user, passwd).subscribe({
      next: (value: AuthResponse) => {
        if (value?.token) {
          this.authResp = value;
          this.saveToken(value.token);
        }
      },
      error: (error: any) => {
        console.error('Login error:', error);
      }
    });
  }

  // Perform registration and save token
  public register(user: User, passwd: string): void {
    this.tripDataService.register(user, passwd).subscribe({
      next: (value: AuthResponse) => {
        if (value?.token) {
          this.authResp = value;
          this.saveToken(value.token);
        }
      },
      error: (error: any) => {
        console.error('Register error:', error);
      }
    });
  }
}
