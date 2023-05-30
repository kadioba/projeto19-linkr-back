import postService from "../services/post.service";

async function publishPost(req, res) {
    const { url, content } = req.body;
    await postService.publishPost({ url, content, ...res.locals.userId });
    res.sendStatus(201);
}

const postController = { publishPost };
export default postController;