function Choose(arr)
{
	//Returns an element from an array at random.
	return arr[Math.floor(Math.random()*arr.length)];
}

function WeightedChoose(arr,weightChoose)
{
	//Returns an element from an array at random according to a weight.
	//A weight of 2 means the first element will be picked roughly twice as often as the second; a weight of 0.5 means half as often. A weight of 1 gives a flat, even distribution.
	if (weightChoose<=0 || weightChoose==undefined) weightChoose=1;
	return arr[Math.floor(Math.pow(Math.random(),weightChoose)*arr.length)];
	
	//return arr[Math.floor((1-Math.pow(Math.random(),1/weightChoose))*arr.length)];//this would give a different curve

	//previously
	/*
	var iChoose;
	var arrChoose=[];
	if (weightChoose<=0 || weightChoose==undefined) weightChoose=1;
	for (iChoose=0;iChoose<arr.length;iChoose++)
	{
		if (Math.round(Math.random()*(iChoose*weightChoose))==0) arrChoose.push(arr[iChoose]);
	}
	return Choose(arrChoose);
	*/
}


function Rand(min,max)
{
	//Return a number between min and max, included.
	return parseFloat(Math.floor(Math.random()*(max-min+1)))+parseFloat(min);
}


var Things=[];
var ThingsN=0;
function Thing(name,contains,namegen)
{
	this.name=name;
	this.contains=contains;
	this.namegen=namegen;
	if (this.namegen==undefined) this.namegen=this.name;

	Things[name]=this;
	ThingsN++;
}

function CheckMissingThings()
{
	var allContents=[];
	var allMissing=[];
	for (var i in Things)
	{
		var thisThing=Things[i];
		for (var i2 in thisThing.contains)
		{
			thisContent=thisThing.contains[i2];
			if (typeof(thisContent)!="string")
			{
				for (var i3 in thisContent) {allContents.push(thisContent[i3]);}
			}
			else allContents.push(thisContent);
		}
	}
	for (var i in allContents)
	{
		var thisContent=allContents[i];
		if (thisContent.charAt(0)==".") thisContent=thisContent.substring(1);
		thisContent=thisContent.split(",");
		thisContent=thisContent[0];
		if (!Things[thisContent] && thisContent!="") allMissing.push(thisContent);
	}
//	allMissing=allMissing.filter(function(elem,pos) {return allMissing.indexOf(elem)==pos;});//remove duplicates

	var str="Things that are linked to, but don't exist :\n";
	for (var i in allMissing)
	{
		str+=allMissing[i]+"\n";
	}
	alert(str);
}

function CleanThings()
{
	for (var iT in Things)
	{
		thisT=Things[iT];

		toConcat=[];
		for (var i in thisT.contains)
		{
			if (typeof(thisT.contains[i])=="string")
			{
				if (thisT.contains[i].charAt(0)==".")
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
			for (var i in toConcat)
			{
				thisT.contains.push(toConcat[i]);
			}
		}

		newContains=[];
		for (var i in thisT.contains)
		{
			if (thisT.contains[i]!="") newContains.push(thisT.contains[i]);
		}
		thisT.contains=newContains;

	}
}




var iN=0;
var Instances=[];
function Instance(what)
{
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

function Title(what)
{
	//Changes a string like "the cat is on the table" to "the Cat Is on the Table"
	what=what.split(" ");
	var toReturn="";
	for (var i in what)
	{
		if (what[i]!="of" && what[i]!="in" && what[i]!="on" && what[i]!="and" && what[i]!="the" && what[i]!="an" && what[i]!="a" && what[i]!="with" && what[i]!="to" && what[i]!="for") what[i]=what[i].substring(0,1).toUpperCase()+what[i].substring(1);
		toReturn+=" "+what[i];
	}
	return toReturn.substring(1);
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


CleanThings();

//CheckMissingThings();
//alert("There are "+ThingsN+" thing archetypes.");

document.getElementById("debug").innerHTML="";
Debug('<div id="div0" class="thing"></div>');

function LaunchNest(what)
{
	if (!Things[what]) what="error";
	var Seed=Make(what);
	Seed.Grow(0);
	Seed.List();
}
new Thing("multiverse",["universe"])
