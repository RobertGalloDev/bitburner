/** @param {NS} ns */

import {crack} from './usefulstuff.js';
export async function main(ns) {
	if(ns.args.length<1){
		ns.tprintf( `Usage: run ${ns.getScriptName()} <targetServer>`);
		return;
	}
	if(!ns.serverExists(ns.args[0]))
	{
		ns.tprintf(`Server '${ns.args[0]}' does not exist`);
		return;
	}

	if (crack(ns,ns.args[0])) {
		ns.tprintf(`Server ${ns.args[0]} is opened!`);
	} else {
		ns.tprintf(`Server ${ns.args[0]} is still closed.`);
	}
	
}