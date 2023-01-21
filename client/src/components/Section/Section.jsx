import { Draggable } from "react-beautiful-dnd";
import { TbPencil } from "react-icons/tb";
import { CgTrashEmpty } from "react-icons/cg";
import "./Section.scss";

export function Section({ id, idx, title, onShowForm, onRemoveSection }) {
  return (
    <Draggable draggableId={id.toString()} index={idx}>
      {(provided) => (
        <li
          className="section"
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <p className="section__title">{title}</p>

          <button onClick={onShowForm}>
            <TbPencil />
          </button>
          <button onClick={onRemoveSection}>
            <CgTrashEmpty />
          </button>
        </li>
      )}
    </Draggable>
  );
}
