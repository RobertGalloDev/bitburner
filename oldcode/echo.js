/** @param {NS} ns */
export async function main(ns) {
	for(var i = 0; i < ns.args.length; i++){
		ns.tprintf("Argument " + i + ": '" + ns.args[i] + "'");
	}
}