import React from 'react'
import JobCard from './JobCard';
import Container from './Container';

interface Props {
    title: string | undefined;
    jobs: any[];
}

const JobsCard = (props: Props) => {

    const { jobs, title } = props;

    return (
        <Container maxWidth=''>
            <div className="overflow-hidden">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {!jobs && 'No jobs found'}
                        {jobs && jobs.length === 0 && 'No jobs found'}
                        {jobs && jobs.length !== 0 && (title || 'Jobs')}
                    </h3>
                </div>
            </div>
            {jobs && <ul>
                {jobs.map((job, index) => <JobCard key={index} job={job} />)}
            </ul>}
        </Container>
    );
}
export default JobsCard;
