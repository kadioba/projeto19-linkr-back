import hashtagService from "../services/hashtag.service.js"

async function getTrendingHashtags(req, res) {
    const trendingHashtags = await hashtagService.getTrendingHashtags()

    res.status(200).send(trendingHashtags)
}

async function getPostsByHashtag(req, res) {
    const { hashtag } = req.params

    const postsByHashtag = await hashtagService.getPostsByHashtag(hashtag)

    res.status(200).send(postsByHashtag)
}

const hashtagController = {
    getTrendingHashtags,
    getPostsByHashtag
}

export default hashtagController