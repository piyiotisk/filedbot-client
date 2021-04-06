import imageCompression from 'browser-image-compression';
import heic2any from "heic2any";
import uuid from 'uuid';

import jobsRepository from '../repositories/jobs/jobsRepository';

const convertToJpeg = async (heicImage: Blob): Promise<File> => {
    const convertedBlob = await heic2any({
        // documentation: https://alexcorvi.github.io/heic2any/#try
        blob: heicImage,
        toType: "image/jpeg",
        quality: 1
    });
    const file = new File([convertedBlob], uuid.v4(), { type: convertedBlob.type, lastModified: Date.now() });
    return file;
};

const compress = async (imageFile: File): Promise<File> => {
    const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 720,
        useWebWorker: false
    }
    return await imageCompression(imageFile, options) as File;
}

const getSignedUrl = async (file: File): Promise<{ signedUrl: string, imageKey: string }> => {
    const data = {
        file: {
            type: file.type
        }
    };

    const { signedUrl, key: imageKey } = await jobsRepository.getPutObjectSignedUrl(data);
    return { signedUrl, imageKey }
}

export { compress, convertToJpeg, getSignedUrl }