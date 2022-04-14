/** @param {NS} ns */
export async function main(ns) {

	if ( ns.args.length < 3) {
		ns.tprintf("Invalid Argument. Usage: run " + ns.getScriptName() + " <runningServer> <targetServer> <script>");
		return;
	}
	var serverName = ns.args[0];
	var targetName = ns.args[1];
	var scriptToRun = ns.args[2];

	await ns.scp(scriptToRun,serverName);
	var threadCount = Math.floor(ns.getServerMaxRam(serverName)/ns.getScriptRam(scriptToRun));
	var minCash = ns.getServerMaxMoney(targetName) * 0.8;
	var maxSec = ns.getServerMinSecurityLevel(targetName) + 5;

	//ns.tprintf( "cash: " + minCash + ". Sec = " + maxSec + ". " + threadCount + " threads with " + ns.getServerMaxRam(serverName) + " GB.");
	 
	if (serverName == "home") {
		ns.spawn(scriptToRun,threadCount,targetName,minCash,maxSec);
	} else {
		await ns.scp(scriptToRun,serverName);
		ns.exec(scriptToRun,serverName,threadCount,targetName,minCash,maxSec);
	}
	
}