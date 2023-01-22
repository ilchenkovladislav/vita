import { useEffect } from "react";
import { useDropzone } from "react-dropzone";

import "./Dropzone.scss";

export default function Dropzone({ onUpdateImages, images, onRemoveImg }) {
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

      onUpdateImages(acceptedFiles);
    },
  });

  const thumbs = images.map((image, id) => (
    <div className="thumb" key={image.id}>
      <button
        onClick={() => onRemoveImg(id)}
        className="removeBtn"
        type="button"
      >
        x
      </button>
      <img
        src={
          image.preview ?? image.img
        }
        className="img"
        alt=""
      />
    </div>
  ));

  useEffect(() => {
    // return () => images.forEach((image) => URL.revokeObjectURL(image.preview));
  }, [images]);

  return (
    <section className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input name="images" {...getInputProps()} />
        <p>перетащите фото сюда или кликните для выбора</p>
      </div>
      <aside className="thumbsContainer">{thumbs}</aside>
    </section>
  );
}
