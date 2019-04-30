
const intersection = (setA, setB) => {
    var _intersection = new Set();
    for (var elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem);
        }
    }
    return _intersection;
};

const isSameSet = (setA, setB) => {
    var _difference = new Set(setA);
    for (var elem of setB) {
        _difference.delete(elem);
    }
    return _difference.size === 0;
};

const duplicateErrorHandler = (err) => {
    if (err.code === "ER_DUP_ENTRY") {
        // console.log("new duplicate");
    } else
        throw err;
};

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
    noSpace: noSpace,
    duplicateErrorHandler,
    intersection,
    isSameSet
};