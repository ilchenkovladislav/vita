import React, { useEffect } from "react";
import { useState } from "react";
import Dropzone from "../Dropzone/Dropzone";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";

import "./FormAdding.scss";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { getImages } from "../../hooks/func";

export function FormAdding({
  currentElement,
  onAddSection,
  onEditSection,
  onCloseForm,
  content,
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
    page_id: null,
  });

  useEffect(() => {
    if (content) {
      setSection(content);
      getImages(content.id).then((images) => setImages(images));
      setEditorState(
        EditorState.createWithContent(
          convertFromRaw(JSON.parse(content.comment))
        )
      );
    }

    return () => {
      setSection({
        title: window.localStorage.getItem("title") ?? "",
        comment: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
        sequence: null,
        page_id: null,
      });

      setImages([]);
    };
  }, [content]);

  const inputHandler = (e) => {
    const { name, value } = e.target;

    setSection((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    window.localStorage.setItem("title", value);
  };

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    setSection((prev) => ({
      ...prev,
      comment: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
    }));

    window.localStorage.setItem(
      "comment",
      JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    );
  };

  const onRemoveImage = (id) => {
    setImages([...images.slice(0, id), ...images.slice(id + 1)]);
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

  const getCoords = (elem) => {
    let box = elem.getBoundingClientRect();

    return {
      top: box.top + window.pageYOffset,
      right: box.right + window.pageXOffset,
      bottom: box.bottom + window.pageYOffset,
      left: box.left + window.pageXOffset,
    };
  };

  const formStyle = () => {
    let coords = getCoords(currentElement);
    const marginX = 30;
    const marginY = 25;

    if (coords.right > 1300) {
      const formWidth = 450;

      return {
        left: coords.left - marginX - formWidth,
        top: coords.top - marginY,
      };
    }

    return { left: coords.right + marginX, top: coords.top - marginY };
  };

  return (
    <div className="form__back" onClick={onCloseForm}>
      <form
        action="http://vita/server/"
        method="post"
        encType="multipart/form-data"
        className="formAdding"
        onSubmit={onSubmit}
        onClick={(e) => e.stopPropagation()}
        style={formStyle()}
      >
        <div>
          <label htmlFor="title">заголовок</label>
          <input
            type="text"
            name="title"
            id="title"
            value={section.title}
            onChange={inputHandler}
          />
        </div>
        <div>
          <label>фотографии</label>
          <Dropzone
            images={images}
            onRemoveImg={onRemoveImage}
            onUpdateImages={onUpdateImages}
          />
        </div>
        <div>
          <label htmlFor="comment">комментарии</label>
          <Editor
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
          />
        </div>
        <button className="formAdding__btn" type="submit">
          добавить секцию
        </button>
      </form>
    </div>
  );
}
