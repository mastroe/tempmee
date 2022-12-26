const { logger } = require('./logger');
const helmet = require('helmet');
const redis = require('./redis').duplicate();

const helmetMiddleware = (app) => {
	app.use(helmet());
	app.use(helmet.noCache());
};

const rateLimitMiddleware = (app) => {
	const limiter = require('express-limiter')(app, redis);

	limiter({
		path: '/compensation',
		method: 'get',
		total: 200,
		expire: 1000 * 60 * 2,
		lookup: 'headers.x-forwarded-for',
		onRateLimited: function (req, res, next) {
			logger.verbose('config/middleware/rateLimitMiddleware', 'ALERT', 'get compensation');
			return res.status(429).json({ message: 'Too many requests. Your account is blocked for 2 minutes' });
		}
	});
};

module.exports = {
	helmetMiddleware,
	rateLimitMiddleware,
};
