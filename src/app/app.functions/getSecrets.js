exports.main = (context = {}) => {
    const objectId = JSON.parse(process.env.OBJECTS_ID_BEBEDC)

    return {
        objectId
    }
}