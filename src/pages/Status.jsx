import axios from 'axios';
import React, { Component } from 'react'
import API_ROOT from './../util/apiUrl';
import Container from '../components/Container';

export default class Status extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isServerOnline: false,
            isFetching: false,
        };
    }

    async componentDidMount() {

        this.setState({ isFetching: true });
        const healthcheck = await axios.get(`${API_ROOT}/healthcheck`);
        if (healthcheck.status === 200) {
            this.setState({ isServerOnline: true });
        }
        this.setState({ isFetching: false });
    }

    renderHealthyAPI = () => <svg className="fill-current text-green-500 inline-block h-8 w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z" /></svg>;
    renderUnhealthyAPI = () => <svg className="fill-current text-red-500 inline-block h-8 w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" /></svg>;

    render() {
        const { isFetching } = this.state;
        return (
            <Container maxWidth={'max-w-sm'}>
                <div className="flex mt-4 mb-4" >
                    <div className="flex-1 m-2 h-12 px-4 py-3 text-left text-gray-900">Fieldbot API</div>
                    {!isFetching && <div className="justify-end m-2 h-12 px-4 py-2">
                        {this.state.isServerOnline && this.renderHealthyAPI()}
                        {!this.state.isServerOnline && this.renderUnhealthyAPI()}
                    </div>}
                </div >
            </Container >
        )
    }
}

