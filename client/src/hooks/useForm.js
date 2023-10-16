import { useState, useEffect, useCallback } from 'react';

export const useForm = () => {
    const [show, setShow] = useState(false);
    const [pageId, setPageId] = useState(null);
    const [sectionId, setSectionId] = useState(null);

    const onKeydown = useCallback((e) => {
        switch (e.key) {
            case 'Escape':
                onCloseForm();
                break;
            default:
                return;
        }
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', onKeydown);
    }, [onKeydown]);

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
