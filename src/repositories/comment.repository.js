import db from "../configs/database.connection.js";

async function createComment({ postId, content, userId }) {
    return await db.query(
        `
        INSERT INTO comments (post_id, content, commented_user_id)
        VALUES ($1, $2, $3)
        RETURNING *;
        `,
        [postId, content, userId]
    );
}

async function getCommentsByPostId(postId) {
    return await db.query(
        `
        SELECT
            comments.id,
            comments.content,
            comments.created_at,
            users.username,
            users.picture
        FROM comments
        JOIN users ON comments.commented_user_id = users.id
        WHERE comments.post_id = $1
        ORDER BY comments.created_at DESC;
        `,
        [postId]
    );
}

const commentRepository = { createComment, getCommentsByPostId };
export default commentRepository;