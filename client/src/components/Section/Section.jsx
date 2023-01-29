import { TbPencil } from "react-icons/tb";
import { CgTrashEmpty } from "react-icons/cg";

import "./Section.scss";

export function Section({ title, onShowForm, onDeleteSection }) {
  return (
    <>
      <p className="section__title">{title}</p>

      <button onClick={onShowForm}>
        <TbPencil />
      </button>
      <button onClick={onDeleteSection}>
        <CgTrashEmpty />
      </button>
    </>
  );
}
