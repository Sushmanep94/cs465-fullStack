import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Trip } from '../models/trip';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { BROWSER_STORAGE } from '../storage';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {
  baseUrl = 'http://localhost:3000/api';
  url = 'http://localhost:3000/api/trips';

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}

  // Helper to include JWT in protected requests
  private getAuthHeaders() {
    const token = this.storage.getItem('travlr-token') || '';
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  // Get all trips (public)
  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.url);
  }

  // Get a single trip (public)
  getTrip(tripCode: string): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.url + '/' + tripCode);
  }

  // Add a trip (protected)
  addTrip(trip: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.url, trip, this.getAuthHeaders());
  }

  // Update a trip (protected)
  updateTrip(formData: Trip): Observable<Trip[]> {
    return this.http.put<Trip[]>(this.url + '/' + formData.code, formData, this.getAuthHeaders());
  }

  // Optional: Delete a trip (protected)
  deleteTrip(code: string): Observable<any> {
    return this.http.delete(this.url + '/' + code, this.getAuthHeaders());
  }

  // Call to /login endpoint, returns JWT
  login(user: User, passwd: string): Observable<AuthResponse> {
    return this.handleAuthAPICall('login', user, passwd);
  }

  // Call to /register endpoint, creates user and returns JWT
  register(user: User, passwd: string): Observable<AuthResponse> {
    return this.handleAuthAPICall('register', user, passwd);
  }

  // Shared method for login and register
  private handleAuthAPICall(endpoint: string, user: User, passwd: string): Observable<AuthResponse> {
    const formData = {
      name: user.name,
      email: user.email,
      password: passwd
    };
    return this.http.post<AuthResponse>(`${this.baseUrl}/${endpoint}`, formData);
  }
}
