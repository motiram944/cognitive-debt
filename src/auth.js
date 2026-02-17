/**
 * Complex function introduced in feature branch
 */
function complexAuth(user, token, context, flags, options) {
    if (user) {
        if (token) {
            if (context) {
                if (flags) {
                    if (options) {
                        return "Authenticated";
                    }
                }
            }
        }
    }
}
module.exports = { complexAuth };
