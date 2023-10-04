import toast from 'react-hot-toast';
import { Section, ServerResponse } from '../../types.ts';
import { AxiosError } from 'axios';
import { useAsyncThunk } from '../../hooks.ts';
import { Axios } from '../../../configs/axiosConfig.ts';

export const createSection = useAsyncThunk()<
    unknown,
    { section: Section; images: File[] }
>(
    'sections/createSection',
    async ({ section, images }, { rejectWithValue }) => {
        const toastId = toast.loading('Грузим данные...');
        const formData = new FormData();

        formData.append('section', JSON.stringify(section));

        if (images) {
            images.forEach((image) => formData.append('images[]', image));
        }

        return await Axios.post<ServerResponse>(
            'section/create.php',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
        )
            .then((res) => {
                toast.success(res.data.message);
                return res.data.records;
            })
            .catch((err: AxiosError<ServerResponse>) =>
                rejectWithValue(
                    `Произошла ошибка: ${err.message}. Не получается создать секцию`,
                ),
            )
            .finally(() => {
                toast.dismiss(toastId);
            });
    },
);
