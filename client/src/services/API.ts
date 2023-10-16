import axios from 'axios';
import toast from 'react-hot-toast';
import { ServerResponse } from '../store/types';

const baseURL =
    window.location.host === 'localhost:5173'
        ? 'http://vita/server'
        : 'https://vita-photofilm.ru/server';

const Axios = axios.create({ baseURL });

class API {
    getImages = async (id) => {
        const response = await Axios.post(
            'image/read.php',
            JSON.stringify({ id }),
        );

        return response.data.records;
    };

    editSections = async (sections) => {
        const formData = new FormData();

        formData.append('sections', JSON.stringify(sections));

        try {
            const res = await Axios.post<ServerResponse>(
                'section/update.php',
                formData,
            );

            res.status
                ? toast.success('Секции обновлены')
                : toast.error('Произошла ошибка, секции не обновлены');
        } catch (error) {
            toast.error(`Произошла ошибка: ${error}`);
        }
    };

    createPageSettings = async (pageId, settings) => {
        try {
            const res = await Axios.post<ServerResponse>(
                'setting/create.php',
                JSON.stringify({ pageId, settings }),
            );

            res.status
                ? toast.success('Настройки успешно сохранены')
                : toast.error('Произошла ошибка');
        } catch (error) {
            toast.error(`Произошла ошибка: ${error}`);
        }
    };

    updatePageSettings = async (pageId, settings) => {
        try {
            const res = await Axios.post<ServerResponse>(
                'setting/update.php',
                JSON.stringify({ pageId, settings }),
            );

            res.status
                ? toast.success('Настройки успешно сохранены')
                : toast.error('Произошла ошибка');
        } catch (error) {
            toast.error(`Произошла ошибка: ${error}`);
        }
    };
}

export default new API();
