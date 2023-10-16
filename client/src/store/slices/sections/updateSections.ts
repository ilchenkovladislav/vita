import toast from 'react-hot-toast';
import { Image, Section, ServerResponse } from '../../types.ts';
import { AxiosError } from 'axios';
import { useAsyncThunk } from '../../hooks.ts';
import { Axios } from '../../../configs/axiosConfig.ts';

export const updateSections = useAsyncThunk()<
    unknown,
    { sections: Section[]; images?: Image[] }
>(
    'sections/updateSections',
    async ({ sections, images }, { rejectWithValue }) => {
        const toastId = toast.loading('Грузим данные...');
        const form = new FormData();

        form.append('sections', JSON.stringify(sections));

        if (images) {
            const newImages = images.filter((image) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                return image.arrayBuffer !== undefined;
            });

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            newImages.forEach((image) => form.append('newImages[]', image));

            const idsOldImages = images
                .filter((image) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    return image.arrayBuffer === undefined;
                })
                .map((el) => el.id);

            form.append('idsOldImages', JSON.stringify(idsOldImages));
        }

        return await Axios.post<ServerResponse>('section/update.php', form, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((res) => {
                toast.success(res.data.message);
                return res.data.records;
            })
            .catch((err: AxiosError<ServerResponse>) =>
                rejectWithValue(
                    `Произошла ошибка: ${err.message}. Не получается обновить секцию`,
                ),
            )
            .finally(() => {
                toast.dismiss(toastId);
            });
    },
);
