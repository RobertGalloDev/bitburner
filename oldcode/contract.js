/** @param {NS} ns */
export async function main(ns) {
	//deprecated: was used to remove all servers below a certain RAM value
	if (ns.args.length < 1) {
		ns.tprint("No minimum RAM selected. Format: run " + ns.getScriptName() + " <minimum RAM>");
		return;
	}
	var minRam = ns.args[0];
	var myServers = ns.getPurchasedServers();

	for( var i = 0; i < myServers.length; i++)
	{
		if ( ns.getServerMaxRam(myServers[i]) < minRam ){
			ns.killall(myServers[i]);
			ns.deleteServer(myServers[i]);
		}
	}
}