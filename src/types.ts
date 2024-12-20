// Define your API error type
export interface ApiError {
  message: string;
  code?: number;
}

// Define a type for a successful response
export interface ApiSuccess<TData> {
  status: "ok";
  data: TData;
}

// Define a type for an error response
export interface ApiFailure {
  status: "fail";
  message: string;
  code?: number;
}

// Union type for API response
export type ApiResponse<TData> = ApiSuccess<TData> | ApiFailure;

export type UnitCondition = {
  id: number;
  name: string;
};

export type Geometry =
  | {
      type: "Point";
      coordinates: [number, number]; // A single pair of coordinates [longitude, latitude]
    }
  | {
      type: "LineString";
      coordinates: [number, number][]; // An array of [longitude, latitude] pairs
    }
  | {
      type: "Polygon";
      coordinates: [number, number][][]; // An array of arrays of [longitude, latitude] pairs (outer and inner rings)
    }
  | {
      type: "MultiPoint";
      coordinates: [number, number][]; // An array of points
    }
  | {
      type: "MultiLineString";
      coordinates: [number, number][][]; // An array of arrays of points
    }
  | {
      type: "MultiPolygon";
      coordinates: [number, number][][][]; // An array of arrays of polygons
    }
  | {
      type: "GeometryCollection";
      geometries: Geometry[]; // A collection of multiple geometries
    };

export type Project = {
  id: number;
  name: string;
  timezone: "WIB" | "WITA" | "WIT";
  location?: Extract<Geometry, { type: "Point" }>;
  radius?: number;
};

export type Unit = {
  id: number;
  asset_code: string;
  project_id: number;
  user_id: number;
  year: string;
  plate: string;
  model: string;
  meter: string;
  colour: string;
  type: string;
  serial: string;
  tire_size_front: string;
  tire_size_rear: string;
  tire_pressure_front: string;
  tire_pressure_rear: string;
  status: "READY" | "NOT READY";
  unit_tax_duedate: string; // ISO date format (YYYY-MM-DD)
  image_unit: string;
  description: string;
  link_barcode?: string | null;
  image_barcode?: string | null;
  created_at: string; // ISO date format
  updated_at: string; // ISO date format
  project?: Project | null;
};

export type UnitReportCondition = {
  id: number;
  name: string;
  value: "C" | "K";
  issue: string | null;
};

export type UnitReport = {
  id: number;
  unit_id: number;
  user_id: number;
  conditions: UnitReportCondition[];
  issue: string | null;
  status_unit: "READY" | "NOT READY" | "NEEDS MAINTENANCE";
  photo?: string | null;
  created_at?: string;
  unit?: Unit | null;
  driver?: Driver | null;
};

export type Driver = {
  id: number;
  nik: string;
  name: string;
  phone_number: string;
  provider: string;
  status: string;
};

export type UnitReportDriver = UnitReport & {
  driver: Driver;
};
