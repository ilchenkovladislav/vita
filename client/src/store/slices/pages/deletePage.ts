import toast from 'react-hot-toast';
import { ServerResponse } from '../../types.ts';
import { AxiosError } from 'axios';
import { useAsyncThunk } from '../../hooks.ts';
import { Axios } from '../../../configs/axiosConfig.ts';

export const deletePage = useAsyncThunk()<unknown>(
    'pages/deletePage',
    async (pageId, { rejectWithValue }) => {
        const toastId = toast.loading('Грузим данные...');

        return await Axios.post<ServerResponse>('page/delete.php', {
            id: pageId,
        })
            .then((res) => {
                toast.success(res.data.message);
                return res.data.records;
            })
            .catch((err: AxiosError<ServerResponse>) =>
                rejectWithValue(
                    `Произошла ошибка: ${err.message}. Не получается удалить страницу`,
                ),
            )
            .finally(() => {
                toast.dismiss(toastId);
            });
    },
);
