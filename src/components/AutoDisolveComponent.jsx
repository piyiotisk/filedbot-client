import React, { Component, Fragment } from 'react';

export default function withAutoDisolveComponent(WrappedComponent) {
    return class extends Component {
        constructor(props) {
            super(props);
            this.state = {
                showComponent: true
            };
        }

        componentDidMount() {
            setTimeout(() => this.setState({ showComponent: false }), 2000);
        };

        render() {
            return (
                <Fragment>
                    {
                        this.state.showComponent &&
                        <WrappedComponent {...this.props} />
                    }
                </Fragment>);
        }
    };
}
