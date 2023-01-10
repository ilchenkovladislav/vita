import React, { useState, useRef, useEffect } from "react";
import { Sections } from "../Sections/Sections";

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
      {edit ? <FormEditTitle /> : <p onClick={() => setEdit(true)}>{title}</p>}

      <Sections
        sections={sections}
        pageId={id}
        onShowForm={onShowForm}
        onRemoveSection={onRemoveSection}
      />

      <button onClick={() => onShowForm(id)}>+</button>
      <button onClick={onRemovePage}>-</button>

      <a href={`http://localhost:3000/page/${link}`} target="_blank">
        тп
      </a>
    </li>
  );
}
