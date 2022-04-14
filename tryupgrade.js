/** @param {NS} ns */
export async function main(ns) {

	const args = ns.flags([
		["hostname","rob"]
	]);
	var myServers = ns.getPurchasedServers();
	var whatIcanafford = affordableRAM(ns);
	var isUpgrade = true;

	var basename = args.hostname ? args.hostname + "_" : "rob_"; //probably superfluous
	basename += whatIcanafford + "_";
	ns.tprint(`Using ${basename} as a root`);

	if (myServers.length == 0) {
		isUpgrade = false;
	}
	else {
		var currentRAM = ns.getServerMaxRam(myServers[0]);
		
		if(whatIcanafford <= currentRAM) {
			ns.tprint(`Cannot afford more than the existing ${whatIcanafford} GB`);
			return;
		}
	}

	ns.tprint(`I can afford ${whatIcanafford}GB servers!`);

	for(var i = 0; i < ns.getPurchasedServerLimit();i++){
		if (isUpgrade || i < myServers.length) {
			//upgrade path
			let newguy = await upgradeServer(ns,myServers[i],basename+i,whatIcanafford);
			ns.tprint(`Server ${myServers[i]} has been upgraded to ${newguy}`);
		} else {
			//straight purchase
			var newserver = ns.purchaseServer(basename+i,whatIcanafford);
			ns.tprint(`Server ${newserver} has been purchased.`);
		}
	}
}

async function upgradeServer(ns,old,fresh,ram) {
	let extantScripts = ns.ps(old);
	let ramdivider = extantScripts.length > 0 ? (1.0/extantScripts.length) : 1.0;
	
	ns.killall(old);
	ns.deleteServer(old);

	var newServer = ns.purchaseServer(fresh,ram);

	for( var i = 0; i<extantScripts.length; i++) {
		await ns.scp(extantScripts[i].filename,newServer);
		let threadcount = Math.floor((ram*ramdivider)/ns.getScriptRam(extantScripts[i].filename));
		ns.exec(extantScripts[i].filename,newServer,threadcount, ...extantScripts[i].args);
	}
	return newServer;
}

function affordableRAM(ns) {
	var cash = ns.getServerMoneyAvailable(ns.getHostname());

	var ram = 2;
	
	for( var r = 2; r < ns.getPurchasedServerMaxRam(); r*=2) {
		var currentprice = ns.getPurchasedServerCost(r) * ns.getPurchasedServerLimit();
		if (currentprice <= cash ) {
			ram = r;
		} else {
			break;
		}
	}

	return ram;
}