'use strict';
var process = require('process');
var BaseUtils=require("./BaseUtils.js");
var StringUtils=require("./StringUtils.js");
var LogUtils=require("./LogUtils.js");

class Chrono{
	constructor(sNombreCompleto,sNombre,nivelAnidamiento,padre){
		var self=this;
		self.nombre=sNombreCompleto;
		self.nombreCorto=sNombre;
		self.acumulado=0;
		self.cronos=[];
		self.profundidad=0;
		self.veces=0;
		self.anidamiento=nivelAnidamiento+0;
		self.padre=padre;
		self.hijos=[];
		self.desperdiciado=0;
	}
}

class processChronos{
	constructor(enabled,withInfoAuxiliar,withNombreCompleto,listaProfundidadMaxima){
		var self=this;
		self.enabled=enabled;
		self.withNombreCompleto=withNombreCompleto;
		self.withInfoAuxiliar=withInfoAuxiliar;
		self.listaProfundidadMaxima;
		self.prependNumCronos=false;
		self.totalCronos=0;
		self.tTotal=0;
		self.cronosOpen=[];
		self.pathChrono="";
		self.allCronos=[];
		self.lastCrono=[];
		self.mapCronos={};
		self.nivelAnidamiento=0;
	}
	prepareNames(nombre,sInfoAuxiliar){
		var sNombreCompleto="";
		var sNombre=nombre;
		if (this.prependNumCronos) {
			sNombre=fillLetrasLeft(5,this.totalCronos)+"_"+sNombre;
		}
		if ((this.withInfoAuxiliar)&&(isDefined(sInfoAuxiliar))){
			sNombre+="_"+sInfoAuxiliar;
		}
		this.nivelAnidamiento++;
		if (this.withNombreCompleto){
			this.totalCronos++;
			this.cronosOpen.push(this.pathChrono);
			sNombreCompleto=this.pathChrono;
			sNombreCompleto+="_"+sNombre;
			this.pathChrono=sNombreCompleto;
		} else {
			sNombreCompleto=sNombre;
		}
		return [sNombre,sNombreCompleto];
	}
	chronoStart(nombre,sInfoAuxiliar){
		var tInicio=new Date().getTime();
		if (!this.enabled) return;
		var arrNames=this.prepareNames(nombre,sInfoAuxiliar);
		var sNombre=arrNames[0];
		var sNombreCompleto=arrNames[1];
		if (isUndefined(this.mapCronos[sNombreCompleto])){
			var padre="";
			if (this.cronosOpen.length>0){
				padre=this.cronosOpen[this.cronosOpen.length-1];
				if (padre!=""){
					padre=this.mapCronos[padre];
				}
			}
			this.mapCronos[sNombreCompleto]=new Chrono(sNombreCompleto,
														sNombre,
														this.nivelAnidamiento,
														padre);
			if (padre!=""){
				padre.hijos.push(this.mapCronos[sNombreCompleto]);
			}
			
			this.allCronos.push(this.mapCronos[sNombreCompleto]);
		}
		var acumCronos=this.mapCronos[sNombreCompleto];
		this.lastCrono.push(acumCronos);
		var cronos=acumCronos.cronos;
		var crono={start:0,desperdiciado:0};
		
		cronos.push(crono);
		if (cronos.length>acumCronos.profundidad){
			acumCronos.profundidad=cronos.length;
		}
		crono.start=new Date().getTime();
		crono.desperdiciado=(crono.start-tInicio);
	}
	chronoStop(nombre){
		var tInicio=new Date().getTime();
		if (!this.enabled) return;

		var sNombre=this.lastCrono.pop().nombre;
		if (isDefined(nombre)){
			var arrNames=this.prepareNames(nombre);
			var sAuxNombre=arrNames[0];
			var sAuxNombreCompleto=arrNames[1];
			if (sAuxNombreCompleto!=sNombre){
				log("Error haciendo Stop. Nombre:"+nombre+" lastCrono:"+sNombre);
			}
			sNombre=sAuxNombreCompleto;
		}
		var sNombreCompleto="";
		this.nivelAnidamiento--;
		if (this.withNombreCompleto){
			sNombreCompleto=this.pathChrono;
			this.pathChrono=this.cronosOpen.pop();
		} else {
			sNombreCompleto=sNombre;
		}
		
		var acumCronos=this.mapCronos[sNombreCompleto];
		acumCronos.veces++;
		
		var cronos=acumCronos.cronos;
		var crono=cronos.pop();
		var timeAct=new Date().getTime();
		var tResult=timeAct-crono.start;
		acumCronos.acumulado+=tResult;
		acumCronos.desperdiciado+=((timeAct-tInicio)+crono.desperdiciado);
		return tResult;
	}
}

class ChronoFactory{
	constructor(){
		var self=this;
		self.chronos=[];
		self.enabled=false;
		self.listaSoloRaices=true;
		self.withNombreCompleto=true;
		self.withInfoAuxiliar=false;
		self.listaProfundidadMaxima=100;
	}
	getChronos(){
		var self=this;
		var sPID=process.pid;
		var pChronos;
		if (isUndefined(self.chronos[sPID])){
			pChronos=new processChronos(self.enabled,self.withInfoAuxiliar,self.withNombreCompleto);
			self.chronos[sPID]=pChronos;
		} else {
			pChronos=self.chronos[sPID];
		}
		return pChronos;
	}
	clearChronos(){
		var sPID=process.pid;
		this.chronos[sPID]=undefinedValue;
	}
	chronoStart(nombre,sInfoAuxiliar){
		this.getChronos().chronoStart(nombre,sInfoAuxiliar);
	}
	chronoStop(nombre){
		this.getChronos().chronoStop(nombre);
	}
	listaCrono(acumCronos){
		if (!this.enabled) return;
		var pChronos=this.getChronos();
		var nMultip=0;
		var porcPadre=0;
		var porcTotal=0;
		var sTabs=" ";
		var padre=acumCronos.padre;
		var iProf=1;
		if (padre!=""){		
			porcPadre=(acumCronos.acumulado/padre.acumulado);
			nMultip=acumCronos.veces/padre.veces;
			var cronoPadre=padre;
			while (cronoPadre!=""){
				iProf++;				
				sTabs+="   ";
				cronoPadre=cronoPadre.padre;
			}
		} 
		porcTotal=acumCronos.acumulado/pChronos.tTotal;
		
		var porcDesp=acumCronos.desperdiciado/pChronos.tTotal;
		var sLog=sTabs+ acumCronos.nombreCorto+
				" ("+acumCronos.veces+")"+
				"\t, Operaciones:\t"+acumCronos.veces+
				"\t, T Desp:\t"+inSeconds(acumCronos.desperdiciado/1000,false)+"\ts \t"
					+ inPercent(porcDesp) +
				"\t, T Acum:\t"+inSeconds(acumCronos.acumulado/1000,false) +"\ts \t" +inPercent(porcTotal)+
				(padre!=""?"\t, % Padre:\t"+ inPercent(porcPadre)+"\t "+" Multip:\t"+nMultip.toFixed(2):"\t\t\t\t") +
				"\t, Rend:\t"+ (acumCronos.veces*1000/acumCronos.acumulado).toFixed(2)+"\t op/s"+
				"\t y \t"+ (acumCronos.acumulado/acumCronos.veces).toFixed(5)+"\t ms/op"+
				"\t, Prf Max:\t"+acumCronos.profundidad+
				"\t, Act:\t"+acumCronos.cronos.length +
				"\t, Anid:\t"+acumCronos.anidamiento ;
		sLog=replaceAll(sLog, "\\.", ","); 
		log(sLog);
		if (iProf<=this.listaProfundidadMaxima) {
			for (var i=0;i<acumCronos.hijos.length;i++){
				this.listaCrono(acumCronos.hijos[i]);
			}
		}
	}
	listar(){
		if (!this.enabled) return;
		var tTotal=0;
		var pChronos=this.getChronos();
		for (var i=0;i<pChronos.allCronos.length;i++){
			var acumCronos=pChronos.allCronos[i];
			if (acumCronos.padre==""){
				tTotal+=acumCronos.acumulado;
			}
		}
		pChronos.tTotal=tTotal;
		log("Listando "+pChronos.allCronos.length +" cronometros ("+(tTotal/1000)+"s)");
/*		this.allCronos.sort(function(a,b){
			if (this.withNombreCompleto) {
				if (a.nombre<b.nombre){
					return -1;
				} else if (a.nombre>b.nombre){
					return +1;
				} 
				return 0;
			} else {
				if (a.acumulado<b.acumulado){
					return 1;
				} else if (a.acumulado>b.acumulado){
					return -1;
				} 
				return 0;
			}
		});
	*/		

		for (var i=0;i<pChronos.allCronos.length;i++){
			var acumCronos=pChronos.allCronos[i];
			var padre=acumCronos.padre;
			if (padre==""){
				this.listaCrono(acumCronos);
			}
		}
	}
}

global.chronoFactory=new ChronoFactory(); 	

class ChronoUtils{
	constructor(){
		log("Creating ChronoUtils");
	}
	chronoStart(sNombre,sExtraInfo){
//		log("Start Chrono:"+sNombre);
		chronoFactory.chronoStart(sNombre,sExtraInfo);
	}
	chronoStop(sNombre){
//		log("Stop Chrono:"+sNombre);
		chronoFactory.chronoStop(sNombre);
	}
	chronoList(acumChronos){
//		log("List Chronos");
		if (isDefined(acumChronos)){
			chronoFactory.listaCrono(acumChronos);
		} else {
			chronoFactory.listar();
		}
	}
	chronoEnable(){
		chronoFactory.enabled=true;
	}
	chronoDisable(){
		chronoFactory.enabled=false;
	}
}

module.exports=ChronoUtils;