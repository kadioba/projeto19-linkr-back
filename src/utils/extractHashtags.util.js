import twitter from "twitter-text";

function normalizeHashtag(tag) {
  return tag
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function extractHashtags(string) {
  const hashtags = twitter.extractHashtags(string);
  const uniqueHashtags = [...new Set(hashtags?.map(normalizeHashtag))];
  return uniqueHashtags.length ? uniqueHashtags : null;
}

export default extractHashtags;
