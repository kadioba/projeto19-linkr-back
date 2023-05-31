import db from "../configs/database.connection.js";

function getTrendingHashtags() {
    return db.query(`
    SELECT
        pht.hashtag_id,
        ht.name,
        COUNT(*) AS hashtag_counts
    FROM posts_hashtags AS pht
        JOIN hashtags AS ht ON pht.hashtag_id = ht.id
    GROUP BY
        pht.hashtag_id,
        ht.name,
        ht.id
    ORDER BY
        hashtag_counts DESC
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
        users.username,
        users.picture,
        array_agg(hashtags.name) as hashtags
    FROM posts
        JOIN users ON posts.user_id = users.id
        JOIN posts_hashtags ON posts.id = posts_hashtags.post_id
        JOIN hashtags ON posts_hashtags.hashtag_id = hashtags.id
    GROUP BY posts.id, users.username, users.picture
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