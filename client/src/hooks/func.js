import toast from "react-hot-toast";

export const _websiteBase = "http://www.s595099.smrtp.ru/server";
// export const _websiteBase = "http://vita/server";

export const getPages = async () => {
  try {
    const response = await fetch(`${_websiteBase}/`);
    const pages = await response.json();
    const res = pages.map(_transformPage);

    for (const page of res) {
      page.sections.sort((a, b) => a.sequence - b.sequence);
    }

    return res;
  } catch (error) {
    toast.error(`Произошла ошибка: ${error}`);
  }
};

export const getImages = async (id) => {
  const response = await fetch(`${_websiteBase}/images.php?id=${id}`);
  const images = await response.json();
  return images.map(_transformImage);
};

export async function deleteSectionOnServer(idSection) {
  try {
    const res = await fetch(`${_websiteBase}/section.php`, {
      method: "DELETE",
      body: idSection,
    });

    const result = await res.json();
    result.status
      ? toast.success("Секция успешно удалена")
      : toast.error("Произошла ошибка, секция не удалена");
  } catch (error) {
    toast.error(`Произошла ошибка: ${error}`);
  }
}

export const addSectionOnServer = async (section, images) => {
  const form = new FormData();
  form.append("section", JSON.stringify(section));

  images.forEach((image) => form.append("images[]", image));

  try {
    const res = await fetch(`${_websiteBase}/section.php`, {
      method: "post",
      body: form,
    });

    const result = await res.json();

    result.status
      ? toast.success("Секция успешно добавлена")
      : toast.error("Произошла ошибка, секция не добавлена");

    return result.lastId;
  } catch (error) {
    toast.error(`Произошла ошибка: ${error}`);
  }
};

export const editSectionOnServer = async (section, images = null) => {
  const form = new FormData();
  form.append("section", JSON.stringify(section));

  if (images) {
    const newImages = images.filter((image) => {
      return image.arrayBuffer !== undefined;
    });

    const oldImageIds = images
      .filter((image) => {
        return image.arrayBuffer === undefined;
      })
      .map((el) => el.id);

    form.append("oldImageIds", JSON.stringify(oldImageIds));

    newImages.forEach((image) => form.append("newimages", image));
  } else {
    form.append("sequence", true);
  }

  try {
    const res = await fetch(`${_websiteBase}/section.php`, {
      method: "PUT",
      body: form,
    });

    const result = await res.json();

    result.status
      ? toast.success("Секция успешно изменена")
      : toast.error("Произошла ошибка, секция не изменена");
  } catch (error) {
    toast.error(`Произошла ошибка: ${error}`);
  }
};

export const addPageOnServer = async (title, link) => {
  const data = new FormData();
  data.append("title", title);
  data.append("link", link);

  try {
    const response = await fetch(`${_websiteBase}/page.php`, {
      method: "POST",
      body: data,
    });

    const result = await response.json();

    result.status
      ? toast.success("Страница успешно добавлена")
      : toast.error("Произошла ошибка, страница не добавлена");

    return result;
  } catch (error) {
    toast.error(`Произошла ошибка: ${error}`);
  }
};

export const removePageOnServer = async (id) => {
  try {
    const response = await fetch(`${_websiteBase}/page.php`, {
      method: "DELETE",
      body: id,
    });

    const result = await response.json();

    result.status
      ? toast.success("Страница успешно удалена")
      : toast.error("Произошла ошибка, страница не удалена");
  } catch (error) {
    toast.error(`Произошла ошибка: ${error}`);
  }
};

export const editPageOnServer = async (id, title) => {
  try {
    const response = await fetch(`${_websiteBase}/page.php`, {
      method: "PUT",
      body: JSON.stringify({ id, title }),
    });

    const result = await response.json();

    result.status
      ? toast.success("Страница успешно изменена")
      : toast.error("Произошла ошибка, страница не изменена");

    return result;
  } catch (error) {
    toast.error(`Произошла ошибка: ${error}`);
  }
};

export const getIdxById = (id, arr) => {
  return arr.findIndex((el) => el.id === id);
};

const _transformPage = (page) => {
  return Object.assign(page, {
    id: Number(page.id),
    sections: page.sections.map((section) =>
      Object.assign(section, {
        id: Number(section.id),
        page_id: Number(section.page_id),
        sequence: Number(section.sequence),
      })
    ),
  });
};

const _transformImage = (image) => {
  return Object.assign(image, {
    id: Number(image.id),
    img: `data:image/jpeg;base64,${image.img}`,
  });
};
