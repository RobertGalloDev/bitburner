/** @param {NS} ns */
export async function main(ns) {
	const args = ns.flags([
		["help",false],
		["server","joesguns"],
		["percent",0.5]
	])

	if (args.help){
		ns.tprint(`Runs a hack against a targeted system from Home using a percentage of RAM`);
		ns.tprint(`Usage: run ${ns.getScriptName()} --server <target> --percent <percent>`);
		ns.tprint(`Example: run ${ns.getScriptName()} --percent 75`);
		ns.tprint(`Example: run ${ns.getScriptName()} --server n00dles`);
		ns.tprint(`Example: run ${ns.getScriptName()} --server iron-gym --percent 0.75`);
		return;
	}
	
	var me = ns.getHostname();
	var percent = args.percent;
	var target = args.server;

	if (percent > 1) percent *= 0.01;
	var availableRAM = ns.getServerMaxRam(me) - ns.getServerUsedRam(me);
	availableRAM += ns.getScriptRam(ns.getScriptName());
	var givenRAM = Math.floor(percent * availableRAM);

	//ns.tprintf("Using " + (percent*100) + "% RAM, " + givenRAM + "GB");

	var threads = Math.floor(givenRAM / ns.getScriptRam("genericHack.js"));

	var cash = ns.getServerMaxMoney(target) * 0.75;
	var sec = ns.getServerMinSecurityLevel(target) + 5;

	ns.spawn("genericHack.js",threads,target,cash,sec);
}