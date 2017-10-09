'use strict';
var BaseUtils=require("./BaseUtils.js");
var arrLibs=[
	"StringUtils","MathUtils","DateUtils","LogUtils","ListUtils","AsyncUtils","ChronoUtils"
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
						global[vPropName]=vPropValue;
					}
				}
			}
	    }		
	}
}
module.exports=RCGUtils;
var rcgUtils=new RCGUtils(true);
/*setLogToBuffer(true);
log("Cargado comprobacion:"+enEuros(100,true));
var sLogAnt=logPop(false);
log("Segundo Log");
log("Primer Log:"+sLogAnt);
*/
log("initFill");
chronoEnable();
chronoStart("Filling");
var arrTest=[];
var iMax=1000*1000*10;
chronoStart("Fill "+(iMax/10));
for (var i=0;i<iMax;i++){
	arrTest.push("id"+i);
	if ((i%(iMax/10))==0){
		chronoStop("Fill "+(iMax/10));
		chronoStart("Fill "+(iMax/10));
	}
}
chronoStop("Fill "+(iMax/10));
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
