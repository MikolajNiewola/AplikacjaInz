import RNFS from 'react-native-fs';

const MEDIA_DIR = `${RNFS.DocumentDirectoryPath}/exercise-media`;
const API_URL = 'http://10.0.2.2:3000';

const ensureDir = async () => {
    const exists = await RNFS.exists(MEDIA_DIR);
    if (!exists) await RNFS.mkdir(MEDIA_DIR);
};

export const cacheMedia = async (url) => {
    if (!url) return null;

    const filename = url.split('/').pop();
    const localPath = `${MEDIA_DIR}/${filename}`;

    await ensureDir();

    const exists = await RNFS.exists(localPath);
    if (exists) return 'file://' + localPath;

    try {
        await RNFS.downloadFile({
            fromUrl: url,
            toFile: localPath,
        }).promise;

        return 'file://' + localPath;
    } catch (e) {
        console.error('Media cache error:', url, e);
        return url;
    }
};

export const clearMediaCache = async () => {
    try {
        const exists = await RNFS.exists(MEDIA_DIR);
        if (exists) await RNFS.unlink(MEDIA_DIR);
    } catch (e) {
        console.error('Error clearing media cache', e);
    }
};

export const cacheExerciseMedia = async (exercises) => {
    return Promise.all(
        exercises.map(async (ex) => {
            const updated = { ...ex };

            if (ex.image && !ex.image.startsWith('file://')) {
                updated.image = await cacheMedia(`${API_URL}/imgs/${ex.image}`);
            }

            if (ex.video && !ex.video.startsWith('file://')) {
                updated.video = await cacheMedia(`${API_URL}/gifs/${ex.video}`);
            }

            return updated;
        })
    );
};
