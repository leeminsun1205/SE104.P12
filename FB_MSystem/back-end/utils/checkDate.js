function isValidRange(start, end, allowEqual = true) {
    if (start == null || end == null) return false; // Không được null hoặc undefined

    const startValue = isNaN(start) ? new Date(start) : Number(start);
    const endValue = isNaN(end) ? new Date(end) : Number(end);

    if (isNaN(startValue) || isNaN(endValue)) return false; // Giá trị không hợp lệ

    return allowEqual ? startValue <= endValue : startValue < endValue;
}

module.exports = {isValidRange};
