/** @param {NS} ns */
export async function main(ns) {
	var target = ns.args[0];
	var minCash = ns.args[1];
	var maxSec = ns.args[2];

	while(true) {
		if (ns.getServerSecurityLevel(target) > maxSec) {
			await ns.weaken(target);
		}
		else if (ns.getServerMoneyAvailable(target) < minCash) {
			await ns.grow(target);
		}
		else {
			await ns.hack(target);
		}
	}
}