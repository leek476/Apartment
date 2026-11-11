type ListingRow = {
  id: string;
  title: string;
  address: string;
  city: string;
  zip: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  image_path: string | null;
  images: string[];
  image_paths: string[];
  pet_friendly: boolean;
  admin_rating: number;
  created_at: string;
};

type ListingInsert = Omit<
  ListingRow,
  "id" | "created_at" | "image_path" | "images" | "image_paths"
> & {
  id?: string;
  created_at?: string;
  image_path?: string | null;
  images?: string[];
  image_paths?: string[];
};

export type ApartmentRequestRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  zip: string;
  budget: string;
  bedrooms: string;
  move_in: string;
  consent: boolean;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      listings: {
        Row: ListingRow;
        Insert: ListingInsert;
        Update: Partial<ListingInsert>;
        Relationships: [];
      };
      apartment_requests: {
        Row: ApartmentRequestRow;
        Insert: Omit<ApartmentRequestRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
