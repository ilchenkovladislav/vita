import { useParams } from "react-router-dom";

import { useFetch } from "../../hooks/useFetch";

export const UserPage = () => {
  const { href } = useParams();

  const { data, isLoading, hasError, errorMessage } = useFetch(
    `http://vita/server/page.php`,
    { link: href }
  );

  const RenderSections = () => {
    data.sections.sort((a, b) => a.sequence - b.sequence);

    return data.sections.map(({ title, imgs, comment }) => {
      return (
        <div>
          <h2>{title}</h2>
          <ul>
            {imgs.map((image) => (
              <li>
                <img
                  width={1000}
                  src={`data:image/jpeg;base64,${image.img}`}
                  alt=""
                />
              </li>
            ))}
          </ul>
          <p>{comment}</p>
        </div>
      );
    });
  };

  if (hasError) return <h1>Error: {errorMessage}</h1>;
  if (isLoading) return <h1>Загрузка..</h1>;
  if (data)
    return (
      <div>
        <h1>{data.title}</h1>
        <RenderSections />
      </div>
    );
};
