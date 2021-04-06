import React from 'react'
import { Customer } from '../models/customer';

interface Props {
    customer: Customer;
}

const addressExists = (address: any) => {
    for (var key in address) {
        if (address[key] !== null && address[key] !== "")
            return true;
    }
    return false;
}


const CustomerDetails = (props: Props) => {
    const { customer } = props;

    return (
        <div className="overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Customer Information
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
                    Personal details and contact information.
                </p>
            </div>
            <div className="px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 col-gap-4 row-gap-8 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                        <dt className="text-sm leading-5 font-medium text-gray-500">
                            Full name
                        </dt>
                        <dd className="mt-1 text-sm leading-5 text-gray-900">
                            {customer.firstName} {customer.lastName}
                        </dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm leading-5 font-medium text-gray-500">
                            Phone
                        </dt>
                        <dd className="mt-1 text-sm leading-5 text-gray-900">
                            {customer.phone}
                        </dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm leading-5 font-medium text-gray-500">
                            Email address
                        </dt>
                        <dd className="mt-1 text-sm leading-5 text-gray-900">
                            {customer.email || 'No email'}
                        </dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm leading-5 font-medium text-gray-500">
                            Address
                        </dt>
                        <dd className="mt-1 text-sm leading-5 text-gray-900">
                            {!addressExists(customer.address) && 'No address'}
                            {addressExists(customer.address) &&
                                `${customer.address.street || 'No street'}, ${customer.address.state || 'No state'}, ${customer.address.city || 'No city'}, ${customer.address.country || 'No country'}, ${customer.address.postCode || 'No post code'}`
                            }
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    )
}

export default CustomerDetails
