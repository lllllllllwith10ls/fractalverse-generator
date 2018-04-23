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
new Thing("megaverse",["multiverse,90-100"]);
new Thing("multiverse",["universe,40-50","fractalverse,2-4"]);
new Thing("universe",["hubble volume,40-60"]);
new Thing("hubble volume",["supercluster,30-40","supergalaxy,0-3","galaxy cluster,100-200"]);
new Thing("fractalverse",["level " + chooseRand(1,100) + " turtlie,40-60"]);
new Thing("level 1 turtlie",[]);
for(let i=2;i<=100;i++) {
	new Thing("level " + i + " turtlie",["level " + i-1 + " turtlie,40-60"]);
};
new Thing("supercluster",["galaxy cluster, 40-75","supergalaxy,25%","galaxy,100-250"]);
new Thing("supergalaxy",["galaxy,50-200","supergalaxy,2%"]);
new Thing("galaxy cluster",["galaxy,20-40"]);
new Thing("galaxy",[]);
document.getElementById("debug").innerHTML="";
debug('<div id="div0" class="thing"></div>');

const launchNest = (what) => {
	if (!Things[what]) what="error";
	var Seed=make(what);
	Seed.Grow(0);
	Seed.List();
}


