import React, { Component } from 'react'

import ErrorAlert from '../../components/ErrorAlert';
import withAutoDisolve from '../../components/AutoDisolveComponent';
import customersRepository from '../../repositories/customers/customersRepository';
import DesctructiveModal from '../../components/DesctructiveModal';
import ButtonLink from '../../components/ButtonLink';
import ButtonDestructive from '../../components/ButtonDestructive';
import Container from '../../components/Container';
import CustomerDetails from '../../components/CustomerDetails';
import JobsCard from '../../components/JobsCard';
import ButtonContainer from '../../components/ButtonContainer';

export default class ViewCustomer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			customer: undefined,
			err: null,
			jobs: undefined,
			showDeleteCustomerModal: false
		};
	};

	async componentDidMount() {
		try {
			const customerId = this.props.location.pathname.split('/')[2];
			const { customer } = await customersRepository.getCustomerById(customerId);
			const jobs = await customersRepository.getJobsForCustomer(customerId);
			this.setState({ jobs, customer });
		} catch (err) {
			console.log(err);
		}
	};

	showDeleteCustomerModal = (event) => {
		event.preventDefault();
		this.setState({ showDeleteCustomerModal: true });
	};

	hideDeleteCustomerModal = (event) => {
		event.preventDefault();
		this.setState({ showDeleteCustomerModal: false });
	};

	handleCustomerDelete = async (event, customerId) => {
		event.preventDefault();
		try {
			await customersRepository.deleteCustomer(customerId);
			this.props.history.push('/customers');
		} catch (err) {
			this.setState({ err });
		}
	};

	render() {
		const ErrorAlertComponent = withAutoDisolve(ErrorAlert);
		const { customer, err, jobs, showDeleteCustomerModal } = this.state;

		if (!customer) {
			return <React.Fragment></React.Fragment>
		}
		const { id: customerId } = customer;

		return (
			<div className="container mx-auto" >
				{err && <ErrorAlertComponent message={err.message} />}

				<Container>
					<CustomerDetails customer={customer} />
				</Container>

				<ButtonContainer>
					<ButtonLink
						buttonText="Edit Customer"
						svgPathElementD="M6.47 9.8A5 5 0 0 1 .2 3.22l3.95 3.95 2.82-2.83L3.03.41a5 5 0 0 1 6.4 6.68l10 10-2.83 2.83L6.47 9.8z"
						linkTo={`/customers/${customer.id}/edit`} />
					<ButtonDestructive
						buttonText="Delete Customer"
						onClick={this.showDeleteCustomerModal} />
				</ButtonContainer>

				<JobsCard customer={customer} jobs={jobs} />
				<ButtonContainer>
					{[<ButtonLink
						key={1}
						buttonText="Add Job"
						svgPathElementD="M11 9V5H9v4H5v2h4v4h2v-4h4V9h-4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20z"
						linkTo={`/jobs/create/customers/${customerId}`} />]}
				</ButtonContainer>

				{
					showDeleteCustomerModal &&
					<DesctructiveModal
						handleAction={(event) => this.handleCustomerDelete(event, customerId)}
						handleClose={this.hideDeleteCustomerModal}
						title="Delete Custromer"
						description="Are you sure you want to delete this customer? All of your data will be permanently removed. This action cannot be undone."
						actionName="Delete" />
				}
			</div >
		)
	}
}
