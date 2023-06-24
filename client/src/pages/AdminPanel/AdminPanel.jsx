import React, { useState, useEffect } from "react";

import { Toaster } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

import { useForm } from "../../hooks/useForm";
import { PageList } from "../../components/PageList/PageList";
import { FormAdding } from "../../components/FormAdding/FormAdding";
import "./AdminPanel.scss";
import API from "../../services/API";

export function AdminPanel() {
  const [pages, setPages] = useState([]);
  const { show, pageId, sectionId, onShowForm, onCloseForm } = useForm();

  useEffect(() => {
    API.getPages().then((pages) => {
      setPages(pages);
    });
  }, []);

  const onAddSection = (section, images) => {
    const pageIdx = pages.findIndex((p) => p.id === pageId);

    section.pageId = pageId;
    section.sequence = pages[pageIdx].sections.length;

    API.addSectionOnServer(section).then((sectionId) => {
      section.id = Number(sectionId);

      if (images.length) {
        API.addImagesOnServer(images, sectionId);
      }

      const copyPages = [...pages];
      copyPages[pageIdx].sections.push(section);
      setPages(copyPages);
    });
  };

  const onEditSection = (section, images) => {
    const pageIdx = pages.findIndex((p) => p.id === pageId);
    const sectionIdx = pages[pageIdx].sections.findIndex(
      (s) => s.id === section.id
    );

    const copyPages = [...pages];
    copyPages[pageIdx].sections[sectionIdx] = section;

    setPages(copyPages);

    API.editSectionOnServer(section);
    API.editImagesOnServer(images, section.id);
  };

  const onDeleteSection = (pageId, sectionIdx, sectionId) => {
    const pageIdx = pages.findIndex((p) => p.id === pageId);

    let copyPages = [...pages];

    copyPages[pageIdx].sections = [
      ...pages[pageIdx].sections.slice(0, sectionIdx),
      ...pages[pageIdx].sections
        .slice(sectionIdx + 1)
        .map((section) => ({ ...section, sequence: section.sequence - 1 })),
    ];

    setPages(copyPages);

    API.deleteSectionOnServer(sectionId);

    for (const section of copyPages[pageIdx].sections) {
      API.editSectionOnServer(section);
    }
  };

  const onAddPage = () => {
    const page = {
      title: "Новая страница",
      link: uuidv4(),
    };

    API.addPageOnServer(page).then((id) =>
      setPages((prev) => [
        ...prev,
        {
          id: Number(id),
          title: page.title,
          link: page.link,
          sections: [],
        },
      ])
    );
  };

  const onRemovePage = (pageId) => {
    const pageIdx = pages.findIndex((p) => p.id === pageId);

    setPages((prev) => [...prev.slice(0, pageIdx), ...prev.slice(pageIdx + 1)]);

    API.removePageOnServer(pageId);
  };

  const onEditPage = (pageId, title) => {
    const pageIdx = pages.findIndex((p) => p.id === pageId);

    const copyPage = { ...pages[pageIdx] };
    copyPage.title = title;

    setPages((prev) => {
      return [...prev.slice(0, pageIdx), copyPage, ...prev.slice(pageIdx + 1)];
    });

    API.editPageOnServer(pageId, title);
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
      const pageIdx = pages.findIndex(
        (p) => p.id === Number(source.droppableId)
      );

      let copyPages = [...pages];

      const pageSections = copyPages[pageIdx].sections;
      const sourceSection = pageSections[source.index];
      const destinationSection = pageSections[destination.index];

      sourceSection.sequence = destination.index;

      if (source.index < destination.index) {
        for (const section of pageSections) {
          if (section.sequence < destination.index) {
            section.sequence = section.sequence - 1;
          }
        }

        destinationSection.sequence = destination.index - 1;
      }

      if (source.index > destination.index) {
        for (const section of pageSections) {
          if (section.sequence > destination.index) {
            section.sequence = section.sequence + 1;
          }
        }

        destinationSection.sequence = destination.index + 1;
      }

      pageSections.sort((a, b) => a.sequence - b.sequence);

      setPages(copyPages);

      for (const section of copyPages[pageIdx].sections) {
        API.editSectionOnServer(section);
      }
    }

    if (destination.droppableId !== source.droppableId) {
      const sourcePageIdx = pages.findIndex(
        (p) => p.id === Number(source.droppableId)
      );

      const destinationPageIdx = pages.findIndex(
        (p) => p.id === Number(destination.droppableId)
      );

      let copyPages = [...pages];

      const sectionsSourcePage = copyPages[sourcePageIdx].sections;
      const sectionsDestinationPage = copyPages[destinationPageIdx].sections;

      const sourceSection = sectionsSourcePage[source.index];

      sourceSection.sequence = destination.index;
      sourceSection.pageId = Number(destination.droppableId);

      sectionsDestinationPage.push(sourceSection);

      sectionsSourcePage.splice(source.index, 1);

      for (const section of sectionsSourcePage) {
        if (section.sequence > source.index) {
          section.sequence = section.sequence - 1;
        }
      }

      for (const section of sectionsDestinationPage) {
        if (section.sequence > destination.index) {
          section.sequence = section.sequence + 1;
        }
      }

      const destinationSection = sectionsDestinationPage[destination.index];

      if (destination.index !== sectionsDestinationPage.length - 1) {
        destinationSection.sequence = destination.index + 1;
      }

      sectionsSourcePage.sort((a, b) => a.sequence - b.sequence);
      sectionsDestinationPage.sort((a, b) => a.sequence - b.sequence);

      setPages(copyPages);

      for (const section of sectionsSourcePage) {
        API.editSectionOnServer(section);
      }

      for (const section of sectionsDestinationPage) {
        API.editSectionOnServer(section);
      }
    }
  };

  let content = null;

  if (sectionId !== null) {
    const pageIdx = pages.findIndex((p) => p.id === pageId);
    const sectionIdx = pages[pageIdx].sections.findIndex(
      (s) => s.id === sectionId
    );

    content = pages[pageIdx].sections[sectionIdx];
  }

  return (
    <div className="admin__panel">
      <PageList
        pages={pages}
        onShowForm={onShowForm}
        onDeleteSection={onDeleteSection}
        onRemovePage={onRemovePage}
        onEditPage={onEditPage}
        onAddPage={onAddPage}
        onDragEnd={onDragEnd}
      />
      <FormAdding
        onCloseForm={onCloseForm}
        onAddSection={onAddSection}
        onEditSection={onEditSection}
        content={content}
        show={show}
      />
      <Toaster position="bottom-right" />
    </div>
  );
}
