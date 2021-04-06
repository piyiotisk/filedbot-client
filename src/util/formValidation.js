const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const isValidEmail = (email) => {
    let result = {};
    if (email) {
        result = email.match(emailRegex);
    }

    if (result) {
        return result.length === 1;
    }

    return false;
}

export { isValidEmail };