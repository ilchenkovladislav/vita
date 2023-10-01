import axios from 'axios';
import toast from 'react-hot-toast';
import { ServerResponse } from '../store/types';

const Axios = axios.create({
    baseURL:
        window.location.host === 'localhost:5173'
            ? 'http://vita/server'
            : 'https://vita-photofilm.ru/server',
});

class API {
    _websiteBase =
        window.location.host === 'localhost:5173'
            ? 'http://vita/server/'
            : 'https://vita-photofilm.ru/server/';

    getPages = async () => {
        try {
            const response = await Axios.get<ServerResponse>('index/read.php');
            const records = response.data.records;
            const res = records.map(this._transformPage);

            return res;
        } catch (error) {
            toast.error(`Произошла ошибка: ${error}`);
        }
    };

    getImages = async (id) => {
        const response = await Axios.post(
            'image/read.php',
            JSON.stringify({ id }),
        );

        return response.data.records;

        // const response = await fetch(
        //     `${this._websiteBase}/image/read.php?id=${id}`,
        // );
        // const images = await response.json();
        // return images.map(this._transformImage);
    };

    addSection = async (section) => {
        const form = new FormData();
        form.append('section', JSON.stringify(section));

        try {
            const res = await fetch(`${this._websiteBase}/section.php`, {
                method: 'post',
                body: form,
            });

            const result = await res.json();

            result.status
                ? toast.success('Секция успешно добавлена')
                : toast.error('Произошла ошибка, секция не добавлена');

            return result.lastId;
        } catch (error) {
            toast.error(`Произошла ошибка: ${error}`);
        }
    };

    addImages = async (images, sectionId) => {
        const form = new FormData();

        form.append('sectionId', sectionId);
        images.forEach((image) => form.append('images[]', image));

        try {
            const res = await fetch(`${this._websiteBase}/images.php`, {
                method: 'post',
                body: form,
            });

            const result = await res.json();

            result.status
                ? toast.success('Изображения успешно добавлены')
                : toast.error('Произошла ошибка, изображения не добавлены');
        } catch (error) {
            toast.error(`Произошла ошибка: ${error}`);
        }
    };

    // editSection = async (sections) => {
    //     const form = new FormData();
    //     form.append('sections', JSON.stringify([sections]));
    //
    //     try {
    //         const res = await fetch(`${this._websiteBase}/section/update.php`, {
    //             method: 'POST',
    //             body: form,
    //         });
    //
    //         const result = await res.json();
    //
    //         result.status
    //             ? toast.success('Секция успешно изменена')
    //             : toast.error('Произошла ошибка, секция не изменена');
    //     } catch (error) {
    //         toast.error(`Произошла ошибка: ${error}`);
    //     }
    // };

    editSections = async (sections) => {
        const formData = new FormData();

        formData.append('sections', JSON.stringify(sections));

        try {
            const res = await Axios.post<ServerResponse>(
                'section/update.php',
                formData,
            );

            res.status
                ? toast.success('Секция успешно изменена')
                : toast.error('Произошла ошибка, секция не изменена');
        } catch (error) {
            toast.error(`Произошла ошибка: ${error}`);
        }
    };

    editImages = async (images, sectionId) => {
        const form = new FormData();

        form.append('sectionId', sectionId);

        const newImages = images.filter((image) => {
            return image.arrayBuffer !== undefined;
        });

        newImages.forEach((image) => form.append('newimages', image));

        const idsOldImages = images
            .filter((image) => {
                return image.arrayBuffer === undefined;
            })
            .map((el) => el.id);

        form.append('idsOldImages', JSON.stringify(idsOldImages));

        try {
            const res = await fetch(`${this._websiteBase}/images.php`, {
                method: 'PUT',
                body: form,
            });

            const result = await res.json();

            result.status
                ? toast.success('Изображения успешно изменены')
                : toast.error('Произошла ошибка, изображения не изменены');
        } catch (error) {
            toast.error(`Произошла ошибка: ${error}`);
        }
    };

    deleteSection = async (sectionId) => {
        try {
            const res = await fetch(`${this._websiteBase}/section.php`, {
                method: 'DELETE',
                body: sectionId,
            });

            const result = await res.json();

            result.status
                ? toast.success('Секция успешно удалена')
                : toast.error('Произошла ошибка, секция не удалена');
        } catch (error) {
            toast.error(`Произошла ошибка: ${error}`);
        }
    };

    addPage = async (page) => {
        try {
            const response = await fetch(`${this._websiteBase}/page.php`, {
                method: 'POST',
                body: JSON.stringify(page),
            });

            const result = await response.json();

            result.status
                ? toast.success('Страница успешно добавлена')
                : toast.error('Произошла ошибка, страница не добавлена');

            return result.lastId;
        } catch (error) {
            toast.error(`Произошла ошибка: ${error}`);
        }
    };

    editPage = async (pageId, title) => {
        try {
            const response = await fetch(`${this._websiteBase}/page.php`, {
                method: 'PUT',
                body: JSON.stringify({ pageId, title }),
            });

            const result = await response.json();

            result.status
                ? toast.success('Страница успешно изменена')
                : toast.error('Произошла ошибка, страница не изменена');

            return result;
        } catch (error) {
            toast.error(`Произошла ошибка: ${error}`);
        }
    };

    removePage = async (pageId) => {
        try {
            const response = await fetch(`${this._websiteBase}/page.php`, {
                method: 'DELETE',
                body: pageId,
            });

            const result = await response.json();

            result.status
                ? toast.success('Страница успешно удалена')
                : toast.error('Произошла ошибка, страница не удалена');
        } catch (error) {
            toast.error(`Произошла ошибка: ${error}`);
        }
    };

    getPageTheme = async (pageId) => {
        try {
            const response = await fetch(
                `${this._websiteBase}/settings.php?pageId=${pageId}`,
            );
            const theme = await response.json();

            return theme;
        } catch (error) {
            toast.error(`Произошла ошибка: ${error}`);
        }
    };

    setPageSettings = async (pageId, settings) => {
        try {
            const response = await fetch(`${this._websiteBase}/settings.php`, {
                method: 'POST',
                body: JSON.stringify({ pageId, settings }),
            });

            const result = await response.json();

            result.status
                ? toast.success('Настройки успешно сохранены')
                : toast.error('Произошла ошибка');
        } catch (error) {
            toast.error(`Произошла ошибка: ${error}`);
        }
    };

    _transformPage = (page) => {
        return {
            ...page,
            id: Number(page.id),
            sections: page.sections
                .map((section) => ({
                    id: Number(section.id),
                    title: section.title,
                    comment: section.comment,
                    sequence: Number(section.sequence),
                    pageId: Number(section.page_id),
                }))
                .sort((a, b) => a.sequence - b.sequence),
        };
    };

    _transformImage = (image) => {
        return {
            id: Number(image.id),
            img: `data:image/jpeg;base64,${image.img}`,
        };
    };
}

export default new API();
