import React, { Component } from 'react'
import { Link, withRouter } from "react-router-dom";

import ErrorComponent from '../components/ErrorComponent';

import userRepository from '../repositories/userRepository';
import Container from '../components/Container';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            err: false,
            fullname: '',
            username: '',
            password: '',
        };

    }

    handleSignup = async (e) => {
        e.preventDefault();
        const user = { email: this.state.username, fullname: this.state.fullname, password: this.state.password };
        try {
            await userRepository.signup(user);
            this.props.history.push('/verify-email');
        } catch (err) {
            this.setState({ err: true });
        }
    }

    handleFullnameChange = (event) => {
        this.setState({ fullname: event.target.value });
    }

    handleUsernameChange = (event) => {
        this.setState({ username: event.target.value });
    }

    handlePasswordChange = (event) => {
        this.setState({ password: event.target.value });
    }

    render() {
        if (this.state.err) {
            return <ErrorComponent message={'Oops, sign up failed...'}></ErrorComponent >
        }

        return (
            <Container maxWidth="max-w-md">
                <form className="shadow-md rounded px-8 pt-6 pb-8 mb-4 text-gray-900">
                    <h2 className="block text-xl font-bold mb-6">Enter your fullname, email and password</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2" htmlFor="Fullname">
                            Full Name
                        </label>
                        <input
                            className="appearance-none bg-gray-100 focus:bg-white border border-transparent focus:border-gray-200 rounded w-full py-4 px-4 leading-tight focus:outline-none " id="fullname" type="text" placeholder="John Doe"
                            value={this.state.fullname}
                            onChange={this.handleFullnameChange}>
                        </input>
                    </div>
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
                        <Link to="/signup/reset-password" className="block font-bold text-xs hover:text-gray-900" href="#">
                            By signing up you agree to the Terms of Service.
                        </Link>
                    </div>
                    <div className=" ">
                        <button
                            className="block w-full justify-center px-4 py-4 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
                            onClick={this.handleSignup}>
                            Sign Up →
                        </button>
                        <Link to="/login" className="block mt-2 text-center font-bold text-xs hover:text-gray-900">
                            Already have an account? Log in here.
                        </Link>
                    </div>
                </form>
            </Container>)
    }
}


export default withRouter(Signup);