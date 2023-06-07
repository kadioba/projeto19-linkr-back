import db from "../configs/database.connection.js";

function getTrendingHashtags() {
  return db.query(`
    SELECT
        posts_hashtags.hashtag_id,
        hashtags.name,
        COUNT(*) AS hashtag_counts
    FROM posts_hashtags 
        JOIN hashtags ON posts_hashtags.hashtag_id = hashtags.id
    GROUP BY
        posts_hashtags.hashtag_id,
        hashtags.name,
        hashtags.id
    ORDER BY
        hashtag_counts DESC,
        hashtags.name ASC
    LIMIT 10;
    `);
}

function getPostsByHashtag(hashtag, page) {
  const offset = (page - 1) * 10;
  return db.query(
    `
    SELECT
        posts.id,
        posts.content,
        posts.url,
        posts.url_title,
        posts.url_description,
        posts.url_picture,
        posts.created_at,
        users.id AS user_id,
        users.username,
        users.picture,
        array_agg(hashtags.name) as hashtags,
        (
            SELECT COALESCE(
                json_object_agg(likes.user_id, liked_users.username),
                '{}'::json
            )
            FROM likes
            LEFT JOIN users AS liked_users ON liked_users.id = likes.user_id
            WHERE likes.post_id = posts.id AND likes.active = true
        ) AS liked_by
    FROM posts
        JOIN users ON posts.user_id = users.id
        JOIN posts_hashtags ON posts.id = posts_hashtags.post_id
        JOIN hashtags ON posts_hashtags.hashtag_id = hashtags.id
    GROUP BY posts.id, users.id
    HAVING $1 = ANY(array_agg(hashtags.name))
    ORDER BY posts.created_at DESC
    OFFSET $2
    LIMIT 10;
    `,
    [hashtag, offset]
  );
}

const hashtagRepository = {
  getTrendingHashtags,
  getPostsByHashtag,
};

export default hashtagRepository;
