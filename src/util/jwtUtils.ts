import jwt from 'jsonwebtoken';

const isTokenValid = (): boolean => {
    const token = localStorage.getItem('authorization');
    if (!token) {
        return false;
    }

    let decodedToken = jwt.decode(token, { complete: true }) as { [key: string]: any };
    let dateNow = new Date();

    if (decodedToken.payload.exp * 1000 < dateNow.getTime()) {
        return false;
    }

    return true;
}

export default {
    isTokenValid
}