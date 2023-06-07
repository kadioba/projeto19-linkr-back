import commentRepository from "../repositories/comment.repository.js";

async function publishComment({ postId, content, userId }) {
    const comment = await commentRepository.createComment({ postId, content, userId });
    return comment;
}

async function getCommentsByPostId(postId, userId) {
    const comments = await commentRepository.getCommentsByPostId(postId, userId);
    return comments;
}

const commentService = { publishComment, getCommentsByPostId };
export default commentService;