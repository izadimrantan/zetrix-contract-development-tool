const Utils = {
    int256Compare(x, y) {
        if (x < y) return -1;
        if (x > y) return 1;
        return 0;
    },
    int256Add(x, y) {
        return x + y;
    },
    int256Sub(x, y) {
        return x - y;
    },
    int256Div(x, y) {
        return x / y;
    },
    int256Mod(x, y) {
        return x % y;
    },
    int256Mul(x, y) {
        return x * y;
    },
    int64Compare(x, y) {
        if (x < y) return -1;
        if (x > y) return 1;
        return 0;
    },
    int64Add(x, y) {
        return x + y;
    },
    int64Sub(x, y) {
        return x - y;
    },
    int64Div(x, y) {
        return x / y;
    },
    int64Mod(x, y) {
        return x % y;
    },
    int64Mul(x, y) {
        return x * y;
    },
    sha256(x, y) {
        return "";
    },
    addressCheck(address) {
    }
}