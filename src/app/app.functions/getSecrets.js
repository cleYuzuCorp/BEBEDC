exports.main = (context = {}) => {
    const objectId = JSON.parse(process.env.OBJECT_ID)

    return {
        objectId
    }
}