'use strict';

class procedimientos{
	constructor(dynobjBase){
		dynobjBase.funciones.add("genEstadisticas",this.genEstadisticas);
	}
	procedimientos.funciones.add("genEstadisticas",function(){
		log("listando Estadisticas del Procedimiento:"+this.id);
		var i=0;
		var estadisticasTotales=factoriaHashMaps.newHashMap();
		var estadisticasDiarias=factoriaHashMaps.newHashMap();
		var impCarga=0.0;
		var impCoste=0.0;
		var diasMes=[31,28,31,30,31,30,31,31,30,31,30,31];
		var sCad="";
	/*	for (var iMes=0;iMes<12;iMes++){
			for (var iDia=0;iDia<diasMes[iMes];iDia++){
				sCad=fillLetrasLeft(2,iMes+"","0");
				sCad+="/";
				sCad+=fillLetrasLeft(2,iDia+"","0");
				estadisticasDiarias.add(sCad,0);
			}
		}*/
		var fMin="2030-12-31";
		var fMax="0000-01-01";
		fMin=toDateNormalYYYYMMDD(fMin);
		fMax=toDateNormalYYYYMMDD(fMax);

		this.getDocumentos().recorrer(function(docAux){
			var fecha=docAux.fecha;
			if (fMin>fecha){
				fMin=fecha;
			}
			if (fMax<fecha){
				fMax=fecha;
			}
		});
		var hsTrabajo=factoriaHashMaps.newHashMap();
		var fAux=fMin;
		var sFecha="";
		while (fAux<fMax){
			sFecha=formatDate(fAux,6);
			hsTrabajo.add(sFecha,{id:sFecha,valor:factoriaHashMaps.newHashMap()});
			fAux=dateAdd(fAux, "day", 1);
		}
		
		this.getDocumentos().recorrer(function(docAux){
			var doc=docAux.objeto;
			impCarga=doc.getCarga();
			impCoste=doc.getCoste();
			
			var tipoDoc=doc.getTipo().id;
			var sClave=tipoDoc;
			var proc=doc.getProcedimientos();
			var proc=proc.getPrimero();
			if (proc!=""){
				sClave=proc.clave+"-"+sClave;
			}
			var orgs=doc.getOrganismos();
			var org=orgs.getPrimero();
			if (org!=""){
				sClave=sClave+" "+org.valor.nombre;
			}
			sClave=doc.getTipo().id;
			var dato=estadisticasTotales.getValor(sClave);
			if (dato==""){
				estadisticasTotales.add(sClave,{id:sClave,valor:1,carga:impCarga,coste:impCoste});
			} else {
				dato.valor++;
				dato.carga+=impCarga;
				dato.coste+=impCoste;
			}
			var fechaDoc=doc.getFecha();
			var sFecha=formatDate(fechaDoc,6);
			if (sFecha==""){
				log("Documento sin Fecha");
			}
			var hsTipos=estadisticasDiarias.getValor(sFecha);
			if (hsTipos==""){
				hsTipos=factoriaHashMaps.newHashMap();
				estadisticasDiarias.add(sFecha,{fecha:sFecha,tipos:hsTipos});
			} else {
				hsTipos=hsTipos.tipos;
			}
			var vValor=hsTipos.getValor(sClave);
			if (vValor==""){
				hsTipos.add(sClave,{id:sClave,valor:1});
			} else {
				vValor.valor++;
			}
			
			if (tipoDoc=="Solicitud"){
				doc.getFases().recorrer(function(auxFase){
					fFecha=auxFase.fecha;
					sFecha=formatDate(fFecha,6);
					hsValores=hsTrabajo.getValor(sFecha);
				});
			}
		});
		return {totales:estadisticasTotales,diarias:estadisticasDiarias};
	}
	getEstadisticas(hsProcedimientos){
		log("listando Estadisticas de todos los Procedimientos");
		var hsProcs=this.listado;
		if (typeof hsProcedimientos!=="undefined"){
			hsProcs=hsProcedimientos;
		}
		var contabilidad=factoriaHashMaps.newHashMap();
		var estadisticas={totales:newHashMap(),diarias:newHashMap(),contabilidad:contabilidad};
		hsProcs.recorrer(function(procAux){
			var auxEstd=procAux.genEstadisticas();
			contabilidad.add(procAux.id,auxEstd.contabilidad);
			auxEstd.totales.recorrer(function(dato){
				estadisticas.totales.add(dato.id,dato);
			});
			auxEstd.diarias.recorrer(function(dato){
				var hsTipos=estadisticas.diarias.getValor(dato.fecha);
				if (hsTipos==""){
					hsTipos=factoriaHashMaps.newHashMap();
					estadisticas.diarias.add(dato.fecha,dato);
				} else {
					dato.tipos.recorrer(function (estTipo){
						var vTotal=hsTipos.tipos.getValor(estTipo.id);
						if (vTotal==""){
							hsTipos.tipos.add(estTipo.id,estTipo);
						} else {
							vTotal.valor+=estTipo.valor;
						}
					});
				}
			});
		});
		estadisticas.totales.balancear();
		estadisticas.diarias.balancear();
		return estadisticas;
	}
}
module.exports=Procedimientos;
