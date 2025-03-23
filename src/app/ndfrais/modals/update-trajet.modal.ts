import {
  Component,
  AfterViewInit,
  effect,
  Inject,
  OnInit
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { debounceTime, distinctUntilChanged, Subject, tap } from 'rxjs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { WORK_STATE } from 'src/app/models/day-app.model';
import { DatepickerDumb } from '../dumbs/datepicker.dumb';
import { Ticket } from '../models/ticket.model';
import { ServerService } from '../services/server.service';
import { Trajet } from '../models/trajet.model';
declare module 'leaflet' {
  namespace Routing {
    interface RoutingControlOptions {
      createMarker?: (i: number, waypoint: any, n: number) => L.Marker;
    }
  }
}
@Component({
  template: `<form>
      <div class="flex items-center" mat-dialog-title>
        <h2 class="headline m-0 flex-auto">Ticket</h2>

        <button
          class="text-secondary"
          mat-dialog-close
          mat-icon-button
          type="button">
          <mat-icon svgIcon="mat:close"></mat-icon>
        </button>
      </div>

      <mat-divider class="text-border"></mat-divider>

      <mat-dialog-content class="flex flex-col">
        <div id="map" style="height: 400px;" class="mb-3"></div>
        @if (currentTrajet) {
          <div class="flex flex-col sm:flex-row">
            <mat-form-field class="flex-auto">
              <mat-label>Nom</mat-label>
              <input
                cdkFocusInitial
                [(ngModel)]="currentTrajet.titre"
                name="nom"
                matInput />

              <mat-icon matIconPrefix svgIcon="mat:person"></mat-icon>
            </mat-form-field>

            <mat-form-field class="flex-auto">
              <mat-label>Date</mat-label>
              <div class="flex">
                <dumb-datepicker
                  #datepickerRefdateBegin
                  [(date)]="currentTrajet.dateTrajet"></dumb-datepicker>
                <input
                  [value]="
                    currentTrajet.dateTrajet | date: 'dd MMM yyyy' : '' : 'fr'
                  "
                  disabled
                  matInput
                  name="dateBegin" />
              </div>
            </mat-form-field>
          </div>

          <div class="flex flex-col sm:flex-row"></div>
        }
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close type="button">Annuler</button>
        <button
          color="primary"
          mat-flat-button
          type="submit"
          (click)="updateTicket()">
          Valider
        </button>
      </mat-dialog-actions>
    </form>

    <mat-menu #settingsMenu="matMenu" xPosition="before" yPosition="below">
      <button mat-menu-item>
        <mat-icon svgIcon="mat:print"></mat-icon>
        <span>Print</span>
      </button>

      <button mat-menu-item>
        <mat-icon svgIcon="mat:download"></mat-icon>
        <span>Export</span>
      </button>

      <button mat-menu-item>
        <mat-icon svgIcon="mat:delete"></mat-icon>
        <span>Delete</span>
      </button>
    </mat-menu> `,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    NgIf,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    DatepickerDumb
  ],
  styles: [
    `
      .text-green {
        color: green;
      }

      .text-red {
        color: red;
      }
      #map {
        width: 100%;
      }
    `
  ]
})
export class UpdateTrajetModal implements AfterViewInit {
  private map: L.Map | undefined;
  mapIsLoading = true;
  refresh = new Subject<void>();
  currentTrajet!: Trajet;
  currentTrajetSignal = this.server.currentTrajet;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { ticket: Ticket },
    private dialogRef: MatDialogRef<UpdateTrajetModal>,
    private server: ServerService
  ) {
    effect(() => {
      const currentTrajetSignal = this.currentTrajetSignal();
      if (currentTrajetSignal) {
        this.currentTrajet = currentTrajetSignal;
      }
    });
  }
  ngAfterViewInit(): void {
    this.initMap();
    requestAnimationFrame(() => {
      this.map?.invalidateSize();
    });
    // this.addRouting();
  }
  updateTicket() {
    this.dialogRef.close(this.currentTrajet);
  }

  private initMap(): void {
    this.map = L.map('map').setView([48, -2], 9);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    L.Icon.Default.prototype.options.iconUrl = './assets/_images/logo.png';
    this.mapIsLoading = false;
  }

  private addRouting(): void {
    if (this.map) {
      L.Routing.control({
        waypoints: [
          L.latLng(
            this.currentTrajet.depart.lat,
            this.currentTrajet.depart.lon
          ),
          L.latLng(this.currentTrajet.arrive.lat, this.currentTrajet.arrive.lon)
        ],

        createMarker: function (i: number, waypoint: any, n: number) {
          const marker = L.marker(waypoint.latLng, {
            draggable: false,
            icon: L.icon({
              iconUrl: './assets/_images/logo.png',
              iconSize: [60, 100],
              iconAnchor: [20, 40],
              popupAnchor: [0, -40],
              shadowUrl: './assets/_images/logo.png',
              shadowSize: [68, 95],
              shadowAnchor: [22, 94]
            })
          });
          //   const popupContent = `
          //       <strong>${visite.monumentList[i].nom}</strong><br>
          //       Description: ${
          //         visite.monumentList[i].description || 'Aucune description'
          //       }
          //     `;
          //   marker.bindPopup(popupContent).openPopup();

          return marker;
        },
        router: L.Routing.osrmv1({
          serviceUrl: 'https://routing.openstreetmap.de/routed-foot/route/v1',
          profile: 'foot' // Spécifie le mode de déplacement à pied
        }),
        show: false
      }).addTo(this.map);
    }
  }
}
