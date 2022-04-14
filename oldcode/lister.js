/** @param {NS} ns */
export async function main(ns) {

var serverlist = ns.scan();

for(var i = 0; i < serverlist.length; i++){
	var templist = ns.scan(serverlist[i]);
	for( var j = 0; j < templist.length; j++) {
		if (!serverlist.includes(templist[j])){
			serverlist.push(templist[j]);
		} 
	}
}
ns.tprint("Found " + serverlist.length + " servers");
for(var k = 0; k < serverlist.length; k++){
	ns.tprint(k + ": " + serverlist[k]);
}

}