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

async function getPosts() {
  const posts = await postRepository.getPosts();
  return posts;
}

async function like({ postId, userId }) {
  const response = await postRepository.like({ postId, userId });
  const { active } = response.rows[0];
  return { isLiked: active };
}

const postService = { publishPost, getPosts, like };
export default postService;
