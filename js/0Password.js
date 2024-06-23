/*
    0Password.js
    ---------------------
    0Password never remembers your passwords.
    It keeps your digital life secure and always available,
    safe behind the zero password that only you know.
    ---------------------
    https://0password.github.io/
    ---------------------
    by Max Gripe (https://github.com/MaxGripe)   
*/

var ZeroPassword = function () {

    var upperCaseSet = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    var lowerCaseSet = "abcdefghijkmnoprstuvwxyz";
    var numbersSet = "234567892345678923456789";
    var specialCharSet = "!#%+:=?@!#%+:=?@!#%+:=?@";

    function getChar(hash, charSet, index) {
        return charSet[hash.charCodeAt(index) % charSet.length];
    }

    function containsCharFromSet(password, set) {
        for (var i = 0; i < password.length; i++) {
            if (set.indexOf(password[i]) !== -1) {
                return true;
            }
        }
        return false;
    }

    function meetsRequirements(password, upperCase, lowerCase, numbers, specialChars) {
        return (!upperCase || containsCharFromSet(password, upperCaseSet)) &&
            (!lowerCase || containsCharFromSet(password, lowerCaseSet)) &&
            (!numbers || containsCharFromSet(password, numbersSet)) &&
            (!specialChars || containsCharFromSet(password, specialCharSet));
    }

    return {
        compute: function (keyword, service, length, upperCase, lowerCase, numbers, specialChars) {

            var minLen = 4;
            var maxLen = 128;

            var charMap = "";
            if (upperCase) charMap += upperCaseSet;
            if (lowerCase) charMap += lowerCaseSet;
            if (numbers) charMap += numbersSet;
            if (specialChars) charMap += specialCharSet;

            if (charMap.length === 0) {
                return '';
            }

            length = Math.min(Math.max(length, minLen), maxLen);
            keyword = keyword || "";
            service = (service || "").toLowerCase();

            var attempt = 0;
            do {
                var password = "";

                var baseString = keyword + service +
                    (upperCase ? "U" : "") +
                    (lowerCase ? "L" : "") +
                    (numbers ? "N" : "") +
                    (specialChars ? "S" : "") +
                    attempt.toString();
                var hash = CryptoJS.SHA256(baseString).toString(CryptoJS.enc.Base64);

                var index = 0;

                while (password.length < length) {
                    if (index >= hash.length) {
                        hash = CryptoJS.SHA256(hash).toString(CryptoJS.enc.Base64);
                        index = 0;
                    }
                    var char = getChar(hash, charMap, index++);
                    password += char;
                }

                attempt++;
            } while (!meetsRequirements(password, upperCase, lowerCase, numbers, specialChars));

            return password;

        }
    };
}();
