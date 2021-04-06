import React, { Component, Fragment, MouseEvent } from 'react'
import uuid from 'uuid';
import Autocomplete from '../../../components/Autocomplete';
import jobsRepository from '../../../repositories/jobs/jobsRepository';

interface Tag {
    name: string,
    id: string
}

interface FormValues {
    tags: Tag[],
}

interface Props {
    sendDataToParent(tags: Tag[]): void,
    tags: Tag[]
}

interface State {
    tagsSuggestions: string[],
    formValues: FormValues
}

export default class TagsPicker extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            tagsSuggestions: [],
            formValues: {
                tags: [],
            }
        };
    };

    componentDidMount = async () => {
        try {
            const tagsSuggestions = await jobsRepository.getTags();
            this.setState({
                tagsSuggestions,
            });
        } catch (err) {
            console.log(err)
        }
    }

    componentDidUpdate(prevProps: Props) {
        // Check lifecycle of react components if you don't remember
        if (this.props.tags !== prevProps.tags) {
            const { tags } = this.props;
            this.setState({
                formValues: {
                    tags: tags
                }
            });
        }
    }


    handleTagDeletion = (event: MouseEvent<HTMLButtonElement>, tagId: string) => {
        event.preventDefault();
        const { formValues } = this.state;
        const { tags } = formValues;
        const newTags = tags.filter(tag => tag.id !== tagId);
        this.setState({
            formValues: {
                ...formValues,
                tags: newTags
            }
        });
        this.props.sendDataToParent(newTags);
    }

    handleTagAddition = (data: string) => {
        const { formValues } = this.state;
        const { tags } = formValues;
        const newTag = { id: uuid.v4(), name: data };
        this.setState({
            formValues: {
                ...formValues,
                tags: [...tags, newTag]
            }
        });
        this.props.sendDataToParent([...tags, newTag]);
    }

    renderTagsPicker = () => {
        const { formValues, tagsSuggestions } = this.state;
        const { tags } = formValues;

        return (
            <Fragment>
                <div className="w-full py-2">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                        Select or create tags
                    </label>

                    <Autocomplete
                        suggestions={tagsSuggestions}
                        onAddition={(data: string) => this.handleTagAddition(data)}
                    />
                    <div className="w-full mb-3">
                        {tags.map((tag) => {
                            return (
                                <div key={tag.id} className="inline-flex bg-gray-500 rounded-full h-8 mr-2 my-1">
                                    <span className="flex-none self-center text-gray-100 h-6 px-3">{tag.name}</span>
                                    <button className="flex-1 mr-1" onClick={(event) => this.handleTagDeletion(event, tag.id)}>
                                        <svg className="fill-current h-6 w-6 text-gray-100 font-bold" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm1.41-1.41A8 8 0 1 0 15.66 4.34 8 8 0 0 0 4.34 15.66zm9.9-8.49L11.41 10l2.83 2.83-1.41 1.41L10 11.41l-2.83 2.83-1.41-1.41L8.59 10 5.76 7.17l1.41-1.41L10 8.59l2.83-2.83 1.41 1.41z" />
                                        </svg>
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                    <p className="text-gray-600 text-xs italic">Tags for the job</p>
                </div>
            </Fragment >
        )
    }

    render = () => this.renderTagsPicker();
}
