import { Droppable } from "react-beautiful-dnd";
import { Draggable } from "react-beautiful-dnd";

import { Section } from "../Section/Section";
import "./Sections.scss";

export function Sections({ sections, pageId, onShowForm, onDeleteSection }) {
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
            onShowForm={() => onShowForm(pageId, section.id)}
            onDeleteSection={() =>
              onDeleteSection(pageId, idxSection, section.id)
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
