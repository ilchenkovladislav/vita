import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { FormAdding } from "../FormAdding/FormAdding";
import { PageList } from "../PageList/PageList";
import "./AdminPanel.scss";
import { Toaster } from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';

import {
  getPages,
  deleteSectionOnServer,
  addSectionOnServer,
  editSectionOnServer,
  getIdxById,
  addPageOnServer,
  removePageOnServer,
  editPageOnServer,
} from "../../hooks/func";

export function AdminPanel() {
  const [pages, setPages] = useState([]);
  const [show, setShow] = useState(false);
  const [pageId, setPageId] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const ulRef = useRef([]);

  useEffect(() => {
    getPages().then((pages) => {
      setPages(pages);
    });
  }, []);

  useEffect(() => {
    ulRef.current = ulRef.current.slice(0, pages.length);
  }, [pages]);

  const onAddSection = (section, imgs) => {
    const idxPage = getIdxById(pageId, pages);
    section.page_id = pageId;
    section.sequence = pages[idxPage].sections.length;

    addSectionOnServer(section, imgs).then((id) => {
      const copy = [...pages];
      copy[idxPage].sections.push(Object.assign(section, { id: Number(id) }));
      setPages(copy);
    });
  };

  const onEditSection = (section, imgs) => {
    const idxPage = getIdxById(pageId, pages);
    const idxSection = getIdxById(sectionId, pages[idxPage].sections);
    const copy = [...pages];
    copy[idxPage].sections[idxSection] = section;
    setPages(copy, editSectionOnServer(section, imgs));
  };

  const onRemoveSection = (pageId, idxSection, idSection) => {
    const idxPage = getIdxById(pageId, pages);
    let copy = [...pages];
    copy[idxPage].sections = [
      ...pages[idxPage].sections.slice(0, idxSection),
      ...pages[idxPage].sections
        .slice(idxSection + 1)
        .map((section) =>
          Object.assign(section, { sequence: section.sequence - 1 })
        ),
    ];

    setPages(copy);

    deleteSectionOnServer(idSection);

    for (const section of copy[idxPage].sections) {
      editSectionOnServer(section);
    }
  };

  const onAddPage = () => {
    const title = "Новая страница";
    const link = uuidv4();
    addPageOnServer(title, link).then((res) =>
      setPages((prev) => [
        ...prev,
        { id: Number(res.lastId), title, link, sections: [] },
      ])
    );
  };

  const onRemovePage = (id) => {
    window.localStorage.setItem("tempState", JSON.stringify(pages));

    const pageIdx = getIdxById(id, pages);
    setPages((prev) => [...prev.slice(0, pageIdx), ...prev.slice(pageIdx + 1)]);

    removePageOnServer(id);
  };

  const onEditPage = (id, title) => {
    const pageIdx = getIdxById(id, pages);
    let edPage = pages[pageIdx];
    edPage.title = title;
    setPages((prev) => {
      return [...prev.slice(0, pageIdx), edPage, ...prev.slice(pageIdx + 1)];
    });
    editPageOnServer(id, title);
  };

  const onShowForm = (pageId, sectionId = null) => {
    setShow((prevShow) => !prevShow);
    setPageId(pageId);
    setSectionId(sectionId);
  };

  const onCloseForm = () => {
    setShow(false);
    setPageId(null);
    setSectionId(null);
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (destination.droppableId === source.droppableId) {
      const pageIdx = getIdxById(Number(source.droppableId), pages);
      let copy = [...pages];
      copy[pageIdx].sections[source.index].sequence = destination.index;

      if (source.index < destination.index) {
        copy[pageIdx].sections = copy[pageIdx].sections.map((section) => {
          if (section.sequence < destination.index) {
            return Object.assign(section, { sequence: section.sequence - 1 });
          }

          return section;
        });
        copy[pageIdx].sections[destination.index].sequence =
          destination.index - 1;
      }

      if (source.index > destination.index) {
        copy[pageIdx].sections = copy[pageIdx].sections.map((section) => {
          if (section.sequence > destination.index) {
            return Object.assign(section, { sequence: section.sequence + 1 });
          }

          return section;
        });
        copy[pageIdx].sections[destination.index].sequence =
          destination.index + 1;
      }

      copy[pageIdx].sections.sort((a, b) => a.sequence - b.sequence);

      setPages(copy);

      for (const section of copy[pageIdx].sections) {
        editSectionOnServer(section);
      }
    }

    if (destination.droppableId !== source.droppableId) {
      const sourcePageIdx = getIdxById(Number(source.droppableId), pages);
      const destinationPageIdx = getIdxById(
        Number(destination.droppableId),
        pages
      );
      let copy = [...pages];

      copy[sourcePageIdx].sections[source.index].sequence = destination.index;

      copy[sourcePageIdx].sections[source.index].page_id = Number(
        destination.droppableId
      );

      copy[destinationPageIdx].sections.push(
        copy[sourcePageIdx].sections[source.index]
      );

      copy[sourcePageIdx].sections = [
        ...copy[sourcePageIdx].sections.slice(0, source.index),
        ...copy[sourcePageIdx].sections.slice(source.index + 1),
      ];

      copy[sourcePageIdx].sections = copy[sourcePageIdx].sections.map(
        (section) => {
          if (section.sequence > source.index) {
            return Object.assign(section, { sequence: section.sequence - 1 });
          }

          return section;
        }
      );

      copy[destinationPageIdx].sections = copy[destinationPageIdx].sections.map(
        (section) => {
          if (section.sequence > destination.index) {
            return Object.assign(section, { sequence: section.sequence + 1 });
          }

          return section;
        }
      );

      if (destination.index !== copy[destinationPageIdx].sections.length - 1) {
        copy[destinationPageIdx].sections[destination.index].sequence =
          destination.index + 1;
      }

      copy[sourcePageIdx].sections.sort((a, b) => a.sequence - b.sequence);
      copy[destinationPageIdx].sections.sort((a, b) => a.sequence - b.sequence);

      setPages(copy);

      for (const section of copy[sourcePageIdx].sections) {
        editSectionOnServer(section);
      }

      for (const section of copy[destinationPageIdx].sections) {
        editSectionOnServer(section);
      }
    }
  };

  let content =
    sectionId === null
      ? null
      : pages[getIdxById(pageId, pages)].sections[
          getIdxById(sectionId, pages[getIdxById(pageId, pages)].sections)
        ];

  const form = show ? (
    <FormAdding
      currentElement={ulRef.current[getIdxById(pageId, pages)]}
      onCloseForm={onCloseForm}
      onAddSection={onAddSection}
      onEditSection={onEditSection}
      content={content}
    />
  ) : null;

  return (
    <div className="admin__panel">
      <PageList
        pages={pages}
        ulRef={ulRef}
        onShowForm={onShowForm}
        onRemoveSection={onRemoveSection}
        onRemovePage={onRemovePage}
        onEditPage={onEditPage}
        onAddPage={onAddPage}
        onDragEnd={onDragEnd}
      />
      {form}
      <Toaster position="bottom-right" />
    </div>
  );
}
