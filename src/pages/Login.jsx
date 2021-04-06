import React, { Component } from 'react'
import { Link } from "react-router-dom";

import ErrorComponent from '../components/ErrorComponent';
import userRepository from '../repositories/userRepository';
import Container from '../components/Container';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            err: false,
            username: '',
            password: '',
        };
    }

    handleLogin = async (e) => {
        e.preventDefault();
        const user = { email: this.state.username, password: this.state.password };
        try {
            await userRepository.login(user);
            this.props.history.push(`/customers`);
            window.location.reload();
        } catch (err) {
            console.log(err)
            this.setState({ err: true });
        }
    }

    handleUsernameChange = (event) => {
        this.setState({ username: event.target.value });
    }

    handlePasswordChange = (event) => {
        this.setState({ password: event.target.value });
    }

    render() {
        if (this.state.err) {
            return <ErrorComponent message={'Oops, log in failed...'}></ErrorComponent >
        }

        return (
            <Container maxWidth="max-w-md">
                <form className="shadow-md rounded px-8 pt-6 pb-8 mb-4 text-gray-900">
                    <h2 className="block text-center text-2xl font-bold mb-6">Enter your email and password</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2" htmlFor="username">
                            Email
                        </label>
                        <input
                            className="appearance-none bg-gray-100 focus:bg-white border border-transparent focus:border-gray-200 rounded w-full py-4 px-4 leading-tight focus:outline-none " id="username" type="text" placeholder="username@example.com"
                            value={this.state.username}
                            onChange={this.handleUsernameChange}>
                        </input>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="appearance-none bg-gray-100 focus:bg-white border border-transparent focus:border-gray-200 rounded w-full py-4 px-4 mb-3 leading-tight focus:outline-none " id="password" type="password" placeholder="******************"
                            value={this.state.password}
                            onChange={this.handlePasswordChange}>
                        </input>
                        <Link to="/login/reset-password" className="block font-bold text-center text-xs">
                            Forgot Password? Click here to reset it.
                        </Link>
                    </div>
                    <div className=" ">
                        <button className="block w-full justify-center px-4 py-4 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
                            onClick={this.handleLogin}>
                            Log In →
                        </button>
                        <Link to="/signup" className="block mt-2 text-center font-bold text-xs text-gray-900 hover:text-gray-900">
                            Don't have an account? Sign up here.
                        </Link>
                    </div>
                </form>
            </Container>
        )
    }
}
