import React, { Component } from 'react'
import companiesRepository from '../repositories/companies/companiesRepository';
import ErrorAlert from '../components/ErrorAlert';
import SuccessAlert from '../components/SuccessAlert';
import withAutoDisolve from '../components/AutoDisolveComponent';
import Container from '../components/Container';
import ButtonContainer from '../components/ButtonContainer';
import ButtonWithIcon from '../components/ButtonWithIcon';

export default class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            err: null,
            companyId: null,
            companyName: '',
            companyEmail: '',
            success: null
        };
    }

    componentDidMount = async () => {
        try {
            const response = await companiesRepository.getCompany();
            if (response) {
                const { company } = response;
                this.setState({ companyName: company.name, companyId: company.id, companyEmail: company.email });
            }
        } catch (err) {
            console.log(err)
        }
    };

    handleCompanyNameChange = (e) => {
        this.setState({ companyName: e.target.value, err: null, success: null });
    };

    handleCompanyEmailChange = (e) => {
        this.setState({ companyEmail: e.target.value, err: null, success: null });
    };

    handleCompanySave = async (e) => {
        e.preventDefault();
        try {
            const { companyId } = this.state;
            if (companyId) {
                // update
                const companyToUpdate = {
                    id: companyId,
                    name: this.state.companyName,
                    email: this.state.companyEmail
                }
                const { company } = await companiesRepository.update(companyToUpdate);
                this.setState({
                    companyId: company.id,
                    companyName: company.name, success: {
                        message: 'Updating company details was succesful'
                    },
                    companyEmail: company.email
                });
            } else {
                // save
                const companyToSave = {
                    name: this.state.companyName,
                    email: this.state.companyEmail
                }
                const { company } = await companiesRepository.create(companyToSave);
                this.setState({
                    companyId: company.id,
                    companyName: company.name, success: {
                        message: 'Saving company details was succesful'
                    },
                    companyEmail: company.email
                });
            }
        } catch (err) {
            this.setState({ err });
        }
    };

    render() {
        const { err, success } = this.state;
        const SuccessAlertComponent = withAutoDisolve(SuccessAlert);
        const ErrorAlertComponent = withAutoDisolve(ErrorAlert);

        return (
            <>
                <Container maxWidth={'max-w-sm'}>
                    {success && <SuccessAlertComponent message={success.message} />}
                    {err && <ErrorAlertComponent message={err.message} />}
                    <form className="px-8 pt-6">
                        <h2 className="block text-gray-900 text-xl font-bold mb-6">Enter your company details</h2>
                        <div className="mb-4">
                            <input
                                className="appearance-none bg-gray-100 focus:bg-white border border-transparent focus:border-gray-100 rounded w-full py-2 px-3 mb-2 text-gray-900 leading-tight focus:outline-none " id="username" type="text" placeholder={this.state.companyName || "Your company name"}
                                value={this.state.companyName}
                                onChange={this.handleCompanyNameChange}>
                            </input>
                            <input
                                className="appearance-none bg-gray-100 focus:bg-white border border-transparent focus:border-gray-100 rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none " id="username" type="text" placeholder={this.state.companyEmail || "Your company email address"}
                                value={this.state.companyEmail}
                                onChange={this.handleCompanyEmailChange}>
                            </input>
                        </div>
                        <ButtonContainer>
                            <ButtonWithIcon
                                buttonText="Save"
                                svgPathElementD="M0 2C0 .9.9 0 2 0h14l4 4v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5 0v6h10V2H5zm6 1h3v4h-3V3z"
                                onClick={this.handleCompanySave} />
                        </ButtonContainer>
                    </form>
                </Container>
            </>
        )
    }
}
