import { axiosWithToken } from '../../util/axiosClient';


const createCustomer = async (customer) => {
    try {
        const response = await axiosWithToken.post(`/customers`, customer);

        if (response.status !== 201) {
            throw Error();
        }
        return response;
    } catch (err) {
        throw Error('Creating customer failed');
    }
}

const getCustomers = async (page, limit) => {
    try {
        const response = await axiosWithToken.get(`/customers?page=${page}&limit=${limit}`);

        if (response.status !== 200) {
            throw Error();
        }
        return response.data.customers || [];
    } catch (err) {
        throw Error('Fetching customers failed');
    }
}

const getCustomersCount = async () => {
    try {
        const response = await axiosWithToken.get(`/customers/count`);

        if (response.status !== 200) {
            throw Error();
        }
        return response.data.count || 0;
    } catch (err) {
        throw Error('Counting customers failed');
    }
}

const getCustomerById = async (id) => {
    try {
        const response = await axiosWithToken.get(`/customers/${id}`);

        if (response.status !== 200) {
            throw Error();
        }
        return response.data;
    } catch (err) {
        throw Error('Fetching customer failed');
    }
}

const updateCustomer = async (customer) => {
    try {
        const response = await axiosWithToken.put(`/customers/${customer.id}`, customer);

        if (response.status !== 200) {
            throw Error();
        }
        return response;
    } catch (err) {
        throw Error('Updating customer failed');
    }
}

const deleteCustomer = async (id) => {
    try {
        const response = await axiosWithToken.delete(`/customers/${id}`);

        if (response.status !== 200) {
            throw Error();
        }
    } catch (err) {
        throw Error('Deleting customer failed');
    }
}

const searchCustomers = async (searchTerm) => {
    try {
        const response = await axiosWithToken.get(`/customers/search/${searchTerm}`);

        if (response.status !== 200) {
            throw Error();
        }
        return response.data.customers;
    } catch (err) {
        throw Error('Finding customer failed');
    }
}

const getJobsForCustomer = async (customerId) => {
    try {
        const response = await axiosWithToken.get(`/jobs/customer/${customerId}`);
        if (response.status !== 200) {
            throw Error();
        }
        return response.data.jobs;
    } catch (err) {
        throw Error('Finding jobs for customer failed');
    }
}

export default { createCustomer, getCustomers, getCustomerById, getCustomersCount, updateCustomer, deleteCustomer, searchCustomers, getJobsForCustomer }