// const Transport = require('winston-transport');
// const { createLogger, format, transports } = require('winston');

// //
// // Inherit from `winston-transport` so you can take advantage
// // of the base functionality and `.exceptions.handle()`.
// //
// class ApiTransport extends Transport {
//   constructor(opts) {
//     super(opts);
//     //
//     // Consume any custom options here. e.g.:
//     // - Connection information for databases
//     // - Authentication information for APIs (e.g. loggly, papertrail,
//     //   logentries, etc.).
//     //
//   }

//   log(info, callback) {
//     setImmediate(() => {
//       this.emit('logged', info);
//     });

//     // fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/error', {
//     //   method: 'POST',
//     //   headers: {
//     //     'Content-Type': 'application/json',
//     //   },
//     //   body: JSON.stringify({ error: JSON.stringify(info), path: '' }),
//     // });

//     // Perform the writing to the remote service
//     callback();
//   }
// }

// const logger = () =>
//   createLogger({
//     transports: [new ApiTransport()],
//   });

// module.exports = {
//   logger,
// };
