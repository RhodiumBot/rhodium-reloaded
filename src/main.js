//
// (c) 2020 Voxain
// The code within this repository is licensed by VoxainDev under GNU GPL v2.
//


// Import Dependencies

const djs   = require('discord.js');
const fs    = require('fs');
const col   = require('colors');
const { eventNames } = require('process');

let client = new djs.Client({
    presence: {
        status: 'online',
        activity: {
            type: 'COMPETING',
            name: 'a competition'
        }
    }
});


// Set Environment

/* 
 * DEVELOPING MODE
 * 
 * Developing mode is entered by invoking the "--dev" flag while starting the script.
 * In developing mode, it will use the devConfig.json instead of the regular config.json.
 * This file is not included within the repository - you'll have to create it yourself.
 * 
*/

client.devEnv = process.argv[2] === '--dev';


// Create logger functions

client.log = {
    verb:   str => { 
        if( !client.devEnv ) return;
        console.log('[VERB] '.green + str) 
    },
    log:    str => { console.log('[LOG]  ' + str) },
    info:   str => { console.log('[INFO] '.blue + str) },
    warn:   str => { console.log('[WARN] '.yellow + str) },
    err:    str => { console.log('[ERR]  '.red + str) }
};


// Require Config 

client.config = require( `./config/${ client.devEnv ? 'dev' : '' }config.json` );


// Parse and bind event handlers

fs.readdirSync('./src/events').forEach( eventFile => {
    if( !eventFile.endsWith('.js') ) return client.log.warn('File loading skipped (invalid file type): ' + eventFile);

    let eventName = eventFile.split('.')[0] || 'fileErr';

    client.on(eventName, require('./events/' + eventFile).bind(null, client));
    client.log.verb(`Event bound: ${eventName} to ./events/${eventFile}`);
});


// Connect to Discord and log in

client.login( client.config.token );