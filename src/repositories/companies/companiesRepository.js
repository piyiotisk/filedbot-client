import { axiosWithToken } from '../../util/axiosClient';


const getCompany = async () => {
    try {
        const response = await axiosWithToken.get(`/companies`);

        if (response.status !== 200) {
            throw Error();
        }
        return response.data;
    } catch (err) {
        throw Error('Company does not exist');
    }
}

const create = async (company) => {
    try {
        const response = await axiosWithToken.post(`/companies`, company);

        if (response.status !== 201) {
            throw Error();
        }
        return response.data;
    } catch (err) {
        throw Error('Creating company failed');
    }

}

const update = async (company) => {
    try {
        const response = await axiosWithToken.put(`/companies`, company);

        if (response.status !== 201) {
            throw Error();
        }
        return response.data;
    } catch (err) {
        throw Error('Updating company failed');
    }
}

export default { getCompany, create, update }