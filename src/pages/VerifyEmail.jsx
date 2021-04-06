import React from 'react'
import Container from '../components/Container'

export default function VerifyEmail() {
    return (
        <Container maxWidth="max-w-md">
            <div className="shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="block text-gray-900 text-2xl font-bold mb-6">Thanks for signing up!</h2>
                <div className="mb-4">
                    <p className="block text-gray-700 text-sm font-bold mb-2">
                        You should receive an email with a link to verify your account. Check your spam folder as well.
                    </p>
                </div>

            </div>
        </Container>)
}
