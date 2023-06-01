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

async function findHashtagByName(name, client = db) {
  const result = await client.query(`SELECT * FROM hashtags WHERE name = $1;`, [name]);
  return result.rows[0];
}

async function createHashtag(name, client = db) {
  const result = await client.query(`INSERT INTO hashtags (name) VALUES ($1) RETURNING id;`, [name]);
  return result.rows[0];
}

async function linkPostToHashtag(postId, hashtagId, client = db) {
  await client.query(`INSERT INTO posts_hashtags (post_id, hashtag_id) VALUES ($1, $2);`, [postId, hashtagId]);
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

const postRepository = { createPost, getPosts, findHashtagByName, createHashtag, linkPostToHashtag, like };
export default postRepository;
