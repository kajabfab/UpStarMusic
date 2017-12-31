const Artist = require('../models/artist');

/**
 * Searches through the Artist collection
 * @param {object} criteria An object with a name, age, and yearsActive
 * @param {string} sortProperty The property to sort the results by
 * @param {number} offset How many records to skip in the result set
 * @param {number} limit How many records to return in the result set
 * @return {Promise<[any , any]>} A promise that resolves with the artists, count, offset, and limit
 */
module.exports = (criteria, sortProperty, offset = 0, limit = 20) => {

    let searchObject = {};

    if (criteria.name !== undefined) {
        searchObject.$text = {
            $search: criteria.name
        };
    }
    if (criteria.age !== undefined) {
        searchObject.age = {
            $gte: criteria.age.min,
            $lte: criteria.age.max
        };
    }
    if (criteria.yearsActive !== undefined) {
        searchObject.yearsActive = {
            $gte: criteria.yearsActive.min,
            $lte: criteria.yearsActive.max
        };
    }


    const query = Artist
        .find(searchObject)
        .sort({[sortProperty]: 1})
        .skip(offset)
        .limit(limit);

    return Promise.all([
            query,
            Artist.find(searchObject).count()
        ])
        .then((result) => {
            return {
                all: result[0],
                count: result[1],
                offset,
                limit
            };
        });
};