import RNFS from 'react-native-fs';

const IMAGE_DIR = `${RNFS.DocumentDirectoryPath}/exercise-images`;

export const cacheImage = async (url) => {
    if (!url) return null;

    const filename = url.split('/').pop();
    const localPath = `${IMAGE_DIR}/${filename}`;

    const dirExists = await RNFS.exists(IMAGE_DIR);
    if (!dirExists) await RNFS.mkdir(IMAGE_DIR);

    const fileExists = await RNFS.exists(localPath);
    if (fileExists) return 'file://' + localPath;

    try {
        await RNFS.downloadFile({
            fromUrl: url,
            toFile: localPath,
        }).promise;

        return 'file://' + localPath;
    } catch (e) {
        console.error("Error downloading image to cache: ", url, e);
        return url;
    }
};

export const cacheExerciseImages = async (exercises) => {
    const updatedExercises = await Promise.all(
        exercises.map(async (ex) => {
            if (ex.image) {
                const localImage = await cacheImage(ex.image);
                return { ...ex, image: localImage };
            }
            return ex;
        })
    );
    return updatedExercises;
};

