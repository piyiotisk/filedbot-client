import React, { ChangeEvent } from 'react'
import ErrorAlert from '../../components/ErrorAlert';
import withAutoDisolve from '../../components/AutoDisolveComponent';
import Container from '../../components/Container';
import Input from '../../components/Input';
import jobsRepository from '../../repositories/jobs/jobsRepository';
import { JobResponse } from '../../models/job';
import ButtonContainer from '../../components/ButtonContainer';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import Table from './Table';
import customersRepository from '../../repositories/customers/customersRepository';
import { Customer } from '../../models/customer';
import invoiceRepository from '../../repositories/invoices/invoiceRepository';
import { Invoice } from '../../models/invoice';

interface ComponentProps {
    location: any
    history: any
};


interface ComponentState {
    customers: Customer[];
    err: {
        message: string,
    } | null;
    formValues: {
        fromDate: string;
        toDate: string;
        [key: string]: any;
    };
    jobs: JobResponse[];
    filteredJobs: JobResponse[];
    filteredInvoices: Invoice[];
    tags: string[] | null;
    selectedTags: string[];
    invoices: Invoice[];
    reports: [{
        customer: Customer,
        job: JobResponse,
        invoice: Invoice
    }] | undefined
}

export default class Reports extends React.Component<ComponentProps, ComponentState>  {
    constructor(props: any) {
        super(props);

        this.state = {
            customers: [],
            err: null,
            formValues: {
                fromDate: '',
                toDate: '',
            },
            jobs: [],
            filteredJobs: [],
            filteredInvoices: [],
            tags: null,
            selectedTags: [],
            invoices: [],
            reports: undefined
        }
    }

    filterJobs = (selectedTags: string[], jobs: JobResponse[]): JobResponse[] | [] => {
        const filteredJobs = jobs.filter((job: JobResponse) => {
            const tags = job.tags;
            const success = selectedTags.every((selectedTag) => tags?.includes(selectedTag))
            if (success) {
                return job;
            }
            return undefined;
        })
        return filteredJobs;
    }

    filterInvoices = (jobs: JobResponse[]): Invoice[] | [] => {
        const { invoices } = this.state;
        let result = jobs.map((job) => {
            return invoices.find((invoice) => invoice.jobId === job.id)
        })
        return result as Invoice[]
    }

    private extractTags = (jobs: JobResponse[]): string[] | null => {
        const tags = jobs.flatMap((job) => job.tags as string[]);
        let unique = [...new Set(tags)];
        return unique;
    }

    private async extractCustomers(jobs: JobResponse[]): Promise<Customer[]> {
        const customerIds = jobs.map((job) => job.customerId);
        const uniqueCustomerIds = [...new Set(customerIds)];
        const promises = uniqueCustomerIds.map(async (customerId) => {
            const { customer } = await customersRepository.getCustomerById(customerId);
            return customer;
        });
        return await Promise.all(promises);
    }

    private async extractInvoices(jobs: JobResponse[]) {
        const invoicesPromises = jobs.map(async (job) => await invoiceRepository.getInvoice(job.id));
        const invoicesPromisesRejectedFullfilled = await Promise.allSettled(invoicesPromises);
        const invoicesResults = invoicesPromisesRejectedFullfilled.filter(p => p.status === 'fulfilled') as PromiseFulfilledResult<Invoice>[];
        return invoicesResults.map((res) => res.value);
    }

    // private generateReport = (customers: Customer[], jobs: JobResponse[], invoices: Invoice[]) => {
    //     const invoicesMap: Map<number, Invoice> = new Map();
    //     invoices.forEach((invoice) => invoicesMap.set(invoice.jobId, invoice));

    //     const invJobs = jobs.map((job) => {
    //         const invoice: Invoice = invoicesMap.get(job.id);
    //         return { job, invoice }
    //     })
    //     const invJobsMap: any = invJobs.forEach((invJob) => invJob[invJob.job.customerId] = invJob)

    //     const result = customers.map((customer) => {
    //         const invJob = invJobsMap[customer.id]
    //         return { customer, job: invJob.job, invoice: invJob.invoice }
    //     })
    // }

    search = async () => {
        try {
            const { fromDate, toDate } = this.state.formValues;
            if (fromDate === '' || toDate === '') {
                return;
            }
            const jobs = await jobsRepository.getFinishedJobs(new Date(fromDate), new Date(toDate));

            const tags = this.extractTags(jobs);
            const customers = await this.extractCustomers(jobs);
            const invoices = await this.extractInvoices(jobs);

            // const report = generateReport(customers, jobs, invoices);

            this.setState({ jobs, tags, filteredJobs: jobs, customers, invoices, filteredInvoices: invoices });
        } catch (err) {
            this.setState({ err });
        }
    }

    handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        event.preventDefault();
        let formValues = this.state.formValues;
        let name = event.target.name; // Field name
        let value = event.target.value; // Field value
        formValues[name] = value;
        this.setState({ formValues });
    };

    handleTagPick = async (event: any) => {
        event.preventDefault();
        let value = event.target.value; // Field value

        if (value === null || value === '') {
            const filteredJobs = this.state.jobs;
            const filteredInvoices = this.state.invoices;
            this.setState({ selectedTags: [], filteredJobs, filteredInvoices })
        } else {
            const { selectedTags, jobs } = this.state;
            selectedTags.indexOf(value) === -1 ? selectedTags.push(value) : console.log("This item already exists");
            const filteredJobs = this.filterJobs(selectedTags, jobs);
            const filteredInvoices = this.filterInvoices(filteredJobs);
            this.setState({ selectedTags, filteredJobs, filteredInvoices })
        }
    }

    handleCustomerChange = (event: any) => {
        const customerId = event.target.value;
        let { customers, jobs, tags, invoices } = this.state;

        if (customerId === '0') {
            this.setState({ filteredJobs: jobs, tags: this.extractTags(jobs), filteredInvoices: invoices })
            return;
        }

        const customer = customers.find((c) => c.id.toString() === customerId) as Customer
        const jobsForCustomer = jobs.filter((job) => job.customerId === customer.id);

        tags = this.extractTags(jobsForCustomer);
        const filteredInvoices = this.filterInvoices(jobsForCustomer);
        this.setState({ filteredJobs: jobsForCustomer, tags, selectedTags: [], filteredInvoices })
    }

    renderTags = (tags: string[] | null) => {
        if (!tags || tags.length === 0) {
            return <div>No tags</div>;
        }

        return (
            <div className="inline-flex">
                {
                    tags.length > 0 && tags.map((tag: string, index: number) => {
                        return (
                            <div key={index} className="mr-1 flex-shrink-0 flex">
                                <button
                                    className={"px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-gray-800 bg-gray-200"}
                                    value={tag}
                                    onClick={this.handleTagPick}>
                                    {tag || 'All'}
                                </button>
                            </div>);
                    })
                }
            </div>

        )
    };

    render() {
        const { err, tags, selectedTags, customers } = this.state;
        const ErrorAlertComponent = withAutoDisolve(ErrorAlert);

        return (
            <div className="text-gray-700">
                <Container maxWidth=''>
                    <div className="overflow-hidden">
                        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Reports
                            </h3>
                        </div>
                    </div>
                    <></>
                </Container>

                <Container maxWidth=''>
                    {err && <div className="container mx-auto mt-2">
                        <ErrorAlertComponent message={err.message} />
                    </div>}
                    <div className="flex">
                        <div className="flex-1 m-4">
                            <Input
                                required
                                name='fromDate'
                                labelName='From Date'
                                type='date'
                                placeholder='2020-09-19'
                                value={this.state.formValues.fromDate}
                                onChange={this.handleInputChange}
                                detailInputExplanation='Find jobs finished after this date' />
                        </div>
                        <div className="flex-1 m-4">
                            <Input
                                required
                                name='toDate'
                                labelName='To Date'
                                type='date'
                                placeholder='2020-09-19'
                                value={this.state.formValues.toDate}
                                onChange={this.handleInputChange}
                                detailInputExplanation='Find jobs finished before this date' />
                        </div>
                    </div>
                    <div className="m-4">
                        <select name="customer" id="customer"
                            onChange={this.handleCustomerChange}
                            className="block appearance-none bg-gray-100 border border-gray-100 text-gray-900 py-3 px-4 mb-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                            <option key={0} value={0}>All customers</option>
                            {customers && customers.length > 0 &&
                                customers.map((customer) => {
                                    return <option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}</option>
                                })}
                        </select>
                    </div>
                    <div className="m-4">
                        <div>
                            Available Tags
                        </div>
                        {this.renderTags(tags)}
                    </div>
                    <div className="m-4">
                        <div>
                            Selected Tags
                        </div>
                        {this.renderTags(selectedTags)}
                    </div>
                    <div className="m-4">
                        <ButtonContainer>
                            <ButtonWithIcon
                                buttonText="Search"
                                svgPathElementD="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"
                                onClick={this.search} />
                        </ButtonContainer>
                    </div>
                </Container>
                <Table
                    customers={this.state.customers}
                    jobs={this.state.filteredJobs}
                    invoices={this.state.filteredInvoices}
                />
            </div >
        )
    }
}
