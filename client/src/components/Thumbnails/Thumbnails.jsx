import "./Thumbnails.scss";

export const Thumbnails = ({ images, onRemoveImg }) => {
  return images.map((image, idx) => (
    <div className="thumb" key={image.id}>
      <button
        onClick={() => onRemoveImg(idx)}
        className="removeBtn"
        type="button"
      >
        x
      </button>
      <img src={image.preview ?? image.img} className="thumb__img" alt="" />
    </div>
  ));
};
