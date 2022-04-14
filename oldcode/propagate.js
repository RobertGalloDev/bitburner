/** @param {NS} ns */
export async function main(ns) {
	//deprecated. Was used to slowly purchase the specified number of servers with a given RAM
	if (ns.args.length < 3 ){
		ns.tprint("Invalid arguments. Format: run " + ns.getScriptName() + " <baseName> <RAM> <numServers>");
		return;
	}
	var myServers = ns.getPurchasedServers();
	var baseName = ns.args[0];
	var newServerRAM = ns.args[1];
	var maxServers = ns.getPurchasedServerLimit() - myServers.length;

	if(ns.args[2] < maxServers ) {
		maxServers = ns.args[2];
	}

	baseName += "_" + newServerRAM + "_";

	ns.tprint("basename: " + baseName);
	ns.tprint("newServerRAM: " + newServerRAM);
	ns.tprint("maxServers: " + maxServers);

	var counter = 0;
	var startpoint = 0;

	while( ns.serverExists(baseName+startpoint)) {
		ns.tprint("server " + baseName+startpoint + " apparently exists");
		startpoint++;
		await ns.sleep(1000);
	}

	ns.tprint("Starting with server " + baseName+startpoint);

	while(counter < maxServers){
		if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(newServerRAM)) {
			var newguy = ns.purchaseServer(baseName+startpoint,newServerRAM);
			ns.tprint("Server " + newguy + " purchased!");
			counter++;
			startpoint++;
		} else {
			ns.print("waiting...");
			await ns.sleep(1000);
		}
	}
}