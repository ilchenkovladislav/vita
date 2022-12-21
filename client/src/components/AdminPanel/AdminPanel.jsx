import React, { useState, useEffect } from "react";
import { useRef, createRef } from "react";
import { FormAdding } from "../FormAdding/FormAdding";
import { PageList } from "../PageList/PageList";
import "./AdminPanel.scss";
import {
  getPages,
  deleteSectionOnServer,
  addSectionOnServer,
  editSectionOnServer,
  getIdxById,
} from "../../hooks/func";

export function AdminPanel() {
  const [pages, setPages] = useState([]);
  const [show, setShow] = useState(false);
  const [pageId, setPageId] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const ulRef = useRef([]);

  useEffect(() => {
    getPages().then((pages) =>
      setPages(pages, (ulRef.current = pages.map(() => createRef())))
    );
  }, []);

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
      ...pages[idxPage].sections.slice(idxSection + 1),
    ];

    setPages(copy, deleteSectionOnServer(idSection));
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
  return (
    <div className="Page">
      <PageList
        pages={pages}
        ulRef={ulRef.current}
        onShowForm={onShowForm}
        onRemoveSection={onRemoveSection}
      />
      {show ? (
        <FormAdding
          currentElement={ulRef.current[getIdxById(pageId, pages)]}
          onCloseForm={onCloseForm}
          onAddSection={onAddSection}
          onEditSection={onEditSection}
          content={content}
        />
      ) : null}

      <button className="page__add">+</button>
    </div>
  );
}
