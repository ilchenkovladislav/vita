import { Section } from "../Section/Section";

export const Sections = ({ sections, pageId, onShowForm, onRemoveSection }) => {
  return (
    <ul className="section__list">
      {sections.map((section, idxSection) => (
        <Section
          key={section.id}
          title={section.title}
          onShowForm={() => onShowForm(pageId, section.id)}
          onRemoveSection={() =>
            onRemoveSection(pageId, idxSection, section.id)
          }
        />
      ))}
    </ul>
  );
};
