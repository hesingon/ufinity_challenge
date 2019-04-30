
const commonStudentQueryBuilder = (arr) => {
    var query = `SELECT student FROM registration WHERE teacher="${arr[0]}"`;
    if (arr.length > 1) {
        for (var i = 1; i < arr.length; i++) {
            query = query + " AND " +
                `registration.student IN (SELECT student FROM registration WHERE teacher="${arr[i]}")`;
        }
    }
    return query;
};

const noSpace = (str) => {
    return str.replace(/\s/g,'');
};

module.exports = {
    commonStudentQueryBuilder: commonStudentQueryBuilder,
    noSpace: noSpace
};