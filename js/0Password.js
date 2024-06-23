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

    function getCharFromSet(hash, charSet, index) {
        return charSet[hash.charCodeAt(index) % charSet.length];
    }

    function meetsRequirements(password, upperCase, lowerCase, numbers, specialChars) {
        return (!upperCase || /[A-Z]/.test(password)) &&
            (!lowerCase || /[a-z]/.test(password)) &&
            (!numbers || /[0-9]/.test(password)) &&
            (!specialChars || /[!@#$%^&*_\-+:,.?]/.test(password));
    }

    return {
        compute: function (keyword, service, length, upperCase, lowerCase, numbers, specialChars) {
            var minLen = 8;
            var maxLen = 64;
            var upperCaseSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var lowerCaseSet = "abcdefghijklmnopqrstuvwxyz";
            var numbersSet = "0123456789";
            var specialCharSet = "!@#$%^&*_-+:,.?";

            var charMap = "";
            if (upperCase) charMap += upperCaseSet;
            if (lowerCase) charMap += lowerCaseSet;
            if (numbers) charMap += numbersSet;
            if (specialChars) charMap += specialCharSet;

            var password = "";

            length = Math.min(Math.max(length, minLen), maxLen);
            keyword = keyword || "";
            service = service || "";

            var baseString = keyword + service +
                (upperCase ? "U" : "") +
                (lowerCase ? "L" : "") +
                (numbers ? "N" : "") +
                (specialChars ? "S" : "");
            var hash = CryptoJS.SHA256(baseString).toString(CryptoJS.enc.Base64);

            var index = 0;

            // Ensure at least one character of each required type
            var requiredTypes = [
                { active: upperCase, set: upperCaseSet, added: false },
                { active: lowerCase, set: lowerCaseSet, added: false },
                { active: numbers, set: numbersSet, added: false },
                { active: specialChars, set: specialCharSet, added: false }
            ];

            requiredTypes.forEach(function (type) {
                if (type.active) {
                    password += getCharFromSet(hash, type.set, index++);
                    type.added = true;
                }
            });

            // Fill the rest of the password
            while (password.length < length) {
                if (index >= hash.length) {
                    hash = CryptoJS.SHA256(hash).toString(CryptoJS.enc.Base64);
                    index = 0;
                }
                var char = charMap[hash.charCodeAt(index++) % charMap.length];
                password += char;
            }

            // Ensure password meets all requirements
            if (!meetsRequirements(password, upperCase, lowerCase, numbers, specialChars)) {
                return this.compute(keyword, service, length, upperCase, lowerCase, numbers, specialChars);
            }

            return password.slice(0, length);
        }
    };
}();
