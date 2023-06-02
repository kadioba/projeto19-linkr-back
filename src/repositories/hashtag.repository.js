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
    `)
}

function getPostsByHashtag(hashtag) {
    return db.query(`
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
        array_remove(ARRAY_AGG(likes.user_id), NULL) AS liked_by_user_ids,
        array_remove(ARRAY_AGG(liked_users.username), NULL) AS liked_by_usernames
    FROM posts
        JOIN users ON posts.user_id = users.id
        JOIN posts_hashtags ON posts.id = posts_hashtags.post_id
        JOIN hashtags ON posts_hashtags.hashtag_id = hashtags.id
        LEFT JOIN likes ON posts.id = likes.post_id AND likes.active = true
        LEFT JOIN users AS liked_users ON likes.user_id = liked_users.id
    GROUP BY posts.id, users.id
    HAVING $1 = ANY(array_agg(hashtags.name))
    ORDER BY posts.created_at DESC
    LIMIT 20;
    `, [hashtag])
}

const hashtagRepository = {
    getTrendingHashtags,
    getPostsByHashtag
}

export default hashtagRepository