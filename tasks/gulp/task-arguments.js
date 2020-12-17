const { argv } = require('yargs');

const destination = argv.destination ? argv.destination : 'public';

exports.destination = destination;
