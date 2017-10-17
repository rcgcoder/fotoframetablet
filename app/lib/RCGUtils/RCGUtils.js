'use strict';
var BaseUtils=require("./BaseUtils.js");
var arrLibs=[
	"StringUtils","MathUtils","DateUtils","LogUtils","ListUtils","AsyncUtils","ExcelUtils","ChronoUtils","HashMapUtils","DynamicObjectUtils"
	];

class RCGUtils{
    constructor(bMakeGlobals) {
	    var self = this;
	    for (var i=0;i<arrLibs.length;i++){
	    	var sNameLib=arrLibs[i];
	    	console.log(sNameLib);
	    	var vLib=require("./"+sNameLib+".js");
	    	self[sNameLib]=new vLib();
		    self.makeGlobals(bMakeGlobals,self[sNameLib]);
	    }
	}
	makeGlobals(bMakeGlobals,obj){
	    var self = this;
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
}
module.exports=RCGUtils;
var rcgUtils=new RCGUtils(true);
chronoEnable();
log("Testing Dynamic Objects");
var XLSX = require('xlsx');

var fs = require('fs');
fs.readFile('../xls/ConfSimulador5.xls', null, function (err,arraybuffer) {
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

});

var coches=newDynamicObjectFactory("Coches",false,[{nombre:"L1",descripcion:"Elementos L1",tipo:"Numero"},
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

