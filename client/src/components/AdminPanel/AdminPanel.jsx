import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { FormAdding } from "../FormAdding/FormAdding";
import { PageList } from "../PageList/PageList";
import "./AdminPanel.scss";
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
    section.sequence = pages[idxPage].sections.length + 1;

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
    copy[idxPage].sections.forEach((section) => {
      editSectionOnServer(section);
    });
  };

  const onAddPage = () => {
    const title = "Новая страница";
    const link = crypto.randomUUID();
    addPageOnServer(title, link).then((res) =>
      setPages((prev) => [
        ...prev,
        { id: res.lastId, title, link, sections: [] },
      ])
    );
  };

  const onRemovePage = (id) => {
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
    }, editPageOnServer(id, title));
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
      />
      {form}
    </div>
  );
}
