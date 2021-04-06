import { Invoice } from '../../models/invoice';
import { axiosWithToken } from '../../util/axiosClient';

const create = async (invoice: any) => {
    try {
        const response = await axiosWithToken.post(`/invoices`, invoice);

        if (response.status !== 201) {
            throw Error();
        }
        return response.data;
    } catch (err) {
        throw Error('Creating invoice failed');
    }
}

const getInvoice = async (jobId: number): Promise<Invoice> => {
    try {
        const response: any = await axiosWithToken.get(`/invoices/job/${jobId}`);

        if (response.status === 200) {
            return response.data.invoice;
        }
        throw Error();
    } catch (err) {
        throw Error('Invoice does not exist');
    }
}

const update = async (invoice: any) => {
    try {
        console.log(invoice)
        const response = await axiosWithToken.put(`/invoices/${invoice.id}`, invoice);

        if (response.status !== 201) {
            throw Error();
        }
        return response.data;
    } catch (err) {
        throw Error('Updating invoice failed');
    }
}

export default { create, getInvoice, update }