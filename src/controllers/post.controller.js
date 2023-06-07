import postService from "../services/post.service.js";

async function publishPost(req, res) {
  const { url, content } = req.body;
  await postService.publishPost(url, content, res.locals.userId);
  res.sendStatus(201);
}

async function getPosts(req, res) {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const { userId } = res.locals;
  const posts = await postService.getPosts(page, userId);
  res.send(posts.rows);
}

async function getPostsById(req, res) {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const { id } = req.params;
  const posts = await postService.getPostsById(id, page);
  res.send(posts.rows);
}

async function like(req, res) {
  const { postId } = req.params;
  const { userId } = res.locals;
  const response = await postService.like({ postId, userId });
  res.send(response);
}

async function updatePost(req, res) {
  const { postId } = req.params;
  const { content } = req.body;
  const { userId } = res.locals;
  await postService.updatePost({ postId, content, userId });
  res.sendStatus(200);
}

async function deletePost(req, res) {
  const { postId } = req.params;
  const { userId } = res.locals;
  await postService.deletePost({ postId, userId });
  res.sendStatus(200);
}

const postController = { publishPost, getPosts, getPostsById, like, updatePost, deletePost };
export default postController;
