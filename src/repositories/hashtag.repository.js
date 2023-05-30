import db from "../configs/database.connection.js";

function getTrending() {
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

const hashtagRepository = {
    getTrending
}

export default hashtagRepository