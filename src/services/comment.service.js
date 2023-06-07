import commentRepository from "../repositories/comment.repository.js";

async function publishComment({ postId, content, userId }) {
    const comment = await commentRepository.createComment({ postId, content, userId });
    return comment;
}

const commentService = { publishComment };
export default commentService;