import React from 'react'
import { Link } from 'react-router-dom';
import TagsCard from './TagsCard';

interface Props {
    job: any;
}

const mapStatusToUIFriendly = (status: string): string => {
    const statusMapping: any = {
        'PENDING': 'Pending',
        'IN_PROGRESS': 'In progress',
        'FINISHED': 'Finished'
    }
    return statusMapping[status];
}

const mapStatusToCssClass = (status: string) => {
    const statusMapping: any = {
        'PENDING': 'text-gray-800 bg-gray-200',
        'IN_PROGRESS': 'text-yellow-800 bg-yellow-200',
        'FINISHED': 'text-green-800 bg-green-200'
    }
    return statusMapping[status];
}


const JobCard = (props: Props) => {
    const { job } = props;
    const { id, name, status, tags } = job;

    return (

        <li key={id} className="border-t border-gray-200">
            <Link
                to={{
                    pathname: `/jobs/${id}/view`,
                    state: {
                        jobId: id
                    }
                }}
                className="hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out">
                <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                        <div className="text-sm leading-5 font-medium text-indigo-600 truncate capitalize">
                            {name}
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${mapStatusToCssClass(status)}`}>
                                {mapStatusToUIFriendly(status)}
                            </span>
                        </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                            <div className="mr-6 flex items-center text-sm leading-5 text-gray-500">
                                <svg
                                    className="flex-shrink-0 mr-1.5 h-5 w-5"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20">
                                    <path d="M0 10V2l2-2h8l10 10-10 10L0 10zm4.5-4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                                </svg>
                                <TagsCard tags={tags} />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </li>
    )
}

export default JobCard
