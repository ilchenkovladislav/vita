import React from 'react';

import { Toaster } from 'react-hot-toast';

import { useForm } from '../../hooks/useForm';
import { PageList } from '../../components/PageList/PageList';
import { FormAdding } from '../../components/FormAdding/FormAdding';
import { useStateSelector, useActionCreators } from '../../store/hooks';
import { pageAsyncActions } from '../../store/slices/pageSlice';
import './AdminPanel.scss';
import { Section } from '../../store/types.ts';

export function AdminPanel() {
    const { show, pageId, sectionId, onShowForm, onCloseForm } = useForm();
    const pages = useStateSelector((state) => state.pages.items);
    const pageActionCreator = useActionCreators(pageAsyncActions);

    const onAddSection = (section: Section, images) => {
        const pageIdx = pages.findIndex((p) => p.id === pageId);

        const newSection = {
            ...section,
            pageId,
            sequence: pages[pageIdx].sections.length,
        };

        pageActionCreator.createSection({ section: newSection, images });
    };

    const onEditSection = (section: Section, images) => {
        pageActionCreator.updateSections({ sections: [section], images });
    };

    let content = null;

    if (sectionId !== null) {
        const pageIdx = pages.findIndex((p) => p.id === pageId);
        const sectionIdx = pages[pageIdx].sections.findIndex(
            (s) => s.id === sectionId,
        );

        content = pages[pageIdx].sections[sectionIdx];
    }

    return (
        <div className="admin__panel">
            <PageList onShowForm={onShowForm} />
            <FormAdding
                onCloseForm={onCloseForm}
                onAddSection={onAddSection}
                onEditSection={onEditSection}
                content={content}
                show={show}
            />
            <Toaster position="bottom-right" />
        </div>
    );
}
