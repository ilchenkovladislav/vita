import { useParams } from "react-router-dom";
import draftToHtml from "draftjs-to-html";
import { Parser } from "html-to-react";
import { SkeletonLoader } from "../SkeletonLoader/SkeletonLoader";

import { useFetch } from "../../hooks/useFetch";

import "./UserPage.scss";

export const UserPage = () => {
  const { href } = useParams();

  const { data, isLoading, hasError, errorMessage } = useFetch(
    `http://vita/server/page.php`,
    { link: href }
  );

  const RenderSections = () => {
    data.sections.sort((a, b) => a.sequence - b.sequence);

    return data.sections.map(({ title, imgs, comment }) => {
      comment = new Parser().parse(draftToHtml(JSON.parse(comment)));

      return (
        <section className="userpage__section">
          <h2>{title}</h2>
          <ul className="userpage__img-list">
            {imgs.map((image) => (
              <li className="userpage__img-item">
                <img src={`data:image/jpeg;base64,${image.img}`} alt="" />
              </li>
            ))}
          </ul>
          <div>{comment}</div>
        </section>
      );
    });
  };

  if (hasError) return <h1>Кажется произошла ошибка: {errorMessage}</h1>;
  if (isLoading) return <SkeletonLoader />;
  if (data)
    return (
      <div className="userpage__container">
        <div className="userpage">
          <h1>{data.title}</h1>
          <RenderSections />
        </div>
      </div>
    );
};
