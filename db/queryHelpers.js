
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

const commonStudentQueryBuilder = (teacherList) => {
    var query;
    // if there's only 1 teacher, arr is
    // only a string, else it's an array.
    if (Array.isArray(teacherList)) {
        query = `SELECT student FROM registration WHERE teacher="${teacherList[0]}"`;
        for (var i = 1; i < teacherList.length; i++) {
            query = query + " AND " +
                `registration.student IN (SELECT student FROM registration WHERE teacher="${teacherList[i]}")`;
        }
    }
    else
        query = `SELECT student FROM registration WHERE teacher="${teacherList}"`;
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