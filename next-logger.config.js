const Transport = require('winston-transport');
const { transports, createLogger, format } = require('winston');

const IGNORED_ERRORS = ['Failed to get source map', 'AbortError:'];

const filter = format((info) => {
  if (IGNORED_ERRORS.some((message) => info.message.startsWith(message))) {
    return false;
  }

  return info;
});

class ApiTransport extends Transport {
  constructor(opts) {
    super(opts);
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info + '\n');
    });

    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: JSON.stringify(info) }),
    });

    callback();
  }
}

const logger = () => {
  const logger = createLogger({
    format: format.combine(filter(), format.timestamp()),
    transports: [
      new transports.Console({
        format: format.simple(),
      }),
      new ApiTransport({
        level: 'error',
        format: format.json(),
      }),
    ],
  });

  logger.exceptions.handle(
    new ApiTransport({
      format: format.json(),
    }),
  );

  return logger;
};

module.exports = {
  logger,
};
