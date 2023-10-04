import toast from 'react-hot-toast';
import { ServerResponse } from '../../types.ts';
import { AxiosError } from 'axios';
import { useAsyncThunk } from '../../hooks.ts';
import { Axios } from '../../../configs/axiosConfig.ts';

export const updatePage = useAsyncThunk()<unknown>(
    'pages/updatePage',
    async (page, { rejectWithValue }) => {
        const toastId = toast.loading('Грузим данные...');

        return await Axios.post<ServerResponse>('page/update.php', page)
            .then((res) => {
                toast.success(res.data.message);
                return res.data.records;
            })
            .catch((err: AxiosError<ServerResponse>) =>
                rejectWithValue(
                    `Произошла ошибка: ${err.message}. Не получается обновить страницу`,
                ),
            )
            .finally(() => {
                toast.dismiss(toastId);
            });
    },
);
