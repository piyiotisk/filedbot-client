import React, { Component } from 'react'

import ErrorComponent from '../components/ErrorComponent';

import userRepository from '../repositories/userRepository';

export default class UpdatePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            err: false,
            username: '',
            password: '',
            passwordConfirmation: '',
            token: ''
        };
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        this.setState({ token: params.token });
    }

    handlePasswordReset = async (e) => {
        e.preventDefault();
        const { password, passwordConfirmation, token } = this.state;

        if (password !== passwordConfirmation) {
            this.setState({ err: true })
        }

        try {
            await userRepository.updatePassword(password, token);
            this.props.history.push(`/login`)
        } catch (err) {
            this.setState({ err: true });
        }
    }

    handlePasswordChange = (event) => {
        this.setState({ password: event.target.value });
    }


    handlePasswordConfirmationChange = (event) => {
        this.setState({ passwordConfirmation: event.target.value });
    }

    render() {
        if (this.state.err) {
            return <ErrorComponent message={'Oops, reseting your password failed...'}></ErrorComponent >
        }


        return (
            < div className="w-full max-w-md mx-auto my-24" >
                <form className="shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h2 className="block text-gray-700 text-xl font-bold mb-6">Reset your password</h2>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            New Password
                        </label>
                        <input
                            className="appearance-none bg-gray-200 focus:bg-white border border-transparent focus:border-gray-200 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none " id="password" type="password" placeholder="******************"
                            value={this.state.password}
                            onChange={this.handlePasswordChange}>
                        </input>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Confirm Password
                        </label>
                        <input
                            className="appearance-none bg-gray-200 focus:bg-white border border-transparent focus:border-gray-200 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none " id="password" type="password" placeholder="******************"
                            value={this.state.passwordConfirmation}
                            onChange={this.handlePasswordConfirmationChange}>
                        </input>
                    </div>
                    <button
                        className="block w-full justify-center px-4 py-4 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150" onClick={this.handlePasswordReset}>
                        Update Password →
                        </button>
                </form>
                <p className="text-center text-gray-500 text-xs">
                    &copy;{new Date().getFullYear()} Fieldbot.io - All rights reserved.
                </p>
            </div >
        )
    }
}
