/** Admin Customers module contracts (src/app/admin/customers, src/app/api/v1/admin/customers). */

export interface AdminCustomerListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  bookingsCount: number;
  totalPaid: number;
  lastBookingAt: string | null;
  createdAt: string;
}

export interface AdminCustomerListResponse {
  customers: AdminCustomerListItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface AdminCustomerBooking {
  bookingNo: string;
  status: string;
  paymentState: string;
  trekName: string;
  batchLabel: string;
  startDate: string | null;
  pax: number;
  totalAmount: number;
  paidAmount: number;
  createdAt: string;
}

export interface AdminCustomerPayment {
  id: string;
  bookingNo: string;
  amount: number;
  method: string | null;
  gateway: string;
  status: string;
  capturedAt: string | null;
  createdAt: string;
}

export interface AdminCustomerLead {
  leadNo: string;
  status: string;
  formType: string;
  trekName: string | null;
  createdAt: string;
}

export interface AdminCustomerDetailResponse {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
  };
  stats: {
    bookingsCount: number;
    totalBilled: number;
    totalPaid: number;
    outstanding: number;
  };
  bookings: AdminCustomerBooking[];
  payments: AdminCustomerPayment[];
  leads: AdminCustomerLead[];
  canEdit: boolean;
}

export interface AdminUpdateCustomerRequest {
  name?: string;
  email?: string;
  phone?: string;
}
