const STATUS_CODE_NOT_FOUND = 404;

exports.isNotFound = response => response && response.status === STATUS_CODE_NOT_FOUND;
