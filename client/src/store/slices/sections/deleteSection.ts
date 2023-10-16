import toast from 'react-hot-toast';
import { ServerResponse } from '../../types.ts';
import { AxiosError } from 'axios';
import { useAsyncThunk } from '../../hooks.ts';
import { Axios } from '../../../configs/axiosConfig.ts';

export const deleteSection = useAsyncThunk()<unknown>(
    'sections/deleteSection',
    async (section, { rejectWithValue }) => {
        const toastId = toast.loading('Грузим данные...');

        return await Axios.post<ServerResponse>(
            'section/delete.php',
            JSON.stringify(section),
        )
            .then((res) => {
                toast.success(res.data.message);
                return res.data.records;
            })
            .catch((err: AxiosError<ServerResponse>) =>
                rejectWithValue(
                    `Произошла ошибка: ${err.message}. Не получается удалить секцию`,
                ),
            )
            .finally(() => {
                toast.dismiss(toastId);
            });
    },
);
