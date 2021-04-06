import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import jwt from 'jsonwebtoken';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullname: '',
            showNavbar: false,
            isUserlogged: false
        }
    }

    componentDidMount() {
        this.setNavbarVisibility();
        this.setUsername();
    }

    setUsername() {
        const token = localStorage.getItem('authorization');
        if (token) {
            const decodeToken = jwt.decode(token);
            const { user } = decodeToken.payload;
            const { fullname } = user;
            this.setState({ fullname, isUserlogged: true });
        }
    }

    setNavbarVisibility() {
        // 640px is the sm in tailwindcss
        if (window.innerWidth < 640) {
            this.setState({ showNavbar: false });
        }
        if (window.innerWidth >= 640) {
            this.setState({ showNavbar: true });
        }
    }

    handleNavbarToggle = () => {
        this.setState({ showNavbar: !this.state.showNavbar });
    }

    handleLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem('authorization');
        this.setState({ isUserlogged: false });
        this.props.history.push(`/login`);
    }

    handleLogin = () => {
        this.setUsername();
        this.setState({ isUserlogged: true });
    }

    render() {
        return (
            <React.Fragment>
                {this.state.isUserlogged && this.renderLoggedInNavbar()}
                {!this.state.isUserlogged && this.renderLoggedOutNavbar()}
            </React.Fragment>
        )
    }

    renderLoggedInNavbar = () => {
        const { showNavbar } = this.state;

        return (
            <nav className="flex items-center justify-between flex-wrap bg-indigo-600 p-4">
                <div className="flex items-center flex-shrink-0 text-white mr-6">
                    <Link to="/" className="font-semibold text-2xl tracking-tight text-white">Fieldbot.io</Link>
                </div>
                <div className="block sm:hidden">
                    <button className="flex items-center px-3 py-2 border rounded text-indigo-50 border-indigo-200 hover:text-white hover:border-white" onClick={this.handleNavbarToggle}>
                        <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
                    </button>
                </div>
                {showNavbar && <div className="w-full flex-grow sm:flex sm:items-center sm:w-auto">
                    <div className="text-sm sm:flex-grow">
                        <Link to="/status"
                            className="block mt-4 sm:inline-block sm:mt-0 text-gray-100 hover:text-white mr-4">
                            Status
                        </Link>
                        <Link to="/customers" className="block mt-4 sm:inline-block sm:mt-0 text-indigo-50 hover:text-white mr-4">
                            Customers
                        </Link>
                        <Link to="/jobs" className="block mt-4 sm:inline-block sm:mt-0 text-indigo-50 hover:text-white mr-4">
                            Jobs
                        </Link>
                        <Link to="/reports" className="block mt-4 sm:inline-block sm:mt-0 text-indigo-50 hover:text-white mr-4">
                            Reports
                        </Link>
                        <Link to="/settings" className="block mt-4 sm:inline-block sm:mt-0 text-indigo-50 hover:text-white mr-4">
                            Settings
                        </Link>
                    </div>
                    <div>
                        <div className="block sm:inline-block text-sm pr-4 py-2 leading-none capitalize text-indigo-50 font-bold mt-4 mr-2 sm:mt-0">{this.state.fullname}</div>
                        <button className="block sm:inline-block text-sm px-4 py-2 leading-none border border-indigo-200 rounded text-indigo-50 font-bold hover:text-white hover:border-white mt-4 mr-2 sm:mt-0" onClick={this.handleLogout}>Log Out</button>
                    </div>
                </div>}
            </nav >
        )
    }

    renderLoggedOutNavbar() {
        const { showNavbar } = this.state;

        return (
            <nav className="flex items-center justify-between flex-wrap bg-indigo-600 p-4">
                <div className="flex items-center flex-shrink-0 text-white mr-6">
                    <Link to="/" className="font-semibold text-2xl tracking-tight text-white">Fieldbot.io</Link>
                </div>
                <div className="block sm:hidden">
                    <button className="flex items-center px-3 py-2 border rounded text-indigo-50 border-indigo-200 hover:text-white hover:border-white" onClick={this.handleNavbarToggle}>
                        <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
                    </button>
                </div>
                {showNavbar && <div
                    className="w-full flex-grow sm:flex sm:items-center sm:w-auto"
                >
                    <div className="text-sm sm:flex-grow">
                        <Link to="/status"
                            className="block mt-4 sm:inline-block sm:mt-0 text-gray-100 hover:text-white mr-4">
                            Status
                        </Link>
                    </div>
                    <div>
                        <Link to={{
                            pathname: '/login',
                        }}
                            className="inline-block text-sm px-4 py-2 leading-none border border-gray-100 rounded text-gray-100 font-bold hover:text-white hover:border-white mt-4 mr-2 sm:mt-0"
                        >Log In
                            </Link>
                        <Link to="/signup"
                            className="inline-block text-sm px-4 py-2 leading-none border border-gray-100 rounded text-indigo-900 font-bold bg-gray-100 hover:bg-white mt-4 sm:mt-0"
                        >Sign Up
                            </Link>
                    </div>
                </div>}
            </nav>
        )
    }
}

export default withRouter(Navbar);