import React, { useState, useRef, useEffect } from "react";
import { Section } from "../Section/Section";

export function PageItem({
  page,
  onShowForm,
  onRemoveSection,
  onRemovePage,
  onEditPage,
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

  const Sections = () => {
    return sections.map((section, idxSection) => (
      <Section
        key={section.id}
        title={section.title}
        onShowForm={() => onShowForm(id, section.id)}
        onRemoveSection={() => onRemoveSection(id, idxSection, section.id)}
      />
    ));
  };

  return (
    <>
      {edit ? <FormEditTitle /> : <p onClick={() => setEdit(true)}>{title}</p>}

      <Sections />

      <button onClick={() => onShowForm(id)}>+</button>
      <button onClick={onRemovePage}>-</button>
      <a href={`http://localhost:3000/page/${link}`} target="_blank">
        тп
      </a>
    </>
  );
}
