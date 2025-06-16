import { Injectable } from '@angular/core';
import { Trip } from './models/trip';

@Injectable({
  providedIn: 'root'
})
export class TripData {
  private selectedTrip: Trip | null = null;

  constructor() {}

  setTrip(trip: Trip): void {
    this.selectedTrip = trip;
  }

  getTrip(): Trip | null {
    return this.selectedTrip;
  }

  clearTrip(): void {
    this.selectedTrip = null;
  }
}
