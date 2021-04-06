import React, { Component } from 'react';
import ReactToPrint from 'react-to-print';

import DesctructiveModal from '../../components/DesctructiveModal';
import EmailJobModal from './EmailJobModal';
import jobsRepository from '../../repositories/jobs/jobsRepository';
import Container from '../../components/Container';
import ButtonLink from '../../components/ButtonLink';
import ButtonDestructive from '../../components/ButtonDestructive';
import ButtonContainer from '../../components/ButtonContainer';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import JobPdfPreview from './JobPdfPreview';
import customersRepository from '../../repositories/customers/customersRepository';


export default class ViewJob extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customer: undefined,
            job: undefined,
            err: null,
            showDeleteJobModal: false,
            showEmailJobModal: false
        };
    };

    async componentDidMount() {
        try {
            const jobId = this.props.location.pathname.split('/')[2];
            const job = await jobsRepository.getJob(jobId);
            const { customer } = await customersRepository.getCustomerById(job.customerId);
            this.setState({ job, customer });
        } catch (err) {
            console.log(err);
        }
    }

    showEmailJobModal = (event) => {
        event.preventDefault();
        this.setState({ showEmailJobModal: true });
    };

    hideEmailJobModal = (event) => {
        event.preventDefault();
        this.setState({ showEmailJobModal: false });
    };

    showDeleteJobModal = (event) => {
        event.preventDefault();
        this.setState({ showDeleteJobModal: true });
    };

    hideDeleteJobModal = (event) => {
        event.preventDefault();
        this.setState({ showDeleteJobModal: false });
    };

    handleJobDelete = async (event) => {
        event.preventDefault();
        try {
            const { id, customerId } = this.state.job;
            await jobsRepository.deleteJob(id);
            this.props.history.push(`/customers/${customerId}/view`);
        } catch (err) {
            this.setState({ err });
        }
    };

    mapStatusToUIFriendly = (status) => {
        const statusMapping = {
            'PENDING': 'Pending',
            'IN_PROGRESS': 'In progress',
            'FINISHED': 'Finished'
        }
        return statusMapping[status];
    }

    mapStatusToCssClass = (status) => {
        const statusMapping = {
            'PENDING': 'text-gray-800 bg-gray-200',
            'IN_PROGRESS': 'text-yellow-800 bg-yellow-200',
            'FINISHED': 'text-green-800 bg-green-200'
        }
        return statusMapping[status];
    }

    renderTags = () => {
        const { tags } = this.state.job;
        if (!tags || tags.length === 0) {
            return <div>No tags</div>;
        }

        return (
            <div className="inline-flex">
                {
                    tags.length > 0 && tags.map((tag, index) => {
                        return (
                            <div key={index} className="mr-1 flex-shrink-0 flex">
                                <span className={"px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-gray-800 bg-gray-200"}>
                                    {tag}
                                </span>
                            </div>);
                    })
                }
            </div>

        )
    };

    formatDateTime(scheduledAt) {
        if (!scheduledAt) {
            return null
        }
        let x = new Date();
        let currentTimeZoneOffsetInHours = x.getTimezoneOffset() / 60;

        const date = scheduledAt.substring(0, 10);
        let hours = (parseInt(scheduledAt.substring(11, 13)) + Math.abs(currentTimeZoneOffsetInHours)) % 24;
        const minutes = scheduledAt.substring(14, 16);

        let time;
        let h;
        if (hours < 10) {
            h = '0' + hours;
        } else {
            h = hours.toString();
        }
        time = h + ':' + minutes;
        return date + ' ' + time;
    }

    render() {
        const { job, showEmailJobModal, showDeleteJobModal, customer } = this.state;

        if (!job) {
            return (
                <Container>
                    Loading...
                </Container>
            )
        }

        const { id, name, description, status, images, userId, scheduledAt } = job;

        const datetime = this.formatDateTime(scheduledAt);

        return (
            <React.Fragment>
                <Container>
                    <div className="px-4 py-5 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Job Information
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
                            Job details and attachments.
                        </p>
                    </div>
                    <div className="px-4 py-5">
                        <dl className="grid grid-cols-1 col-gap-4 row-gap-8 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <dt className="text-sm leading-5 font-medium text-gray-500">
                                    Customer
                                </dt>
                                <dd className="mt-1 text-sm leading-5 text-gray-900 capitalize">
                                    {customer.firstName} {customer.lastName}
                                </dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm leading-5 font-medium text-gray-500">
                                    Name
                                </dt>
                                <dd className="mt-1 text-sm leading-5 text-gray-900">
                                    {name}
                                </dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm leading-5 font-medium text-gray-500">
                                    Scheduled At:
                                </dt>
                                <dd className="mt-1 text-sm leading-5 text-gray-900">
                                    {datetime || 'Not scheduled'}
                                </dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm leading-5 font-medium text-gray-500">
                                    Status
                                </dt>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${this.mapStatusToCssClass(status)}`}>
                                    {this.mapStatusToUIFriendly(status)}
                                </span>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm leading-5 font-medium text-gray-500">
                                    Assigned Employee
                                </dt>
                                <dd className="mt-1 text-sm leading-5 text-gray-900">
                                    {userId || 'No employee has been assigned'}
                                </dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm leading-5 font-medium text-gray-500">
                                    Tags
                                </dt>
                                <dd className="mt-1 text-sm leading-5 text-gray-900">
                                    {this.renderTags()}
                                </dd>
                            </div>
                            <div className="sm:col-span-2">
                                <dt className="text-sm leading-5 font-medium text-gray-500">
                                    Description
                                </dt>
                                <dd className="mt-1 text-sm leading-5 text-gray-900">
                                    {description || 'No description'}
                                </dd>
                            </div>
                            {images && images.length !== 0 && <div className="sm:col-span-2">
                                <dt className="text-sm leading-5 font-medium text-gray-500">
                                    Images
                                </dt>
                                <dd className="mt-1 text-sm leading-5 text-gray-900">
                                    <ul className="border border-gray-200 rounded-md">
                                        {
                                            images.map((image, index) => {
                                                return (
                                                    <li key={index} className="sm:inline-flex py-3 items-center justify-around">
                                                        <img className="h-full w-full sm:h-64 sm:w-64 pb-2 px-2 object-cover" src={image.signedUrl} alt={`File ${index}`} />
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </dd>
                            </div>}
                        </dl>
                    </div>
                </Container>
                <ButtonContainer>
                    <ButtonLink
                        buttonText="Edit Job"
                        linkTo={`/jobs/${id}/edit`}
                        svgPathElementD="M6.47 9.8A5 5 0 0 1 .2 3.22l3.95 3.95 2.82-2.83L3.03.41a5 5 0 0 1 6.4 6.68l10 10-2.83 2.83L6.47 9.8z"
                    />
                    <ReactToPrint
                        trigger={() => {
                            return <ButtonWithIcon
                                buttonText="Print Job"
                                svgPathElementD="M4 16H0V6h20v10h-4v4H4v-4zm2-4v6h8v-6H6zM4 0h12v5H4V0zM2 8v2h2V8H2zm4 0v2h2V8H6z"
                            />;
                        }}
                        content={() => this.componentRef}
                    />
                    <ButtonLink
                        buttonText="Invoice"
                        linkTo={`/invoices/job/${id}`}
                        svgPathElementD="M18 6V4H2v2h16zm0 4H2v6h16v-6zM0 4c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm4 8h4v2H4v-2z"
                    />
                    <ButtonWithIcon
                        buttonText="Email Job"
                        onClick={this.showEmailJobModal}
                        svgPathElementD="M18 2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2h16zm-4.37 9.1L20 16v-2l-5.12-3.9L20 6V4l-10 8L0 4v2l5.12 4.1L0 14v2l6.37-4.9L10 14l3.63-2.9z"
                    />
                    <ButtonDestructive
                        buttonText="Delete Job"
                        onClick={this.showDeleteJobModal}
                    />
                </ButtonContainer>
                <div style={{ display: "none" }}><JobPdfPreview job={job} ref={el => (this.componentRef = el)} /></div>

                {showDeleteJobModal &&
                    <DesctructiveModal
                        handleAction={this.handleJobDelete}
                        handleClose={this.hideDeleteJobModal}
                        title="Delete Job"
                        description=" Are you sure you want to delete this job? All of your data will be permanently removed. This action cannot be undone."
                        actionName="Delete" />
                }
                {showEmailJobModal &&
                    <EmailJobModal
                        id={id}
                        handleClose={this.hideEmailJobModal}
                    />}
            </React.Fragment>
        )
    }
}
