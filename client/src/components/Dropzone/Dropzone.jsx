import { useEffect } from 'react';

import { useDropzone } from 'react-dropzone';

import { Thumbnails } from '../Thumbnails/Thumbnails';
import './Dropzone.scss';

export default function Dropzone({ onUpdateImages, images, onRemoveImg }) {
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': [],
        },
        onDrop: (acceptedFiles) => {
            acceptedFiles.map((file) =>
                Object.assign(file, { preview: URL.createObjectURL(file) }),
            );

            onUpdateImages(acceptedFiles);
        },
    });

    useEffect(() => {
        return () =>
            images.forEach((image) => URL.revokeObjectURL(image.preview));
    }, [images]);

    return (
        <section className="dropzone-wrapper">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input name="images" {...getInputProps()} />
                <p>перетащите фото сюда или кликните для выбора</p>
            </div>
            <aside className="thumbsContainer">
                <Thumbnails images={images} onRemoveImg={onRemoveImg} />
            </aside>
        </section>
    );
}
