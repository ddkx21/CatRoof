function loadImage(path) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`не загрузилась картинка: ${path}`));
        img.src = path;
    });
}

export async function loadImages(manifest) {
    const names = Object.keys(manifest);
    const images = await Promise.all(names.map((name) => loadImage(manifest[name])));

    const result = {};
    names.forEach((name, i) => {
        result[name] = images[i];
    });
    return result;
}
