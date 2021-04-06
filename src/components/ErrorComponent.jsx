import React from 'react'
import Container from './Container'

export default function ErrorComponent(props) {
    return (
        <Container maxWidth="max-w-md">
            <div className="shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="block text-gray-700 text-xl font-bold mb-6">Something went wrong :/</h2>
                <div className="mb-4">
                    <p className="block text-gray-700 text-sm font-bold mb-2">
                        {props.message || ''}
                    </p>
                </div>
            </div>
        </Container>)
}
