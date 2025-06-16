import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Trip } from '../models/trip';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {

  private apiUrl = 'http://localhost:3000/api/trips';  // base API URL

  constructor(private http: HttpClient) { }

  getTrip(tripCode: string): Observable<Trip[]> {
    //console.log('Inside TripDataService::getTrips');
    return this.http.get<Trip[]>(this.apiUrl + '/' + tripCode);
  }

  getTrips(): Observable<Trip[]> {
    //console.log('Inside TripDataService::getTrips');
    return this.http.get<Trip[]>(this.apiUrl);
    //this.url + '/' + tripCode);
  }
  addTrip(trip: Trip): Observable<Trip> {
    //console.log('Inside TripDataService::getTrips');
    return this.http.post<Trip>(this.apiUrl, trip);
    //this.url +'/' + formData.code, formData);
  }

  updateTrip(formData: Trip): Observable<Trip[]> {
    //console.log('Inside TripDataService::addTrips');
    return this.http.put<Trip[]>(this.apiUrl +'/' + formData.code, formData);
  }
}
