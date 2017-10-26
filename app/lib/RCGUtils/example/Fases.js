'use strict';

class Fases{
	constructor(dynobjBase){
		dynobjBase.nuevaFase=this.nuevaFase;
		dynobjBase.simularFase=this.simularFase;
		dynobjBase.simular=this.simular;
	}
	nuevaFase(idTipo,procedimiento,nombre){
			var tipos=this.getParentAttribute("tipos");
			var sTipo="";
			if (tipos!=""){
				sTipo=tipos.attribute.getNombre(idTipo);
			}
			var fncNuevoTipo=this.getParentMethod("nuevo"+sTipo);
			var objFase="";
			if (fncNuevoTipo!=""){
				objFase=fncNuevoTipo.object["nuevo"+sTipo](procedimiento,nombre);
			}
			return objFase;
	}

	simularFase(sAnio){
		logClear();
		chronoStartFunction("Simulacion Fase:"+this.nombre);
		
	/*	var iNivel=0;
		if (typeof iNivelIndex!=="undefined"){
			iNivel=iNivelIndex;
		}
	*/	var sEspacios="";
	/*	for (var i=0;i<iNivel;i++){
			sEspacios+=" ";
		}
	*/	log(sEspacios+"Simulando "+this.id+" - "+this.nombre);
		if (this.getAplica()!="SI"){
			log("NO APLICA");
			chronoStopFunction();
			return;
		}
		//
		var procedimiento=this.getProcedimiento();
		var organismo=this.getOrganismo();
		if (organismo==""){
			organismo=procedimiento.getOrganismo();
		}
		var fechaInicio=this.getFechaInicio();
		var fechaFin=this.getFechaFin();
		if (fechaInicio!=""){
			fechaInicio=fechaInicio+"/"+sAnio;
			fechaInicio=toDateNormalDDMMYYYYHHMMSS(fechaInicio);
		}
		if (fechaFin!=""){
			fechaFin=fechaFin+"/"+sAnio;
			fechaFin=toDateNormalDDMMYYYYHHMMSS(fechaFin);
		}
		var duracion=this.getDuracion();
		if (duracion==""){
			duracion=0;
		} else {
			duracion=Math.round(parseFloat(duracion));
		}
		
		var trasUltimo=this.getTrasElUltimo();
		if (trasUltimo=="SI"){
			trasUltimo=true;
		} else {
			trasUltimo=false;
		}
		var espera=this.getEspera();
		if (espera==""){
			espera=0;
		} else {
			espera=Math.round(parseFloat(espera));
		}
		
	    // tipo de documento
		var tipoDocResult=this.getTipoResultado();
//		var subTipoDocResult=this.getSubTipoResultado();
			
		// numero de documentos
		var bSoloUnResultado=this.getSoloUnResultado();
		var bUnResultadoPorReferencia=this.getUnResultadoPorReferencia();
		var nResultados=this.getNumDocumentosResultado();
		if (bSoloUnResultado=="SI"){
			bSoloUnResultado=true;
		} else if (bUnResultadoPorReferencia=="SI"){
			bUnResultadoPorReferencia=true;
		}
		
		// ajustando la fecha de inicio y la fecha de fin.
		if ((trasUltimo)||(bSoloUnResultado)){
	/*		var objResult={
				numero:numResult,
				porcentaje:porcResult,
				documentos:lstDocsResult,
				documentosReferencia:lstDocsOrigen,
				sinDocumentos:bSinDocs
			};
	*/		
			var fechaMax=0;
			nResultados.documentosReferencia.recorrer(function(docAux){
				var doc=docAux.objeto;
				var auxFases=doc.getFases();
				if (auxFases!=""){
	/*				auxFases.recorrer(function(auxFase){
						log(auxFase.fecha+" "+auxFase.objeto.nombre);
					});*/
					var fase=auxFases.getUltimo().valor;
					if (fase.fecha>fechaMax){
						fechaMax=fase.fecha;
					}
				} else if (docAux.fecha>fechaMax){
					fechaMax=docAux.fecha;
				}
			});
			fechaInicio=fechaMax;
			fechaInicio=dateAdd(fechaInicio, "day", espera);
			fechaFin=dateAdd(fechaInicio, "day", duracion);
		} 
		
		var docAux;
		var adjAux;
		var nAdjuntos=this.getAdjunto();
		nAdjuntos=nAdjuntos.numero;
		log("Resultados a generar:"+nResultados.numero+ " Docs estimados:"+(nAdjuntos*nResultados.numero));
		var nDocsTotal=0;
		var nDocsAnt=0;
		var nBloques=0;
		var i=0;
		var me=this;
		this.getDocumentos().vaciar();
		var docResult;
		var nAcciones=nResultados.numero;
		var bPrimero=true;
		var hsIndicesSeleccionados=factoriaHashMaps.newHashMap();
		if (bSoloUnResultado){
			nAcciones=nResultados.documentosReferencia.length();
		}
		var fncCrearResultados=function(objStep){
			chronoStart("CreandoResultados_bloque");
			i=objStep.indice-1;
			if (bSoloUnResultado){
				if (bPrimero){
					docAux=documentos.nuevo(tipoDocResult.nombre);
					bPrimero=false;
					docAux.setTipo(tipoDocResult);
					docAux.addProcedimiento(procedimiento);
					docAux.addOrganismo(organismo);
					nAdjuntos=me.getAdjunto().numero;
					docAux.setAdjunto(nAdjuntos);
					vFecha=(Math.random()*(fechaFin.getTime()-fechaInicio.getTime()))+fechaInicio.getTime();
					vFecha=new Date(vFecha);
					var sFecha=formatDate(vFecha,6);
					if (sFecha==""){
						log("Documento sin Fecha");
					}
					var sFecha=formatDate(vFecha,6);
					if (sFecha==""){
						log("Documento sin Fecha");
					}
					docAux.addFase({id:docAux.id,fecha:vFecha,objeto:me});
					docAux.setFecha(vFecha);
					procedimiento.addDocumento({id:docAux.id,fecha:vFecha,objeto:docAux});
					me.addDocumento({id:docAux.id,fecha:vFecha,objeto:docAux});
					docAux.updateFormato();
					docResult=docAux;
				} else {
					docAux=docResult;
				}
				var nodAux="";
				nodAux=nResultados.documentos.findByInd(i);
				if (nodAux==""){
					log("No hay referencia para:"+i);
					nodAux=nResultados.documentos.findByInd(i);
				} else {
					vFecha=docAux.getFecha();
				}
				nodAux.objeto.addFase({id:docAux.id,fecha:vFecha,objeto:me});
			} else {
				docAux=documentos.nuevo(tipoDocResult.nombre);
				docAux.setTipo(tipoDocResult);
				docAux.addProcedimiento(procedimiento);
				docAux.addOrganismo(organismo);
				//docAux.setSubTipo()
				nAdjuntos=me.getAdjunto().numero;
				docAux.setAdjunto(nAdjuntos);
	/*			for (var j=0;j<nAdjuntos;j++){
					chronoStart("CreandoAdjunto");
					adjAux=documentos.nuevo(tipoDocResult.nombre);
					nDocsTotal++;
					adjAux.setTipo(tiposDocumento.getById("Adjunto"));
					docAux.addAdjunto(adjAux);
					chronoStop();
				}
				*/
				var vFecha;
				var nodAux="";
				if (nResultados.documentos.length()>0){
					nodAux=nResultados.documentos.findByInd(i);
					if (nodAux==""){
						log("No hay referencia para:"+i);
						nodAux=nResultados.documentos.findByInd(i);
					} else {
						vFecha=nodAux.fecha;
						if (!trasUltimo){
							fechaInicio=dateAdd(vFecha, "day", espera);
							fechaFin=dateAdd(fechaInicio, "day", duracion);
						}
					}
				}
				
				if ((trasUltimo)||((fechaInicio!="")&&(fechaFin!=""))){
					vFecha=(Math.random()*(fechaFin.getTime()-fechaInicio.getTime()))+fechaInicio.getTime();
					vFecha=new Date(vFecha);
					var sFecha=formatDate(vFecha,6);
					if (sFecha==""){
						log("Documento sin Fecha");
					}
				} 
				var sFecha=formatDate(vFecha,6);
				if (sFecha==""){
					log("Documento sin Fecha");
				}

				if (nodAux!=""){
					nodAux.objeto.addFase({id:docAux.id,fecha:vFecha,objeto:me});
				}
				docAux.addFase({id:docAux.id,fecha:vFecha,objeto:me});
				docAux.setFecha(vFecha);
				procedimiento.addDocumento({id:docAux.id,fecha:vFecha,objeto:docAux});
				me.addDocumento({id:docAux.id,fecha:vFecha,objeto:docAux});
				docAux.updateFormato();
			}
			chronoStop();
		}
		var fncFinBucle=function(objStep){
				procedimiento.getDocumentos().balancear();
				me.getDocumentos().balancear();
				chronoStop(); // fin del chronometro de la fase
		}
		factoriaHashMaps.bucleAsync("Crea Resultados",0,nAcciones,fncCrearResultados,fncFinBucle,false);
	}
	simular(sAnio,hsProcedimientosIncluidos,callback){
		chronoStart("Simulacion Completa"+this.nombre);
		var hsProcs=hsProcedimientosIncluidos;
		var cbkFinSimular=callback;
		var sAnioSim="2017";
		if (typeof sAnio!=="undefined"){
			sAnioSim=sAnio;
		}
		documentos.vaciar();
		hsProcs.recorrer(function(auxProc){
			auxProc.getDocumentos().vaciar();
			auxProc.getExpedientes().vaciar();
		});
		// funcion a ejecutar en cada nodo
		var fncFinSimulacion=function(objStep){
					log("fin del recorrer asinchrono");
					chronoStop();
					chronometros.listar();
					if (typeof cbkFinSimular!=="undefined"){
						cbkFinSimular();
					}
		}

		var fncSimulaFase=function(objStep){
				var fase=objStep.valor;
				var proc=fase.getProcedimiento();
				if (hsProcs.exists(proc.id)){
					fase.simular(sAnioSim);
				}
			};

		this.listado.recorrerAsync("SimularFases",fncSimulaFase,fncFinSimulacion,false);

	}
	simularFasesSiguientes(faseAct){
		chronometros.listar();
		var faseAnt=faseAct.getFaseAnterior();
		var bProcesandoHermana=false;
		if (faseAnt!=""){
			var fasesHermanas=faseAnt.getFasesSiguientes();
			var nFasesHermanas=fasesHermanas.length();
			if (nFasesHermanas>1){
				var auxFase=fasesHermanas.getPrimero();
				var nFaseAct=0;
				while ((auxFase.valor!=faseAct)&&(nFaseAct<nFasesHermanas)){ // saltamos las hermanas ya procesadas
					auxFase=auxFase.siguiente;
					nFaseAct++;
				}
				if (auxFase.valor==faseAct){ // si ha encontrado la actual entre las hermanas
					if (auxFase.siguiente!=""){ // y hay una hermana siguiente
						auxFase.siguiente.valor.simular();//(iNivel+1); // se simula la siguiente hermana
						return;
					}
				}
				
			}
		}
		// si no habia hermanas que procesar... se procesa la siguiente fase.
		var nextFases=faseAct.getFaseSiguientes();
		if (nextFases.length()>0){
			var auxFase=nextFases.getPrimero().valor;
			auxFase.simular();//(iNivel+1);
		}
	}


	simularRecepcionSolicitudes(fase){
		log("simular Recepción Solicitudes");
		var proc=fase.getProcedimiento();
		var nSolicitudes=proc.getNumSolicitudes();
//		nSolicitudes=400000;
		log("Procesando Recepcion de solicitudes -> "+ proc.id + " Solicitudes a generar:"+nSolicitudes);
		var iNuevasSolicitud=0
		var nTotalAdjuntos=0;
		
		var fncOperacion=function(){
			var nAdjuntos=0;
			chronoStart("NumDocumentos");
			nAdjuntos=proc.getNumDocumentos();
			chronoStop();
			chronoStart("NuevaSolicitud");
			var auxSol=documentos.nuevoSolicitud(fase,"Solicitud_"+iNuevasSolicitud);
			chronoStop();
			chronoStart("NuevoAdjunto");
			for (var j=0;j<nAdjuntos;j++){
				var auxAdj=auxSol.nuevoAdjunto("Adjunto_"+j);
			}
			chronoStop();
		}
		procesaOffline(0,nSolicitudes,fncOperacion,"Solicitudes",function(){
							var fnc=this.factoria.simularFasesSiguientes(fase);
						});
	}
	simularCrearExpediente(fase){
		var proc=fase.getProcedimiento();
		log("Procesando Creacion de Expediente -> "+ proc.id);
		
	}

	/*fases.procesarAportacion=function(fase){
	}
	fases.procesarPeticionDatosIntermediados=function(fase){
	fases.procesarComprobacionDocumentacion=function(fase){
	fases.procesarNotificacion=function(fase){
	fases.procesarSubsanacion=function(fase){
	fases.procesarInforme=function(fase){
	fases.procesarPropuestaResolucion=function(fase){
	fases.procesarAlegacion=function(fase){
	fases.procesarResolucion=function(fase){
	fases.procesarRecurso=function(fase){
	*/

	// operaciones específicas en funcion del tipo de fase
	/*
	fases.nuevoRecepcionSolicitudes=function(procedimiento,nombre){
		var newFase=this.nuevoRecepcionSolicitudes_interno(procedimiento,nombre);
		return newFase;
	}
	fases.nuevoAportacion=function(codProc,nombre){
		var sTipoFase="Aportacion";
		var newFase=this.nuevo(nombre,this.getNewId(codProc+"_"+sTipoFase));
		newFase.setTipo(5);
		return newFase;
	}
	fases.nuevoPeticionDatosIntermediados=function(codProc,nombre){
		var sTipoFase="PeticionDatosIntermediados";
		var newFase=this.nuevo(nombre,this.getNewId(codProc+"_"+sTipoFase));
		newFase.setTipo(6);
		return newFase;
	}
	fases.nuevoComprobacionDocumentacion=function(codProc,nombre){
		var sTipoFase="ComprobacionDocumentacion";
		var newFase=this.nuevo(nombre,this.getNewId(codProc+"_"+sTipoFase));
		newFase.setTipo(6);
		return newFase;
	}
	fases.nuevoNotificacion=function(codProc,nombre){
		var sTipoFase="Notificacion";
		var newFase=this.nuevo(nombre,this.getNewId(codProc+"_"+sTipoFase));
		newFase.setTipo(1);
		return newFase;
	}
	fases.nuevoSubsanacion=function(codProc,nombre){
		var sTipoFase="Subsanacion";
		var newFase=this.nuevo(nombre,this.getNewId(codProc+"_"+sTipoFase));
		newFase.setTipo(2);
		return newFase;
	}
	fases.nuevoInforme=function(codProc,nombre){
		var sTipoFase="Informe";
		var newFase=this.nuevo(nombre,this.getNewId(codProc+"_"+sTipoFase));
		newFase.setTipo(3);
		return newFase;
	}
	fases.nuevoPropuestaResolucion=function(codProc,nombre){
		var sTipoFase="PropuestaResolucion";
		var newFase=this.nuevo(nombre,this.getNewId(codProc+"_"+sTipoFase));
		newFase.setTipo(6);
		return newFase;
	}
	fases.nuevoAlegacion=function(codProc,nombre){
		var sTipoFase="Alegacion";
		var newFase=this.nuevo(nombre,this.getNewId(codProc+"_"+sTipoFase));
		newFase.setTipo(4);
		return newFase;
	}
	fases.nuevoResolucion=function(codProc,nombre){
		var sTipoFase="Resolucion";
		var newFase=this.nuevo(nombre,this.getNewId(codProc+"_"+sTipoFase));
		newFase.setTipo(6);
		return newFase;
	}
	fases.nuevoRecurso=function(codProc,nombre){
		var sTipoFase="Recurso";
		var newFase=this.nuevo(nombre,this.getNewId(codProc+"_"+sTipoFase));
		newFase.setTipo(6);
		return newFase;
	}
	*/
	childConstructor(){
		// this es el objeto nuevo que se construye en una funcion nuevo();
		var obj=this;
		obj.factoria.executeParentMethod("childConstructor");
		obj.simular=this.factoria.simularFase;
	}


}

module.exports=Fases;

