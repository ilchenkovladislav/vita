import React from "react";
import { PageItem } from "../PageItem/PageItem";

import "./PageList.scss";

export function PageList({
  pages,
  ulRef,
  onShowForm,
  onRemoveSection,
  onRemovePage,
  onEditPage,
  onAddPage
}) {
  return (
    <ul className="page__list">
      {pages.map((page, idx) => (
        <PageItem
          idx={idx}
          ulRef={ulRef}
          key={page.id}
          page={page}
          onShowForm={onShowForm}
          onRemoveSection={onRemoveSection}
          onRemovePage={() => onRemovePage(page.id)}
          onEditPage={onEditPage}
        />
      ))}

      <button onClick={onAddPage} className="page__add">
        +
      </button>
    </ul>
  );
}
