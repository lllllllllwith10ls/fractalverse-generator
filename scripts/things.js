const Rand = (min,max) => {
	
	return parseFloat(Math.floor(Math.random()*(max-min+1)))+parseFloat(min);
};

const Choose = (arr) => {
	return arr[Math.floor(Math.random()*arr.length)];
};

const RandName = (type) => {
	if (type == "symbols") {
		let number = Rand(5,10)
		const letters = ["!","@","#","$","%","^","&","*","+","_","?","/","|","\\","-","="];
		let name=""
		for(number; number > 0; number--) {
			name+=letters[Rand(0,15)];
		}
		return name;
		
	} else if (type == "letters") {
		let number = Rand(5,10)
		const letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
		let name=""
		for(number; number > 0; number--) {
			name+=letters[Rand(0,25)];
		}
		return name;
		
	}
};

let Things = {};

let ThingsN = 0;

class Thing{
	constructor(name,contains,namegen){
		this.name=name;
		this.contains=contains;
		this.namegen=namegen;
		if (this.namegen===undefined) this.namegen=this.name;

		Things[name]=this;
		ThingsN++;
	}
};


const CleanThings = () => {
	for (let iT in Things)
	{
		thisT=Things[iT];

		toConcat=[];
		for (let i in thisT.contains)
		{
			if (typeof(thisT.contains[i])==="string")
			{
				if (thisT.contains[i].charAt(0)===".")
				{
					if (Things[thisT.contains[i].substring(1)]!=undefined)
					{
						toConcat=toConcat.concat(Things[thisT.contains[i].substring(1)].contains);
					}
					thisT.contains[i]="";
				}
			}
		}	
		if (toConcat.length>0){
			for (let i in toConcat)
			{
				thisT.contains.push(toConcat[i]);
			}
		}

		newContains=[];
		for (let i in thisT.contains)
		{
			if (thisT.contains[i]!=="") newContains.push(thisT.contains[i]);
		}
		thisT.contains=newContains;

	}
};

let iN=0;
let Instances=[];
class Instance{
	constructor(what, transmitter, reciever, transciever, openEVERYTHING, breakOpen) {
		this.name = "thing";
		this.parent = 0;
		this.children = [];
		this.n = iN;
		this.display = 0;
		this.grown = false;
		this.transmitter = transmitter;
		this.reciever = reciever;
		this.transciever = transciever;
		this.thingPool = [];
		this.openEVERYTHING = openEVERYTHING;
		this.breakOpen = breakOpen;
		this.type = Things[what];
		iN++;
		Instances.push(this);

		return this;
  }
}
Instance.prototype.Name=function(){
	this.name = this.type.namegen;

	if (typeof(this.name) != "string"){
		var str = "";
		if (typeof(this.name[0]) == "string") {
			str += Choose(this.name);
		} else {
			for (var i in this.name){
				str += Choose(this.name[i]);
			}
		}
		this.name = str;
	} else{
		let nameParts = this.name.split("|");
		this.name = nameParts[0];
		this.name = "";
		for(let i=0; i<nameParts.length; i++) {
			if (nameParts[i].includes("*PARENT*")) {
				let parent = this.parent.name;
				let parentParts = nameParts[i].split(",");
				for(let j = 1; j <= parentParts.length; j++) {
					parent = parent.replace(parentParts[j],"");
				}
				this.name += parent;
			} else if (nameParts[i].includes("*RANDOM*")) {
				let moreParts = nameParts[i].split(",");
				
				if(moreParts[1] == "symbols") {
					this.name += RandName("symbols");
				} else if (moreParts[1] == "letters") {
					this.name += RandName("letters");
				} 
			} else {
				this.name += nameParts[i];
			}
		}
	}
}

Instance.prototype.Grow = function(){
	if (this.grown === false){
		this.Name();
		let contains=this.type.contains;
		for (let i=0; i<contains.length; i++){
			let toMake;
			if (typeof(contains[i]) != "string") {
				if (contains[i] === undefined) {
					break;
				}
				toMake=Choose(contains[i]);
				if (Array.isArray("toMake")) {
					contains=contains.concat("toMake");

				}
			} else {
				toMake=contains[i];
			}
			if (typeof(toMake) === "string") {
				toMake=toMake.split("|");
				for (let j=0; j<toMake.length; j++) {
					let toMakePart=toMake[j].split(",");
					let makeAmount=1;
					let makeProb=100;
					let transmitter = false;
					let reciever = false;
					let transciever = false;
					let openEVERYTHING = false;
					let breakOpen = false;
					
					if (toMakePart[1] === undefined) {
						toMakePart[1]=1;
					} else{
						makeAmount=toMakePart[1].split("-");
						if (makeAmount[1] === undefined) makeAmount=makeAmount[0]; 
						else{
							makeAmount=Rand(makeAmount[0],makeAmount[1]);
						}
						makeProb=(toMakePart[1]+"?").split("%");
						if (makeProb[1] != undefined) {makeProb=makeProb[0];makeAmount=1;} else makeProb=100;
					}
					if (toMakePart[0].includes(">")) {
						toMakePart[0] = toMakePart[0].replace(">","");
						transmitter = true;
					}
					if (toMakePart[0].includes("<")) {
						toMakePart[0] = toMakePart[0].replace("<","");
						reciever = true;
					}
					if (toMakePart[0].includes("=")) {
						toMakePart[0] = toMakePart[0].replace("=","");
						transciever = true;
					}
					if (toMakePart[0].includes("!")) {
						toMakePart[0] = toMakePart[0].replace("!","");
						openEVERYTHING = true;
						console.log(toMakePart[0]);
					}
					if (toMakePart[0].includes("?")) {
						toMakePart[0] = toMakePart[0].replace("?","");
						breakOpen = true;
						console.log(toMakePart[0]);
					}

					if (toMakePart[0].includes("*")) {
						switch (toMakePart[0]) {
							case "*sublife species":
								for(let k = makeAmount; k>0; k--) {
									let contains2 = [">?*sublife individual,100-300"];
									let thisName = this.name;
									thisName = thisName.replace("genus ","");
									thisName += " " + RandName("letters")
									let id = uniqueN + ",sublife species," + thisName;
									uniqueThings[uniqueN] = new Thing(id, contains2, thisName);
									let New = make(uniqueThings[uniqueN].name, transmitter, reciever, transciever, openEVERYTHING, breakOpen);
									New.parent = this;
									this.children.push(New);
									
									uniqueN++;
								}
								break;
							case "*sublife individual":
								{
									let contains2 = ["cell membrane","rna","protein,2-4"];
									let thisName = this.name + " individual";
									let id = uniqueN + ",sublife species individual," + thisName;
									uniqueThings[uniqueN] = new Thing(id, contains2, thisName);
									for(let k = makeAmount; k>0; k--) {
										let New = make(uniqueThings[uniqueN].name, transmitter, reciever, transciever, openEVERYTHING, breakOpen);
										New.parent = this;
										this.children.push(New);
											if(New.transmitter === true) {
											let thisThing = this;
											while(thisThing.reciever === false) {
												thisThing = thisThing.parent;
												if(thisThing.transciever === true) {
													if(thisThing.thingPool.includes(New.type) === false) {
														thisThing.thingPool.push(New.type);
													}
												}
											}
											if(!thisThing.thingPool.includes(New.type)) {
												thisThing.thingPool.push(New.type);
											}
										}
									}
									
									uniqueN++;
								}
								break;
							case "*prokaryotic species":
								for(let k = makeAmount; k>0; k--) {
									let contains2 = [">?*prokaryotic individual,100-300"];
									let thisName = this.name;
									thisName = thisName.replace("genus ","");
									thisName += " " + RandName("letters")
									let id = uniqueN + ",prokaryotic species," + thisName;
									uniqueThings[uniqueN] = new Thing(id, contains2, thisName);
									let New = make(uniqueThings[uniqueN].name, transmitter, reciever, transciever, openEVERYTHING, breakOpen);
									New.parent = this;
									this.children.push(New);
									
									uniqueN++;
								}
								break;
							case "*prokaryotic individual":
								{
									let contains2 = ["bacterial cell wall","cell membrane","dna","rna,2-4","bacterial ribosome,3-6","protein,20-40","glucose,100-150"];
									let thisName = this.name + " individual";
									let id = uniqueN + ",prokaryotic species individual," + thisName;
									uniqueThings[uniqueN] = new Thing(id, contains2, thisName);
									for(let k = makeAmount; k>0; k--) {
										let New = make(uniqueThings[uniqueN].name, transmitter, reciever, transciever, openEVERYTHING, breakOpen);
										New.parent = this;
										this.children.push(New);
											if(New.transmitter === true) {
											let thisThing = this;
											while(thisThing.reciever === false) {
												thisThing = thisThing.parent;
												if(thisThing.transciever === true) {
													if(thisThing.thingPool.includes(New.type) === false) {
														thisThing.thingPool.push(New.type);
													}
												}
											}
											if(!thisThing.thingPool.includes(New.type)) {
												thisThing.thingPool.push(New.type);
											}
										}
									}
									
									uniqueN++;
								}
								break;
							default:
						}
					}
					if(Things[toMakePart[0]] != undefined) {
						if (Math.random()*100 <= makeProb){
							for(let ii=0; ii<makeAmount; ii++) {
								let New = make(Things[toMakePart[0]].name, transmitter, reciever, transciever, openEVERYTHING, breakOpen);
								New.parent = this;
								this.children.push(New);
								if(New.transmitter === true) {
									let thisThing = this.parent;
									while(thisThing.reciever === false) {
										thisThing = thisThing.parent;
										if(thisThing.transciever === true) {
											if(thisThing.thingPool.includes(New.type) === false) {
												thisThing.thingPool.push(New.type);
											}
										}
									}
									if(thisThing.thingPool.includes(New.type) === false) {
										thisThing.thingPool.push(New.type);
									}
								}
							}
						}
					}
					if(toMakePart[0] === "thingPool") {
						if (Math.random()*100 <= makeProb){
							for(let ii=0; ii<makeAmount; ii++) {
								let thisThing = this;
								while(thisThing.thingPool[0] === undefined) {
									thisThing = thisThing.parent;
								}
								let New = make(Things[Choose(thisThing.thingPool).name].name, transmitter, reciever, transciever, openEVERYTHING, breakOpen);
								New.parent = this;
								this.children.push(New)
							}
						}
					}
				}
			}
		}
		this.grown=true;
	}
}

let uniqueThings = [];
let uniqueN = 0

Instance.prototype.List = function(){
	var str="";
	var addStyle="";
	for (var i in this.children){
		str+='<div id="div'+this.children[i].n+'">'+this.children[i].name+'</div>';
	}
	
	//if (this.children.length>0) document.getElementById("div"+this.n).innerHTML='<span onclick="toggle('+this.n+');"><span class="arrow" id="arrow'+this.n+'">+</span> '+this.name+'</span><div id="container'+this.n+'" class="thing" style="display:none;">'+str+'</div>';
	if (this.children.length>0) document.getElementById("div"+this.n).innerHTML='<a href="javascript:toggle('+this.n+');" style="padding-right:8px;" alt="archetype : '+(this.type.name)+'" title="archetype : '+(this.type.name)+'"><span class="arrow" id="arrow'+this.n+'">+</span> '+this.name+'</a><div id="container'+this.n+'" class="thing" style="display:none;'+addStyle+'">'+str+'</div>';
	else document.getElementById("div"+this.n).innerHTML='<span class="emptyThing">'+this.name+'</span>';
}

const make = (what, transmitter, reciever, transciever, openEVERYTHING, breakOpen) => {
	return new Instance(what, transmitter, reciever, transciever, openEVERYTHING, breakOpen);
}
const toggle = (what) => {
	
	if (Instances[what].display==0) {

		for (let i in Instances[what].children) {
			if (Instances[what].children[i].grown==false) {
				Instances[what].children[i].Grow(0);
				Instances[what].children[i].List(0);
			}
		}

		if(Instances[what].openEVERYTHING === true) {
			expand(Instances[what].children);
		}
		Instances[what].display=1;
		document.getElementById("container"+what).style.display="block";
		document.getElementById("arrow"+what).innerHTML="-";
	}
	else if (Instances[what].display==1) {
		Instances[what].display=0;
		document.getElementById("container"+what).style.display="none";
		document.getElementById("arrow"+what).innerHTML="+";
	}
}
const expand = (what) => {
	for (var i = 0; i < what.length; i++) {
		if (what[i].breakOpen === false) {
			toggle(what[i].n);
			expand(what[i].children)
			toggle(what[i].n);
		}
	}
}
const debug = (what) => {
	document.getElementById("debug").innerHTML=document.getElementById("debug").innerHTML+'<br>'+what;
}
new Thing("the box",["debug","altarca,90-110","the box"]);
/*new Thing("debug",["debug2"],"aaabacaaaaaaa");
new Thing("debug2",["<!debug22"],"*PARENT*,b,c|a");
new Thing("debug22",["sublife","?test",["?proton","?proton|?neutron"]],"*RANDOM*,letters");
new Thing("test",["test2"]);
new Thing("test2",["thingPool,100-200"]);*/
new Thing("altarca",["trancendentum continuum,50-60"]);
new Thing("trancendentum continuum",["trancendentum,100-130"]);
new Thing("trancendentum",["beyond bubble,70-120"]);
new Thing("beyond bubble",["monocosm,90-100"]);
new Thing("monocosm",["omniverse,1-5","godverse,1-2"]);
new Thing("omniverse",["apeiroverse,100-200"]);
new Thing("apeiroverse",["ultraverse,100-200"]);
new Thing("ultraverse",["gigaverse,50-100","megaverse,90-100","multiverse,100-200"]);
new Thing("gigaverse",["megaverse,90-100"]);
new Thing("megaverse",["multiverse,90-100"]);
new Thing("multiverse",["universe,40-50","fractalverse,2-4"]);
new Thing("universe",["hubble volume,40-60"]);
new Thing("hubble volume",["supercluster,30-40","supergalaxy,0-3","galaxy cluster,100-200"]);
new Thing("fractalverse",[["level 1 turtlie,40-60","level 2 turtlie,40-60","level 3 turtlie,40-60","level 4 turtlie,40-60","level 5 turtlie,40-60","level 6 turtlie,40-60","level 7 turtlie,40-60","level 8 turtlie,40-60","level 9 turtlie,40-60","level 10 turtlie,40-60"]]);
new Thing("level 1 turtlie",["islandic,40-60"]);
for(let i=2;i<=10;i++) {
	new Thing("level " + i + " turtlie",["level " + (i-1) + " turtlie,40-60"]);
};
new Thing("islandic",["islandic piece,10-20"]);
new Thing("islandic piece",["supergalaxy,40-60"]);
new Thing("supercluster",["galaxy cluster, 40-75","supergalaxy,25%","galaxy,100-250"]);
new Thing("supergalaxy",["galaxy,50-200","supergalaxy,2%"]);
new Thing("galaxy cluster",["galaxy,20-40"]);
new Thing("galaxy",[["spiral arm,3-6","galaxy body"],"galactic core","galactic halo"]);
new Thing("galactic core",["central black hole","belt,10-20"]);
new Thing("central black hole",["black hole","black hole 2%","solar system,2-10"]);
new Thing("spiral arm",["belt,10-15","bubble,50-100"]);
new Thing("galaxy body",["belt,50-150","bubble,500-750"]);
new Thing("galactic halo",["globular cluster,25-50"]);
new Thing("globular cluster",["solar system,250-500","cold solar system,100-200","central black hole"]);
new Thing("belt",["bubble,10-20","star cloud,50-100"],"stellar belt");
new Thing("bubble",["star cloud,20-30","solar system,200-300","cold solar system,50-100"],"stellar bubble");
new Thing("star cloud",["solar system,20-30","cold solar system,10-20"],"stellar cloud");
new Thing("solar system",["star",["star","brown dwarf,50%","white dwarf,25%","black hole,10%","neutron star,10%"],["scorched asteroid belt,50%","scorched dwarf planet,50%","scorched terrestrial planet,50%","scorched superterrestrial planet,50%","scorched jovian planet,50%"],["hot asteroid belt,50%","hot dwarf planet,50%","hot terrestrial planet,50%","hot superterrestrial planet,50%","hot jovian planet,50%"],["warm asteroid belt,50%","warm dwarf planet,50%","warm terrestrial planet,50%","warm superterrestrial planet,50%","warm jovian planet,50%"],["<!temperate asteroid belt,50%","<!temperate dwarf planet,50%","<!temperate terrestrial planet,50%","<!temperate superterrestrial planet,50%","<!temperate jovian planet,50%"],["cool asteroid belt,50%","cool dwarf planet,50%","cool terrestrial planet,50%","cool superterrestrial planet,50%","cool jovian planet,50%"],["cold asteroid belt,50%","cold dwarf planet,50%","cold terrestrial planet,50%","cold superterrestrial planet,50%","cold jovian planet,50%"],["frozen asteroid belt,50%","frozen dwarf planet,50%","frozen terrestrial planet,50%","frozen superterrestrial planet,50%","frozen jovian planet,50%"]]);
new Thing("cold solar system",[["brown dwarf","brown dwarf","brown dwarf","white dwarf","white dwarf","black hole","neutron star"],["brown dwarf,50%","white dwarf,25%","black hole,10%","neutron star,10%"],["cold asteroid belt,50%","cold dwarf planet,50%","cold terrestrial planet,50%","cold superterrestrial planet,50%","cold jovian planet,50%"],["frozen asteroid belt,50%","frozen dwarf planet,50%","frozen terrestrial planet,50%","frozen superterrestrial planet,50%","frozen jovian planet,50%"]],["solar system"]);
new Thing("star",["corona","chromosphere","photosphere","convective zone","radiative zone","star core"],[["o-type","a-type","b-type","f-type","f-type","g-type","g-type","g-type","k-type","k-type","k-type","k-type","k-type","m-type","m-type","m-type","m-type","m-type","m-type","m-type"],[" star"]]);
new Thing("black hole",["singularity"]);
new Thing("singularity",["aaa,1","wormhole,1%"]);
new Thing("wormhole",["universe"]);
new Thing("brown dwarf",["jovian atmosphere","rocky core"]);
new Thing("neutron star",["neutron star crust","neutron star core"]);
new Thing("white dwarf",["white dwarf crust","white dwarf core"]);
new Thing("scorched dwarf planet",["metallic core","scorched small moon,10%","scorched atmosphere,10%","scorched crust"]);
new Thing("scorched terrestrial planet",["metallic core","scorched small moon,20%","scorched atmosphere,20%","scorched crust"]);
new Thing("scorched asteroid belt",["scorched asteroid,100-200"]);
new Thing("scorched asteroid",[["iron chunk,20-30","lava,30-40","iron chunk,10-20|lava,10-20"]],"asteroid");
new Thing("scorched small moon",[["iron chunk,20-30","rock,30-40","iron chunk,10-20|rock,10-20"]],"small moon");
new Thing("temperate terrestrial planet",["?metallic core","?mantle","?temperate small moon,0-5","temperate medium moon,0-2,50%",["?temperate crust|?temperate atmosphere","?sublife temperate crust|?temperate atmosphere,95%|sublife,95%","?prokaryotic temperate crust|?temperate atmosphere,95%|prokaryotic life,75%","?wet temperate crust|?temperate oxygenated atmosphere,95%|?eukaryotic life,50%","?wet temperate crust|?temperate oxygenated atmosphere|?multicellular life,50%","?wet temperate crust|?temperate oxygenated atmosphere|?complex multicellular life,45%","?wet temperate crust|?temperate oxygenated atmosphere|?simple ecosystem,40%","?wet temperate crust|?temperate oxygenated atmosphere|?complex ecosystem,20%","?wet temperate crust|?temperate oxygenated atmosphere|?simple civilization,10%","?wet temperate crust|?temperate oxygenated atmosphere|?complex civilization,1%"]]);
new Thing("temperate superterrestrial planet",["?metallic core","?mantle","?temperate small moon,0-15","temperate medium moon,0-5",["?temperate crust|?temperate atmosphere","?sublife temperate crust|?temperate superterrestrial atmosphere|sublife,95%","?prokaryotic temperate crust|?temperate superterrestrial atmosphere|prokaryotic life,75%","?wet temperate crust|?temperate superterrestrial oxygenated atmosphere|?eukaryotic life,50%","?wet temperate crust|?temperate superterrestrial oxygenated atmosphere|?multicellular life,50%","?wet temperate crust|?temperate superterrestrial oxygenated atmosphere|?complex multicellular life,45%","?wet temperate crust|?temperate superterrestrial oxygenated atmosphere|?simple ecosystem,40%","?wet temperate crust|?temperate superterrestrial oxygenated atmosphere|?complex ecosystem,20%","?wet temperate crust|?temperate superterrestrial oxygenated atmosphere|?simple civilization,10%","?wet temperate crust|?temperate superterrestrial oxygenated atmosphere|?complex civilization,1%"]]);
new Thing("temperate asteroid belt",["?temperate asteroid,100-200",["sublife,20%","prokaryotic life,1%","?eukaryotic life,.1%"]]);
new Thing("temperate asteroid",[["iron chunk,20-30","rock,30-40","iron chunk,10-20|rock,10-20"],"ice,5-10,10%","thin atmosphere,10%"],"asteroid");
new Thing("temperate dwarf planet",["?metallic core","?mantle","?temperate small moon,0-2","temperate medium moon,25%",["?temperate crust|?temperate atmosphere","?sublife temperate crust|?temperate atmosphere,95%|!sublife,95%","?prokaryotic temperate crust|?temperate atmosphere,95%|prokaryotic life,75%","?wet temperate crust|?temperate oxygenated atmosphere,95%|?eukaryotic life,50%","?wet temperate crust|?temperate oxygenated atmosphere|?multicellular life,50%","?wet temperate crust|?temperate oxygenated atmosphere|?complex multicellular life,45%","?wet temperate crust|?temperate oxygenated atmosphere|?simple ecosystem,40%","?wet temperate crust|?temperate oxygenated atmosphere|?complex ecosystem,20%","?wet temperate crust|?temperate oxygenated atmosphere|?simple civilization,10%","?wet temperate crust|?temperate oxygenated atmosphere|?complex civilization,1%"]]);
new Thing("temperate small moon",[["iron chunk,20-30","rock,30-40","iron chunk,10-20|rock,10-20"],"ice,5-10,10%","thin atmosphere,10%"],"small moon");
new Thing("temperate medium moon",["?metallic core","?mantle",["?temperate crust|?temperate atmosphere","?sublife temperate crust|?temperate atmosphere,95%|sublife,95%","?prokaryotic temperate crust|?temperate atmosphere,95%|prokaryotic life,75%","?wet temperate crust|?temperate oxygenated atmosphere,95%|?eukaryotic life,50%","?wet temperate crust|?temperate oxygenated atmosphere|?multicellular life,50%","?wet temperate crust|?temperate oxygenated atmosphere|?complex multicellular life,45%","?wet temperate crust|?temperate oxygenated atmosphere|?simple ecosystem,40%","?wet temperate crust|?temperate oxygenated atmosphere|?complex ecosystem,20%","?wet temperate crust|?temperate oxygenated atmosphere|?simple civilization,10%","?wet temperate crust|?temperate oxygenated atmosphere|?complex civilization,1%"]]);


new Thing("sublife",["sublife domain,1-3"]);
new Thing("sublife domain",["sublife kingdom,1-3"],"domain |*RANDOM*,letters");
new Thing("sublife kingdom",["sublife phylum,1-3"],"kingdom |*RANDOM*,letters");
new Thing("sublife phylum",["sublife class,1-3"],"phylum |*RANDOM*,letters");
new Thing("sublife class",["sublife order,1-3"],"class |*RANDOM*,letters");
new Thing("sublife order",["sublife genus,1-3"],"order  |*RANDOM*,letters");
new Thing("sublife genus",["*sublife species,1-3"],"genus  |*RANDOM*,letters");
/*new Thing("sublife species",["sublife individual,100-300"],"*PARENT*,genus| |*RANDOM*,letters");
new Thing("sublife individual",["cell membrane","rna","protein,2-4"],"*PARENT*| individual");*/
new Thing("cell membrane",["phospholipid,100-200"],"plasma membrane");
new Thing("phospholipid",["phosphate","carbon atom,10-20","hydrogen atom, 20-40"]);
new Thing("rna",["rna nucleotide,200-400"]);
new Thing("rna nucleotide",["phosphate","ribose",["adenine","guanine","cytosine","uracil"]],"nucleotide");
new Thing("ribose",["carbon atom,5","hydrogen atom,10","oxygen atom,5"]);
new Thing("phosphate",["phosphorus atom","oxygen atom,4"]);
new Thing("adenine",["carbon atom,5","hydrogen atom,5","nitrogen atom,5"]);
new Thing("guanine",["carbon atom,5","hydrogen atom,5","nitrogen atom,5","oxygen atom"]);
new Thing("cytosine",["carbon atom,4","hydrogen atom,5","nitrogen atom,3","oxygen atom"]);
new Thing("uracil",["carbon atom,4","hydrogen atom,4","nitrogen atom,2","oxygen atom,2"]);
new Thing("protein",["peptide,4-8"]);
new Thing("peptide",["alanine,0-2","arginine,0-2","asparagine,0-2","aspartic acid,0-2","cysteine,0-2","glutamine,0-2","glutamic acid,0-2","glycine,0-2","histidine,0-2","isoleucine,0-2","leucine,0-2","lysine,0-2","methionine,0-2","phenylalanine,0-2","proline,0-2","serine,0-2","threonine,0-2","tryptophan,0-2","tyrosine,0-2","valine,0-2"]);
new Thing("alanine",["carbon atom,3","hydrogen atom,7","nitrogen atom","oxygen atom,2"]);
new Thing("arginine",["carbon atom,6","hydrogen atom,14","nitrogen atom,4","oxygen atom,2"]);
new Thing("asparagine",["carbon atom,4","hydrogen atom,8","nitrogen atom,2","oxygen atom,3"]);
new Thing("aspartic acid",["carbon atom,4","hydrogen atom,7","nitrogen atom","oxygen atom,4"]);
new Thing("cysteine",["carbon atom,3","hydrogen atom,7","nitrogen atom","oxygen atom,2","sulfur atom"]);
new Thing("glutamine",["carbon atom,5","hydrogen atom,10","nitrogen atom,2","oxygen atom,3"]);
new Thing("glutamic acid",["carbon atom,5","hydrogen atom,9","nitrogen atom","oxygen atom,4"]);
new Thing("glycine",["carbon atom,2","hydrogen atom,5","nitrogen atom","oxygen atom,2"]);
new Thing("histidine",["carbon atom,6","hydrogen atom,9","nitrogen atom,3","oxygen atom,2"]);
new Thing("isoleucine",["carbon atom,6","hydrogen atom,13","nitrogen atom","oxygen atom,2"]);
new Thing("leucine",["carbon atom,6","hydrogen atom,13","nitrogen atom","oxygen atom,2"]);
new Thing("lysine",["carbon atom,6","hydrogen atom,14","nitrogen atom,2","oxygen atom,2"]);
new Thing("methionine",["carbon atom,5","hydrogen atom,11","nitrogen atom","oxygen atom,2","sulfur atom"]);
new Thing("phenylalanine",["carbon atom,9","hydrogen atom,11","nitrogen atom","oxygen atom,2"]);
new Thing("proline",["carbon atom,5","hydrogen atom,9","nitrogen atom","oxygen atom,2"]);
new Thing("serine",["carbon atom,3","hydrogen atom,7","nitrogen atom","oxygen atom,3"]);
new Thing("threonine",["carbon atom,4","hydrogen atom,9","nitrogen atom","oxygen atom,3"]);
new Thing("tryptophan",["carbon atom,11","hydrogen atom,12","nitrogen atom,2","oxygen atom,2"]);
new Thing("tyrosine",["carbon atom,9","hydrogen atom,11","nitrogen atom","oxygen atom,3"]);
new Thing("valine",["carbon atom,5","hydrogen atom,11","nitrogen atom","oxygen atom,2"]);
new Thing("prokaryotic life",["prokaryotic domain,1-3"]);
new Thing("prokaryotic domain",["prokaryotic kingdom,1-3"],"domain |*RANDOM*,letters");
new Thing("prokaryotic kingdom",["prokaryotic phylum,1-3"],"kingdom |*RANDOM*,letters");
new Thing("prokaryotic phylum",["prokaryotic class,1-3"],"phylum |*RANDOM*,letters");
new Thing("prokaryotic class",["prokaryotic order,1-3"],"class |*RANDOM*,letters");
new Thing("prokaryotic order",["prokaryotic genus,1-3"],"order  |*RANDOM*,letters");
new Thing("prokaryotic genus",["*prokaryotic species,1-3"],"genus  |*RANDOM*,letters");
/*new Thing("prokaryotic species",["prokaryotic individual,100-300"],"*PARENT*,genus| |*RANDOM*,letters");
new Thing("prokaryotic individual",["bacterial cell wall","cell membrane","dna","rna,2-4","bacterial ribosome,3-6","protein,20-40","glucose,100-150"],"*PARENT*| individual");*/
new Thing("dna",["dna nucleotide,200-400"]);
new Thing("dna nucleotide",["phosphate","deoxyribose",["adenine","guanine","cytosine","thymine"]],"nucleotide");
new Thing("thymine"["carbon atom,5","hydrogen atom,6","nitrogen atom,2","oxygen atom,2"]);
new Thing("deoxyribose",["carbon atom,5","hydrogen atom,10","oxygen atom,4"]);
new Thing("bacterial ribosome",["protein,4-5","rna,10-12"],"ribosome");
new Thing("glucose",["carbon atom,6","hydrogen atom,12","oxygen atom,6"]);
new Thing("bacterial cell wall",["glucose,50-100","peptide,25-50"],"cell wall");


new Thing("corona",["hydrogen atom,100-300","helium atom,50-60","electron,200-300","proton,200-300"]);
new Thing("temperate atmosphere",["carbon dioxide cloud,80-200","water cloud,20-40,50%","nitrogen cloud,30-100"],"atmosphere");
new Thing("oxygenated temperate atmosphere",["carbon dioxide cloud,10-50","water cloud,40-60,99%","nitrogen cloud,100-200","oxygen cloud,50-100,95%"],"atmosphere");
new Thing("thin atmosphere",["carbon dioxide cloud,2-10","nitrogen cloud,1-2,75%"],"atmosphere");
new Thing("jovian atmosphere",["hydrogen cloud,500-600","helium cloud,200-300","methane cloud,100-200,10%"],"atmosphere");
new Thing("temperate superterrestrial atmosphere",["carbon dioxide cloud,100-300","water cloud,50-100,50%","nitrogen cloud,50-150","helium cloud,100-200"],"atmosphere");
new Thing("chromosphere",["plasma cloud,10-20"]);
new Thing("photosphere",["plasma cloud,100-200"]);
new Thing("convective zone",["plasma cloud,200-300"]);
new Thing("radiative zone",["plasma cloud,300-350"]);
new Thing("star core",["plasma cloud,300-350"],"core");
new Thing("plasma cloud",["hydrogen atom,100-300","helium atom,50-60","electron,200-300","proton,200-300"]);
new Thing("hydrogen cloud",["hydrogen,100-200"]);
new Thing("helium cloud",["helium atom,100-200"]);
new Thing("methane cloud",["methane,100-200"]);
new Thing("carbon dioxide cloud",["carbon dioxide,100-200"]);
new Thing("nitrogen cloud",["nitrogen,100-200"]);
new Thing("water cloud",["water,100-200"]);
new Thing("oxygen cloud",["oxygen,100-200"]);
new Thing("rocky core",["rock,100-200"],"core");
new Thing("rock",[["silicon dioxide,50-100","magnesium oxide,50-100","iron ii oxide,50-100","aluminum oxide,50-100","calcium oxide,50-100"]]);
new Thing("neutron star crust",["iron atom,100-500"],"crust");
new Thing("neutron star core",["neutron,100-500","strangelet,50-100"],"core");
new Thing("white dwarf crust",["diamond,100-200"],"crust");
new Thing("white dwarf core",["proton,100-200","neutron,100-200","electron,100-200"],"core");
new Thing("temperate crust",["temperate continent,5-10"],"crust");
new Thing("wet temperate crust",["wet temperate continent,5-10","ocean,2-7"],"crust");
new Thing("sublife temperate crust",["sublife temperate continent,5-10","sublife ocean,2-7"],"crust");
new Thing("prokaryotic temperate crust",["prokaryotic temperate continent,5-10","prokaryotic ocean,2-7"],"crust");
new Thing("temperate continent",["mountain,25-50","rock,100-200"],"continent");
new Thing("wet temperate continent",["mountain,25-50","rock,100-200","lake,25-50"],"continent");
new Thing("sublife temperate continent",["mountain,25-50","rock,100-200","sublife lake,25-50"],"continent");
new Thing("prokaryotic temperate continent",["mountain,25-50","rock,100-200","prokaryotic lake,25-50"],"continent");
new Thing("lake",["water droplet,50-100"],"lake");
new Thing("sublife lake",["sublife water droplet,50-100"],"lake");
new Thing("prokaryotic lake",["prokaryotic water droplet,50-100"],"lake");
new Thing("ocean",["salt water droplet,100-200"],"ocean");
new Thing("sublife ocean",["sublife salt water droplet,100-200"],"ocean");
new Thing("prokaryotic ocean",["sublife salt water droplet,100-200"],"ocean");
new Thing("salt water droplet",["water,100-200","salt,50-100"],"water droplet");
new Thing("water droplet",["water,100-200"],"water droplet");
new Thing("sublife salt water droplet",["water,100-200","salt,50-100","thingPool,20-30"],"water droplet");
new Thing("sublife water droplet",["water,100-200","thingPool,20-30"],"water droplet");
new Thing("prokaryotic salt water droplet",["water,100-200","salt,50-100","thingPool,20-30"],"water droplet");
new Thing("prokaryotic water droplet",["water,100-200","thingPool,20-30"],"water droplet");
new Thing("mountain",["rock,100-200"]);
new Thing("metallic core",["iron chunk,100-200","nickel chunk,100-200"],"core");
new Thing("iron chunk",["iron atom,100-200"]);
new Thing("nickel chunk",["nickel atom,100-200"]);
new Thing("scorched atmosphere",["carbon dioxide cloud,100-200","water cloud,50-100,90%","sodium cloud,30-100,75%","magnesium cloud,30-100,75%"],"atmosphere");
new Thing("scorched crust",["scorched continent,5-10","lava ocean,2-7"],"crust");
new Thing("scorched continent",["volcano,25-50","rock,100-200","lava lake,25-50"],"continent");
new Thing("lava lake",["lava,50-100"]);
new Thing("lava ocean",["lava,100-200"]);
new Thing("lava",[["silicon dioxide,50-100","magnesium oxide,50-100","iron ii oxide,50-100","aluminum oxide,50-100","calcium oxide,50-100"]]);
new Thing("volcano",["rock,100-200","lava,20-50"]);
new Thing("mantle",["lava,200-500"]);
new Thing("sodium cloud",["sodium atom,100-200"]);
new Thing("salt",["chlorine atom","sodium atom"]);
new Thing("magnesium cloud",["magnesium atom,100-200"]);


new Thing("silicon dioxide",["silicon atom","oxygen atom,2"]);
new Thing("magnesium oxide",["magnesium atom","oxygen atom"]);
new Thing("iron ii oxide",["iron atom","oxygen atom"]);
new Thing("aluminum oxide",["aluminum atom,2","oxygen atom,3"]);
new Thing("calcium oxide",["calcium atom","oxygen atom"]);
new Thing("methane",["hydrogen atom,4","carbon atom"]);
new Thing("hydrogen",["hydrogen atom,2"]);
new Thing("diamond",["carbon atom,100-200"]);
new Thing("water",["oxygen atom","hydrogen atom,2"]);
new Thing("nitrogen",["nitrogen atom,2"]);
new Thing("carbon dioxide",["carbon atom","oxygen atom,2"]);


new Thing("silicon atom",["proton,14","neutron,14","neutron,5%","neutron,2%","electron,14","electron,1%"]);
new Thing("oxygen atom",["proton,8","neutron,8",["neutron,2,2%","neutron,.05%"],"electron,8","electron,1-2,50%"]);
new Thing("carbon atom",["proton,6","neutron,6","neutron,1%","electron,6"]);
new Thing("nitrogen atom",["proton,7","neutron,7","neutron,0.5%","electron,7","electron,1-2,25%"]);
new Thing("phosphorus atom",["proton,15","neutron,16","electron,15","electron,1-3,10%"]);
new Thing("aluminum atom",["proton,13","neutron,14","electron,10","electron,1-3,20%"]);
new Thing("magnesium atom",["proton,12","neutron,12",["neutron,10%","neutron,2,11%"],"electron,10","electron,1-2,25%"]);
new Thing("sulfur atom",["proton,16","neutron,16",["neutron,.75%","neutron,2,4%"],"electron,16","electron,1-2,25%"]);
new Thing("calcium atom",["proton,20","neutron,20",["neutron,1%,2","neutron,.5%,3"],"electron,18","electron,1-2,25%"]);
new Thing("iron atom",["proton,26","neutron,28",["neutron,2,95%","neutron,2,95%","neutron,2,95%","neutron,2,95%","neutron,2-3"],"electron,23",["electron","electron,3"]])
new Thing("hydrogen atom",["proton","electron,80%","electron,10%","neutron,.2%"]);
new Thing("helium atom",["proton,2","electron,2","neutron","neutron,99.998%"]);
new Thing("chlorine atom",["proton,17","electron,17","electron,99%","neutron,18","neutron,2,20%"]);
new Thing("sodium atom",["proton,11","electron,10","electron,1%","neutron,12"]);
new Thing("proton",["up quark,2","down quark","gluon,1-5","strange quark,.01%"]);
new Thing("neutron",["down quark,2","up quark","gluon,1-5","strange quark,.01%"]);
new Thing("electron",["aaa"]);
new Thing("aaa",["null,2-3"],"*RANDOM*,symbols");
new Thing("up quark",["aaa"]);
new Thing("down quark",["aaa"]);
new Thing("strange quark",["aaa"]);
new Thing("gluon",["aaa"]);
new Thing("strangelet",["up quark,2-20","down quark,2-20","strange quark,2-20","gluon,2-20"]);
new Thing("null",["the box"]);
document.getElementById("debug").innerHTML="";
debug('<div id="div0" class="thing"></div>');

const launchNest = (what) => {
	if (!Things[what]) what="error";
	var Seed=make(what);
	Seed.Grow(0);
	Seed.List();
}

