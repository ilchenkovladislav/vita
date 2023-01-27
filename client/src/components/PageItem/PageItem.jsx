import React, { useState, useEffect } from "react";
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
  const [isEdit, setIsEdit] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    setInput(title);
  }, [title]);

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
    if (isEdit) return <FormEditTitle />;

    return (
      <p className="page__title" onClick={() => setIsEdit(true)}>
        {title}
      </p>
    );
  };

  return (
    <li
      ref={(el) => (ulRef.current[idx] = el)}
      key={idx}
      className="page__item"
    >
      <div className="page__header">
        <Title />

        <a
          // href={`http://www.s595099.smrtp.ru/page/${link}`}
          href={`http://localhost:3000/page/${link}`}
          rel="noreferrer"
          target="_blank"
        >
          <TbExternalLink />
        </a>
      </div>

      <Sections
        sections={sections}
        pageId={id}
        onShowForm={onShowForm}
        onRemoveSection={onRemoveSection}
      />

      <div className="page__btns">
        <button onClick={() => onShowForm(id)}>
          <HiOutlineDocumentAdd />
        </button>
        <button onClick={onRemovePage}>
          <CgTrashEmpty />
        </button>
      </div>
    </li>
  );
}
