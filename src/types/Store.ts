export interface Store {
  id: number;
  storeCode: string;
  name: string;
  city: string;
  state: string;
}

export interface StoreUpdate {
  storeCode?: string;
  name?: string;
  city?: string;
  state?: string;
} 