import React, { useState, useEffect } from 'react';

import { Dialog } from '@headlessui/react';
import { TextEditor } from '../TextEditor/TextEditor';

import API from '../../services/API';
import Dropzone from '../Dropzone/Dropzone';
import './FormAdding.scss';
import { Section } from '../../store/types.ts';
import { useActionCreators, useStateSelector } from '../../store/hooks.ts';
import { getIndexById } from '../../utility/utility.ts';
import { pageAsyncActions } from '../../store/slices/pageSlice.ts';

export function FormAdding({ onCloseForm, content, show }) {
    const pages = useStateSelector((state) => state.pages.items);
    const pageActionCreator = useActionCreators(pageAsyncActions);

    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (!content) {
            setTitle('');
            setComment('');
            setImages([]);
            return;
        }

        setTitle(content?.title);
        setComment(content?.comment);

        API.getImages(content.id).then((images) => setImages(images));
    }, [content]);

    const inputHandler = (e) => {
        const { value } = e.target;

        setTitle(value);
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

    const onAddSection = (
        section: { title: string; comment: string; pageId: number },
        images,
    ) => {
        const pageIdx = getIndexById(pages, section.pageId);

        const newSection = {
            ...section,
            sequence: pages[pageIdx].sections.length,
        };

        pageActionCreator.createSection({ section: newSection, images });
    };

    const onEditSection = (section: Section, images) => {
        pageActionCreator.updateSections({ sections: [section], images });
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (content?.id) {
            onEditSection({ ...content, title, comment }, images);
        } else {
            onAddSection({ title, comment, pageId: content }, images);
        }

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
                                value={title ?? ''}
                                onChange={inputHandler}
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
                                value={comment ?? ''}
                                onChange={onQuillChange}
                            />
                        </div>
                        <button className="formAdding__btn" type="submit">
                            сохранить
                        </button>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
