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

const commentRepository = { createComment };
export default commentRepository;