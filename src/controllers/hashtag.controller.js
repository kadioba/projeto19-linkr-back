import hashtagService from "../services/hashtag.service.js"

async function getTrending(req, res) {
    const trending = await hashtagService.getTrending()

    res.status(200).send(trending)
}

const hashtagController = {
    getTrending
}

export default hashtagController