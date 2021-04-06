let endpoint;
if (process.env.NODE_ENV === 'development') {
    endpoint = "http://localhost:3000";
}

if (process.env.NODE_ENV === 'production') {
    endpoint = "https://api.fieldbot.io";
}

export default endpoint;