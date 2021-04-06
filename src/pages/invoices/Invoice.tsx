import React, { Component, Fragment, ChangeEvent } from 'react'

import LineItems from './LineItems';
import uuid from 'uuid';
import Container from '../../components/Container';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import ButtonContainer from '../../components/ButtonContainer';
import ErrorAlert from '../../components/ErrorAlert';
import withAutoDisolve from '../../components/AutoDisolveComponent';

import invoiceRepository from '../../repositories/invoices/invoiceRepository';
import jobsRepository from '../../repositories/jobs/jobsRepository';
import customersRepository from '../../repositories/customers/customersRepository';


interface Props {
    history: any;
    match: {
        params: {
            id: number
        }
    }
}

interface State {

}

export default class Invoice extends Component<Props, State> {
    state = {
        err: null,
        id: 'initial',
        customer: undefined,
        createdAt: Date(),
        invoiceId: undefined,
        jobId: undefined,
        taxIncluded: false,
        taxRate: 19.00,
        customInvoiceId: "1234ABC",
        updatedAt: Date(),
        lineItems: [
            {
                createdAt: Date(),
                id: 'initial',      // react-beautiful-dnd unique key
                name: '',
                description: '',
                quantity: 0,
                price: 0.00,
                updatedAt: Date(),
            },
        ]
    }


    componentDidMount = async () => {
        try {
            const jobId = this.props.match.params.id;
            const job = await jobsRepository.getJob(jobId);
            const { customer } = await customersRepository.getCustomerById(job.customerId);
            this.setState({ jobId, customer });

            const invoice = await invoiceRepository.getInvoice(jobId);
            this.setState({ ...invoice });
        } catch (err) {
            console.log(err)
        }
    }

    handleInvoiceChange = (event: any) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleLineItemChange = (elementIndex: any) => (event: any) => {
        let lineItems = this.state.lineItems.map((item, i) => {
            if (elementIndex !== i) return item
            return { ...item, [event.target.name]: event.target.value }
        })
        this.setState({ lineItems })
    }

    handleAddLineItem = (event: any) => {
        this.setState({
            // use optimistic uuid for drag drop; in a production app this could be a database id
            lineItems: this.state.lineItems.concat(
                [{ createdAt: Date(), id: uuid.v4(), name: '', description: '', quantity: 0, price: 0.00, updatedAt: Date() }]
            )
        })
    }

    handleRemoveLineItem = (elementIndex: any) => (event: any) => {
        this.setState({
            lineItems: this.state.lineItems.filter((item, i) => {
                return elementIndex !== i
            })
        })
    }

    handleReorderLineItems = (newLineItems: any) => {
        this.setState({
            lineItems: newLineItems,
        })
    }

    handleFocusSelect = (event: any) => {
        event.target.select()
    }

    handleLineItemsIncludeTax = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            taxIncluded: !this.state.taxIncluded,
        })
    }

    handleSave = async (event: any) => {
        try {
            const { id, createdAt, invoiceId, jobId, taxIncluded, taxRate, customInvoiceId, updatedAt, lineItems } = this.state;
            const total = this.calcGrandTotal()
            const invoice = {
                id, createdAt, invoiceId, jobId, taxIncluded, taxRate, customInvoiceId, updatedAt, total, lineItems,
            }

            // save
            if (invoice.id === 'initial') {
                await invoiceRepository.create(invoice)
            } else {
                // update
                await invoiceRepository.update(invoice);
            }

            this.props.history.goBack();
        } catch (err) {
            this.setState({ err });
        }
    }

    formatCurrency = (amount: any) => {
        const locale = 'en-DE';
        const currency = 'EUR'

        return (new Intl.NumberFormat(locale, {
            style: 'currency',
            currency
        }).format(amount))
    }

    calcTaxAmount = (c: any) => {
        return c * (this.state.taxRate / 100)
    }

    calcLineItemsTotal = () => {
        const { taxIncluded } = this.state;

        if (taxIncluded) {
            const { taxRate } = this.state;
            const tax = taxRate / 100 + 1;

            return this.state.lineItems.reduce((prev, cur) => (prev + (cur.quantity * cur.price) / tax), 0)
        }

        return this.state.lineItems.reduce((prev, cur) => (prev + (cur.quantity * cur.price)), 0)
    }

    calcTaxTotal = () => {
        return this.calcLineItemsTotal() * (this.state.taxRate / 100)
    }

    calcGrandTotal = () => {
        return this.calcLineItemsTotal() + this.calcTaxTotal()
    }

    formatDate = (date: Date) => new Intl.DateTimeFormat('en-GB').format(date)

    render = () => {
        const { err, createdAt, updatedAt, customer } = this.state;
        const ErrorAlertComponent = withAutoDisolve(ErrorAlert);

        return (
            <Fragment>
                <Container maxWidth="">
                    {/* @ts-ignore */}
                    {err && <ErrorAlertComponent message={err.message} />}

                    <div className="px-4 py-5 border-b border-gray-200 bg-gray-200 rounded-lg rounded-b-none">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Invoice
                        </h3>
                        {customer && <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500 capitalize">
                            {/* @ts-ignore */}
                            For: {customer.firstName} {customer.lastName}
                        </p>}
                        <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
                            Created: {this.formatDate(new Date(createdAt))}
                        </p>
                        <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
                            Updated:  {this.formatDate(new Date(updatedAt))}
                        </p>
                    </div>

                    <form className="w-1/3 flex p-4">
                        <div className="mr-2">Invoice ID:</div>
                        <input className="w-1/3 h-8 text-center rounded-lg bg-gray-100" name="customInvoiceId" type="text" value={this.state.customInvoiceId} onChange={this.handleInvoiceChange} onFocus={this.handleFocusSelect} />
                    </form >

                    <form className="w-1/3 flex p-4 items-center">
                        <div className="mr-2">Tax is already included in line items</div>
                        <input className="form-checkbox h-4 w-4 text-indigo-600" type="checkbox" checked={this.state.taxIncluded} onChange={this.handleLineItemsIncludeTax} />
                    </form >

                    <div className="m-2 border rounded-lg border-gray-400">
                        <LineItems
                            items={this.state.lineItems}
                            currencyFormatter={this.formatCurrency}
                            addHandler={this.handleAddLineItem}
                            changeHandler={this.handleLineItemChange}
                            focusHandler={this.handleFocusSelect}
                            deleteHandler={this.handleRemoveLineItem}
                            reorderHandler={this.handleReorderLineItems}
                        />
                    </div>

                    <div className="flex flex-row justify-between p-4">
                        <form className="w-1/3 flex">
                            <div className="w-2/3">Tax Rate (%)</div>
                            <input className="w-1/3 h-8 text-center rounded-lg bg-gray-100" name="taxRate" type="number" step="0.10" value={this.state.taxRate} onChange={this.handleInvoiceChange} onFocus={this.handleFocusSelect} />
                        </form >

                        <form className="w-1/3 flex flex-col">
                            <div className="flex flex-row">
                                <div className="w-2/3">Subtotal</div>
                                <div className="w-1/3 text-right">{this.formatCurrency(this.calcLineItemsTotal())}</div>
                            </div>
                            <div className="flex flex-row">
                                <div className="w-2/3">Tax ({this.state.taxRate}%)</div>
                                <div className="w-1/3 text-right">{this.formatCurrency(this.calcTaxTotal())}</div>
                            </div>
                            <div className="flex flex-row mt-4 text-green-400 font-semibold">
                                <div className="w-2/3">Total Due</div>
                                <div className="w-1/3 text-right">{this.formatCurrency(this.calcGrandTotal())}</div>
                            </div >
                        </form >
                    </div >
                </Container >
                <ButtonContainer>
                    <ButtonWithIcon
                        buttonText="Save"
                        svgPathElementD="M0 2C0 .9.9 0 2 0h14l4 4v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5 0v6h10V2H5zm6 1h3v4h-3V3z"
                        onClick={this.handleSave}
                    />
                </ButtonContainer>
            </Fragment >
        )
    }
}