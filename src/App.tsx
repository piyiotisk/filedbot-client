import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import jwtUtils from './util/jwtUtils';
import VerifyEmailPage from './pages/VerifyEmail';
import ResetPasswordPage from './pages/ResetPassword';
import UpdatePasswordPage from './pages/UpdatePassword';
import StatusPage from './pages/Status';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import CustomersPage from './pages/customers/Customers';
import CreateCustomerPage from './pages/customers/CreateCustomer';
import EditCustomerPage from './pages/customers/EditCustomer';
import ViewCustomerPage from './pages/customers/ViewCustomer';
import CreateJobPage from './pages/jobs/CreateJob';
import ViewJobPage from './pages/jobs/ViewJob';
import EditJobPage from './pages/jobs/EditJob';
import JobsPage from './pages/jobs/Jobs';
import SettingsPage from './pages/Settings';
import InvoicesPage from './pages/invoices/Invoice';
import ReportsPage from './pages/reports/Reports';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default class App extends Component {
  render() {
    return (
      <Router>
        <Navbar />
        <div className="min-h-screen flex flex-col font-sans">
          <div className="flex-grow bg-gray-100 antialiased">
            {!jwtUtils.isTokenValid() && <Redirect to="/login" />}
            <Route path="/verify-email" component={VerifyEmailPage} />
            <Route path="/status" component={StatusPage} />
            <Route exact path="/login/reset-password" component={ResetPasswordPage} />
            <Route exact path="/login/update-password/:token" component={UpdatePasswordPage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/signup" component={SignupPage} />
            <Route exact path="/customers/:id/edit" component={EditCustomerPage} />
            <Route exact path="/customers/:id/view" component={ViewCustomerPage} />
            <Route exact path="/customers/create" component={CreateCustomerPage} />
            <Route exact path="/jobs/create/customers/:id" component={CreateJobPage} />
            <Route exact path="/jobs/:id/view" component={ViewJobPage} />
            <Route exact path="/jobs/:id/edit" component={EditJobPage} />
            <Route exact path="/jobs" component={JobsPage} />
            <Route exact path="/customers" component={CustomersPage} />
            <Route exact path="/settings" component={SettingsPage} />
            <Route exact path="/invoices/job/:id" component={InvoicesPage} />
            <Route exact path="/reports" component={ReportsPage} />
          </div>
        </div>
        <Footer />
      </Router>
    )
  }
}

