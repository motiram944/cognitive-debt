// ❌ BAD CODE: Hard to read, deep nesting, unclear names.

function process(d, t, f) {
    let val = 0;
    if (d && d.length > 0) {
        for (let i = 0; i < d.length; i++) {
            if (d[i].q > 0) {
                if (d[i].p > 100) {
                    if (f) {
                        val += d[i].p * d[i].q * 0.9;
                    } else {
                        val += d[i].p * d[i].q;
                    }
                } else {
                    val += d[i].p * d[i].q;
                }
            }
        }
        val = val + (val * t);
    }
    return val.toFixed(2);
}

// Score: 45/100 (Fair/Poor)
// Issues:
// - Unclear names (d, t, f, val)
// - Deep nesting (4 levels)
// - Mixed logic
