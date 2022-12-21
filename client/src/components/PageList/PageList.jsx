import React from "react";
import { PageItem } from "../PageItem/PageItem";

export function PageList({ pages, ulRef, onShowForm, onRemoveSection }) {
  return pages.map((page, idx) => (
    <PageItem
      key={page.id}
      ulRef={ulRef[idx]}
      page={page}
      onShowForm={onShowForm}
      onRemoveSection={onRemoveSection}
    />
  ));
}
