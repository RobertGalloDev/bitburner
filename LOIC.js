/** @param {NS} ns */

import {crack} from './usefulstuff.js';

export async function main(ns) {

	const args = ns.flags([
		["verbose",false],
		["script","genericHack.js"],
		["testing",false]
	])

	var scriptName = ns.fileExists(args.script) ? args.script : "genericHack.js";

	if (!ns.fileExists(scriptName))
	{
		if(args.verbose) {
			ns.tprint(`Script ${scriptName} not found.`);
		} else {
			ns.print(`Script ${scriptName} not found.`);
		}
		return;
	}

	if(args.verbose){
		ns.tprint(`Running script ${scriptName}`);
	} else {
		ns.print(`Running script ${scriptName}`);
	}

	var myskill = ns.getHackingLevel();
	var serverlist = ns.scan();
	var rootedcount = 0;
	var threadcount = 0;

	var hackram = ns.getScriptRam(scriptName);

	class Cannon {
		constructor(name,threads) {
			this.name=name;
			this.threads=threads;
		}

		async fire(ns,target,cash,sec) {
			if(this.threads > 0) {
				ns.killall(this.name);
				await ns.scp(scriptName,this.name);
				await ns.exec(scriptName,this.name,this.threads,target,cash,sec);
			}
		}

		toString() {
			var retVal = "Server " + this.name + " can handle " + this.threads + " threads."
			return retVal;
		}
	}

	class PotentialTarget {
		constructor(name,money,rooted,hackable,minsec) {
		this.name=name;
		this.maxmoney=money;
		this.rooted=rooted;
		this.canhack=hackable;
		this.minsec = minsec;
		}

		isTargetable() {
			return this.rooted && this.canhack;
		}

		toString() {
			var str = "Server " + this.name + " has a max of $" + this.maxmoney + ", is ";
			if(!this.rooted) str += "not ";
			str += "rooted, and can ";
			if(!this.canhack) str += "not ";
			str += "be hacked.";
			return str;
		}

		get targetCash() {
			return this.maxmoney * 0.75;
		}
		get targetSec() {
			return this.minsec + 5;
		}
	}

	var cannons = [];
	var meep = [];

	for(var i = 0; i < serverlist.length; i++){
		var thisone = ns.getServer(serverlist[i]);
		var rooted = crack(ns,serverlist[i]);

		if(rooted && serverlist[i]!="home"){
			rootedcount++;
			var thisthread = Math.floor((thisone.maxRam*1.0)/hackram);
			threadcount += thisthread;
			if(thisthread > 0) {
				var barrel = new Cannon(serverlist[i],thisthread)
				cannons.push(barrel);
			}
		}
		
		var canhack = myskill >= thisone.requiredHackingSkill;

		if (!thisone.purchasedByPlayer){
			var PT = new PotentialTarget(serverlist[i],thisone.moneyMax,rooted,canhack,thisone.minDifficulty);
			meep.push(PT);
		}

		var templist = ns.scan(serverlist[i]);
		for( var j = 0; j < templist.length; j++) {
			if (!serverlist.includes(templist[j])){
				serverlist.push(templist[j]);
			} 
		}
	}


	let sortedhackables = meep.filter( PotentialTarget => PotentialTarget.isTargetable() === true).sort((s1,s2) => (s1.maxmoney < s2.maxmoney) ? 1 : (s1.maxmoney > s2.maxmoney) ? -1 : 0);

	var dropoff = sortedhackables[0].maxmoney * 0.5;

	let targets = sortedhackables.filter(PotentialTarget => PotentialTarget.maxmoney >= dropoff);

	var minTargets = 10;
	if (sortedhackables.length < minTargets ) {
		minTargets = sortedhackables.length
	}

	if (targets.length < minTargets){
		targets = sortedhackables.filter(PotentialTarget => PotentialTarget.maxmoney >= sortedhackables[minTargets-1].maxmoney)
	}

	let battery = cannons.sort((c1,c2) => (c1.threads < c2.threads) ? 1 : (c1.threads > c2.threads) ? -1 : 0);

	for( var k = 0; k < targets.length; k++ ) {
		if(args.verbose) {
			ns.tprint(targets[k].toString());
		} else {
			ns.print(targets[k].toString());
		}
	}

	ns.tprint("LOIC Count " + rootedcount + " with " + threadcount + " threads against " + targets.length + " targets");
	ns.tprint( battery.length + " cannons loaded");

	for(var l = 0; l < battery.length; l++) {
		if (args.verbose) {
			ns.tprint(battery[l].toString());
		} else {
			ns.print(battery[l].toString());
		}
		
	}
	if (!args.testing){
		var threadspertarget = Math.floor(threadcount/targets.length);
		var threadssofar = 0;

		for( var i = 0; i<battery.length; i++) {
			var tgtid = Math.floor(threadssofar/threadspertarget);
			if (tgtid >= targets.length) tgtid = targets.length-1;
			await battery[i].fire(ns,targets[tgtid].name,targets[tgtid].targetCash,targets[tgtid].targetSec);
			threadssofar += battery[i].threads;
		}
	}
}