// Property from NestJS backend GET /properties/:id
export interface Property {
  id: string;
  slug: string;
  type: 'rent' | 'sale' | 'daily_rent';
  propertyType: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  area: number;
  address: string;
  lat: number | null;
  lng: number | null;
  neighborhood: string;
  stratum: number;
  description: string | null;
  photos: string[];
  available: boolean;
  name: string | null;
  age: number | null;
  ownerId: string | null;
  owner: Customer | null;
  createdAt: string;
  updatedAt: string;
}

// Paginated response from GET /properties
export interface PaginatedPropertiesResponse {
  items: Property[];
  hasMore: boolean;
  nextToken?: string;
}

// Customer from NestJS backend
export interface Customer {
  id: string;
  email: string;
  phone: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

// Remodeling from NestJS backend
export interface Remodeling {
  id: string;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  createdAt: string;
}

// Preview format for display in cards
export interface PropertyPreview {
  propertyId: string;
  address: string;
  price: string;
  rooms: number;
  bathrooms: number;
  parkingSlots: number;
  availability: boolean;
  coordinates: string;
  firstPhoto: string;
  city: string;
  neighbourhood: string;
  propertyType?: string;
}

// Map location for Leaflet markers
export interface MapLocation {
  id: string;
  position: [number, number];
  photo?: string;
  price?: string;
  label?: string;
}
