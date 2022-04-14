/** @param {NS} ns */
export async function main(ns) {

	canIgetargs(ns,"genericHack.js","joesguns",45,18,"steve");

}

function canIgetargs(ns,firstArg,secondArg){
	if(Number.isNaN(arguments.length)){
		ns.tprint("oops");
		return;
	}
	ns.tprint("We have" + arguments.length + "arguments!");
	for( var i = 0; i < arguments.length; i++)
	{
		ns.tprint(i + ": " + arguments[i]);
	}
}