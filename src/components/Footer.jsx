import React from 'react'


export default function Footer() {
    return (
        <footer className="w-full text-center text-indigo-100 p-8 pin-b bg-indigo-600">
            <div className="container mx-auto flex items-center justify-between flex-col md:flex-row py-4">
                <div className="text-center md:text-left">
                    <p className="mt-2">Made in London, UK</p>
                </div>
                <ul className="text-left md:text-left my-4 md:m-0 list-reset">
                    <li>Give us <a href="/feedback" target="_blank" className="light-text font-medium mr-4 underline">Feedback</a></li>
                    <li>Contact us <a href="/contact" className="light-text font-medium mr-4 underline">via email</a></li>
                </ul>
            </div>
            <p className="text-center text-indigo-200 text-xs">
                &copy;{new Date().getFullYear()} Fieldbot.io - All rights reserved.
            </p>
        </footer>
    )
}
