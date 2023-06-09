import postRepository from "../repositories/post.repository.js";
import urlMetadata from "url-metadata";
import extractHashtags from "../utils/extractHashtags.util.js";
import withTransaction from "../utils/withTransaction.util.js";

async function publishPost(url, content, userId) {
  let hashtags;
  if (content) {
    hashtags = extractHashtags(content);
  }

  let data = { url_title: "", url_description: "", url_picture: "" };

  try {
    const metadata = await urlMetadata(url);
    const dataScraped = {
      url_title: metadata["og:title"],
      url_description: metadata["og:description"],
      url_picture: metadata["og:image"],
    };
    data = dataScraped;
  } catch (error) {
    console.log(error);
  }

  const publishPostWithTransaction = async (client) => {
    const postId = await postRepository.createPost({ url, content, userId }, data, client);
    if (hashtags) {
      for (const hashtag of hashtags) {
        await postRepository.createHashtag(hashtag, postId, client);
      }
    }
  };

  await withTransaction(publishPostWithTransaction);
}

async function repost({postId, userId}){
  return await postRepository.repost({ postId, userId });
}

async function getPosts(page, userId) {
  const posts = await postRepository.getPosts(page, userId);
  return posts;
}

async function getPostsById(id, page) {
  const posts = await postRepository.getPostsById(id, page);
  return posts;
}

async function like({ postId, userId }) {
  const response = await postRepository.like({ postId, userId });
  const { active } = response.rows[0];
  return { isLiked: active };
}

async function updatePost({ postId, content, userId }) {
  const post = await postRepository.getPostById(postId);
  if (post.rows[0].user_id !== userId) {
    throw new Error("You are not allowed to edit this post");
  }

  let hashtags;
  if (content) {
    hashtags = extractHashtags(content);
  }

  await postRepository.deletePostHashtags(postId);

  const editPostWithTransaction = async (client) => {
    await postRepository.updatePost({ postId, content, userId }, client);
    if (hashtags) {
      for (const hashtag of hashtags) {
        await postRepository.createHashtag(hashtag, postId, client);
      }
    }
  };

  await withTransaction(editPostWithTransaction);
}

async function deletePost({ postId, userId }) {
  const post = await postRepository.getPostById(postId);
  if (post.rows[0].user_id !== userId) {
    throw new Error("You are not allowed to delete this post");
  }

  const deletePostWithTransaction = async (client) => {
    await postRepository.deletePostHashtags(postId, client);
    await postRepository.deletePost(postId, userId, client);
  };
  await withTransaction(deletePostWithTransaction);
}

const postService = { publishPost, repost, getPosts, getPostsById, like, updatePost, deletePost };
export default postService;
