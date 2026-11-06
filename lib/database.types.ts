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

export type Database = {
  public: {
    Tables: {
      listings: {
        Row: ListingRow;
        Insert: ListingInsert;
        Update: Partial<ListingInsert>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
