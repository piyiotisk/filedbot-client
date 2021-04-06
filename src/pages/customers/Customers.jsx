import React, { Component } from 'react'
import CustomerCard from '../../components/CustomerCard';
import customersRepository from '../../repositories/customers/customersRepository';
import ErrorAlert from '../../components/ErrorAlert';
import withAutoDisolve from '../../components/AutoDisolveComponent';
import Container from '../../components/Container';
import ButtonContainer from '../../components/ButtonContainer';
import ButtonLink from '../../components/ButtonLink';

const PAGE_LIMIT = 10;

export default class Customers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            err: null,
            customers: [],
            searchTerm: '',
            isFetching: false,
            customersCount: 0,
            currentPage: 1,
        }
    }

    async componentDidMount() {
        const { currentPage } = this.state;
        this.setState({ isFetching: true });
        try {
            const customersCount = await customersRepository.getCustomersCount();
            const customers = await customersRepository.getCustomers(currentPage, PAGE_LIMIT);
            this.setState({ customers, isFetching: false, customersCount });
        } catch (err) {
            this.setState({ err });
        }
    }

    handleSearch = async (event) => {
        try {
            const searchTerm = event.target.value;
            let { customers } = this.state;
            const { currentPage } = this.state;

            if (searchTerm.length === 0) {
                customers = await customersRepository.getCustomers(currentPage, PAGE_LIMIT);
            } else {
                customers = await customersRepository.searchCustomers(searchTerm);
            }

            if (customers) {
                this.setState({ searchTerm, customers, err: null });
            }
        } catch (err) {
            this.setState({ err });
        }
    }

    renderSearchBar = () => (
        <input className="w-full py-4 px-4 rounded-lg overflow-hidden leading-tight focus:outline-none"
            type="search" id="search" placeholder="Search"
            value={this.state.q}
            onChange={this.handleSearch}
        />
    );

    handlePagination = async (event) => {
        event.preventDefault();
        const { customersCount, currentPage } = this.state;
        const pages = ((customersCount / PAGE_LIMIT) >> 0) + 1;

        const nextPage = parseInt(event.target.value) + currentPage;

        if (nextPage >= 1 && nextPage <= pages) {
            this.setState({ isFetching: true });
            const customers = await customersRepository.getCustomers(nextPage, PAGE_LIMIT);
            this.setState({ customers, isFetching: false, customersCount, currentPage: nextPage });
        }
    }

    renderPagination = () => {
        const { customersCount } = this.state;
        const pages = (customersCount / PAGE_LIMIT) >> 0;

        if (pages > 0) {
            return (
                <nav className="px-4 py-4 flex items-center justify-between">
                    <div className="w-0 flex-1 flex">
                        <button onClick={this.handlePagination} value={-1} className="pr-1 inline-flex items-center text-sm leading-5 font-medium text-gray-500">
                            <svg className="mr-3 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                        Previous
                        </button>
                    </div>
                    <div className="w-0 flex-1 flex justify-end">
                        <button onClick={this.handlePagination} value={1} className="pl-1 inline-flex items-center text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-400 transition ease-in-out duration-150">
                            Next
                            <svg className="ml-3 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </nav>
            );
        } else {
            return;
        }
    };

    render() {
        const { err, customers, isFetching } = this.state;
        const ErrorAlertComponent = withAutoDisolve(ErrorAlert);

        return (
            <div className="text-gray-700">
                <Container maxWidth=''>
                    <div className="overflow-hidden">
                        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Customers
                            </h3>
                        </div>
                    </div>
                </Container>
                <ButtonContainer>
                    {[
                        <ButtonLink
                            key={1}
                            buttonText="Add customer"
                            linkTo="/customers/create/"
                            svgPathElementD="M11 9V5H9v4H5v2h4v4h2v-4h4V9h-4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" />
                    ]}
                </ButtonContainer>

                <Container maxWidth=''>
                    {this.renderSearchBar()}
                </Container>


                <Container maxWidth=''>
                    {err && <div className="container mx-auto mt-2">
                        <ErrorAlertComponent message={err.message} />
                    </div>}
                    {isFetching &&
                        <div className="py-10 text-center font-bold">
                            Loading...
                        </div>
                    }
                    {!isFetching && customers?.length === 0 &&
                        <div className="py-10 text-center font-bold">
                            No customers found. Please search for something else.
                        </div>
                    }
                    {!isFetching && customers && <CustomerCard customers={customers} />}
                </Container>
                <Container maxWidth={'max-w-sm'}>
                    {this.renderPagination()}
                </Container>
            </div >
        )
    }
}
