import React, { useState } from 'react';

import { Toaster } from 'react-hot-toast';

import { PageList } from '../../components/PageList/PageList';
import { FormAdding } from '../../components/FormAdding/FormAdding';
import './AdminPanel.scss';
import { Section } from '../../store/types.ts';

export function AdminPanel() {
    const [show, setShow] = useState(false);
    const [currentSection, setCurrentSection] = useState<Section>(null);

    const onShowForm = (section: Section) => {
        setShow((prevShow) => !prevShow);
        setCurrentSection(section);
    };

    const onCloseForm = () => {
        setShow(false);
        setCurrentSection(null);
    };

    return (
        <div className="admin__panel">
            <PageList onShowForm={onShowForm} />
            <FormAdding
                onCloseForm={onCloseForm}
                content={currentSection}
                show={show}
            />
            <Toaster position="bottom-right" />
        </div>
    );
}
