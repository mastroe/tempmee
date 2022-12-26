const winston = require('winston');
const { format, transports } = winston;
const { combine, timestamp, colorize, printf, align, json } = format;
const { SPLAT } = require('triple-beam');
const { v4: uuidv4 } = require('uuid');
const { isObject } = require('lodash');

const emitters = require('events');
emitters.EventEmitter.defaultMaxListeners = 50;


const isProduction = process.env.NODE_ENV === 'production';
const LOG_LEVEL = process.env.LOG_LEVEL || 'verbose';

const formatObject = (param) => {
	if (isObject(param)) {
		return JSON.stringify(param);
	}
	return param;
};

const all = format((info) => {
	const splat = info[SPLAT] || [];
	const message = formatObject(info.message);
	const rest = splat.map(formatObject).join(' ');
	info.message = `${message} ${rest}`;
	return info;
});


const generateLoggerConfiguration = (name) => {
	const transportsConfig = [
		new transports.Console({ level: LOG_LEVEL })
	];

	const config = {
		format: combine(
			all(),
			timestamp(),
			colorize(),
			align(),
			printf(
				(info) =>
					`${info.timestamp} ${info.level}: ${formatObject(info.message)}`
			)
		),
		transports: transportsConfig
	};
	if (isProduction) {
		config.format = combine(
			all(),
			timestamp(),
			json()
		);
	}

	return config;
};

const LOGGER_NAMES = {
	compensation: 'Compensation',
};

winston.loggers.add('default', generateLoggerConfiguration('all', false));

Object.entries(LOGGER_NAMES).forEach(([key, value], index) => {
	winston.loggers.add(value, generateLoggerConfiguration(value));
});

const logger = winston.loggers.get('default');

const logEntryRequest = (req, res, next) => {
	req.uuid = uuidv4();
	logger.info(
		req.uuid,
		'middleware/hostname',
		req.hostname,
		req.headers['x-real-ip'],
		req.headers['x-real-origin'],
		req.method,
		req.path
	);
	next();
};

const stream = {
	write: (message, encoding) => {
		logger.info(message);
	}
};

module.exports = {
	logEntryRequest,
	stream,
	logger,
	loggerCompensation: winston.loggers.get(LOGGER_NAMES.compensation),
};
