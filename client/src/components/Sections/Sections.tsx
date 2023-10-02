import { Droppable, Draggable } from 'react-beautiful-dnd';

import { Section } from '../Section/Section';
import './Sections.scss';
import { useActionCreators, useStateSelector } from '../../store/hooks.ts';
import { pageAsyncActions } from '../../store/slices/pageSlice.ts';

export function Sections({ sections, pageId, onShowForm }) {
    const pages = useStateSelector((state) => state.pages.items);
    const pageActionCreator = useActionCreators(pageAsyncActions);

    const onDeleteSection = (pageId: number, sectionIdx: number) => {
        const pageIdx = pages.findIndex((p) => p.id === pageId);

        pageActionCreator.deleteSection(pages[pageIdx].sections[sectionIdx]);
        pageActionCreator.updateSections({
            sections: pages[pageIdx].sections
                .slice(sectionIdx + 1)
                .map((section) => ({
                    ...section,
                    sequence: section.sequence - 1,
                })),
        });
    };

    const elements = sections.map((section, idxSection) => (
        <Draggable
            draggableId={section.id.toString()}
            key={section.id}
            index={idxSection}
        >
            {(provided) => (
                <li
                    className="sections__item"
                    ref={provided.innerRef}
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}
                >
                    <Section
                        title={section.title}
                        onShowForm={() => onShowForm(section)}
                        onDeleteSection={() =>
                            onDeleteSection(pageId, idxSection)
                        }
                    />
                </li>
            )}
        </Draggable>
    ));

    return (
        <Droppable droppableId={pageId.toString()}>
            {(provided) => (
                <ul
                    className="sections"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    {elements}
                    {provided.placeholder}
                </ul>
            )}
        </Droppable>
    );
}
