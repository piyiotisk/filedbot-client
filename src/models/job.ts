export enum JobStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    FINISHED = "FINISHED"
}

export interface Address {
    street: string,
    city: string,
    state: string,
    country: string,
    postCode: string
}

export interface JobRequest {
    name: string,
    scheduledAt: string | undefined,
    description: string,
    images: {
        keys: string[] | undefined
    },
    status: JobStatus,
    customerId: number,
    userId: number | undefined,
    tags: string[] | undefined,
    address: Address
}

export interface JobResponse {
    address: Address
    companyId: number,
    customerId: number,
    description: string,
    id: number,
    images: {
        key: string,
        signedUrl: string
    }[] | null,
    name: string,
    scheduledAt: string | undefined,
    status: JobStatus,
    tags: string[] | null,
    userId: number | null,
}