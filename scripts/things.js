function Rand(min,max) {
	
	return parseFloat(Math.floor(Math.random()*(max-min+1)))+parseFloat(min);
}
function Choose(arr) {
	return arr[Math.floor(Math.random()*arr.length)];
}
function ChooseRand(min,max) {
	let numbers = []
	for(let i = min; i<=max; i++) {
	numbers.push(i)	
	}
	return Choose(numbers)
}
let Things = {}

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
  
}

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

		if (toConcat.length>0)
		{
			for (let i in toConcat)
			{
				thisT.contains.push(toConcat[i]);
			}
		}

		newContains=[];
		for (let i in thisT.contains)
		{
			if (thisT.contains[i]!="") newContains.push(thisT.contains[i]);
		}
		thisT.contains=newContains;

	}
}

let iN=0;
let Instances=[];
class Instance{
  constructor(what) {
    this.name="thing";
    this.type=Things[what];
    this.parent=0;
    this.children=[];
    this.n=iN;
    this.display=0;
    this.grown=false;
    iN++;
    Instances.push(this);

    return this;
  }
}
Instance.prototype.Name=function()
{
	this.name=this.type.namegen;

	if (typeof(this.name)!="string")
	{
		var str="";
		if (typeof(this.name[0])=="string") str+=Choose(this.name);
		else
		{
			for (var i in this.name)
			{
				str+=Choose(this.name[i]);
			}
		}
		this.name=str;
	}

}
Instance.prototype.Grow=function()
{
	if (this.grown===false)
	{
		this.Name();
		for (let i in this.type.contains)
		{
			toMake=this.type.contains[i];
			if (typeof(toMake)!="string")
			{toMake=Choose(toMake);}
			toMake=toMake.split(",");
			let makeAmount=1;
			let makeProb=100;
			if (toMake[1]===undefined) toMake[1]=1;
			else
			{
				makeAmount=toMake[1].split("-");
				if (makeAmount[1]===undefined) makeAmount=makeAmount[0]; else
				{
					makeAmount=Rand(makeAmount[0],makeAmount[1]);
				}
				makeProb=(toMake[1]+"?").split("%");
				if (makeProb[1]!=undefined) {makeProb=makeProb[0];makeAmount=1;} else makeProb=100;
			}

			if (Things[toMake[0]]!=undefined)
			{
				if (Math.random()*100<=makeProb)
				{
					for (let ii=0;ii<makeAmount;ii++)
					{
						let New=make(Things[toMake[0]].name);
						New.parent=this;
						this.children.push(New);
					}
				}
			}

		}
		this.grown=true;
	}
}

Instance.prototype.List=function()
{
	var str="";
	var addStyle="";
	for (var i in this.children)
	{
		str+='<div id="div'+this.children[i].n+'">'+this.children[i].name+'</div>';
	}
	
	//if (this.children.length>0) document.getElementById("div"+this.n).innerHTML='<span onclick="toggle('+this.n+');"><span class="arrow" id="arrow'+this.n+'">+</span> '+this.name+'</span><div id="container'+this.n+'" class="thing" style="display:none;">'+str+'</div>';
	if (this.children.length>0) document.getElementById("div"+this.n).innerHTML='<a href="javascript:toggle('+this.n+');" style="padding-right:8px;" alt="archetype : '+(this.type.name)+'" title="archetype : '+(this.type.name)+'"><span class="arrow" id="arrow'+this.n+'">+</span> '+this.name+'</a><div id="container'+this.n+'" class="thing" style="display:none;'+addStyle+'">'+str+'</div>';
	else document.getElementById("div"+this.n).innerHTML='<span class="emptyThing">'+this.name+'</span>';
}

const make = (what) => {
	return new Instance(what);
}
function toggle(what)
{
	if (Instances[what].display==0)
	{

		for (var i in Instances[what].children)
		{
			if (Instances[what].children[i].grown==false) {Instances[what].children[i].Grow(0);Instances[what].children[i].List(0);}
		}


		Instances[what].display=1;
		document.getElementById("container"+what).style.display="block";
		document.getElementById("arrow"+what).innerHTML="-";
	}
	else if (Instances[what].display==1)
	{
		Instances[what].display=0;
		document.getElementById("container"+what).style.display="none";
		document.getElementById("arrow"+what).innerHTML="+";
	}
}
const debug = (what) => {
	document.getElementById("debug").innerHTML=document.getElementById("debug").innerHTML+'<br>'+what;
}
new Thing("the box",["altarca,90-110","the box"]);
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
new Thing("globular cluster",["solar system,500-750"]);
new Thing("belt",["bubble,10-20","star cloud,50-100"],"stellar belt");
new Thing("bubble",["star cloud,20-30","solar system,200-300"],"stellar bubble");
new Thing("star cloud",["solar system,20-30"],"stellar cloud");
new Thing("solar system",[["star","star","star","star","star","star","star","star","brown dwarf","brown dwarf","brown dwarf","white dwarf","white dwarf","black hole","neutron star"],["asteroid belt","dwarf planet","terrestrial planet","superterrestrial planet","jovian planet"],["asteroid belt,90%","dwarf planet,90%","terrestrial planet,90%","superterrestrial planet,90%","jovian planet,90%"],["asteroid belt,50%","dwarf planet,50%","terrestrial planet,50%","superterrestrial planet,50%","jovian planet,50%"],["asteroid belt,50%","dwarf planet,50%","terrestrial planet,50%","superterrestrial planet,50%","jovian planet,50%"]]);
new Thing("star",["corona","chromosphere","photosphere","convective zone","radiative zone","star core"],[["o-type","a-type","b-type","f-type","f-type","g-type","g-type","g-type","k-type","k-type","k-type","k-type","k-type","m-type","m-type","m-type","m-type","m-type","m-type","m-type"],[" star"]]);
new Thing("black hole",["singularity"]);
new Thing("singularity",["aaa,1-3","wormhole,1%"]);
new Thing("wormhole",["universe"]);
new Thing("brown dwarf",["jovian atmosphere","rocky core"]);
new Thing("neutron star",["neutron star crust","neutron star core"]);

new Thing("corona",["hydrogen atom,100-300","helium atom,50-60","electron,200-300","proton,200-300"]);
new Thing("jovian atmosphere",["hydrogen cloud,100-200","helium cloud,20-30"]);
new Thing("chromosphere",["plasma cloud,10-20"]);
new Thing("photosphere",["plasma cloud,100-200"]);
new Thing("convective zone",["plasma cloud,200-300"]);
new Thing("radiative zone",["plasma cloud,300-350"]);
new Thing("star core",["plasma cloud,300-350"]);
new Thing("plasma cloud",["hydrogen atom,100-300","helium atom,50-60","electron,200-300","proton,200-300"]);
new Thing("hydrogen cloud",["hydrogen,100-200"]);
new Thing("helium cloud",["helium atom,100-200"]);
new Thing("rocky core",["rock,100-200"]);
new Thing("rock",[["silicon dioxide,50-100","magnesium oxide,50-100","iron ii oxide,50-100","aluminum oxide,50-100","calcium oxide,50-100"]]);

new Thing("silicon dioxide",["silicon atom","oxygen atom,2"]);
new Thing("magnesium oxide",["magnesium atom","oxygen atom"]);
new Thing("iron ii oxide",["iron atom","oxygen atom"]);
new Thing("aluminum oxide",["aluminum atom,2","oxygen atom,3"]);
new Thing("calcium oxide",["calcium atom","oxygen atom"]);
new Thing("silicon atom",["proton,14","neutron,14","neutron,5%","neutron,2%","electron,14","electron,1%"]);
new Thing("oxygen atom",["proton,8","neutron,8",["neutron,2,2%","neutron,.05%"],"electron,8","electron,50%","electron,50%"]);

new Thing("hydrogen",["hydrogen atom,2"]);
new Thing("hydrogen atom",["proton","electron,80%","electron,10%","neutron,.2%"]);
new Thing("helium atom",["proton,2","electron,2","neutron","neutron,99.998%"]);
new Thing("proton",["up quark,2","down quark","gluon,1-5","strange quark,.01%"]);
new Thing("neutron",["down quark,2","up quark","gluon,1-5","strange quark,.01%"]);
new Thing("electron",["aaa"]);
new Thing("aaa",["null,2-3"],[["!","@","#","$","%","^","&","*","+","_","?","/"],["!","@","#","$","%","^","&","*","+","_","?","/"],["!","@","#","$","%","^","&","*","+","_","?","/"],["!","@","#","$","%","^","&","*","+","_","?","/"],["!","@","#","$","%","^","&","*","+","_","?","/"]]);
new Thing("up quark",["aaa"]);
new Thing("down quark",["aaa"]);
new Thing("null",["the box"]);
document.getElementById("debug").innerHTML="";
debug('<div id="div0" class="thing"></div>');

const launchNest = (what) => {
	if (!Things[what]) what="error";
	var Seed=make(what);
	Seed.Grow(0);
	Seed.List();
}


