import React, { Component } from 'react';
import Input from '../../components/Input';
import customersRepository from '../../repositories/customers/customersRepository';
import ErrorAlert from '../../components/ErrorAlert';
import withAutoDisolve from '../../components/AutoDisolveComponent';
import Container from '../../components/Container';
import ButtonContainer from '../../components/ButtonContainer';
import ButtonWithIcon from '../../components/ButtonWithIcon';

export default class CreateCustomer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            err: null,
            formValues: {
                id: '',
                firstName: '',
                lastName: '',
                phone: '',
                email: '',
                // address
                street: '',
                city: '',
                state: '',
                country: '',
                postCode: '',
            }
        }
    };

    componentDidMount = async () => {
        const customerId = this.props.location.pathname.split('/')[2];
        const { customer } = await customersRepository.getCustomerById(customerId);
        const { id, firstName, lastName, phone, email, address } = customer;
        const { street, city, state, country, postCode } = address;
        // TODO: handle empty values
        this.setState({
            formValues: {
                id,
                firstName,
                lastName,
                phone,
                email: email || '',
                // address
                street: street || '',
                city: city || '',
                state: state || '',
                country: country || '',
                postCode: postCode || '',
            }
        });
    }


    mapToCustomerDTO = () => {
        const {
            id,
            firstName,
            lastName,
            email,
            phone,
            // address
            street,
            city,
            state,
            country,
            postCode } = this.state.formValues;

        const customer = {
            id,
            firstName,
            lastName,
            email,
            phone,
            address: {
                street,
                city,
                state,
                country,
                postCode
            }
        };
        return customer;
    }

    isInputValid = () => {
        const { firstName, lastName, phone } = this.state.formValues;

        if (!firstName || !lastName || !phone || phone.length < 6 || phone.length > 50) {
            return false;
        }
        return true;
    }

    handleSave = async (event) => {
        event.preventDefault();
        try {
            if (this.isInputValid()) {
                const customer = this.mapToCustomerDTO();
                await customersRepository.updateCustomer(customer);
                this.props.history.push(`/customers`);
            } else {
                console.log('Please fill the required fields and try again');
            }
        } catch (err) {
            this.setState({ err });
        }
    }

    handleInputChange = (event) => {
        event.preventDefault();
        let formValues = this.state.formValues;
        let name = event.target.name; // Field name
        let value = event.target.value; // Field value

        formValues[name] = value;
        this.setState({ formValues, err: null });
    }

    render() {
        const { err } = this.state;
        const ErrorAlertComponent = withAutoDisolve(ErrorAlert);

        return (
            <Container maxWidth="max-w-2xl">
                {err && <ErrorAlertComponent message={err.message} />}
                <form className="w-full pt-8 px-8 mx-auto max-w-2xl shadow-md rounded">
                    <h2 className="block text-gray-700 text-xl font-bold mb-6">Edit customer</h2>
                    <div className="flex flex-wrap mb-6">
                        <Input name='firstName' labelName='Firstname' placeholder='John' value={this.state.formValues.firstName} onChange={this.handleInputChange} detailInputExplanation='The firstname of your customer' required={!this.isInputValid()} />
                        <Input name='lastName' labelName='Lastname' placeholder='Doe' value={this.state.formValues.lastName} onChange={this.handleInputChange} detailInputExplanation='The lastname of your customer' required={!this.isInputValid()} />
                        <Input name='phone' labelName='Phone' placeholder='+44 (0) 20 3955 7455' value={this.state.formValues.phone} onChange={this.handleInputChange} detailInputExplanation='The phone number of your customer' required={!this.isInputValid()} />
                        <Input name='email' labelName='Email' placeholder='john.doe@email.com' value={this.state.formValues.email} onChange={this.handleInputChange} detailInputExplanation='The email of your customer' />
                        <h3 className="flex flex-wrap text-gray-700 text-lg font-bold my-4">Address</h3>
                        <Input name='street' labelName='Street' placeholder='1 Bedford Ave, Fitzrovia' value={this.state.formValues.street} onChange={this.handleInputChange} detailInputExplanation='' />
                        <Input name='city' labelName='City' placeholder='London' value={this.state.formValues.city} onChange={this.handleInputChange} detailInputExplanation='' />
                        <Input name='state' labelName='State' placeholder='England' value={this.state.formValues.state} onChange={this.handleInputChange} detailInputExplanation='' />
                        <Input name='country' labelName='Country' placeholder='United Kingdom' value={this.state.formValues.country} onChange={this.handleInputChange} detailInputExplanation='' />
                        <Input name='postCode' labelName='Postcode' placeholder='W1 XBE' value={this.state.formValues.postCode} onChange={this.handleInputChange} detailInputExplanation='' />
                    </div>

                    <ButtonContainer>
                        <ButtonWithIcon
                            buttonText="Save"
                            svgPathElementD="M0 2C0 .9.9 0 2 0h14l4 4v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5 0v6h10V2H5zm6 1h3v4h-3V3z"
                            onClick={this.handleSave} />
                    </ButtonContainer>
                </form>
            </Container>)
    }
}
