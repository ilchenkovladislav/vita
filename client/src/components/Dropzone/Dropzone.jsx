import React, { useEffect } from "react";
import { useDropzone } from "react-dropzone";

import "./Dropzone.scss";

export default function Dropzone({ handleDropzone, images }) {
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

      handleDropzone(acceptedFiles);
    },
  });

  const removeImage = (id) => {
    const result = [...images.slice(0, id), ...images.slice(id + 1)];
    handleDropzone(result);
  };

  const thumbs = images.map((file, id) => (
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
    return () => images.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [images]);

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
