import React, { useState, useEffect } from 'react';

import { Dialog } from '@headlessui/react';
import { TextEditor } from '../TextEditor/TextEditor';

import API from '../../services/API';
import Dropzone from '../Dropzone/Dropzone';
import './FormAdding.scss';

export function FormAdding({
    onAddSection,
    onEditSection,
    onCloseForm,
    content,
    show,
}) {
    const [images, setImages] = useState([]);
    const [comment, setComment] = useState('');

    const [section, setSection] = useState({
        title: window.localStorage.getItem('title') ?? '',
        comment: '',
        sequence: null,
        pageId: null,
    });

    useEffect(() => {
        if (!content) {
            return;
        }

        setSection(content);
        setComment(content?.comment);

        API.getImages(content.id).then((images) => setImages(images));
    }, [content]);

    const inputHandler = (e) => {
        const { value } = e.target;

        setSection((prevData) => ({
            ...prevData,
            title: value,
        }));

        window.localStorage.setItem('title', value);
    };

    const onQuillChange = (markdown: string) => {
        if (markdown === '<p><br></p>') {
            setComment('');
        } else {
            setComment(markdown);
        }
    };

    const onRemoveImage = (idx) => {
        setImages([...images.slice(0, idx), ...images.slice(idx + 1)]);
    };

    const onUpdateImages = (images) => {
        setImages((prevImgs) => [...prevImgs, ...images]);
    };

    const clearLocalStorage = () => {
        window.localStorage.setItem('title', '');
        window.localStorage.setItem('comment', '');
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (content) {
            onEditSection({ ...section, comment }, images);
        } else {
            onAddSection({ ...section, comment }, images);
        }

        clearLocalStorage();
        onCloseForm();
    };

    return (
        <Dialog open={show} onClose={onCloseForm}>
            <div className="form__back" aria-hidden="true" />
            <div className="form__container">
                <Dialog.Panel className="form__panel">
                    <form
                        encType="multipart/form-data"
                        className="formAdding"
                        onSubmit={onSubmit}
                    >
                        <div className="formAdding__title">
                            <label htmlFor="title">название секции</label>
                            <input
                                type="text"
                                id="title"
                                value={section.title}
                                onChange={inputHandler}
                                autoFocus={!content}
                            />
                        </div>
                        <div className="formAdding__photo">
                            <label>фотографии</label>
                            <Dropzone
                                images={images}
                                onRemoveImg={onRemoveImage}
                                onUpdateImages={onUpdateImages}
                            />
                        </div>
                        <div className="formAdding__comment">
                            <label htmlFor="comment">текст</label>
                            <TextEditor
                                value={comment}
                                onChange={onQuillChange}
                            />
                        </div>
                        <button
                            onClick={onSubmit}
                            className="formAdding__btn"
                            type="submit"
                        >
                            сохранить
                        </button>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
