'use strict';
var BaseUtils=require("./BaseUtils.js");
var arrLibs=[
	"./StringUtils.js","./MathUtils.js","./DateUtils.js","./LogUtils.js","./ListUtils.js",
	"./AsyncUtils.js","./ExcelUtils.js","./ChronoUtils.js","./HashMapUtils.js","./DynamicObjectUtils.js"
	];

function makeGlobals(bMakeGlobals,obj){
	if (isUndefined(bMakeGlobals)) return;
	if (bMakeGlobals==true){
		var arrProperties=Object.getOwnPropertyNames(obj.__proto__);
		for (var i=0;i<arrProperties.length;i++){
			var vPropName=arrProperties[i];
			if (vPropName!=="constructor"){
				var vPropValue=obj[vPropName];
				if (isMethod(vPropValue)){
					if (isUndefined(global[vPropName])){
						global[vPropName]=vPropValue;
					}
				}
			}
		}
    }		
}

function requireLib(bMakeGlobals,sNameLib){
	console.log(sNameLib);
	var vLib=require(sNameLib);
	var obj=new vLib();
    makeGlobals(bMakeGlobals,obj);
}

function requireLibs(bMakeGlobals,arrLibs){
    for (var i=0;i<arrLibs.length;i++){
    	var sNameLib=arrLibs[i];
    	requireLib(bMakeGlobals,sNameLib);
    }
}

class RCGUtils{
    constructor(bMakeGlobals) {
    	var self=this;
    	requireLibs(bMakeGlobals,arrLibs);
    	self.requireLib=requireLib;
    	self.requireLibs=requireLibs;
	}
}
module.exports=RCGUtils;
var rcgUtils=new RCGUtils(true);
chronoEnable();
log("Testing Dynamic Objects");
var XLSX = require('xlsx');
class auxfactory{
	constructor(nombre,depende){
		var self=this;
		self.nombre=nombre;
		if (isDefined(depende)){
			log("Tipo:"+ (typeof depende)+"  "+Array.isArray(depende));
			if (isArray(depende)){
				self.depende=depende;
			} else {
				self.depende=[depende];
			}
		} else {
			self.depende=[];
		}
		self.object="";
		self.isLoaded=false;
		self.isConfigured=false;
	}
}
var fs = require('fs');
fs.readFile('app/xls/ConfSimulador5.xls', null, function (err,arraybuffer) {
  if (err) {
    return console.log(err);
  }
  var data = new Uint8Array(arraybuffer);
  var arr = new Array();
  for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
  var bstr = arr.join("");

  /* Call XLSX */
  var workbook = XLSX.read(bstr, {type:"binary"});
  /* Get worksheet */
  var sNombreSheet="Organismos";
  
  var arrObjetos=newHashMap();
  var arrObjetos2=newHashMap();
  arrObjetos.add("Organismos",new auxfactory("Organismos"));
  arrObjetos.add("Procedimientos",new auxfactory("Procedimientos",["Organismos"]));
  arrObjetos.add("TiposFases",new auxfactory("TiposFases"));
  arrObjetos.add("TiposDocumentos",new auxfactory("TiposDocumentos",["TiposFases"]));
  arrObjetos.add("Documentos",new auxfactory("Documentos",["TiposDocumentos"]));
  arrObjetos.add("Fases",new auxfactory("Fases",["TiposFases","Procedimientos","TiposDocumentos"]));
//  arrObjetos.add("TiposGraficas",new auxfactory("TiposGraficas"));
//  arrObjetos.add("Series",new auxfactory("Series"));
//  arrObjetos.add("Graficas",new auxfactory("Graficas"));
  chronoStart("RecorreAsync");
  chronoStart("RecorreAsync1");
  var barrier=newBarrier();
  
  var fncConfigObject=function(stepNode){
	  var auxFactNode=stepNode.valor;
	  var sFactoryName=auxFactNode.nombre;
	  log("Configurando:"+sFactoryName);
	  if (!auxFactNode.isConfigured){
		  for (var i=0;i<auxFactNode.depende.length;i++){
			  var auxDepend=arrObjetos.find(auxFactNode.depende[i]);
			  fncConfigObject(auxDepend);
		  }
		  var sFileName="../classes/"+sFactoryName+".js";
		  var auxFact;
		  var fs = require('fs');
		  var sFullPath=__dirname+"/../"+sFileName;
		  if (!fs.existsSync(sFullPath)) {
			  sFileName=undefined;
			  log("No Tiene Fichero");
			  auxFact=newDynamicObjectFactory(undefined,undefined,undefined,sFactoryName);
		  } else {
			  log("Tiene Fichero");
			  auxFact=newDynamicObjectFactoryFromFile(sFileName,sFactoryName);		  
		  }
		  auxFact.configFromExcel(workbook);
		  auxFactNode.object=auxFact;
		  auxFactNode.isConfigured=true;
		  log("Configurado:"+sFactoryName);
	  } else {
		  log("Ya estaba configurado:"+sFactoryName);
	  }
  }
  
  var fncLoadObject=function(stepNode){
	  var auxFactNode=stepNode.valor;
	  var objFactory=auxFactNode.object;
	  var sFactoryName=auxFactNode.nombre;
	  log("Cargando Desde Excel:"+sFactoryName);
	  if (!auxFactNode.isLoaded){
		  for (var i=0;i<auxFactNode.depende.length;i++){
			  var auxDepend=arrObjetos.find(auxFactNode.depende[i]);
			  fncLoadObject(auxDepend);
			  auxDepend.valor.object.generarTipos(objFactory);
		  }
		  objFactory.loadFromExcel(workbook);
		  objFactory.balancear();
		  auxFactNode.isLoaded=true;
		  log("Cargado:"+sFactoryName);
	  } else {
		  log("Ya estaba cargado:"+sFactoryName);
	  }
  }
  
  
  arrObjetos.recorrerAsync("Configurando desde Excel 1",		  
		  						fncConfigObject,
						        function(){chronoStop("RecorreAsync1");},undefined,undefined,undefined,undefined,barrier
						     );
/*  chronoStart("RecorreAsync2");
  arrObjetos2.recorrerAsync("Configurando desde Excel 2",		  
			function(stepNode){
				  var sFactoryName=stepNode.valor;
				  log("Cargando:"+sFactoryName);
				  var sClave=stepNode.nodoActual.clave;
				  var auxFact=newDynamicObjectFactory(sFactoryName,true,[],[],[],"../../classes/"+sFactoryName+".js");		  
				  auxFact.configFromExcel(workbook);
				  arrObjetos2.setValor(sClave,auxFact);
	         },
	         function(){chronoStop("RecorreAsync2");},undefined,undefined,undefined,undefined,barrier
	     );
*/
  barrier.setCallback(function(){
 	 chronoStop();
	 chronoList();
	 log("Fin Async");
	 arrObjetos.balancear();
	 log("Cargando desde Excel");
	 chronoStart("RecorreAsync2");
	 arrObjetos.recorrerAsync("Cargando Desde Excel",fncLoadObject,
			 function(){
		 		chronoStop("RecorreAsync2");
		 		 log("Fichero XLS Leido.... ¿bravo?");
		 	});
  });

  

});

var coches=newDynamicObjectFactory([{nombre:"L1",descripcion:"Elementos L1",tipo:"Numero"},
													{nombre:"L2",descripcion:"Elementos L2",tipo:"Valor"},
													{nombre:"L3",descripcion:"Elementos L3",tipo:"Fecha"},
													],["A1","A2","A3"],["P1","P2"]);
var coche=coches.nuevo("ZX");
coches.traza();
/*
log("testing HashMap");
var hsAux=newHashMap();
var sKey;
var iKey;
var iMax=100000;
for (var i=1;i<iMax;i++){
	iKey=Math.round(Math.random()*iMax*100);
	sKey=fillLetrasLeft(10,iKey,"0"); 
	hsAux.add("Key_"+sKey,"Value_"+sKey);
}
hsAux.balancear();
hsAux.trazaTodo();
*/
/*
function testIntro(iCad){
	var bFnc=true;
	if (bFnc) {
		chronoStartFunction("testIntro");
	} else {
		chronoStart("testIntro");
	}
	iCad++;
	if (bFnc){
		chronoStopFunction();
	} else {
		chronoStop("testIntro");
	}
	return iCad;
}
function testFnc(){
//	chronoStartFunction();
	var auxChrono=chronoStartFunction();
	var iCad=1;
	while (auxChrono.getCuantoLleva()<(1000*10)){
//	for (var i=0;i<1000*100;i++){
		iCad=testIntro(iCad);
	}
	chronoStopFunction();
}
testFnc();
*/
chronoList();
log("Fin");
/*setLogToBuffer(true);
log("Cargado comprobacion:"+enEuros(100,true));
var sLogAnt=logPop(false);
log("Segundo Log");
log("Primer Log:"+sLogAnt);
*/
/*
log("initFill");
chronoEnable();
chronoStart("Filling");
var arrTest=[];
var iMax=1000*1000*10;
var iModulo=iMax/100000;
chronoStart("Fill "+(iModulo));
for (var i=0;i<iMax;i++){
	arrTest.push("id"+i);
	if ((i%(iModulo))==0){
		chronoStop("Fill "+(iModulo));
		chronoStart("Fill "+(iModulo));
	}
}
chronoStop("Fill "+(iModulo));
log("endFill");
chronoStop("Filling");

log("NewBarrier");
var barrier=newBarrier();

chronoStart("Test");
log("procesaOffline");
procesaOffline(0,arrTest.length,fncVacia,"Casas",undefinedValue,undefinedValue,2,barrier);
barrier.setCallback(function(){
	log("Finalizada la Barrera");
	chronoStop("Test");
	chronoList();
});
log("Finiquito");
*/

