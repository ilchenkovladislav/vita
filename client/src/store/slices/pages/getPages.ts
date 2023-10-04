import toast from 'react-hot-toast';
import { ServerResponse } from '../../types.ts';
import { AxiosError } from 'axios';
import { useAsyncThunk } from '../../hooks.ts';
import { Axios } from '../../../configs/axiosConfig.ts';

export const getPages = useAsyncThunk()<unknown>(
    'pages/getPages',
    async (_, { rejectWithValue }) => {
        const toastId = toast.loading('Грузим данные...');

        return await Axios.get<ServerResponse>('page/read.php')
            .then((res) => res.data.records)
            .catch((err: AxiosError<ServerResponse>) =>
                rejectWithValue(
                    `Произошла ошибка: ${err.message}. Не получается получить данные по страницам`,
                ),
            )
            .finally(() => {
                toast.dismiss(toastId);
            });
    },
);
