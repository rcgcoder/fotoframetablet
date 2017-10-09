'use strict';
var BaseUtils=require("./BaseUtils.js");
var LogUtils=require("./LogUtils.js");

class Barrier{
	constructor(callback){
		var self=this;
		self.arrObjects=[];
		self.fncFinishCallback=callback;
	}
	setCallback(newCallback){
		this.fncFinishCallback=newCallback;
	}
	finish(objeto){
		var iInd=0;
		log("Fin Procesado" + (isDefined(objeto.nombre)?":"+objeto.nombre:"."));
		for (var i=0;i<this.arrObjects.length;i++){
			if (this.arrObjects[i]==objeto){
				if (i > -1) {
					this.arrObjects.splice(i, 1);
					if (this.arrObjects.length==0){
						log("Fin del procesado de todos los objetos de la barrera.");
						if (isDefined(this.fncFinishCallback)){
							setTimeout(this.fncFinishCallback);
						}
					}
					return;
				}
			}
		}
	}
	start(objeto){
		this.arrObjects.push(objeto);
	}
};

class offlineStepInfo{
	constructor(iIndAct,nRendimiento,nDuracion,iIndMaximo,
				sUnidades,nRendTotal,nDuracionTotal,nPorc,tEstimado){
		var self=this;
		self.iIndAct=iIndAct;
		self.nRendimiento=nRendimiento;
		self.nDuracion=nDuracion;
		self.iIndMaximo=iIndMaximo;
		self.sUnidades=sUnidades;
		self.nRendTotal=nRendTotal;
		self.nDuracionTotal=nDuracionTotal;
		self.nPorc=nPorc;
		self.tEstimado=tEstimado;
	}
	log(){
		var self=this;
		var sCad;
		if (self.iOps>=self.iIndMaximo){
			sCad="Fin Procesado " + self.sUnidades;
		} else {
			sCad="Procesando " + self.sUnidades;
		}
		sCad+="  "+self.iIndAct + "/"+self.iIndMaximo +" "+inPercent(self.nPorc)+
			  "  Bloque:"+ " " +self.nDuracion+ " s (" + Math.round(self.nRendimiento) + " "+self.sUnidades+" /s)"+
			  "  Total:" +self.nDuracionTotal+ " s (" + Math.round(self.nRendTotal) + " "+self.sUnidades+" /s)" +
			  "  Tiempo Resta:" + self.tEstimado;
		log(sCad);
	}
}
class offlineProcesor{
	constructor(iIndMin,iIndMax,funcion,sUnidades,callback,callBloque,nSegundos,barrier){
		var self=this;
		self.barrier=barrier;
		self.sUnidades="operaciones";
		if (isDefined(sUnidades)){
			self.sUnidades=sUnidades;
		}
		self.CallBloque=procesaOfflineDefaultLog;
		if (isDefined(callBloque)){
			self.CallBloque=callBloque;
		}
		self.nSegsLog=3000;
		if (isDefined(nSegundos)){
			self.nSegsLog=Math.round(nSegundos*1000);
		}
		self.iIndAct=iIndMin;
		self.iIndMin=iIndMin;
		self.iIndMaximo=iIndMax;
		if (isUndefined(iIndMax)){
			self.iIndMaximo=iIndMin-1;
		}
		self.theCallBloque=callBloque;
		self.theCallback=callback;
		self.theOperacion=funcion;
		self.nOperacionesTotales=0;
		self.initTimestamp=new Date().getTime();
		self.lastTimestamp=new Date().getTime();
	}
	nextCicle(){
		var self=this;
		if ((self.iIndAct==self.iIndMin)&&(isDefined(self.barrier))){
			self.barrier.start(this);
		}
		var actNow=new Date().getTime();
		var nOpsRonda=0;
		var tInicioRonda=actNow;
		var opResult;
		var bFinish=false;
		while ((!bFinish)
				&&((self.iIndAct<self.iIndMaximo)||(self.iIndMaximo<self.iIndMin))
				&&(actNow<=(self.lastTimestamp+self.nSegsLog))) {
			if (isDefined(self.theOperacion)){
				opResult=self.theOperacion(self.iIndAct);
				if (isDefined(opResult)){
					if (opResult){ //opResult==true..... finish!
						bFinish=opResult;
					}
				}
			}
			self.nOperacionesTotales++;
			nOpsRonda++;
			self.iIndAct++;
			actNow=new Date().getTime();
		}
		self.lastTimestamp=new Date().getTime();
		var nDuracionTotal=((self.lastTimestamp-self.initTimestamp)/1000);
		var nRendTotal=self.nOperacionesTotales/nDuracionTotal;
		var nDuracion=((self.lastTimestamp-tInicioRonda)/1000);
		var nRendimiento=0;
		if (nDuracion>0){
			nRendimiento=nOpsRonda/nDuracion;
		}
		var nPorc=1;
		if ((self.iIndMaximo>self.iIndMin)&&((self.iIndMaximo-self.iIndMin)>0)){
			nPorc=(self.iIndAct-self.iIndMin)/(self.iIndMaximo-self.iIndMin);
		}
		var tEstimado=0;
		if (nPorc>0){
			tEstimado=((1-nPorc)*nDuracionTotal)/nPorc;
		}
		var theStepInfo=new offlineStepInfo(
				self.iIndAct,nRendimiento,nDuracion,self.iIndMaximo,self.sUnidades,
				nRendTotal,nDuracionTotal,nPorc,tEstimado
				);

		self.CallBloque(theStepInfo);
		if (((self.iIndAct>=self.iIndMaximo)&&(self.iIndMaximo>self.iIndMin))||(bFinish)) {
			if (isDefined(self.theCallback)){
				self.theCallback(theStep);
			}
			if (isDefined(self.barrier)){
				setTimeout(function(){
							self.barrier.finish(self);
						});
			}
		} else {
			setTimeout(function(){
				self.nextCicle();
			});
		}
		self.lastTimestamp=new Date().getTime();
	}
}


class AsyncUtils{
	procesaOfflineDefaultLog(stepInfo){
		stepInfo.log();
	}
	procesaOffline(iIndMin,iIndMax,funcion,sUnidades,callback,callBloque,nSegundos,barrier){
		var offProcesor=new offlineProcesor(iIndMin,iIndMax,funcion,sUnidades,callback,callBloque,nSegundos,barrier);
		setTimeout(function(){
			offProcesor.nextCicle();
		});
	}
	newBarrier(callback){
		return new Barrier(callback);
	}
}
module.exports=AsyncUtils;