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

async function getPosts(client = db) {
  return await client.query(`
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
      array_remove(ARRAY_AGG(likes.user_id), NULL) AS liked_by_user_ids,
      array_remove(ARRAY_AGG(liked_users.username), NULL) AS liked_by_usernames
    FROM
      posts
      JOIN users ON posts.user_id = users.id
      LEFT JOIN likes ON posts.id = likes.post_id AND likes.active = true
      LEFT JOIN users AS liked_users ON likes.user_id = liked_users.id
    GROUP BY
      posts.id, users.id
    ORDER BY
      posts.created_at DESC
    LIMIT 20;
  `);
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

  const deletedHashtagIds = deletedHashtagIdsResult.rows.map(row => row.hashtag_id);

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


const postRepository = { createPost, getPosts, createHashtag, like, getPostById, deletePostHashtags, updatePost };
export default postRepository;
