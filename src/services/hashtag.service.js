import hashtagRepository from "../repositories/hashtag.repository.js"

async function getTrendingHashtags() {
    const {rows: trendingHashtags} = await hashtagRepository.getTrendingHashtags()

    return trendingHashtags
}

async function getPostsByHashtag(hashtag){
    const {rows: postsByHashtag} = await hashtagRepository.getPostsByHashtag(hashtag)

    return postsByHashtag
}

const hashtagService = {
    getTrendingHashtags,
    getPostsByHashtag
}

export default hashtagService