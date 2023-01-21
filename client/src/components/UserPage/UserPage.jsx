import { useParams } from "react-router-dom";
import draftToHtml from "draftjs-to-html";
import { Parser } from "html-to-react";
import ContentLoader from "react-content-loader";

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

  if (hasError) return <h1>Error: {errorMessage}</h1>;
  if (isLoading)
    return (
      <ContentLoader
        speed={1}
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        backgroundColor="#b5b5b5"
        foregroundColor="#3b3b3b"
        className="userpage"
      >
        <rect x="0" y="8" rx="3" ry="3" width="600" height="43" />

        <rect x="0" y="120" rx="3" ry="3" width="450" height="21" />

        <rect x="0" y="172" rx="3" ry="3" width="500" height="6" />
        <rect x="0" y="185" rx="3" ry="3" width="500" height="6" />
        <rect x="0" y="198" rx="3" ry="3" width="500" height="6" />

        <rect x="0" y="223" rx="3" ry="3" width="500" height="300" />
        <rect x="510" y="224" rx="3" ry="3" width="500" height="300" />
        <rect x="510" y="530" rx="3" ry="3" width="500" height="300" />
        <rect x="0" y="530" rx="3" ry="3" width="500" height="300" />

        {/* <rect x="0" y="679" rx="3" ry="3" width="509" height="43" />

        <rect x="0" y="756" rx="3" ry="3" width="328" height="21" />

        <rect x="0" y="801" rx="3" ry="3" width="380" height="6" />
        <rect x="0" y="814" rx="3" ry="3" width="380" height="6" />
        <rect x="0" y="827" rx="3" ry="3" width="380" height="6" />

        <rect x="0" y="852" rx="3" ry="3" width="256" height="197" />
        <rect x="270" y="853" rx="3" ry="3" width="256" height="197" /> */}
      </ContentLoader>
    );
  if (data)
    return (
      <div className="userpage">
        <h1>{data.title}</h1>
        <RenderSections />
      </div>
    );
};
