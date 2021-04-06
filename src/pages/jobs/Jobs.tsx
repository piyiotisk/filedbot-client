import React from 'react'
import ErrorAlert from '../../components/ErrorAlert';
import withAutoDisolve from '../../components/AutoDisolveComponent';
import Container from '../../components/Container';
import jobsRepository from '../../repositories/jobs/jobsRepository';
import { StatsComponent } from './jobsComponents/StatsComponent';
import JobsCard from '../../components/JobsCard';
import { JobResponse } from '../../models/job';

interface ComponentProps {
    location: any
    history: any
};


interface ComponentState {
    jobsCounts: {
        pendingJobsCount: number,
        inProgressJobsCount: number,
        finishedJobCounts: number
    } | undefined;
    err: {
        message: string,
    } | null;
    isFetching: Boolean,
    pendingJobs: JobResponse[],
    inProgressJobs: JobResponse[],
};

export default class Jobs extends React.Component<ComponentProps, ComponentState>  {
    constructor(props: any) {
        super(props);

        this.state = {
            err: null,
            isFetching: false,
            jobsCounts: undefined,
            pendingJobs: [],
            inProgressJobs: []
        }
    }

    async componentDidMount() {
        this.setState({ isFetching: true });
        try {
            const jobsCounts = await jobsRepository.getJobsCounts();
            const pendingJobs = await jobsRepository.getPendingJobs();
            const inProgressJobs = await jobsRepository.getInProgressJobs();
            this.setState({ isFetching: false, jobsCounts, pendingJobs, inProgressJobs });
        } catch (err) {
            this.setState({ err });
        }
    }

    render() {
        const { err, jobsCounts, isFetching, pendingJobs, inProgressJobs } = this.state;
        const ErrorAlertComponent = withAutoDisolve(ErrorAlert);

        return (
            <div className="text-gray-700">
                <Container maxWidth=''>
                    <div className="overflow-hidden">
                        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Jobs
                            </h3>
                        </div>
                    </div>
                    <></>
                </Container>

                <Container maxWidth='' bgColor='bg-gray-100' shadow='shadow-none'>
                    {err && <div className="container mx-auto mt-2">
                        <ErrorAlertComponent message={err.message} />
                    </div>}
                    {isFetching &&
                        <div className="py-10 text-center font-bold">
                            Loading...
                        </div>
                    }
                    {!isFetching && jobsCounts &&
                        <>
                            <StatsComponent jobsCounts={jobsCounts} />
                        </>
                    }
                </Container>
                <JobsCard
                    title='Pending Jobs'
                    jobs={pendingJobs}
                />
                <JobsCard
                    title='In Progress Jobs'
                    jobs={inProgressJobs}
                />
            </div >
        )
    }
}
