import React, { useState, useEffect, MouseEvent } from 'react'

import jobsRepository from '../../repositories/jobs/jobsRepository'
import { isValidEmail } from '../../util/formValidation';
import companiesRepository from '../../repositories/companies/companiesRepository';

interface Props {
    id: number;
    handleClose: (e: MouseEvent) => {};
}

const EmailJobModal = (props: Props) => {
    const [emailFrom, setEmailFrom] = useState('');
    const [emailTo, setEmailTo] = useState('');
    const [emailCc, setEmailCc] = useState('');

    const { handleClose } = props;

    // Similar to componentDidMount and componentDidUpdate:  
    useEffect(() => {
        companiesRepository.getCompany().then((response) => {
            const { company } = response;
            const { email } = company;
            setEmailFrom(email);
        });
    }, []);

    const emailJob = async (e: MouseEvent, props: Props, emailTo: string, emailCc?: string): Promise<void> => {
        e.preventDefault();

        if (!emailFrom || !isValidEmail(emailFrom)) {
            return;
        }

        const { id, handleClose } = props;

        if (!emailTo || !isValidEmail(emailTo)) {
            return;
        }

        handleClose(e);
        try {
            await jobsRepository.sendJobByEmail(id, emailFrom, emailTo, emailCc);
        }
        catch (err) {
            window.alert(`Sending email failed. Error message: ${err.message}`);
        }
    }

    return (
        <div className="fixed bottom-0 inset-x-0 px-4 pb-6 sm:inset-0 sm:p-0 sm:flex sm:items-center sm:justify-center">

            <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                <div>
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2h16zm-4.37 9.1L20 16v-2l-5.12-3.9L20 6V4l-10 8L0 4v2l5.12 4.1L0 14v2l6.37-4.9L10 14l3.63-2.9z" />
                        </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                            Send this job by email
                        </h3>
                        <div className="mt-2">
                            <div className="mt-2 max-w-xl text-sm leading-5 text-gray-500">
                                <div>
                                    Share information about the job with someone else, this includes job information and customer information.
                                </div>
                            </div>
                            <div className="mt-5 sm:flex sm:items-center">
                                <div className="w-full mt-1 sm:mt-0 sm:col-span-2">
                                    <div className="max-w-lg flex rounded-md shadow-sm">
                                        <span className="inline-flex w-3/12 sm:w-2/12 items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                            From:
                                        </span>
                                        <input
                                            disabled
                                            className="flex-1 form-input block w-full min-w-0 rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                            placeholder={emailFrom} />

                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:flex sm:items-center">
                                <div className="w-full mt-1 sm:mt-0 sm:col-span-2">
                                    <div className="max-w-lg flex rounded-md shadow-sm">
                                        <span className="inline-flex w-3/12 sm:w-2/12 items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                            To:
                                        </span>
                                        <input
                                            onChange={event => setEmailTo(event.target.value)} value={emailTo}
                                            id="emailTo"
                                            className={`flex-1 form-input block w-full min-w-0 rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${!isValidEmail(emailTo) && 'border border-red-500'}`}
                                            placeholder="Recipient" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-1 sm:flex sm:items-center">
                                <div className="w-full mt-1 sm:mt-0 sm:col-span-2">
                                    <div className="max-w-lg flex rounded-md shadow-sm">
                                        <span className="inline-flex w-3/12 sm:w-2/12 items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                            Cc:
                                        </span>
                                        <input
                                            onChange={event => setEmailCc(event.target.value)} value={emailCc}
                                            id="EmailCc"
                                            className="flex-1 form-input block w-full min-w-0 rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                            placeholder="Additional recipient" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <span className="flex w-full rounded-md shadow-sm sm:col-start-2">
                        <button
                            onClick={(e) => emailJob(e, props, emailTo, emailCc)}
                            type="button"
                            className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                            Send
                        </button>
                    </span>
                    <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:col-start-1">
                        <button
                            onClick={handleClose}
                            type="button"
                            className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                            Cancel
                        </button>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default EmailJobModal
