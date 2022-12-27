import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { getPage } from "../../hooks/func";

export const UserPage = () => {
  const params = useParams();

  const [page, setPage] = useState({ sections: [] });
  const [isLoad, setIsLoad] = useState(true);

  useEffect(() => {
    getPage(params.href).then((p) => {
      setPage(p);
      setIsLoad(false);
    });
  }, [params]);

  return isLoad ? (
    <h1>Загрузка..</h1>
  ) : (
    <div>
      <h1>{page.title}</h1>
      {page.sections.map((section, idx) => {
        return (
          <div>
            <h2>{section.title}</h2>
            <p>{section.comments}</p>
            <ul>
              {section.img.map((image) => (
                <li>
                  <img
                    width={100}
                    src={`data:image/jpeg;base64,` + image.img}
                    alt=""
                  />
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};
