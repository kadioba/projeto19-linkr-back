function extractHashtags(string) {
  const regex = /(?<=#)\w{1,100}/g;
  return string.match(regex);
}

export default extractHashtags;
