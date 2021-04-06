import React, { Component } from 'react'
import { JobResponse } from '../../models/job';

interface Props {
    job: JobResponse
}
interface State {

}

export default class JobPdfPreview extends Component<Props, State> {
    mapStatusToUIFriendly = (status: string): string => {
        const statusMapping: any = {
            'PENDING': 'Pending',
            'IN_PROGRESS': 'In progress',
            'FINISHED': 'Finished'
        }
        return statusMapping[status];
    }

    mapStatusToCssClass = (status: string): string => {
        const statusMapping: any = {
            'PENDING': 'text-gray-800 bg-gray-200',
            'IN_PROGRESS': 'text-yellow-800 bg-yellow-200',
            'FINISHED': 'text-green-800 bg-green-200'
        }
        return statusMapping[status];
    }

    renderTags = () => {
        const { tags } = this.props.job;
        if (!tags || tags.length === 0) {
            return <div>No tags</div>;
        }

        return (
            <div className="inline-flex">
                {
                    tags.length > 0 && tags.map((tag, index) => {
                        return (
                            <div key={index} className="mr-1 flex-shrink-0 flex">
                                <span className={"px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-gray-800 bg-gray-200"}>
                                    {tag}
                                </span>
                            </div>);
                    })
                }
            </div>

        )
    };

    render() {
        const { id, name, description, status, images, userId } = this.props.job;

        return (
            <div>
                <div className="px-4 py-5 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Job Information
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
                        Job id: {id}
                    </p>
                </div>
                <div className="px-4 py-5">
                    <dl className="grid grid-cols-1 col-gap-4 row-gap-8 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <dt className="text-sm leading-5 font-medium text-gray-500">
                                Name
                                </dt>
                            <dd className="mt-1 text-sm leading-5 text-gray-900">
                                {name}
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm leading-5 font-medium text-gray-500">
                                Status
                                </dt>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${this.mapStatusToCssClass(status)}`}>
                                {this.mapStatusToUIFriendly(status)}
                            </span>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm leading-5 font-medium text-gray-500">
                                Assigned Employee
                                </dt>
                            <dd className="mt-1 text-sm leading-5 text-gray-900">
                                {userId || 'No employee has been assigned'}
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm leading-5 font-medium text-gray-500">
                                Tags
                                </dt>
                            <dd className="mt-1 text-sm leading-5 text-gray-900">
                                {this.renderTags()}
                            </dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="text-sm leading-5 font-medium text-gray-500">
                                Description
                                </dt>
                            <dd className="mt-1 text-sm leading-5 text-gray-900">
                                {description || 'No description'}
                            </dd>
                        </div>
                        {images && images.length !== 0 && <div className="sm:col-span-2">
                            <dt className="text-sm leading-5 font-medium text-gray-500">
                                Images
                                </dt>
                            <dd className="mt-1 text-sm leading-5 text-gray-900">
                                <ul className="border border-gray-200 rounded-md">
                                    {
                                        images.map((image, index) => {
                                            return (
                                                <li key={index} className="sm:inline-flex py-3 items-center justify-around">
                                                    <img className="h-full w-full sm:h-64 sm:w-64 pb-2 px-2 object-cover" src={image.signedUrl} alt={`File ${index}`} />
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </dd>
                        </div>}
                    </dl>
                </div>
            </div>
        )
    }
}
