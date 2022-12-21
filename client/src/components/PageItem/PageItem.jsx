import React from "react";
import { Section } from "../Section/Section";

export function PageItem({ ulRef, page, onShowForm, onRemoveSection }) {
  const { id, sections, title } = page;
  return (
    <ul ref={ulRef}>
      <p>{title}</p>
      {sections.map((section, idxSection) => (
        <Section
          key={section.title}
          title={section.title}
          onShowForm={() => onShowForm(id, section.id)}
          onRemoveSection={() => onRemoveSection(id, idxSection, section.id)}
        />
      ))}
      <button onClick={() => onShowForm(id)}>+</button>
    </ul>
  );
}
