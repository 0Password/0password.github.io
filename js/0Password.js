var ZeroPassword = function () {

    var upperCaseSet = "ABCDEFGHJKLMNPRSTUVWXYZ";
    var lowerCaseSet = "abcdefghijkmnopqrstuvwxyz";
    var numbersSet = "23456789";
    var specialCharSet = "!#%+:=?@";

    function getCharFromSet(hash, charSet, index) {
        return charSet[hash.charCodeAt(index) % charSet.length];
    }

    function isInSet(password, charSet) {
        for (var i = 0; i < password.length; i++) {
            if (charSet.indexOf(password[i]) !== -1) {
                return true;
            }
        }
        return false;
    }

    function meetsRequirements(password, upperCase, lowerCase, numbers, specialChars) {
        return (!upperCase || isInSet(password, upperCaseSet)) &&
            (!lowerCase || isInSet(password, lowerCaseSet)) &&
            (!numbers || isInSet(password, numbersSet)) &&
            (!specialChars || isInSet(password, specialCharSet));
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
            service = service || "";

            var attempt = 1;
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
                    var char = getCharFromSet(hash, charMap, index++);
                    password += char;
                }

                attempt++;
            } while (!meetsRequirements(password, upperCase, lowerCase, numbers, specialChars));

            return password;

        }
    };
}();
