/**
 * Example of BAD code with HIGH cognitive debt
 * 
 * This file demonstrates anti-patterns:
 * - Long functions (> 100 lines)
 * - Deep nesting (> 5 levels)
 * - Too many parameters (> 8)
 * - Unclear, cryptic names
 * - Complex logic
 */

// Cryptic single-letter variables
function proc(x, y, z, a, b, c, d, e, f) {
    let tmp = 0;
    let res = [];
    let data = {};

    // Deep nesting - very hard to follow
    if (x) {
        if (y) {
            if (z) {
                if (a) {
                    if (b) {
                        if (c) {
                            // 6 levels deep!
                            for (let i = 0; i < x.length; i++) {
                                if (x[i].val > 10) {
                                    if (x[i].type === 'special') {
                                        tmp += x[i].val;
                                        res.push(x[i]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return { tmp, res, data };
}

// Extremely long function (100+ lines)
function handlerequest(req, res, db, cache, logger, config, validator, auth, mailer) {
    let userdata = null;
    let err = null;
    let tmp = [];

    // Line 10
    if (!req) {
        return res.status(400).send('bad request');
    }

    // Line 15
    if (!req.body) {
        return res.status(400).send('no body');
    }

    // Line 20
    try {
        userdata = JSON.parse(req.body);
    } catch (e) {
        err = e;
        return res.status(400).send('parse error');
    }

    // Line 28
    if (!userdata.id) {
        return res.status(400).send('no id');
    }

    // Line 33
    if (!userdata.name) {
        return res.status(400).send('no name');
    }

    // Line 38
    if (!userdata.email) {
        return res.status(400).send('no email');
    }

    // Line 43
    if (!validator.validate(userdata.email)) {
        return res.status(400).send('invalid email');
    }

    // Line 48
    let usr = null;
    try {
        usr = db.query('SELECT * FROM users WHERE id = ?', [userdata.id]);
    } catch (e) {
        logger.error(e);
        return res.status(500).send('db error');
    }

    // Line 57
    if (!usr) {
        return res.status(404).send('not found');
    }

    // Line 62
    if (usr.status === 'banned') {
        return res.status(403).send('banned');
    }

    // Line 67
    if (usr.status === 'pending') {
        if (config.allowPending) {
            if (auth.check(req)) {
                if (auth.level(req) > 5) {
                    // Allow
                } else {
                    return res.status(403).send('insufficient permissions');
                }
            } else {
                return res.status(401).send('unauthorized');
            }
        } else {
            return res.status(403).send('pending users not allowed');
        }
    }

    // Line 84
    let cacheddata = cache.get('user:' + userdata.id);
    if (cacheddata) {
        tmp = cacheddata;
    } else {
        tmp = db.query('SELECT * FROM data WHERE user_id = ?', [userdata.id]);
        cache.set('user:' + userdata.id, tmp);
    }

    // Line 93
    for (let i = 0; i < tmp.length; i++) {
        if (tmp[i].type === 'important') {
            if (tmp[i].value > 100) {
                if (tmp[i].status === 'active') {
                    if (tmp[i].verified) {
                        // Process important data
                        let x = tmp[i].value * 2;
                        let y = x + 50;
                        tmp[i].processed = y;
                    }
                }
            }
        }
    }

    // Line 108
    if (config.sendEmail) {
        try {
            mailer.send({
                to: userdata.email,
                subject: 'Update',
                body: 'Your data has been updated',
            });
        } catch (e) {
            logger.error('Email failed', e);
        }
    }

    // Line 121
    return res.status(200).json({
        success: true,
        data: tmp,
        user: usr,
    });
}

// All lowercase, no separators - hard to read
function processuserdataandvalidateandstore(userdata, validationrules, databaseconnection) {
    // Implementation...
    return true;
}

// Export
module.exports = {
    proc,
    handlerequest,
    processuserdataandvalidateandstore,
};
