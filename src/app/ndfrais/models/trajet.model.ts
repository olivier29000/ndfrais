export interface Trajet {
  id?: number;
  titre: string;
  dateTrajet: Date;
  dateCreation: Date;
  nbkm: number;
  depart: Position;
  arrive: Position;
}

export interface Position {
  lat: number;
  lon: number;
  displayed: string;
}
