import postService from "../services/post.service";

async function publishPost(req, res) {
    const { url, content } = req.body;
    await postService.publishPost({ url, content, ...res.locals.userId });
    res.sendStatus(201);
}

async function getPosts(req, res) {
    const posts = await postService.getPosts();
    res.send(posts);
}

const postController = { publishPost, getPosts };
export default postController;