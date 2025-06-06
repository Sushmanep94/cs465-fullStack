const mongoose = require('mongoose');
const host = process.env.DB_HOST || '127.0.0.1';
const dbURI = `mongodb://${host}/travlr`;
const readline = require('readline'); 

// Build the connection string and set the connection timeout
const connect = () => {
  setTimeout(() => {
    mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }, 1000);
};

// Monitor connection events
mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${dbURI}`); 
});

mongoose.connection.on('error', err => {
  console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Windows specific listener
if (process.platform === 'win32') { 
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.on('SIGINT', () => {
    process.emit('SIGINT');
  });
}

// Configure for graceful shutdown
const gracefulShutdown = (msg) => {
  mongoose.connection.close(() => {
    console.log(`Mongoose disconnected through ${msg}`);
  });
};

// Shutdown hooks
process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart');
  process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', () => {
  gracefulShutdown('app termination');
  process.exit(0);
});

process.on('SIGTERM', () => {
  gracefulShutdown('app shutdown');
  process.exit(0);
});

// Connect to the database
connect();

// Import Mongoose models
require('./travlr');


module.exports = mongoose;
