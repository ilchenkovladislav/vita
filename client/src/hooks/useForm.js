import { useState } from 'react';

export const useForm = () => {
    const [show, setShow] = useState(false);
    const [pageId, setPageId] = useState(null);
    const [sectionId, setSectionId] = useState(null);

    const onShowForm = (pageId, sectionId = null) => {
        setShow((prevShow) => !prevShow);
        setPageId(pageId);
        setSectionId(sectionId);
    };

    const onCloseForm = () => {
        setShow(false);
        setPageId(null);
        setSectionId(null);
    };

    return { show, pageId, sectionId, onShowForm, onCloseForm };
};
