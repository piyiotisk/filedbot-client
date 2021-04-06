import userRepository from './userRepository';
import LocalStorageMock from '../test/helpers/localStorageMock';

global.localStorage = new LocalStorageMock;

jest.mock('axios');
import axios from 'axios';


describe('.login()', () => {

    beforeEach(() => {
        localStorage.clear();
    });

    it('saves the authorization token to local storage', async () => {
        const response = {
            status: 200,
            data: {
                authorization: 'expected-token'
            }
        }

        axios.post.mockImplementation(() => Promise.resolve(response));

        await userRepository.login({});

        expect(localStorage.getItem('authorization')).toBe(response.data.authorization);
    });


    it('throws an error when login return 500', async () => {
        const response = {
            status: 500,
            data: {
                authorization: 'expected-token'
            }
        }

        axios.post.mockImplementation(() => Promise.resolve(response));

        try {
            await userRepository.login({});
        } catch (err) {
            expect(err).toStrictEqual(new Error('Login failed'));
            expect(localStorage.getItem('authorization')).toBe(null);
        }

    });
})

describe('.signup()', () => {
    it('succedds when the response has status code 201', async () => {
        const response = {
            status: 201,
            data: {
                id: 27,
                createdAt: '2019-09-20T21:44:35.547Z',
                updatedAt: null,
                deletedAt: null,
                email: "user11131@example.com",
                password: "$2b$10$4ImlaDJVjRJA5kNxmtP9euovaPqbVgYDhE30dY4EG9EfUcbbDwax6",
                fullname: "John Doe",
                emailConfirmed: false,
                emailVerificationToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIxMTEzMUBleGFtcGxlLmNvbSIsImlhdCI6MTU2OTAxNTg3NSwiZXhwIjoxNTY5MDE5NDc1LCJpc3MiOiJwaW5nYm90LXNlcnZlciJ9.gfGo3yw931pCA_lSl_xPTXTH6Y_IwMYxlpZE3f7EY_E"
            }
        }

        axios.post.mockImplementation(() => Promise.resolve(response));

        const actualResponse = await userRepository.signup({});

        expect(actualResponse).toStrictEqual(response);
    });


    it('throws an error when signup return 500', async () => {
        const response = {
            status: 500,
            data: {
            }
        }

        axios.post.mockImplementation(() => Promise.resolve(response));

        try {
            await userRepository.signup({});
        } catch (err) {
            expect(err).toStrictEqual(new Error('Signup failed'));
        }

    });
})

describe('.resetPassword()', () => {
    it('succeeds if backend returns 200', async () => {
        const response = {
            status: 200,
        }

        axios.post.mockImplementation(() => Promise.resolve(response));

        const actualResponse = await userRepository.resetPassword('email@example.com');

        expect(actualResponse).toStrictEqual(response);
    });


    it('throws an error when signup return 500', async () => {
        const response = {
            status: 500,
        }

        axios.post.mockImplementation(() => Promise.resolve(response));

        try {
            await userRepository.resetPassword({});
        } catch (err) {
            expect(err).toStrictEqual(new Error('Reset password failed'));
        }

    });
})

describe('.updatePassword()', () => {
    it('succeeds if backend returns 200', async () => {
        const response = {
            status: 200,
        }

        axios.put.mockImplementation(() => Promise.resolve(response));

        const actualResponse = await userRepository.updatePassword('password', 'token');

        expect(actualResponse).toStrictEqual(response);
    });


    it('throws an error when signup return 500', async () => {
        const response = {
            status: 500,
        }

        axios.put.mockImplementation(() => Promise.resolve(response));

        try {
            await userRepository.updatePassword('password', 'token');
        } catch (err) {
            expect(err).toStrictEqual(new Error('Update password failed'));
        }

    });
})