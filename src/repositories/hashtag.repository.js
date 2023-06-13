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

async function getPostsByHashtag(hashtag, page) {
    const offset = (page - 1) * 10;
    return await db.query(`
      WITH original_posts AS (
        SELECT
          posts.id,
          posts.content,
          posts.url,
          posts.created_at,
          posts.url_title,
          posts.url_description,
          posts.url_picture,
          users.id AS user_id,
          users.picture,
          users.username,
          NULL::integer as reposter_user_id,
          NULL::text as reposter_username,
          NULL::integer as repost_id,
          (
            SELECT COALESCE(
              json_object_agg(likes.user_id, liked_users.username),
              '{}'::json
            )
            FROM likes
            LEFT JOIN users AS liked_users ON liked_users.id = likes.user_id
            WHERE likes.post_id = posts.id AND likes.active = true
          ) AS liked_by,
          array_agg(hashtags.name) as hashtags
        FROM posts
        JOIN users ON posts.user_id = users.id
        JOIN posts_hashtags ON posts.id = posts_hashtags.post_id
        JOIN hashtags ON posts_hashtags.hashtag_id = hashtags.id
        WHERE hashtags.name = $1
        GROUP BY posts.id, users.id
      ),
      reposted_posts AS (
        SELECT
          posts.id,
          posts.content,
          posts.url,
          reposts.created_at,
          posts.url_title,
          posts.url_description,
          posts.url_picture,
          users.id AS user_id,
          users.picture,
          users.username,
          reposts.reposter_user_id,
          reposting_users.username AS reposter_username,
          reposts.id as repost_id,
          (
            SELECT COALESCE(
              json_object_agg(likes.user_id, liked_users.username),
              '{}'::json
            )
            FROM likes
            LEFT JOIN users AS liked_users ON liked_users.id = likes.user_id
            WHERE likes.post_id = posts.id AND likes.active = true
          ) AS liked_by,
          array_agg(hashtags.name) as hashtags
        FROM posts
        JOIN reposts ON posts.id = reposts.post_id
        JOIN users ON posts.user_id = users.id
        JOIN users AS reposting_users ON reposts.reposter_user_id = reposting_users.id
        JOIN posts_hashtags ON posts.id = posts_hashtags.post_id
        JOIN hashtags ON posts_hashtags.hashtag_id = hashtags.id
        WHERE hashtags.name = $1
        GROUP BY posts.id, users.id, reposts.id, reposting_users.username
      ),
      repost_counts AS (
        SELECT
          post_id,
          COUNT(*) as repost_count
        FROM reposts
        GROUP BY post_id
      ),
      comment_counts AS (
        SELECT
          post_id,
          COUNT(*) as comment_count
        FROM comments
        GROUP BY post_id
      )
      SELECT 
        original_posts.id,
        original_posts.content,
        original_posts.url,
        original_posts.created_at,
        original_posts.url_title,
        original_posts.url_description,
        original_posts.url_picture,
        original_posts.user_id,
        original_posts.picture,
        original_posts.username,
        original_posts.repost_id,
        original_posts.reposter_user_id,
        original_posts.reposter_username,
        COALESCE(repost_counts.repost_count, 0) as repost_count,
        COALESCE(comment_counts.comment_count, 0) as comment_count,
        original_posts.liked_by,
        original_posts.hashtags
      FROM original_posts
      LEFT JOIN repost_counts ON original_posts.id = repost_counts.post_id
      LEFT JOIN comment_counts ON original_posts.id = comment_counts.post_id
      UNION ALL
      SELECT 
        reposted_posts.id,
        reposted_posts.content,
        reposted_posts.url,
        reposted_posts.created_at,
        reposted_posts.url_title,
        reposted_posts.url_description,
        reposted_posts.url_picture,
        reposted_posts.user_id,
        reposted_posts.picture,
        reposted_posts.username,
        reposted_posts.repost_id,
        reposted_posts.reposter_user_id,
        reposted_posts.reposter_username,
        COALESCE(repost_counts.repost_count, 0) as repost_count,
        COALESCE(comment_counts.comment_count, 0) as comment_count,
        reposted_posts.liked_by,
        reposted_posts.hashtags
      FROM reposted_posts
      LEFT JOIN repost_counts ON reposted_posts.id = repost_counts.post_id
      LEFT JOIN comment_counts ON reposted_posts.id = comment_counts.post_id
      ORDER BY created_at DESC
      OFFSET $2
      LIMIT 10;
    `, [hashtag, offset]);
}  

const hashtagRepository = {
  getTrendingHashtags,
  getPostsByHashtag,
};

export default hashtagRepository;
