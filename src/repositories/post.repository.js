import db from "../configs/database.connection.js";

async function createPost({ url, content, userId }, data, client = db) {
  const result = await client.query(
    `
    INSERT INTO
        posts (
            url,
            content,
            user_id,
            url_title,
            url_description,
            url_picture
        )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id;`,
    [url, content, userId, data.url_title, data.url_description, data.url_picture]
  );

  return result.rows[0].id;
}

async function repost({ postId, userId }, client = db) {
  return await client.query(`
  INSERT INTO reposts (post_id, reposter_user_id)
  VALUES ($1, $2) 
  `, [postId, userId])
}

async function getPosts(page, userId, client = db) {
  const offset = (page - 1) * 10;
  return await client.query(`
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
        ) AS liked_by
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE users.id = $2
        OR users.id IN (
            SELECT followed_id
            FROM followers
            WHERE follower_id = $2
              AND active = true
        )
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
        ) AS liked_by
      FROM posts
      JOIN reposts ON posts.id = reposts.post_id
      JOIN users ON posts.user_id = users.id
      JOIN users AS reposting_users ON reposts.reposter_user_id = reposting_users.id
      WHERE reposts.reposter_user_id = $2
        OR reposts.reposter_user_id IN (
            SELECT followed_id
            FROM followers
            WHERE follower_id = $2
              AND active = true
        )
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
      original_posts.liked_by
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
      reposted_posts.liked_by
    FROM reposted_posts
    LEFT JOIN repost_counts ON reposted_posts.id = repost_counts.post_id
    LEFT JOIN comment_counts ON reposted_posts.id = comment_counts.post_id
    ORDER BY created_at DESC
    OFFSET $1
    LIMIT 10;
  `, [offset, userId]);
}


/*async function getPosts(page, userId, client = db) {
  const offset = (page - 1) * 10;
  return await client.query(`
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
        ) AS liked_by
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE users.id = $2
        OR users.id IN (
            SELECT followed_id
            FROM followers
            WHERE follower_id = $2
              AND active = true
        )
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
        ) AS liked_by
      FROM posts
      JOIN reposts ON posts.id = reposts.post_id
      JOIN users ON posts.user_id = users.id
      JOIN users AS reposting_users ON reposts.reposter_user_id = reposting_users.id
      WHERE reposts.reposter_user_id = $2
        OR reposts.reposter_user_id IN (
            SELECT followed_id
            FROM followers
            WHERE follower_id = $2
              AND active = true
        )
    ),
    repost_counts AS (
      SELECT
        post_id,
        COUNT(*) as repost_count
      FROM reposts
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
      original_posts.liked_by
    FROM original_posts
    LEFT JOIN repost_counts ON original_posts.id = repost_counts.post_id
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
      reposted_posts.liked_by
    FROM reposted_posts
    LEFT JOIN repost_counts ON reposted_posts.id = repost_counts.post_id
    ORDER BY created_at DESC
    OFFSET $1
    LIMIT 10;
  `, [offset, userId]);
}*/

async function getPostsById(id, page, client = db) {
  const offset = (page - 1) * 10;
  return await client.query(`
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
        ) AS liked_by
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE users.id = $1
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
        ) AS liked_by
      FROM posts
      JOIN reposts ON posts.id = reposts.post_id
      JOIN users ON posts.user_id = users.id
      JOIN users AS reposting_users ON reposts.reposter_user_id = reposting_users.id
      WHERE reposts.reposter_user_id = $1
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
      original_posts.liked_by
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
      reposted_posts.liked_by
    FROM reposted_posts
    LEFT JOIN repost_counts ON reposted_posts.id = repost_counts.post_id
    LEFT JOIN comment_counts ON reposted_posts.id = comment_counts.post_id
    ORDER BY created_at DESC
    OFFSET $2
    LIMIT 10;
  `, [id, offset]);
}

async function createHashtag(name, postId, client = db) {
  return await client.query(
    `
  WITH upsert AS (
    INSERT INTO hashtags (name)
    VALUES ($1)
    ON CONFLICT (name)
    DO
    UPDATE SET name = EXCLUDED.name
    RETURNING id
  )
  INSERT INTO posts_hashtags (post_id, hashtag_id)
  SELECT $2, id FROM upsert;`,
    [name, postId]
  );
}

async function like({ userId, postId }, client = db) {
  return await client.query(
    `
  INSERT INTO likes (user_id, post_id, active) 
      VALUES ($1, $2, true)
      ON CONFLICT (user_id, post_id) DO UPDATE SET
      active = NOT likes.active
      RETURNING active;
    `,
    [userId, postId]
  );
}

async function getPostById(postId, client = db) {
  return await client.query(
    `
    SELECT * FROM posts WHERE id = $1;
  `,
    [postId]
  );
}

async function deletePostHashtags(postId, client = db) {
  const deletedHashtagIdsResult = await client.query(
    `
    DELETE FROM posts_hashtags
    WHERE post_id = $1
    RETURNING hashtag_id
    `,
    [postId]
  );

  const deletedHashtagIds = deletedHashtagIdsResult.rows.map((row) => row.hashtag_id);

  for (const hashtagId of deletedHashtagIds) {
    await client.query(
      `
      DELETE FROM hashtags
      WHERE id = $1 AND NOT EXISTS (
        SELECT 1 FROM posts_hashtags
        WHERE hashtag_id = $1
      );
      `,
      [hashtagId]
    );
  }
}

async function updatePost({ postId, content, userId }, client = db) {
  await client.query(
    `
    UPDATE posts
    SET content = $1
    WHERE id = $2 AND user_id = $3;
  `,
    [content, postId, userId]
  );
}

async function deletePost(postId, userId, client = db) {
  await client.query(
    `
    DELETE FROM likes
    WHERE post_id = $1;
  `,
    [postId]
  );

  await client.query(
    `
    DELETE FROM posts
    WHERE id = $1 AND user_id = $2;
  `,
    [postId, userId]
  );
}

const postRepository = {
  createPost,
  repost,
  getPosts,
  createHashtag,
  like,
  getPostById,
  getPostsById,
  deletePostHashtags,
  updatePost,
  deletePost,
};
export default postRepository;
