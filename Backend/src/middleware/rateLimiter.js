import ratelimit from "../config/upstash.js";

const ratelimiter = async (req, res, next) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const result = await ratelimit.limit(ip);
        if (!result.success) {
            return res.status(429).json({ error: "Trop de tentatives, veuillez réessayer plus tard." });
        }
        // If you want to use a custom key for rate limiting, you can uncomment the line below
        // const { success } = await ratelimit.limit("my-rate-limit-key");

        const {success} = await ratelimit.limit("my-rate-limit-key");
        // If the rate limit is exceeded, return a 429 status code
        // Otherwise, proceed to the next middleware or route handler
        if (!success) {
            return res.status(429).json({ error: "Trop de tentatives, veuillez réessayer plus tard." });
        }
        console.log('Rate limit check passed for IP:', ip);
        next();
    } catch (error) {
        console.log('Rate limiter error:', error);
        next(error);        
    }
}

export default ratelimiter;