import React, { useState } from "react";

import { HiOutlineDocumentAdd } from "react-icons/hi";
import { CgTrashEmpty } from "react-icons/cg";
import { TbExternalLink } from "react-icons/tb";

import { Sections } from "../Sections/Sections";
import { PageSettings } from "../PageSettings/PageSettings";
import "./PageItem.scss";

export function PageItem({
  page: { id, sections, title, link },
  onShowForm,
  onDeleteSection,
  onRemovePage,
  onEditPage,
}) {
  const [isEdit, setIsEdit] = useState(false);
  const [input, setInput] = useState(title);

  const onSubmit = (e) => {
    e.preventDefault();
    setIsEdit(false);
    onEditPage(id, input);
  };

  const onChangeInput = (e) => {
    setInput(e.target.value);
  };

  const FormEditTitle = () => {
    return (
      <form onSubmit={onSubmit}>
        <input type="text" onChange={onChangeInput} value={input} autoFocus />
      </form>
    );
  };

  const Title = () => {
    return (
      <p className="page__title" onClick={() => setIsEdit(true)}>
        {title}
      </p>
    );
  };

  return (
    <>
      <div className="page__header">
        {isEdit ? <FormEditTitle /> : <Title />}
        <PageSettings pageId={id} />
        <a
          href={
            window.location.host === "localhost:5173"
              ? `http://localhost:5173/page/${link}`
              : `https://vita-photofilm.ru/page/${link}`
          }
          rel="noreferrer"
          target="_blank"
          className="page__link"
        >
          <TbExternalLink size={20} />
        </a>
      </div>

      <Sections
        sections={sections}
        pageId={id}
        onShowForm={onShowForm}
        onDeleteSection={onDeleteSection}
      />

      <div className="page__btns">
        <button onClick={() => onShowForm(id)}>
          <HiOutlineDocumentAdd size={20} />
        </button>
        <button onClick={onRemovePage}>
          <CgTrashEmpty size={20} />
        </button>
      </div>
    </>
  );
}
