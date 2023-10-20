const totalLikes = (blogs) => {
    if (blogs.length === 0) {
        return 0
    } else {
        const likes = blogs.reduce((acc, blog) => {
            return acc + blog.likes
        }, 0)
        return likes
    }
}

module.exports = {
    totalLikes
}