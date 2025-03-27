import {
  Component,
  AfterViewInit,
  effect,
  Inject,
  OnInit,
  signal,
  WritableSignal,
  computed
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
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subject,
  tap
} from 'rxjs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { WORK_STATE } from 'src/app/models/day-app.model';
import { DatepickerDumb } from '../dumbs/datepicker.dumb';
import { ServerService } from '../services/server.service';
import { Position, Trajet } from '../models/trajet.model';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
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
      <h2 class="headline m-0 flex-auto">Trajet</h2>

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
        <div class="flex flex-col sm:flex-row mt-3">
          <mat-form-field class="flex-auto">
            <mat-label>Titre</mat-label>
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
        <div class="flex flex-col sm:flex-row">
          <mat-form-field class="flex-auto">
            <mat-label>Départ</mat-label>
            <input
              [formControl]="depart"
              [value]="depart"
              name="nom"
              matInput />
            @if (departFound()) {
              <mat-hint class="text-green">{{ departSignal() }}</mat-hint>
            } @else if (departFound() === false) {
              <mat-hint class="text-red">Adresse non trouvée</mat-hint>
            }
            <mat-icon matIconPrefix svgIcon="mat:person"></mat-icon>
          </mat-form-field>

          <mat-form-field class="flex-auto">
            <mat-label>Arrivée</mat-label>
            <input
              [formControl]="arrive"
              [value]="arrive"
              name="nom"
              matInput />
            @if (arriveFound()) {
              <mat-hint class="text-green">{{ arriveSignal() }}</mat-hint>
            } @else if (arriveFound() === false) {
              <mat-hint class="text-red">Adresse non trouvée</mat-hint>
            }
            <mat-icon matIconPrefix svgIcon="mat:person"></mat-icon>
          </mat-form-field>
        </div>
        <div class="flex flex-col sm:flex-row"></div>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close type="button">Annuler</button>
      <button
        color="warn"
        mat-flat-button
        type="button"
        (click)="deleteTrajet()">
        Supprimer
      </button>
      <button
        color="primary"
        mat-flat-button
        type="submit"
        [disabled]="canValid() === false"
        (click)="validTrajet()">
        Valider
      </button>
    </mat-dialog-actions>
  </form> `,
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
  markers: L.Marker[] = [];
  private routingControl?: L.Routing.Control;
  depart = new FormControl('');
  departFound: WritableSignal<boolean | undefined> = signal(undefined);
  departSignal: WritableSignal<string | undefined> = signal(undefined);
  arrive = new FormControl('');
  arriveFound: WritableSignal<boolean | undefined> = signal(undefined);
  arriveSignal: WritableSignal<string | undefined> = signal(undefined);
  canValid = computed(() => {
    return this.departFound() === true && this.arriveFound() === true;
  });
  constructor(
    private dialogRef: MatDialogRef<UpdateTrajetModal>,
    private server: ServerService,
    private http: HttpClient
  ) {
    effect(
      () => {
        const currentTrajetSignal = this.currentTrajetSignal();
        if (currentTrajetSignal) {
          this.currentTrajet = currentTrajetSignal;
          if (this.currentTrajet.id) {
            this.depart = new FormControl(this.currentTrajet.depart.displayed);
            this.arrive = new FormControl(this.currentTrajet.arrive.displayed);
            this.departFound.set(true);
            this.arriveFound.set(true);
            this.departSignal.set(this.currentTrajet.depart.displayed);
            this.arriveSignal.set(this.currentTrajet.arrive.displayed);
          }
        }
      },
      { allowSignalWrites: true }
    );

    effect(() => {
      const depart = this.departSignal();
      const arrive = this.arriveSignal();
      if (depart) {
        this.currentTrajet.depart.displayed = depart;
      }
      if (arrive) {
        this.currentTrajet.arrive.displayed = arrive;
      }
      if (depart && arrive) {
        this.addRouting(this.currentTrajet.depart, this.currentTrajet.arrive);
      }
    });

    effect(() => {
      this.depart.valueChanges
        .pipe(debounceTime(1000), distinctUntilChanged())
        .subscribe((depart) => {
          if (depart) {
            this.departSignal.set(undefined);
            this.departFound.set(undefined);
            this.getCoordsFromAddress(depart).subscribe((res) => {
              this.markers.forEach((m) => this.map?.removeLayer(m));
              this.markers.length = 0; // Vide le tableau
              if (res.length > 0 && this.map) {
                this.departSignal.set(res[0].display_name);
                this.departFound.set(true);

                this.markers.push(
                  L.marker([res[0].lat, res[0].lon]).addTo(this.map)
                );
                this.currentTrajet.depart.lat = res[0].lat;
                this.currentTrajet.depart.lon = res[0].lon;
              } else {
                this.departFound.set(false);
              }
              if (this.arriveSignal() !== undefined && this.map) {
                this.markers.push(
                  L.marker([
                    this.currentTrajet.arrive.lat,
                    this.currentTrajet.arrive.lon
                  ]).addTo(this.map)
                );
              }
            });
          }
        });
    });

    effect(() => {
      this.arrive.valueChanges
        .pipe(debounceTime(1000), distinctUntilChanged())
        .subscribe((arrive) => {
          if (arrive) {
            this.arriveSignal.set(undefined);
            this.arriveFound.set(undefined);
            this.getCoordsFromAddress(arrive).subscribe((res) => {
              console.log(res);
              this.markers.forEach((m) => this.map?.removeLayer(m));
              this.markers.length = 0; // Vide le tableau
              if (res.length > 0 && this.map) {
                this.arriveSignal.set(res[0].display_name);
                this.arriveFound.set(true);

                this.markers.push(
                  L.marker([res[0].lat, res[0].lon]).addTo(this.map)
                );
                this.currentTrajet.arrive.lat = res[0].lat;
                this.currentTrajet.arrive.lon = res[0].lon;
              } else {
                this.arriveFound.set(false);
              }
              if (this.departSignal() !== undefined && this.map) {
                this.markers.push(
                  L.marker([
                    this.currentTrajet.depart.lat,
                    this.currentTrajet.depart.lon
                  ]).addTo(this.map)
                );
              }
            });
          }
        });
    });
  }
  ngAfterViewInit(): void {
    this.initMap();
    requestAnimationFrame(() => {
      this.map?.invalidateSize();
    });
    // this.addRouting();
  }
  validTrajet() {
    this.dialogRef.close(this.currentTrajet);
  }
  deleteTrajet() {
    Swal.fire({
      title: 'Etes vous sûr de vouloir supprimer ce trajet ?',
      text: 'Vous ne pourrez pas revenir en arrière!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'Annuler',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer'
    }).then((result) => {
      if (result.isConfirmed) {
        this.server.deleteTrajet(this.currentTrajet);
        this.dialogRef.close();
      }
    });
  }
  private initMap(): void {
    this.map = L.map('map').setView([48, -2], 9);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.mapIsLoading = false;
  }

  private addRouting(depart: Position, arrive: Position): void {
    if (this.map) {
      if (this.routingControl) {
        this.map.removeControl(this.routingControl);
      }
      this.routingControl = L.Routing.control({
        waypoints: [
          L.latLng(depart.lat, depart.lon),
          L.latLng(arrive.lat, arrive.lon)
        ],
        router: L.Routing.osrmv1({
          serviceUrl: 'https://routing.openstreetmap.de/routed-car/route/v1',
          profile: 'car' // Spécifie le mode de déplacement à pied
        }),
        show: false
      }).addTo(this.map);

      this.routingControl.on('routesfound', (e: any) => {
        const route = e.routes[0];
        const distanceMeters = route.summary.totalDistance;
        const distanceKm = (distanceMeters / 1000).toFixed(2);
        console.log(distanceKm);
        this.currentTrajet.nbkm = Number(distanceKm);

        // Tu peux ensuite afficher cette info dans le template ou ailleurs
      });
    }
  }

  getAddressFromCoords(lat: number, lon: number): Observable<any> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    return this.http.get(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'TonApp/1.0' // Important pour respecter la politique d'utilisation de Nominatim
      }
    });
  }

  getCoordsFromAddress(address: string): Observable<any> {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;

    return this.http.get(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'TonApp/1.0'
      }
    });
  }
}
