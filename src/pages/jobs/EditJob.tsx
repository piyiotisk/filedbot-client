import React, { RefObject, Fragment, MouseEvent, ChangeEvent } from 'react';
import uuid from 'uuid';
import Input from '../../components/Input';
import ErrorAlert from '../../components/ErrorAlert';
import withAutoDisolve from '../../components/AutoDisolveComponent';
import jobsRepository from '../../repositories/jobs/jobsRepository';
import TagsPicker from './editJobComponents/TagsPicker';
import { JobRequest } from '../../models/job';
import ImagePicker from './editJobComponents/imagePicker';
import { getSignedUrl } from '../../util/image';
import ButtonContainer from '../../components/ButtonContainer';
import ButtonWithIcon from '../../components/ButtonWithIcon';

enum JobStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    FINISHED = "FINISHED"
}

interface Tag {
    name: string,
    id: string
}

interface Employee {
    id: number,
    fullName: string
};

interface FileWithMetadata {
    originalCompressedFile: File,
    localURL: string,
    imageKey: string,
    signedUrl: string
}

interface FormValues {
    jobId: number | undefined,
    name: string,
    date: string | undefined,
    time: string | undefined,
    description: string,
    files: FileWithMetadata[] | undefined,
    status: JobStatus,
    employee: Employee | undefined,
    userId: number | undefined,
    tags: Tag[]
    street: string,
    city: string,
    state: string,
    country: string,
    postCode: string,
    [key: string]: any;
}

interface Props {
    location: any
    history: any
    job: any
};


interface State {
    err: {
        message: string,
    } | null,
    employees: Employee[],
    loadingImages: boolean,
    formValues: FormValues
};

export default class EditJob extends React.Component<Props, State> {
    fileInput: RefObject<HTMLInputElement>;

    constructor(props: Props) {
        super(props);

        this.fileInput = React.createRef();
        this.state = {
            err: null,
            employees: [],
            loadingImages: false,
            formValues: {
                jobId: undefined,
                name: '',
                date: undefined,
                time: undefined,
                description: '',
                files: undefined,
                status: JobStatus.PENDING,
                employee: undefined,
                userId: undefined,
                tags: [],
                street: '',
                city: '',
                state: '',
                country: '',
                postCode: '',
            }
        };
    };

    mapToJobDTO = (): JobRequest => {
        const { formValues } = this.state;
        const {
            name,
            date,
            time,
            description,
            files,
            status,
            customerId,
            employee,
            tags,
            street,
            city,
            state,
            country,
            postCode
        } = formValues;

        return {
            name,
            scheduledAt: date ? new Date(date + 'T' + time).toISOString() : undefined,
            description,
            images: {
                keys: files ? files.map(file => file.imageKey) : undefined
            },
            status,
            userId: employee ? employee.id : undefined,
            customerId,
            address: {
                street,
                city,
                state,
                country,
                postCode
            },
            tags: tags ? tags.map((tag) => tag.name) : undefined
        };
    }

    mapImagesFromRequest = async (images: { key: string, signedUrl: string }[]): Promise<FileWithMetadata[]> => {
        const promises = await images.map(async (image) => {
            const fileOptions: FilePropertyBag = {
                lastModified: Date.now(),
                // set the file type from key
                // keys are similar to this: '3213/e4cc35fc-218b-400a-bacc-e09fcb19451d.jpeg'
                type: 'image/' + image.key.split('.')[1]
            }
            let blob = await fetch(image.signedUrl).then(r => r.blob());
            const file = new File([blob], image.key, fileOptions);
            const { signedUrl, imageKey } = await getSignedUrl(file);
            const localURL = URL.createObjectURL(file);

            return {
                imageKey,
                signedUrl,
                localURL,
                originalCompressedFile: file
            }
        });
        return await Promise.all(promises)
    };

    componentDidMount = async () => {
        // TODO: fetch employees
        try {
            const jobId = this.props.location.pathname.split('/')[2];
            const job = await jobsRepository.getJob(jobId);
            const { address, scheduledAt } = job;
            const { tags: tagsFromResponse } = job;

            const tags: Tag[] = tagsFromResponse ? tagsFromResponse.map((tag) => {
                return {
                    id: uuid.v4(),
                    name: tag
                }
            }) : [];

            let files;
            if (job.images) {
                files = await this.mapImagesFromRequest(job.images);
            }

            const { date, time } = this.formatDateTime(scheduledAt);

            this.setState({
                formValues: {
                    ...address,
                    name: job.name,
                    date,
                    time,
                    jobId: job.id,
                    description: job.description,
                    status: job.status,
                    tags: tags,
                    companyId: job.companyId,
                    customerId: job.customerId,
                    userId: undefined,
                    employee: undefined,
                    files: files
                }
            });
        } catch (err) {
            this.setState({ err });
        }

    }

    componentWillUnmount = () => {
        // Removing the files from the app to prevent memory leaks
        const { files } = this.state.formValues;
        files?.forEach(file => URL.revokeObjectURL(file.localURL));
    }

    isInputStringValid = (formValueField: string, minLength: number, maxLength: number) => {
        let value = this.state.formValues[formValueField];
        if (!value || minLength > value.length || maxLength < value.length) {
            return false;
        }
        return true;
    }

    isInputValid = () => {
        if (!this.isInputStringValid('name', 3, 50)) {
            return false;
        }
        return true;
    }

    uploadImages = async (files: FileWithMetadata[]) => {
        const promises = files.map(async (file: FileWithMetadata) => {
            return await jobsRepository.uploadImage(file.originalCompressedFile, file.signedUrl);
        });
        await Promise.all(promises);
    };

    handleSave = async (event: MouseEvent) => {
        event.preventDefault();
        const { formValues } = this.state;
        const { files, jobId: id } = formValues;

        if (!id) {
            return;
        }

        try {
            if (this.isInputValid()) {
                if (files) {
                    await this.uploadImages(files);
                }
                const job = this.mapToJobDTO();
                await jobsRepository.updateJob(id, job);
                this.props.history.goBack();
            } else {
                // TODO: add validation
                console.log('Please fill the required fields and try again');
            }
        } catch (err) {
            // TODO: if error saving the images, maybe delete the job as well?
            this.setState({ err });
        };
    };

    handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        event.preventDefault();
        let formValues = this.state.formValues;
        let name = event.target.name; // Field name
        let value = event.target.value; // Field value
        formValues[name] = value;
        this.setState({ formValues });
    };

    handleEmployeeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const { employees, formValues } = this.state;
        const employeeId = parseInt(event.target.value);
        this.setState({
            formValues: {
                ...formValues, employee: employees[employeeId]
            }
        });
    };

    renderEmployees = () => {
        const { employees } = this.state;
        if (!employees) return;

        return (
            <Fragment>
                <div className="w-full py-2">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                        Assign employee
                    </label>
                    <div className="relative w-full">
                        {employees.length > 0 && <select
                            onChange={this.handleEmployeeChange}
                            className="block appearance-none w-full bg-gray-100 border border-gray-100 text-gray-700 py-3 px-4 mb-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                            {employees.map((employee) => <option value={employee?.id}>{employee?.fullName}</option>)}
                        </select>}
                        {employees.length === 0 && <select
                            className="block appearance-none w-full bg-gray-100 border border-gray-100 text-gray-700 py-3 px-4 mb-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                            <option value={undefined}>No Employees</option>)
                        </select>}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                    <p className="text-gray-600 text-xs italic">The employee responsible for the job</p>
                </div>
            </Fragment>
        );
    }

    renderStatusDropDown = () => {
        const { status } = this.state.formValues;

        return (
            <Fragment>
                <div className="w-full py-2">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                        Select the status of the job
                    </label>
                    <div className="relative w-full">
                        <select
                            value={status}
                            onChange={this.handleStatusChange}
                            className="block appearance-none w-full bg-gray-100 border border-gray-100 text-gray-700 py-3 px-4 mb-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                            <option value='PENDING'>Pending</option>
                            <option value='IN_PROGRESS'>In Progress</option>
                            <option value='FINISHED'>Finished</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                    <p className="text-gray-600 text-xs italic">The status of the job</p>
                </div>
            </Fragment>
        );
    }

    renderDescription = () => {
        return (<Fragment>
            <div className="w-full py-2">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Description
                </label>
                <textarea
                    className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    name='description'
                    placeholder='Air condition model X'
                    value={this.state.formValues.description}
                    cols={50}
                    rows={3}
                    onChange={this.handleInputChange} />
                <p className="text-gray-600 text-xs italic">The description of the job</p>
            </div>
        </Fragment>)
    }

    handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
        event.preventDefault();
        const input = event.target.value;
        const status = input as JobStatus;
        const { formValues } = this.state;
        this.setState({ formValues: { ...formValues, status } });
    }

    handleImagePicker = (files: FileWithMetadata[]) => {
        if (!files) {
            return;
        }

        const { formValues } = this.state;
        this.setState({
            formValues: {
                ...formValues,
                files
            }
        })
    }

    handleTagsPicker = (tags: Tag[]) => {
        const { formValues } = this.state;
        this.setState({
            formValues: {
                ...formValues,
                tags
            }
        })
    }

    goBack = (event: MouseEvent) => {
        event.preventDefault();
        this.props.history.goBack();
    }

    renderButtons = () => {
        return (
            <ButtonContainer>
                <ButtonWithIcon
                    buttonText="Save"
                    svgPathElementD="M0 2C0 .9.9 0 2 0h14l4 4v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5 0v6h10V2H5zm6 1h3v4h-3V3z"
                    onClick={this.handleSave} />
            </ButtonContainer>
        )
    }

    private formatDateTime(scheduledAt: string | undefined) {
        if (!scheduledAt) {
            return {};
        };

        let x = new Date();
        let currentTimeZoneOffsetInHours = x.getTimezoneOffset() / 60;

        const date = scheduledAt.substring(0, 10);
        let hours = (parseInt(scheduledAt.substring(11, 13)) + Math.abs(currentTimeZoneOffsetInHours)) % 24;
        const minutes = scheduledAt.substring(14, 16);

        let time: string;
        let h: string;
        if (hours < 10) {
            h = '0' + hours;
        } else {
            h = hours.toString();
        }
        time = h + ':' + minutes;
        return { date, time };
    }

    render() {
        const { err, formValues } = this.state;
        const { tags, files } = formValues;

        const ErrorAlertComponent = withAutoDisolve(ErrorAlert);

        return (
            <div className="container mx-auto py-4">
                {err && <ErrorAlertComponent message={err.message} />}
                <form className="w-full pt-8 px-8 mx-auto max-w-2xl shadow-md rounded bg-white">
                    <h2 className="block text-gray-700 text-xl font-bold mb-6">Edit job</h2>
                    <div className="flex flex-wrap mb-6">
                        <Input
                            name='name'
                            labelName='Name'
                            placeholder='Air condition service'
                            value={this.state.formValues.name}
                            onChange={this.handleInputChange} d
                            detailInputExplanation='The name of the job'
                            required={!this.isInputStringValid('name', 3, 50)} />
                        <Input
                            name='date'
                            labelName='Date'
                            type='date'
                            placeholder='2020-09-19'
                            value={this.state.formValues.date}
                            onChange={this.handleInputChange} d
                            detailInputExplanation='Date when this job is sheduled' />
                        <Input
                            name='time'
                            labelName='Time'
                            type='time'
                            placeholder='09:30:00'
                            value={this.state.formValues.time}
                            onChange={this.handleInputChange} d
                            detailInputExplanation='Time when this job is sheduled' />
                        {this.renderStatusDropDown()}
                        {this.renderDescription()}
                        {this.renderEmployees()}
                        <TagsPicker
                            sendDataToParent={this.handleTagsPicker} tags={tags} />
                        <ImagePicker
                            sendDataToParent={this.handleImagePicker} files={files} />
                    </div>
                    {this.renderButtons()}
                </form>
            </div >
        )
    }
}
