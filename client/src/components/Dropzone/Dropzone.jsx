import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

import "./Dropzone.scss";

export default function Dropzone({ handleDropzone }) {
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    },
  });

  useEffect(() => {
    handleDropzone(files);
  }, [files, handleDropzone]);

  const removeImage = (id) => {
    const result = [...files.slice(0, id), ...files.slice(id + 1)];
    setFiles(result);
  };

  const thumbs = files.map((file, id) => (
    <div className="thumb" key={file.name}>
      <button onClick={() => removeImage(id)} className="removeBtn">
        x
      </button>
      <img
        src={file.preview}
        className="img"
        alt=""
        // Revoke data uri after image is loaded
        onLoad={() => {
          URL.revokeObjectURL(file.preview);
        }}
      />
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input name="images" {...getInputProps()} />
        <p>Перетащите файлы сюда, или кликните для выбора файлов</p>
      </div>
      <aside className="thumbsContainer">{thumbs}</aside>
    </section>
  );
}
