import React, { useCallback } from "react";
import { useState } from "react";
import Dropzone from "../Dropzone/Dropzone";
import "./FormAdding.scss";

export default function FormAdding() {
  const [data, setData] = useState({
    title: "",
    images: "",
    comment: "",
  });

  const inputHandler = (e) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDropzone = useCallback((images) => {
    setData((prevData) => ({
      ...prevData,
      images,
    }));
  }, []);

  const postDataOnServer = (data) => {
    fetch("http://vita/server/", {
      method: "post",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      body: data,
      mode: "no-cors",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    postDataOnServer(JSON.stringify(data));
  };

  return (
    <form
      action="http://vita/server/"
      method="post"
      className="formAdding"
      onSubmit={handleSubmit}
    >
      <div>
        <label htmlFor="title">Заголовок</label>
        <input
          type="text"
          name="title"
          id="title"
          value={data.title}
          onChange={inputHandler}
          placeholder="darova"
        />
      </div>
      <div>
        <label>Фотки:</label>
        <Dropzone handleDropzone={handleDropzone} />
      </div>
      <div>
        <label htmlFor="comment">Комментарии:</label>
        <textarea
          name="comment"
          id="comment"
          value={data.comment}
          onChange={inputHandler}
          cols="30"
          rows="10"
        ></textarea>
      </div>
      <button className="formAdding__btn" type="submit">
        Добавить секцию
      </button>
    </form>
  );
}
