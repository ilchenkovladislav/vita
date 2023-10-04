import toast from 'react-hot-toast';
import { ServerResponse } from '../../types.ts';
import { AxiosError } from 'axios';
import { useAsyncThunk } from '../../hooks.ts';
import { Axios } from '../../../configs/axiosConfig.ts';

export const createPage = useAsyncThunk()<unknown>(
    'pages/createPage',
    async (page, { rejectWithValue }) => {
        const toastId = toast.loading('Грузим данные...');

        return await Axios.post<ServerResponse>(
            'page/create.php',
            JSON.stringify(page),
        )
            .then((res) => {
                toast.success(res.data.message);
                return res.data.records;
            })
            .catch((err: AxiosError<ServerResponse>) =>
                rejectWithValue(
                    `Произошла ошибка: ${err.message}. Не получается создать страницу`,
                ),
            )
            .finally(() => {
                toast.dismiss(toastId);
            });
    },
);
