import { Draggable } from "react-beautiful-dnd";

export function Section({ id, idx, title, onShowForm, onRemoveSection }) {
  return (
    <Draggable draggableId={id.toString()} index={idx} key={id.toString()}>
      {(provided) => (
        <li
          className="section__item"
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          {title}
          <button onClick={onShowForm}>ред</button>
          <button onClick={onRemoveSection}>-</button>
        </li>
      )}
    </Draggable>
  );
}
