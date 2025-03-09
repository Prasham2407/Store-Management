export interface Sku {
  id: number;
  skuCode: string;
  name: string;
  category: string;
  department: string;
  price: number;
  cost: number;
}

export type SkuUpdate = Partial<Sku>; 