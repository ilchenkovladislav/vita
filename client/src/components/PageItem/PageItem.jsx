import React, { useState, useRef, useEffect } from "react";
import { Sections } from "../Sections/Sections";
import "./PageItem.scss";

import { HiOutlineDocumentAdd } from "react-icons/hi";
import { CgTrashEmpty } from "react-icons/cg";
import { TbExternalLink } from "react-icons/tb";

export function PageItem({
  page,
  onShowForm,
  onRemoveSection,
  onRemovePage,
  onEditPage,
  ulRef,
  idx,
}) {
  const { id, sections, title, link } = page;
  const [edit, setEdit] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    setInput(title);
  }, [title]);

  const onSubmit = (e) => {
    e.preventDefault();
    setEdit(false);
    onEditPage(id, input);
  };

  const onChangeInput = (e) => {
    setInput(e.target.value);
  };

  const FormEditTitle = () => {
    return (
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          type="text"
          onChange={onChangeInput}
          value={input}
          autoFocus
        />
      </form>
    );
  };

  return (
    <li
      ref={(el) => (ulRef.current[idx] = el)}
      key={idx}
      className="page__item"
    >
      <div className="page__header">
        {edit ? (
          <FormEditTitle />
        ) : (
          <p className="page__title" onClick={() => setEdit(true)}>
            {title}
          </p>
        )}

        <a href={`http://localhost:3000/page/${link}`} rel="noreferrer" target="_blank">
          <TbExternalLink />
        </a>
      </div>

      <Sections
        sections={sections}
        pageId={id}
        onShowForm={onShowForm}
        onRemoveSection={onRemoveSection}
      />

      <button onClick={() => onShowForm(id)}>
        <HiOutlineDocumentAdd />
      </button>
      <button onClick={onRemovePage}>
        <CgTrashEmpty />
      </button>
    </li>
  );
}
