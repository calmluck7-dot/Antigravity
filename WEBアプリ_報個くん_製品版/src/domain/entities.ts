export type Role = "developer" | "admin" | "driver";

export interface User {
    uid: string;
    email: string;
    name: string;
    role: Role;
    companyId: string;
    createdAt: Date;
}

export interface Driver extends User {
    role: "driver";
    vehicleType?: string; // e.g., "Kei-Van", "Bike"
    defaultRateId?: string; // Link to a default RateTable
    isActive: boolean;
}

export interface RateTable {
    id: string;
    name: string; // e.g., "Regular", "Distance Based"
    companyId: string;
    unitPrice: number; // Default unit price per package
    description?: string;
    isActive: boolean;
    createdAt: Date;
}

export interface Company {
    id: string;
    name: string;
    plan: "buyout" | "subscription";
    stripeCustomerId?: string;
    createdAt: Date;
}

export interface DailyReport {
    id: string;
    driverId: string;
    date: string; // YYYY-MM-DD
    location: string;
    rateId: string;
    rateName: string; // Snapshot
    unitPrice: number; // Snapshot
    pickedUp: number; // 持ち出し
    returned: number; // 持ち戻り
    delivered: number; // 配完 (pickedUp - returned)
    allowance: number; // その他手当
    remarks: string;
    isApproved: boolean;
    companyId: string;
    createdAt: Date;
}
