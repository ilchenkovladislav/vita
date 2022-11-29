import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import Dropzone from "../Dropzone/Dropzone";
import "./FormAdding.scss";

export default function FormAdding(props) {
  const [section, setSection] = useState({
    title: "",
    images: [],
    comment: "",
  });

  useEffect(() => {
    setSection(props.section);
  }, [props.section]);

  const inputHandler = (e) => {
    const { name, value } = e.target;

    setSection((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const removeImage = (id) => {
    const result = [
      ...section.images.slice(0, id),
      ...section.images.slice(id + 1),
    ];
    updateImages(result);
  };

  const updateImages = useCallback((images) => {
    setSection((prevData) => ({
      ...prevData,
      images,
    }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    props.onAdd(props.pageId, section);
  };

  if (!props.show) {
    return null;
  }

  function getCoords(elem) {
    let box = elem.getBoundingClientRect();

    return {
      top: box.top + window.pageYOffset,
      right: box.right + window.pageXOffset,
      bottom: box.bottom + window.pageYOffset,
      left: box.left + window.pageXOffset,
    };
  }

  const formStyle = () => {
    const form = props.ulishka.current[props.pageId].current;

    let coords = getCoords(form);
    return { left: coords.right + 30, top: coords.top };
  };

  return (
    <div className="form__back" onClick={props.onClose}>
      <form
        action="http://vita/server/"
        method="post"
        className="formAdding"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        style={formStyle()}
      >
        <div>
          <label htmlFor="title">Заголовок</label>
          <input
            type="text"
            name="title"
            id="title"
            value={section.title}
            onChange={inputHandler}
          />
        </div>
        <div>
          <label>Фотки:</label>
          <Dropzone
            images={section.images}
            onRemoveImg={removeImage}
            updateImages={updateImages}
          />
        </div>
        <div>
          <label htmlFor="comment">Комментарии:</label>
          <textarea
            name="comment"
            id="comment"
            value={section.comment}
            onChange={inputHandler}
            cols="30"
            rows="10"
          ></textarea>
        </div>
        <button className="formAdding__btn" type="submit">
          Добавить секцию
        </button>
      </form>
    </div>
  );
}
