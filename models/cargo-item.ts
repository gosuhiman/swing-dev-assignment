export interface CargoItem {
  id: string;
  weight: number;
}

export namespace CargoItem {
  export const MAX_WEIGHT: number = 500;
}