(function() {

// A stable array sort, because `Array#sort()` is not guaranteed stable.
// This is an implementation of merge sort, without recursion.
// © 2012 Stéphan Kochen, Angry Bytes. MIT-licensed.

var stable = function(arr, comp) {
    if (typeof(comp) !== 'function') {
        comp = function(a, b) {
            return String(a).localeCompare(b);
        };
    }

    // Rather than dividing input, simply iterate chunks of 1, 2, 4, 8, etc.
    // Chunks are the size of the left or right hand in merge sort.
    // Stop when the left-hand covers all of the array.
    var len = arr.length, chk;
    for (chk = 1; chk < len; chk *= 2) {
        console.log("before " + chk + " " + JSON.stringify(arr));
        arr = pass(arr, comp, chk);
    }
    console.log("result " + JSON.stringify(arr));
    console.log('');
    return arr;
};

// Run a single pass with the given chunk size. Returns a new array.
var pass = function(arr, comp, chk) {
    var len = arr.length;
    // Output, and position.
    var result = new Array(len);
    var i = 0;
    // Step size / double chunk size.
    var dbl = chk * 2;
    // Bounds of the left and right chunks.
    var l, r, e;
    // Iterators over the left and right chunk.
    var li, ri;

    // Iterate over pairs of chunks.
    for (l = 0; l < len; l += dbl) {
        r = l + chk;
        e = r + chk;
        if (r > len) r = len;
        if (e > len) e = len;

        // Iterate both chunks in parallel.
        li = l;
        ri = r;
        while (true) {
            // Compare the chunks.
            if (li < r && ri < e) {
                // This works for a regular `sort()` compatible comparator,
                // but also for a simple comparator like: `a > b`
                if (comp(arr[li], arr[ri]) <= 0) {
                    result[i++] = arr[li++];
                }
                else {
                    result[i++] = arr[ri++];
                }
            }
            // Nothing to compare, just flush what's left.
            else if (li < r) {
                result[i++] = arr[li++];
            }
            else if (ri < e) {
                result[i++] = arr[ri++];
            }
            // Both iterators are at the chunk ends.
            else {
                break;
            }
        }
    }

    return result;
};

// Export use CommonJS or to the window.
if (typeof(module) !== 'undefined') {
    module.exports = stable;
}
else if (typeof(exports) !== 'undefined') {
    exports.stable = stable;
}
else {
    window.stable = stable;
}

})();