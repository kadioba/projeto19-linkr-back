import hashtagRepository from "../repositories/hashtag.repository.js";

async function getTrendingHashtags() {
  const { rows: trendingHashtags } = await hashtagRepository.getTrendingHashtags();

  return trendingHashtags;
}

async function getPostsByHashtag(hashtag, page) {
  const { rows: postsByHashtag } = await hashtagRepository.getPostsByHashtag(hashtag, page);

  return postsByHashtag;
}

const hashtagService = {
  getTrendingHashtags,
  getPostsByHashtag,
};

export default hashtagService;
