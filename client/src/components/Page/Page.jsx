import React, { useState, useEffect } from "react";
import { useRef, createRef } from "react";
import FormAdding from "../FormAdding/FormAdding";
import "./Page.scss";

export default function Page(props) {
  const [pages, setPages] = useState([]);
  const [show, setShow] = useState(false);
  const [pageId, setPageId] = useState();
  const [sectionId, setSectionId] = useState(null);
  const ulRef = useRef([]);
  ulRef.current = pages.map((_, i) => ulRef.current[i] ?? createRef());

  useEffect(() => {
    try {
      const fetchPages = async () => {
        const response = await fetch("http://vita/server/");
        const pages = await response.json();
        const res = pages.map((page) => ({
          id: page.id,
          sections: JSON.parse(page.page),
        }));
        setPages(res);
      };

      fetchPages();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const removeSection = (idxPage, idxSection) => {
    let copy = [...pages];
    copy[idxPage].sections = [
      ...pages[idxPage].sections.slice(0, idxSection),
      ...pages[idxPage].sections.slice(idxSection + 1),
    ];

    setPages(copy, updatePageOnServer(pages[idxPage]));
  };

  const addSection = (idxPage, section) => {
    const copy = [...pages];
    copy[idxPage].sections.push(section);
    setPages(copy, updatePageOnServer(pages[idxPage]));
  };

  const convertPageToJson = (page) => {
    let copy = { ...page };
    copy.sections = JSON.stringify(page.sections);

    return JSON.stringify(copy);
  };

  const updatePageOnServer = async (page) => {
    try {
      const res = await fetch("http://vita/server/", {
        method: "PUT",
        headers: { "Content-Type": "application/json;charset=utf-8" },
        body: convertPageToJson(page),
      });

      const result = await res.json();
      result.status
        ? alert("Запись успешно добавлена")
        : alert("Не удалось добавить запись");
    } catch (error) {
      console.error(error);
    }
  };

  const showForm = (id, idxSection = null) => {
    setShow((prevShow) => !prevShow);
    setPageId(id);
    setSectionId(idxSection);
  };

  return (
    <div className="Page">
      {pages.map((page, idxPage) => {
        return (
          <>
            <ul ref={ulRef.current[idxPage]}>
              <p>Страница № {idxPage}</p>
              {page.sections.map((section, idxSection) => {
                return (
                  <li>
                    {section.title}
                    <button onClick={() => showForm(idxPage, idxSection)}>
                      ред
                    </button>
                    <button onClick={() => removeSection(idxPage, idxSection)}>
                      -
                    </button>
                  </li>
                );
              })}
              <button onClick={() => showForm(idxPage)}>+</button>
            </ul>
          </>
        );
      })}
      <FormAdding
        pageId={pageId}
        ulishka={ulRef}
        onClose={() => setShow(false)}
        onAdd={addSection}
        show={show}
        section={
          sectionId === null
            ? {
                title: "",
                images: [],
                comment: "",
              }
            : pages[pageId].sections[sectionId]
        }
      />
      <button className="page__add">+</button>
    </div>
  );
}
