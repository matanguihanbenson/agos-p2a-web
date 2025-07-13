// User types
export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'field_operator' | 'supervisor';
  status: 'active' | 'offline' | 'suspended';
  assignedBots: string[];
  lastActive: Date;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Bot types
export interface Bot {
  id: string;
  name: string;
  model: string;
  status: 'active' | 'charging' | 'maintenance' | 'offline';
  operatorId?: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  battery: number;
  signal: 'strong' | 'good' | 'weak' | 'offline';
  lastMaintenance: Date;
  totalCollected: number;
  operationTime: number; // in hours
  sensors: {
    camera: boolean;
    waterQuality: boolean;
    gps: boolean;
    collision: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Trash data types
export interface TrashItem {
  id: string;
  type: 'plastic_bottle' | 'food_container' | 'plastic_bag' | 'metal_can' | 'other';
  location: {
    latitude: number;
    longitude: number;
  };
  collectedAt: Date;
  botId: string;
  weight?: number;
  imageUrl?: string;
  confidence: number; // AI detection confidence 0-1
}

export interface TrashDeposit {
  id: string;
  area: string;
  coordinates: [number, number];
  totalItems: number;
  breakdown: {
    plasticBottles: number;
    foodContainers: number;
    plasticBags: number;
    metalCans: number;
    other: number;
  };
  density: 'low' | 'medium' | 'high' | 'very_high';
  lastUpdated: Date;
}

// Water quality types
export interface WaterQualityReading {
  id: string;
  location: {
    latitude: number;
    longitude: number;
    area: string;
  };
  readings: {
    ph: number;
    dissolvedOxygen: number; // mg/L
    turbidity: number; // NTU
    temperature: number; // Celsius
    conductivity: number; // µS/cm
  };
  qualityIndex: number; // 0-10 scale
  botId: string;
  timestamp: Date;
}

// Report types
export interface Report {
  id: string;
  title: string;
  type: 'environmental' | 'operational' | 'maintenance' | 'overview';
  dateRange: {
    start: Date;
    end: Date;
  };
  data: Record<string, unknown>; // Flexible data structure based on report type
  generatedAt: Date;
  generatedBy: string;
  format: 'pdf' | 'excel' | 'csv';
  fileUrl?: string;
}

// Live stream types
export interface LiveStream {
  id: string;
  botId: string;
  streamUrl: string;
  quality: '1080p' | '720p' | '480p';
  isActive: boolean;
  startTime: Date;
  viewers: number;
  recordingEnabled: boolean;
  recordingUrl?: string;
}

// Notification types
export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  recipientId: string;
  botId?: string;
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

// Dashboard metrics types
export interface DashboardMetrics {
  totalBots: number;
  activeBots: number;
  totalOperators: number;
  activeOperators: number;
  trashCollectedToday: number;
  trashCollectedTotal: number;
  averageWaterQuality: number;
  systemAlerts: number;
  coverageArea: number; // in km²
  operationalEfficiency: number; // percentage
}

// API response types
export interface ApiResponse<T = Record<string, unknown>> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

// Form types
export interface CreateUserForm {
  name: string;
  email: string;
  role: AppUser['role'];
  assignedBots?: string[];
  location?: string;
}

export interface CreateBotForm {
  name: string;
  model: string;
  operatorId?: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

// Filter and search types
export interface UserFilters {
  role?: AppUser['role'];
  status?: AppUser['status'];
  search?: string;
}

export interface BotFilters {
  status?: Bot['status'];
  operatorId?: string;
  search?: string;
}

export interface ReportFilters {
  type?: Report['type'];
  dateRange?: {
    start: Date;
    end: Date;
  };
  botId?: string;
  area?: string;
}
