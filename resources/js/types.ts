/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CustomerStatus = 'active' | 'isolated' | 'pending';
export type InvoiceStatus = 'paid' | 'pending' | 'overdue';

export interface GeoMarker {
  id: string;
  name: string;
  type: 'ODC' | 'ODP' | 'Customer';
  lat: number;
  lng: number;
  description?: string;
  status: 'active' | 'maintenance' | 'broken';
  capacity?: number;
  used?: number;
  connectedTo?: string; // parent ID
  link?: 'fiber' | 'drop' | 'wireless';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  plan: string;
  status: CustomerStatus;
  address: string;
  pppoe?: string;
  startDate: string;
  lat?: number;
  lng?: number;
  invoiceAmount: number;
  invoiceStatus: InvoiceStatus;
}

export type UserRole = 'Super Admin' | 'Technician' | 'Support' | 'Viewer';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
}

export interface InventoryItem {
  id: string;
  itemName: string;
  sku: string;
  category: string;
  quantity: number;
  stock?: number;
  unitPrice: number;
}

export interface Sale {
  id: string;
  saleId: string;
  time: string;
  total: number;
  method: 'cash' | 'card' | 'qris';
  discount: number;
  items: Array<{
    itemId: string;
    qty: number;
    price: number;
  }>;
}

export interface GeneralSettings {
  platformName: string;
  supportEmail: string;
}

export interface BillingSettings {
  invoiceDueDays: number;
  lateFee: number;
}

export interface SecuritySettings {
  twofaEnabled: boolean;
}
