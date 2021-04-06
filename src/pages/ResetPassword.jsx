import React, { Component } from 'react'

import ErrorComponent from '../components/ErrorComponent';
import userRepository from '../repositories/userRepository';
import { isValidEmail } from '../util/formValidation';
import Container from '../components/Container';

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            err: false,
            username: '',
            showPasswordResetSuccessComponent: false,
            showPasswordResetComponent: true
        };

    }

    handlePasswordReset = async (e) => {
        e.preventDefault();
        const { username } = this.state;

        if (!isValidEmail(this.state.username)) {
            return;
        }

        try {
            await userRepository.resetPassword(username);
            this.setState({ showPasswordResetComponent: false, showPasswordResetSuccessComponent: true });
        } catch (err) {
            this.setState({ err: true });
        }
    }

    handleUsernameChange = (event) => {
        this.setState({ username: event.target.value });
    }

    renderResetPasswordSuccess = () => (
        <Container maxWidth="max-w-md">
            <div className="shadow-md rounded px-8 pt-6 pb-8 mb-4 text-gray-900">
                <h2 className="block text-xl font-bold mb-6">You have succesfully reset your password!</h2>
                <div className="mb-4">
                    <p className="block text-md mb-2">
                        We have sent an email with password reset instructions to
                        <b>&nbsp;{this.state.username}&nbsp;</b>
                    </p>
                    <span className="block text-sm mb-2 mt-6"> Didn't recieve an email? </span>
                    <span className="block text-gray-600 text-sm mb-2">
                        Please check your spam folder and contact
                        <b>&nbsp;help@fieldbot.io&nbsp;</b>
                        if the problem persists.
                    </span>
                </div>
            </div>
        </Container>
    )

    renderResetPassowordComponent = () => (
        <Container maxWidth="max-w-md">
            <form className="shadow-md rounded px-8 pt-6 pb-8 mb-4 text-gray-900">
                <h2 className="block text-center text-2xl font-bold mb-6">Reset your password</h2>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="username">
                        Email
                        </label>
                    <input
                        required
                        className="appearance-none bg-gray-100 focus:bg-white border border-transparent focus:border-gray-200 rounded w-full py-4 px-4 leading-tight focus:outline-none "
                        id="username"
                        type="email"
                        placeholder="username@example.com"
                        value={this.state.username}
                        onChange={this.handleUsernameChange}>
                    </input>
                </div>
                <div>
                    <button
                        className="block w-full justify-center px-4 py-4 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
                        onClick={this.handlePasswordReset}>
                        Reset Password →
                        </button>
                </div>
            </form>
        </Container>
    )


    render() {
        if (this.state.err) {
            return <ErrorComponent message={'Oops, resetting your password failed...'}></ErrorComponent >
        }

        return (
            <React.Fragment>
                {this.state.showPasswordResetComponent && this.renderResetPassowordComponent()}
                {this.state.showPasswordResetSuccessComponent && this.renderResetPasswordSuccess()}
            </React.Fragment>
        )
    }
}
