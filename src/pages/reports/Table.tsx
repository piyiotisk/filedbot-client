import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Container from '../../components/Container'
import TagsCard from '../../components/TagsCard'
import { Customer } from '../../models/customer'
import { Invoice } from '../../models/invoice'
import { JobResponse } from '../../models/job'
import { StatComponent } from '../jobs/jobsComponents/StatComponent'

interface Props {
    customers: Customer[]
    jobs: JobResponse[]
    invoices: Invoice[]
}
interface State {

}

export default class Table extends Component<Props, State> {
    state = {}

    formatCurrency = (amount: any) => {
        const locale = 'en-DE';
        const currency = 'EUR'

        return (new Intl.NumberFormat(locale, {
            style: 'currency',
            currency
        }).format(amount))
    }

    calculateTotalRevenue = (invoices: Invoice[]): number => {
        let total = 0;
        for (let i = 0; i < invoices.length; i++) {
            const element = invoices[i];
            total = total + parseFloat(element.total);
        }
        return total;
    }

    render() {
        const { customers, jobs, invoices } = this.props;

        return (
            <>
                <div className="container mx-auto mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <StatComponent
                        title="Revenue"
                        count={this.formatCurrency(this.calculateTotalRevenue(invoices))}
                    />
                    <StatComponent
                        title="Jobs"
                        count={jobs.length}
                    />
                </div>

                <Container maxWidth="">
                    <div></div>
                    <div className="flex flex-col">
                        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                    Customer Details
                                            </th>
                                                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                    Job
                                            </th>
                                                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                            </th>
                                                <th className="px-6 py-3 bg-gray-50 text-right text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                    Invoice
                                            </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {(!jobs || jobs.length === 0) &&
                                                <tr>
                                                    <td className="px-6 py-4 whitespace-no-wrap text-center" colSpan={5}>
                                                        No jobs found. Search for different dates.
                                                </td>
                                                </tr>
                                            }

                                            {jobs && jobs.map((job) => {
                                                const customer = customers.find((customer) => customer.id === job.customerId)
                                                const invoice = invoices.find((invoice) => invoice.jobId === job.id)
                                                return (
                                                    <tr key={job.id}>
                                                        <td className="px-6 py-4 whitespace-no-wrap">
                                                            <div
                                                                className="flex items-center"
                                                            >
                                                                <div className="flex-shrink-0 h-10 w-10">
                                                                    <svg className="fill-current text-gray-500 h-6 w-6 m-2"
                                                                        viewBox="0 0 20 20">
                                                                        <path d="M5 5a5 5 0 0 1 10 0v2A5 5 0 0 1 5 7V5zM0 16.68A19.9 19.9 0 0 1 10 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z" />
                                                                    </svg>
                                                                </div>
                                                                <div className="ml-4">
                                                                    <Link
                                                                        to={`/customers/${customer?.id}/view`}
                                                                    >
                                                                        <div className="text-sm leading-5 font-medium text-gray-900 hover:text-indigo-700">
                                                                            {customer?.firstName} {customer?.lastName}
                                                                        </div>
                                                                        <div className="text-sm leading-5 text-gray-500 hover:text-indigo-700">
                                                                            {customer?.phone}
                                                                        </div>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-no-wra">
                                                            <div className="text-sm leading-5 text-gray-900 capitalize hover:text-indigo-700">
                                                                <Link
                                                                    to={`/jobs/${job.id}/view`}>
                                                                    {job.name}
                                                                </Link>
                                                            </div>
                                                            <div className="text-sm leading-5 text-gray-500">
                                                                <TagsCard tags={job.tags || []} />
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-no-wrap">
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                {job.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-right text-gray-500">
                                                            {invoice &&
                                                                <Link
                                                                    className="hover:text-indigo-700"
                                                                    to={`invoices/job/${job.id}`}>
                                                                    {this.formatCurrency(invoice.total)}
                                                                </Link>}
                                                            {!invoice && 'No invoice'}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container >
            </>
        )
    }
}
