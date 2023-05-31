import hashtagRepository from "../repositories/hashtag.repository.js"

async function getTrending() {
    const {rows: trending} = await hashtagRepository.getTrending()

    return trending
}

const hashtagService = {
    getTrending
}

export default hashtagService