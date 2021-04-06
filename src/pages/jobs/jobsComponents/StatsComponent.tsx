import React from 'react'
import { StatComponent } from './StatComponent';

interface Props {
    jobsCounts: {
        pendingJobsCount: number,
        inProgressJobsCount: number,
        finishedJobCounts: number
    };
}


export const StatsComponent = (props: Props) => {
    const { pendingJobsCount, inProgressJobsCount, finishedJobCounts } = props.jobsCounts;
    return (
        <div>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <StatComponent
                    title='Pending'
                    count={pendingJobsCount}
                />
                <StatComponent
                    title='In Progress'
                    count={inProgressJobsCount}
                />
                <StatComponent
                    title='Finished'
                    count={finishedJobCounts}
                />
            </div>
        </div>
    )
}
