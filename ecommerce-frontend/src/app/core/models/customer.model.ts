export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface Customer {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  status?: CustomerStatus;
  createdAt?: string;
  updatedAt?: string;
}
