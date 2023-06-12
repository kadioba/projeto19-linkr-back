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

async function getCommentsByPostId(postId, userId) {
    return await db.query(
        `
        SELECT
            comments.id,
            comments.content,
            comments.created_at,
            users.username,
            users.picture,
            CASE 
                WHEN posts.user_id = comments.commented_user_id THEN TRUE
                ELSE FALSE
            END AS is_author,
            CASE 
                WHEN EXISTS (
                    SELECT 1 FROM followers 
                    WHERE follower_id = $2 
                    AND followed_id = comments.commented_user_id 
                    AND active = TRUE
                ) THEN TRUE
                ELSE FALSE
            END AS is_followed
        FROM comments
        JOIN users ON comments.commented_user_id = users.id
        JOIN posts ON comments.post_id = posts.id
        WHERE comments.post_id = $1
        ORDER BY comments.created_at ASC;
        `,
        [postId, userId]
    );
}

const commentRepository = { createComment, getCommentsByPostId };
export default commentRepository;