import commentService from "../services/comment.service.js";

async function publishComment(req, res) {
    const { postId } = req.params;
    const { content } = req.body;
    const { userId } = res.locals;
    console.log(postId, content, userId)
    await commentService.publishComment({ postId, content, userId });
    res.sendStatus(201);
}

async function getCommentsByPostId(req, res) {
    const { postId } = req.params;
    const comments = await commentService.getCommentsByPostId(postId);
    res.send(comments.rows);
}

const commentController = { publishComment, getCommentsByPostId };
export default commentController;