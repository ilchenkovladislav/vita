import React, { Suspense, useState } from 'react';

import { HiOutlineDocumentAdd } from 'react-icons/hi';
import { CgTrashEmpty } from 'react-icons/cg';
import { TbExternalLink } from 'react-icons/tb';

import { Sections } from '../Sections/Sections';
import { PageSettingsAsync } from '../PageSettings/PageSettingsAsync.ts';
import './PageItem.scss';
import { Page, pageAsyncActions } from '../../store/slices/pageSlice';
import { useActionCreators } from '../../store/hooks';

export function PageItem({ page, onShowForm, onRemovePage }) {
    const pageActions = useActionCreators(pageAsyncActions);

    const [isEdit, setIsEdit] = useState(false);
    const [title, setTitle] = useState(page.title);

    const onEditPage = (page: Page) => {
        pageActions.updatePage(page);
    };

    const onStoreTitle = () => {
        setIsEdit(false);
        onEditPage({ ...page, title });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        onStoreTitle();
    };

    const onChangeInput = (e) => {
        setTitle(e.target.value);
    };

    const onBlurInput = () => {
        onStoreTitle();
    };

    const FormEditTitle = () => {
        return (
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    onChange={onChangeInput}
                    value={title}
                    onBlur={onBlurInput}
                    autoFocus
                />
            </form>
        );
    };

    const Title = () => {
        return (
            <p className="page__title" onClick={() => setIsEdit(true)}>
                {page.title}
            </p>
        );
    };

    return (
        <>
            <div className="page__header">
                {isEdit ? <FormEditTitle /> : <Title />}
                <Suspense fallback={<p>Загрузка...</p>}>
                    <PageSettingsAsync pageId={page.id} />
                </Suspense>
                <a
                    href={
                        window.location.host === 'localhost:5173'
                            ? `http://localhost:5173/page/${page.link}`
                            : `https://vita-photofilm.ru/page/${page.link}`
                    }
                    rel="noreferrer"
                    target="_blank"
                    className="page__link"
                >
                    <TbExternalLink size={20} />
                </a>
            </div>

            <Sections
                sections={page.sections}
                pageId={page.id}
                onShowForm={onShowForm}
            />

            <div className="page__btns">
                <button onClick={() => onShowForm(page.id)}>
                    <HiOutlineDocumentAdd size={20} />
                </button>
                <button onClick={onRemovePage}>
                    <CgTrashEmpty size={20} />
                </button>
            </div>
        </>
    );
}
