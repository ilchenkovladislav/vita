import React from "react";

import { DragDropContext } from "react-beautiful-dnd";

import { PageItem } from "../PageItem/PageItem";
import "./PageList.scss";

export function PageList({
  pages,
  onShowForm,
  onDeleteSection,
  onRemovePage,
  onEditPage,
  onAddPage,
  onDragEnd,
}) {
  const elements = pages.map((page, idx) => (
    <li key={page.id} className="page__item">
      <PageItem
        page={page}
        onShowForm={onShowForm}
        onDeleteSection={onDeleteSection}
        onRemovePage={() => onRemovePage(page.id)}
        onEditPage={onEditPage}
      />
    </li>
  ));

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <ul className="page__list">
        {elements}
        <button onClick={onAddPage} className="page__add">
          +
        </button>
      </ul>
    </DragDropContext>
  );
}
