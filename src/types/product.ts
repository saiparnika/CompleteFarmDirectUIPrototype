export interface Product {
  id: string;
  farmer_id: string;
  name: string;
  category: string;
  description: string | null;
  price_per_kg: number;
  quantity_kg: number;
  grade: string | null;
  unit: string;
  harvest_date: string | null;
  location: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  name: string;
  category: string;
  description: string;
  price_per_kg: string;
  quantity_kg: string;
  grade: string;
  unit: string;
  harvest_date: string;
  location: string;
}
