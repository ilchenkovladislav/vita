import React from "react";
import { PageItem } from "../PageItem/PageItem";

export function PageList({
  pages,
  ulRef,
  onShowForm,
  onRemoveSection,
  onRemovePage,
  onEditPage,
}) {
  return pages.map((page, idx) => (
    <ul ref={(el) => (ulRef.current[idx] = el)} key={idx}>
      <PageItem
        key={page.id}
        page={page}
        onShowForm={onShowForm}
        onRemoveSection={onRemoveSection}
        onRemovePage={() => onRemovePage(page.id)}
        onEditPage={onEditPage}
      />
    </ul>
  ));
}
