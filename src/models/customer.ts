interface Address {
    street: string;
    city: string;
    state: string;
    country: string;
    postCode: string
}

export interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyId: string;
    address: Address
}