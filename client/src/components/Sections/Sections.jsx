import { Section } from "../Section/Section";
import "./Sections.scss";

import { Droppable } from "react-beautiful-dnd";

export function Sections({ sections, pageId, onShowForm, onRemoveSection }) {
  return (
    <Droppable droppableId={pageId.toString()}>
      {(provided) => (
        <ul
          ref={provided.innerRef}
          className="sections"
          {...provided.droppableProps}
        >
          {sections.map((section, idxSection) => (
            <Section
              id={section.id}
              idx={idxSection}
              key={section.id}
              title={section.title}
              onShowForm={() => onShowForm(pageId, section.id)}
              onRemoveSection={() =>
                onRemoveSection(pageId, idxSection, section.id)
              }
            />
          ))}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  );
}
