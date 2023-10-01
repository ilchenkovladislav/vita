import { TbPencil } from 'react-icons/tb';
import { CgTrashEmpty } from 'react-icons/cg';

import './Section.scss';

export function Section({ title, onShowForm, onDeleteSection }) {
    return (
        <>
            <p className="section__title">{title}</p>

            <div className="section__btns">
                <button onClick={onShowForm}>
                    <TbPencil size={20} />
                </button>
                <button onClick={onDeleteSection}>
                    <CgTrashEmpty size={20} />
                </button>
            </div>
        </>
    );
}
