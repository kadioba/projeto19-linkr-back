import errors from "../errors/index.errors.js";
import postRepository from "../repositories/post.repository.js";
import userRepository from "../repositories/user.repository.js";

async function publishPost(url, content, userId) {
    const { rowCount: userExists } = await userRepository.findUserById(userId);
    if (!userExists) throw errors.notFound();

    await postRepository.createPost({ url, content, userId });
}

async function getPosts() {
    const posts = await postRepository.getPosts();
    return posts;
}

const postService = { publishPost, getPosts };
export default postService;