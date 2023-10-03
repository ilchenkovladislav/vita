import React from 'react';

import { DragDropContext } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';

import { PageItem } from '../PageItem/PageItem';
import './PageList.scss';
import { pageAsyncActions, pageActions } from '../../store/slices/pageSlice';
import {
    useActionCreators,
    useAppDispatch,
    useStateSelector,
} from '../../store/hooks';

export function PageList({ onShowForm }) {
    const pages = useStateSelector((state) => state.pages.items);
    const pageActionCreator = useActionCreators(pageAsyncActions);
    const dispatch = useAppDispatch();

    const onAddPage = () => {
        const newPage = {
            title: 'Новая страница',
            link: uuidv4(),
        };

        pageActionCreator.createPage(newPage);
    };

    const onRemovePage = (pageId) => {
        pageActionCreator.deletePage(pageId);
    };

    const onDragEnd = (result) => {
        dispatch(pageActions.onDragEnd(result));
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <button onClick={onAddPage} className="page__add">
                Создать страницу
            </button>
            <ul className="page__list">
                {pages.map((page) => (
                    <li key={page.id} className="page__item">
                        <PageItem
                            page={page}
                            onShowForm={onShowForm}
                            onRemovePage={() => onRemovePage(page.id)}
                        />
                    </li>
                ))}
            </ul>
        </DragDropContext>
    );
}
