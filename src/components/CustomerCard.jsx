import React from 'react'
import { Link } from 'react-router-dom';

const addressExists = (address) => {
    for (var key in address) {
        if (address[key] !== null && address[key] !== "")
            return true;
    }
    return false;
}

const renderCustomers = (customers) => {
    return (
        <>
            <ul>
                {customers.map((customer) => {
                    return (
                        <li key={customer.id} className="border-t border-gray-200">
                            <Link
                                className="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out"
                                to={{
                                    pathname: `/customers/${customer.id}/view`,
                                    state: {
                                        customer,
                                    }
                                }} >
                                <div className="flex items-center px-4 py-4 sm:px-6">
                                    <div className="min-w-0 flex-1 flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg className="fill-current text-gray-500 h-6 w-6 m-2"
                                                viewBox="0 0 20 20">
                                                <path d="M5 5a5 5 0 0 1 10 0v2A5 5 0 0 1 5 7V5zM0 16.68A19.9 19.9 0 0 1 10 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z" />
                                            </svg>
                                        </div>
                                        <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                                            <div>
                                                <div className="text-sm leading-5 font-medium text-indigo-600 truncate capitalize">
                                                    {`${customer.firstName} ${customer.lastName}`}
                                                </div>
                                                <div className="mt-2 flex items-center text-sm leading-5 text-gray-500">
                                                    <svg className="flex-shrink-0 mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                    </svg>
                                                    <span className="truncate">
                                                        {customer.email || 'No email'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:flex sm:justify-between">
                                                <div>
                                                    <div className="mt-2 flex items-center text-sm leading-5 text-gray-700">
                                                        <svg className="flex-shrink-0 mr-1 h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M20 18.35V19a1 1 0 0 1-1 1h-2A17 17 0 0 1 0 3V1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4c0 .56-.31 1.31-.7 1.7L3.16 8.84c1.52 3.6 4.4 6.48 8 8l2.12-2.12c.4-.4 1.15-.71 1.7-.71H19a1 1 0 0 1 .99 1v3.35z" clipRule="evenodd" />
                                                        </svg>
                                                        {customer.phone}
                                                    </div>
                                                    <div className="mt-2 flex items-center text-sm leading-5 text-gray-500">
                                                        <svg
                                                            className="flex-shrink-0 mr-1 h-5 w-5 text-red-400 fill-current"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                                                        </svg>
                                                        {!addressExists(customer.address) && 'No address'}
                                                        {addressExists(customer.address) &&
                                                            `${customer.address.street || 'No street'}, ${customer.address.state || 'No state'}, ${customer.address.city || 'No city'}, ${customer.address.country || 'No country'}, ${customer.address.postCode || 'No post code'}`
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    )
                })
                }
            </ul>
        </>
    )
}

export default function CustomerCard(props) {
    return renderCustomers(props.customers);
}
