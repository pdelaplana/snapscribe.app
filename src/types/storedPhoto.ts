export interface StoredPhoto {
  id: string;

  imageUrl?: string;
  caption: string;
  rating: number;
  date: Date;
}

export interface PhotoSource {
  webPath: string;
  photoPath: string;
}
