import React from 'react'

export default function ErrorAlert(props) {
    return (
        <div role="alert">
            <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                Error
            </div>
            <div className="mb-4 px-4 py-3 border border-t-0 border-red-400 rounded-b bg-red-100 text-red-700">
                <p>{props.message || 'Something not ideal might be happening.'}</p>
            </div>
        </div>
    )
}
