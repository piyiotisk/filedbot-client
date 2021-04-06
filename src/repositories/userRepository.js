import axios from 'axios';

import API_ROOT from './../util/apiUrl';

const login = async (user) => {
    try {
        const response = await axios.post(`${API_ROOT}/login`, user);

        if (response.status !== 200) {
            throw Error();
        }

        localStorage.setItem('authorization', response.data.authorization);
    } catch (err) {
        throw Error('Login failed');
    }
}

const signup = async (user) => {
    try {
        const response = await axios.post(`${API_ROOT}/signup`, user);

        if (response.status !== 201) {
            throw Error();
        }
        return response;
    } catch (err) {
        throw Error('Signup failed');
    }

}

const resetPassword = async (email) => {
    try {
        const response = await axios.post(`${API_ROOT}/login/reset-password`, { email });

        if (response.status !== 200) {
            throw Error();
        }
        return response;
    } catch (err) {
        throw Error('Reset password failed');
    }
}

const updatePassword = async (password, token) => {
    try {
        const response = await axios.put(`${API_ROOT}/login/update-password`, { password, token });

        if (response.status !== 200) {
            throw Error();
        }
        return response;
    } catch (err) {
        throw Error('Update password failed');
    }
}

export default { login, signup, resetPassword, updatePassword }