import db from "../configs/database.connection.js";

async function createPost({ url, content, userId }, data) {
    console.log(data);
    return await db.query(`INSERT INTO posts (url, content, user_id, url_title, url_description, url_picture )
     VALUES ($1, $2, $3, $4, $5, $6);`, [url, content, userId, data.url_title, data.url_description, data.url_picture]);
}

async function getPosts() {
    return await db.query(`SELECT posts.id, posts.content, posts.url, posts.created_at, posts.url_title, posts.url_description, posts.url_picture,
    users.picture, users.username
    FROM posts
    JOIN users ON posts.user_id = users.id
    ORDER BY created_at DESC LIMIT 20;`);
}

const postRepository = { createPost, getPosts };
export default postRepository;