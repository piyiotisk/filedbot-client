import React, { Component, RefObject, Fragment, MouseEvent, ChangeEvent } from 'react';

import { compress, convertToJpeg } from '../../../util/image';
import jobsRepository from '../../../repositories/jobs/jobsRepository';

interface FileWithMetadata {
    originalCompressedFile: File,
    localURL: string,
    imageKey: string,
    signedUrl: string
}

interface FormValues {
    files: FileWithMetadata[],
}

interface Props {
    sendDataToParent(files: FileWithMetadata[]): void,
}

interface State {
    loadingImages: boolean,
    formValues: FormValues
}

export default class ImagePicker extends Component<Props, State> {
    fileInput: RefObject<HTMLInputElement>;

    constructor(props: Props) {
        super(props);

        this.fileInput = React.createRef();
        this.state = {
            loadingImages: false,
            formValues: {
                files: [],
            }
        };
    };

    sendDataToParent = () => {
        const { files } = this.state.formValues;
        this.props.sendDataToParent(files);
    }

    handleImageCompression = async (files: File[]): Promise<File[]> => {
        return await Promise.all(files.map((file: File) => compress(file)));
    };

    handleConversionFromHeicToJpeg = async (files: Blob[]): Promise<File[]> => {
        return await Promise.all(files.map((file: Blob) => convertToJpeg(file)));
    };

    addSignedUrls = async (files: { originalCompressedFile: File, localURL: string }[]) => {
        const result = files.map(async (file) => {
            const data = {
                file: {
                    type: file.originalCompressedFile.type,
                }
            };
            const { signedUrl, key: imageKey } = await jobsRepository.getPutObjectSignedUrl(data);
            return { signedUrl, imageKey, ...file };
        });
        return result;
    };

    fileSelectedHandler = async (event: ChangeEvent<HTMLInputElement>) => {
        const { formValues } = this.state;
        this.setState({ loadingImages: true });

        let inputFiles: File[] = [];
        const fileList = event.target.files;
        if (fileList) {
            for (let i = 0; i < fileList.length; i++) {
                const file = fileList.item(i);
                if (file) {
                    inputFiles.push(file);
                }
            }
        }

        const heicFiles = inputFiles.filter(file => file.type === 'image/heic');
        const otherFiles = inputFiles.filter(file => file.type !== 'image/heic');
        // convert .heic files to jpeg or png
        const convertedFiles = await this.handleConversionFromHeicToJpeg(heicFiles);

        const allFiles = [...convertedFiles, ...otherFiles];

        // Reduce images size
        const compressedFiles = await this.handleImageCompression(allFiles);

        const filesWithMetadata = compressedFiles.map((file: File) => {
            const originalCompressedFile = file;
            const localURL = URL.createObjectURL(file);
            return {
                originalCompressedFile,
                localURL
            }
        });

        const promises = await this.addSignedUrls(filesWithMetadata);
        const filesWithSignedUrlsAndKeys = await Promise.all(promises);

        const files = [...this.state.formValues.files, ...filesWithSignedUrlsAndKeys];
        this.setState({ loadingImages: false, formValues: { ...formValues, files } });
        this.sendDataToParent();
    };

    handleRemoveImage = (event: MouseEvent<HTMLButtonElement>, id: number) => {
        event.preventDefault();
        const { formValues } = this.state;
        const { files } = formValues;

        if (files.length === 0) {
            return;
        }
        const removed = files.splice(id, 1);
        removed.forEach(file => URL.revokeObjectURL(file.localURL));
        this.setState({ formValues: { ...formValues, files } });
        this.sendDataToParent();
    };

    renderImagePicker = () => {
        const { formValues, loadingImages } = this.state;
        const { files } = formValues;

        return (
            <Fragment>
                <div className="mt-4 mb-4 w-full sm:w-auto">
                    <label htmlFor="images"
                        className="block text-center justify-center px-4 py-4 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150">
                        <svg className={`${loadingImages && 'loading'} fill-current inline-block h-4 w-4 mr-2`} viewBox="0 0 20 20"><path d="M13 10v6H7v-6H2l8-8 8 8h-5zM0 18h20v2H0v-2z" /></svg>
                        Upload Images
                    </label>
                    <p className="text-gray-600 text-xs italic">Accepted image formats are .jpeg, .jpg, .png and .heic</p>

                    <input
                        className="hidden"
                        ref={this.fileInput}
                        type="file" multiple
                        accept="image/png,image/jpeg,image/jpg,image/heic"
                        name="images"
                        id="images"
                        onChange={this.fileSelectedHandler}
                    />
                </div>
                {files.length > 0 &&
                    files.map((file, index) => {
                        return (
                            <div key={index} className="relative p-2 mx-2 my-2">
                                <button className="absolute top-0 right-0 rounded-full" onClick={(event) => this.handleRemoveImage(event, index)}>
                                    <svg className="fill-current inline-block h-6 w-6 text-red-600 bg-gray-100" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm1.41-1.41A8 8 0 1 0 15.66 4.34 8 8 0 0 0 4.34 15.66zm9.9-8.49L11.41 10l2.83 2.83-1.41 1.41L10 11.41l-2.83 2.83-1.41-1.41L8.59 10 5.76 7.17l1.41-1.41L10 8.59l2.83-2.83 1.41 1.41z" /></svg>
                                </button>
                                <img
                                    alt=''
                                    className="h-12 w-12 object-cover"
                                    src={file.localURL}
                                />
                            </div>
                        )
                    })
                }
            </Fragment>
        );
    };

    render = () => this.renderImagePicker();
}
