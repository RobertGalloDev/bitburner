/** @param {NS} ns */
export async function main(ns) {
	
	const myargs = ns.flags([
			["verbose",false],
			["script","genericHack.js"]
		]);

	var bob = myargs._[0];

	if (myargs.verbose){
		ns.tprint(`Showing ${myargs._.length}`)
		ns.tprint(`As requested, the first argument is ${bob}`);
	}

	ns.tprint(`pretending to run script ${myargs.script}`);

}