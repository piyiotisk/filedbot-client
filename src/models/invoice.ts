interface LineItem {
    id: string,
    invoiceId: string,
    createdAt: string,
    updatedAt: string,
    name: string,
    description: string,
    quantity: number,
    price: number
}

export interface Invoice {
    createdAt: string,
    customInvoiceId: string,
    jobId: number,
    id: string,
    taxIncluded: boolean,
    taxRate: number,
    updatedAt: string,
    total: string,
    lineItems: LineItem[]
}