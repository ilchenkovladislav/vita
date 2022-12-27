const _websiteBase = "http://vita/server";

export const getPages = async () => {
  try {
    const response = await fetch(`${_websiteBase}/`);
    const pages = await response.json();
    const res = pages.map((page) => _transformPage(page));

    return res;
  } catch (error) {
    throw Error(error);
  }
};

export const getPage = async (href) => {
  try {
    const response = await fetch(`${_websiteBase}/page.php?link=${href}`);
    const page = await response.json();
    const res = _transformPage(page);

    return res;
  } catch (error) {
    throw Error(error);
  }
};

export const getImages = async (id) => {
  const response = await fetch(`${_websiteBase}/images.php?id=${id}`);
  const images = await response.json();
  return images.map((image) => _transformImage(image));
};

export async function deleteSectionOnServer(idSection) {
  try {
    const res = await fetch(`${_websiteBase}/section.php`, {
      method: "DELETE",
      body: idSection,
    });

    const result = await res.json();
    result.status
      ? alert("Запись успешно добавлена")
      : alert("Не удалось добавить запись");
  } catch (error) {
    console.error(error);
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
    return result.lastId;
  } catch (error) {
    console.error(error);
  }
};

export const editSectionOnServer = async (section, images) => {
  const form = new FormData();
  form.append("section", JSON.stringify(section));

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

  try {
    const res = await fetch(`${_websiteBase}/section.php`, {
      method: "PUT",
      body: form,
    });

    const result = await res.text();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

export const addPageOnServer = async (title) => {
  const data = new FormData();
  data.append("title", title);

  try {
    const response = await fetch(`${_websiteBase}/page.php`, {
      method: "POST",
      body: data,
    });

    const res = await response.json();
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const removePageOnServer = async (id) => {
  try {
    const response = await fetch(`${_websiteBase}/page.php`, {
      method: "DELETE",
      body: id,
    });
    const res = await response.text();
    console.log(res);
  } catch (error) {
    console.error(error);
  }
};

export const editPageOnServer = async (id, title) => {
  try {
    const response = await fetch(`${_websiteBase}/page.php`, {
      method: "PUT",
      body: JSON.stringify({ id, title }),
    });

    const res = await response.json();
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const getIdxById = (id, arr) => {
  return arr.findIndex((el) => el.id === id);
};

const _transformPage = (page) => {
  return {
    id: Number(page.id),
    title: page.title,
    sections: page.sections.map((section) =>
      Object.assign(section, {
        id: Number(section.id),
        page_id: Number(section.page_id),
        sequence: Number(section.sequence),
      })
    ),
  };
};

const _transformImage = (image) => {
  return Object.assign(image, {
    id: Number(image.id),
  });
};
