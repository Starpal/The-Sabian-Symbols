export interface Degree {
  _id: string;
  sign: string;
  degree: number;
  title: string;
  keynote: string;
  description: string;
}

export interface BackgroundImage {
  contentType: string;
  imageBase64: string;
}