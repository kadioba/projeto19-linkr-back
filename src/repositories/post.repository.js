import db from "../configs/database.connection.js";

async function createPost({ url, content, userId }, data) {
  const result = await db.query(
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

async function getPosts() {
  return await db.query(`
  SELECT posts.id, posts.content, posts.url, posts.created_at, posts.url_title, posts.url_description, posts.url_picture,
    users.picture, users.username
    FROM posts
    JOIN users ON posts.user_id = users.id
    ORDER BY created_at DESC LIMIT 20;`);
}

async function findHashtagByName(name) {
  const result = await db.query(`SELECT * FROM hashtags WHERE name = $1;`, [name]);
  return result.rows[0];
}

async function createHashtag(name) {
  const result = await db.query(`INSERT INTO hashtags (name) VALUES ($1) RETURNING id;`, [name]);
  return result.rows[0];
}

async function linkPostToHashtag(postId, hashtagId) {
  await db.query(`INSERT INTO posts_hashtags (post_id, hashtag_id) VALUES ($1, $2);`, [postId, hashtagId]);
}

const postRepository = { createPost, getPosts, findHashtagByName, createHashtag, linkPostToHashtag };
export default postRepository;
