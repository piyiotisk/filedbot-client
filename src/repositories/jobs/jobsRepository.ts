import { axiosWithToken, axiosWithoutToken } from '../../util/axiosClient';
import { JobRequest, JobResponse } from '../../models/job';

const createJob = async (job: JobRequest) => {
    try {
        const response = await axiosWithToken.post(`/jobs`, job);

        if (response.status !== 201) {
            throw Error();
        }
        return response.data.job;
    } catch (err) {
        throw Error('Creating job failed');
    }
}

const updateJob = async (id: number, job: JobRequest): Promise<JobResponse> => {
    try {
        const response = await axiosWithToken.put(`/jobs/${id}`, job);

        if (response.status !== 200) {
            throw Error();
        }
        return response.data.job;
    } catch (err) {
        console.log(err)
        throw Error('Updating job failed');
    }
}

const getPutObjectSignedUrl = async (data: any): Promise<{ signedUrl: string, key: string }> => {
    try {
        const response = await axiosWithToken.post(`/jobs/images/uploadUrl`, data);

        if (response.status !== 200) {
            throw Error();
        }
        return response.data;
    } catch (err) {
        throw Error('Getting signed PUT url failed');
    }
}

const uploadImage = async (file: File, signedUrl: string) => {
    try {
        // delete Authorization header since it won't match the expected request from s3
        const options = {
            headers: {
                'x-amz-acl': 'private',
                'Content-Type': file.type
            }
        };

        const response = await axiosWithoutToken.put(signedUrl, file, options);

        if (response.status !== 200) {
            throw Error();
        }
        return response;
    } catch (err) {
        throw Error('Uploading image failed');
    }
}

const getTags = async () => {
    try {
        const response = await axiosWithToken.get('/jobs/tags');
        if (response.status !== 200) {
            throw Error();
        }
        return response.data.tags || [];
    } catch (err) {
        throw Error('Getting tags failed');
    }
}

const deleteJob = async (id: number) => {
    try {
        if (!id) {
            return;
        }
        const response = await axiosWithToken.delete(`/jobs/${id}`);
        if (response.status !== 204) {
            throw Error();
        }
        return;
    } catch (err) {
        throw Error(`Error deleting job with id: ${id}`);
    }
}

const getJob = async (id: number): Promise<JobResponse> => {
    try {
        const response = await axiosWithToken.get(`/jobs/${id}`);
        if (response.status !== 200) {
            throw Error();
        }
        return response.data.job;
    } catch (err) {
        throw Error(`Error getting job with id: ${id}`);
    }
}

const getPendingJobs = async (): Promise<JobResponse[]> => {
    try {
        const response = await axiosWithToken.get(`/jobs/pending`);
        if (response.status !== 200) {
            throw Error();
        }
        return response.data.jobs;
    } catch (err) {
        throw Error(`Error getting pending jobs`);
    }
}

const getInProgressJobs = async (): Promise<JobResponse[]> => {
    try {
        const response = await axiosWithToken.get(`/jobs/inprogress`);
        if (response.status !== 200) {
            throw Error();
        }
        return response.data.jobs;
    } catch (err) {
        throw Error(`Error getting in progress jobs`);
    }
}

const getFinishedJobs = async (fromDate: Date, toDate: Date): Promise<JobResponse[]> => {
    try {
        const params = {
            fromDate,
            toDate
        };

        const response = await axiosWithToken.get(`/jobs/finished`, { params });
        if (response.status !== 200) {
            throw Error();
        }
        return response.data.jobs;
    } catch (err) {
        throw Error(`Error getting finished jobs`);
    }
}

const getJobsCounts = async (): Promise<any> => {
    try {
        const response = await axiosWithToken.get(`/jobs/counts`);
        if (response.status !== 200) {
            throw Error();
        }
        return response.data.jobCounts;
    } catch (err) {
        throw Error(`Error getting job counts`);
    }
}

const sendJobByEmail = async (id: number, emailFrom: string, emailTo: string, emailCc?: string): Promise<void> => {
    const requestBody = {
        emailTo,
        emailCc
    }
    const response = await axiosWithToken.post(`/jobs/${id}/email`, requestBody, { timeout: 10000 });
    if (response.status !== 200) {
        throw Error(`Received response with status code: ${response.status}`);
    }
}

export default {
    createJob, updateJob, deleteJob, getPutObjectSignedUrl,
    uploadImage, getTags, getJob, sendJobByEmail, getJobsCounts,
    getPendingJobs, getInProgressJobs, getFinishedJobs
}