import ContentLoader from "react-content-loader";

import "./SkeletonLoader.scss";

export const SkeletonLoader = () => {
  return (
    <div className="userpage__container">
      <ContentLoader
        speed={2}
        backgroundColor="#b5b5b5"
        foregroundColor="#3b3b3b"
        className="skeleton"
      >
        <rect className="skeleton__title" />

        <rect className="skeleton__subtitle" />

        <rect className="skeleton__img skeleton__img-1" />
        <rect className="skeleton__img skeleton__img-2" />
        <rect className="skeleton__img skeleton__img-3" />
        <rect className="skeleton__img skeleton__img-4" />
      </ContentLoader>
    </div>
  );
};
