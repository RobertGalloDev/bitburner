/** @param {NS} ns */
export function crack(ns,target) {

	if(!ns.serverExists(target)) return false;
	var hasSSH = ns.fileExists("BruteSSH.exe");
	var hasFTP = ns.fileExists("FTPCrack.exe");
	var hasSMTP = ns.fileExists("relaySMTP.exe");
	var hasHTTP = ns.fileExists("HTTPWorm.exe"); 
	var hasSQL = ns.fileExists("SQLInject.exe");

	if (!ns.hasRootAccess(target)) {
		if (hasSSH) ns.brutessh(target);
		if (hasFTP) ns.ftpcrack(target);
		if (hasSMTP) ns.relaysmtp(target);
		if (hasHTTP) ns.httpworm(target);
		if (hasSQL) ns.sqlinject(target);
		ns.nuke(target);
	}

	return ns.hasRootAccess(target)
}