import React, { Fragment } from 'react';

export default function ErrorAlert(props) {

    return (
        <Fragment>
            <div className="bg-green-500 text-white font-bold rounded-t px-4 py-2">
                Success
                    </div>
            <div className="mb-4 px-4 py-3 border border-t-0 border-green-400 rounded-b bg-green-100 text-gray-900">
                <p>{props.message || 'The action was succesful'}</p>
            </div>
        </Fragment>
    )
}
