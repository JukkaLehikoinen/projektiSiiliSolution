require('ts-node/register');

require('./index').migrator.runAsCLI().catch(e => console.log(e));
