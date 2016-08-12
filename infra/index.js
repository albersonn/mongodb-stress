const mongoose = require('mongoose');

module.exports = () => {
  mongoose.connect('mongodb://alberson:alberson@localhost:27017/social');
  // CONNECTION EVENTS
  // When successfully connected
  mongoose.connection.on('connected', () => {
    console.log('Mongoose default connection open');
  });

  // If the connection throws an error
  mongoose.connection.on('error', (err) => {
    console.error(`Mongoose default connection error: ${err}`);
  });

  // When the connection is disconnected
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
  });

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
  });
};
