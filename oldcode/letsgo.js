/** @param {NS} ns */
export async function main(ns) {
	var targetServer = "joesguns"
	var scriptToRun = "genericHack.js"

	if (ns.args.length > 0) {
		scriptToRun = ns.args[0];
		if (!ns.fileExists(scriptToRun)) {
			ns.tprint("Script " + scriptToRun + " not found.");
			return;
		}
	}

	var cashgoal = ns.getServerMaxMoney(targetServer);

	var serverlist = ns.scan();

	for(var i = 0; i < serverlist.length; i++){
		if(ns.hasRootAccess(serverlist[i])){
			if( ns.getServerMaxMoney(serverlist[i]) > cashgoal) {
				targetServer = serverlist[i];
				cashgoal = ns.getServerMaxMoney(serverlist[i]);
			}
		}
		var templist = ns.scan(serverlist[i]);
		for( var j = 0; j < templist.length; j++) {
			if (!serverlist.includes(templist[j])){
				serverlist.push(templist[j]);
			} 
		}
	}

	ns.tprint("Targeting " + targetServer);

	var minCash = ns.getServerMaxMoney(targetServer) * 0.75;
	var maxSec = ns.getServerMinSecurityLevel(targetServer) + 5;

	await startServers(ns,serverlist,targetServer,scriptToRun,minCash,maxSec);

}

async function startServers(ns,serverlist,tgt,progname,cash,sec) {
	ns.tprint("Iterating through " + serverlist.length + " servers, running " + progname + " against " + tgt);
	var i = 0;
	while(i<serverlist.length){
		if( crack(ns,serverlist[i])){
			await ns.scp(progname,serverlist[i]);
			var numThreads = Math.floor(ns.getServerMaxRam(serverlist[i])/(ns.getScriptRam(progname)));
			if (numThreads > 0) await ns.exec(progname,serverlist[i],numThreads,tgt,cash,sec);
		}
		i++;
	}
}

function crack(ns,target) {

	if(!ns.serverExists(target)) return false;
	if(ns.hasRootAccess(target)) return true;
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
		var box = ns.getServer(target);
		if (box.numOpenPortsRequired <= box.openPortCount){
			ns.nuke(target);
		}
	}

	return ns.hasRootAccess(target)
}