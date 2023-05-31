import errors from "../errors/index.errors.js";
import postRepository from "../repositories/post.repository.js";
import userRepository from "../repositories/user.repository.js";
import urlMetadata from "url-metadata";
import fetch from "node-fetch";

//global.fetch = fetch;

async function publishPost(url, content, userId) {
    const { rowCount: userExists } = await userRepository.findUserById(userId);
    if (!userExists) throw errors.notFound();

    let data = { url_title: '', url_description: '', url_picture: '' }

    try {
        const metadata = await urlMetadata(url);
        const dataScraped = { url_title: metadata['og:title'], url_description: metadata['og:description'], url_picture: metadata['og:image'] };
        data = dataScraped;
    } catch (error) {
        console.log(error);
    }

    await postRepository.createPost({ url, content, userId }, data);
}


/* async function publishPost(url, content, userId) {
    const { rowCount: userExists } = await userRepository.findUserById(userId);
    if (!userExists) throw errors.notFound();

    const data = { url_title: '', url_description: '', url_picture: '' }

    urlMetadata(url)

        .then((metadata) => {
            const dataScraped = { url_title: metadata['og:title'], url_description: metadata['og:description'], url_picture: metadata['og:image'] };
            //console.log(dataScraped);
            data.url_title = metadata['og:title'];
            data.url_description = metadata['og:description'];
            data.url_picture = metadata['og:image'];
        })
        .catch((error) => {
            console.log(error);
        });
    console.log(data);

    await postRepository.createPost({ url, content, userId }, data);
} */

async function getPosts() {
    const posts = await postRepository.getPosts();
    return posts;
}

const postService = { publishPost, getPosts };
export default postService;