import { useContext, useEffect } from 'react';

import { useParams } from 'react-router-dom';
import { Parser } from 'html-to-react';
import { SkeletonLoader } from '../../components/SkeletonLoader/SkeletonLoader';

import { useFetch } from '../../hooks/useFetch';
import { ThemeContext } from '../../contexts/ThemeContext';
import API from '../../services/API';

import './UserPage.scss';
import 'react-quill/dist/quill.snow.css';

export const UserPage = () => {
    const { href } = useParams();
    const { setTheme } = useContext(ThemeContext);

    const { data, isLoading, hasError, errorMessage } = useFetch(
        `${API._websiteBase}/page.php`,
        { link: href },
    );

    useEffect(() => {
        if (!data?.theme) return;
        setTheme(data.theme);
    }, [setTheme, data]);

    const renderSections = () => {
        data.sections.sort((a, b) => a.sequence - b.sequence);

        return data.sections.map(({ imgs, comment }) => {
            comment = new Parser().parse(comment);

            return (
                <section className="userpage__section">
                    <div>{comment}</div>
                    <ul className="userpage__img-list">
                        {imgs.map((image) => (
                            <li className="userpage__img-item">
                                <img src={image.path} alt="" />
                            </li>
                        ))}
                    </ul>
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
                    {renderSections()}
                </div>
            </div>
        );
};
