import React, { useState, useEffect } from "react";

import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Dialog } from "@headlessui/react";

import API from "../../services/API";
import Dropzone from "../Dropzone/Dropzone";
import "./FormAdding.scss";

export function FormAdding({
  onAddSection,
  onEditSection,
  onCloseForm,
  content,
  show,
}) {
  const [images, setImages] = useState([]);

  const [editorState, setEditorState] = useState(
    window.localStorage.getItem("comment")
      ? EditorState.createWithContent(
          convertFromRaw(JSON.parse(window.localStorage.getItem("comment")))
        )
      : EditorState.createEmpty()
  );

  const [section, setSection] = useState({
    title: window.localStorage.getItem("title") ?? "",
    comment: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
    sequence: null,
    pageId: null,
  });

  useEffect(() => {
    if (!content) {
      return;
    }

    setSection(content);

    setEditorState(
      EditorState.createWithContent(convertFromRaw(JSON.parse(content.comment)))
    );

    API.getImages(content.id).then((images) => setImages(images));
  }, [content]);

  const inputHandler = (e) => {
    const { value } = e.target;

    setSection((prevData) => ({
      ...prevData,
      title: value,
    }));

    window.localStorage.setItem("title", value);
  };

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);

    const comment = JSON.stringify(
      convertToRaw(editorState.getCurrentContent())
    );

    setSection((prev) => {
      return { ...prev, comment };
    });

    window.localStorage.setItem("comment", comment);
  };

  const onRemoveImage = (idx) => {
    setImages([...images.slice(0, idx), ...images.slice(idx + 1)]);
  };

  const onUpdateImages = (images) => {
    setImages((prevImgs) => [...prevImgs, ...images]);
  };

  const clearLocalStorage = () => {
    window.localStorage.setItem("title", "");
    window.localStorage.setItem("comment", "");
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (content) {
      onEditSection(section, images);
    } else {
      onAddSection(section, images);
    }

    clearLocalStorage();
    onCloseForm();
  };

  return (
    <Dialog open={show} onClose={onCloseForm}>
      <div className="form__back" aria-hidden="true" />
      <div className="form__container">
        <Dialog.Panel className="form__panel">
          <form
            encType="multipart/form-data"
            className="formAdding"
            onSubmit={onSubmit}
          >
            <div className="formAdding__title">
              <label htmlFor="title">заголовок</label>
              <input
                type="text"
                id="title"
                value={section.title}
                onChange={inputHandler}
                autoFocus={!content}
              />
            </div>
            <div className="formAdding__photo">
              <label>фотографии</label>
              <Dropzone
                images={images}
                onRemoveImg={onRemoveImage}
                onUpdateImages={onUpdateImages}
              />
            </div>
            <div className="formAdding__comment">
              <label htmlFor="comment">комментарии</label>
              <Editor
                editorState={editorState}
                onEditorStateChange={onEditorStateChange}
              />
            </div>
            <button
              onClick={onSubmit}
              className="formAdding__btn"
              type="submit"
            >
              сохранить
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
