import errors from "../errors/index.errors.js";
import postRepository from "../repositories/post.repository.js";
import userRepository from "../repositories/user.repository.js";
import urlMetadata from "url-metadata";
import extractHashtags from "../utils/extractHashtags.util.js";

async function publishPost(url, content, userId) {
  const { rowCount: userExists } = await userRepository.findUserById(userId);
  if (!userExists) throw errors.notFound();

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

  const postId = await postRepository.createPost({ url, content, userId }, data);

  if (hashtags) {
    for (const hashtag of hashtags) {
      let existingHashtag = await postRepository.findHashtagByName(hashtag);

      if (!existingHashtag) {
        existingHashtag = await postRepository.createHashtag(hashtag);
      }

      await postRepository.linkPostToHashtag(postId, existingHashtag.id);
    }
  }
}

async function getPosts() {
  const posts = await postRepository.getPosts();
  return posts;
}

async function like({ postId, userId }) {
  const response = await postRepository.like({ postId, userId });
  const { active } = response.rows[0];
  return {isLiked: active};
}

const postService = { publishPost, getPosts, like };
export default postService;
