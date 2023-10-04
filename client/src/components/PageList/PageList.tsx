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
import { createSection } from '../../utility/utility.ts';

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

    const onCreateTemplate = async () => {
        const newPage = {
            title: 'Новая страница',
            link: uuidv4(),
        };

        const response = await pageActionCreator.createPage(newPage);
        const pageId = response.payload[0].id;

        const newSections = [
            createSection('Идея', pageId, 0),
            createSection('Место', pageId, 1),
            createSection('Цвет', pageId, 2),
            createSection('Герои', pageId, 3),
            createSection('Стиль', pageId, 4),
        ];

        const promises = newSections.map((s) =>
            pageActionCreator.createSection({ section: s }),
        );

        await Promise.allSettled(promises);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <button onClick={onAddPage} className="page__add">
                Создать страницу
            </button>
            <button onClick={onCreateTemplate} className="page__add">
                Создать по шаблону
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
