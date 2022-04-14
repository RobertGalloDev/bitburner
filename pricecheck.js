/** @param {NS} ns */
export async function main(ns) {
	var budget = Math.floor(ns.getServerMoneyAvailable("home"));
	
	var maxRAM = 2;
	var myCost = 0;

	for(var r = 2; r <= 1048576; r *= 2)
	{
		var cost = ns.getPurchasedServerLimit() * ns.getPurchasedServerCost(r);
		if (cost < budget){
			maxRAM = r;
			myCost = cost;
		} else break;
	}

	ns.tprintf("Can afford " + ns.getPurchasedServerLimit() + " servers with " + maxRAM + " GB of RAM for $" + myCost);
}