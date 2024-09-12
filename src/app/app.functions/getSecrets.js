exports.main = async (context = {}) => {
    const objectId = JSON.parse(process.env.OBJECT_ID);

    return {
        objectId
    };
};