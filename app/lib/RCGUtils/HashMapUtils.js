'use strict';
/*
Libraries are allready loaded
var BaseUtils=require("./BaseUtils.js");
var StringUtils=require("./StringUtils.js");
var LogUtils=require("./LogUtils.js");
var AsyncUtils=require("./AsyncUtils.js");
var ChronoUtils=require("./ChronoUtils.js");
*/

class FactoriaHashMaps{
		constructor(){
			this.nHashCreated=0;
			this.pilaAsyncCalls="";
			
		}
		newHashMap(){
			this.nHashCreated++;
			var obj={
				    raiz:"",
					nodoCache:"",
					nNodos:0}
			obj.getPrimero=this.getPrimero;
			obj.getUltimo=this.getUltimo;
			obj.resetNodo=this.resetNodo;
			obj.interno_nodo_getNumHijos=this.interno_nodo_getNumHijos;
			obj.interno_nodo_getPrimero=this.interno_nodo_getPrimero;
			obj.interno_nodo_getUltimo=this.interno_nodo_getUltimo;
			obj.nuevoNodoVacio=this.nuevoNodoVacio;
			obj.nuevoNodo=this.nuevoNodo;
			obj.borradoLogico=this.borradoLogico;
			obj.findMaxClave=this.findMaxClave;
			obj.findMinClave=this.findMinClave;
			obj.findPos=this.findPos;
			obj.getValor=this.getValor;
			obj.setValor=this.setValor;
			obj.getValorByAttr=this.getValorByAttr;
			obj.exists=this.exists;
			obj.find=this.find;
			obj.findByInd=this.findByInd;
			obj.internal_updatePrimeroUltimo=this.internal_updatePrimeroUltimo;
			obj.updatePrimeroUltimo=this.updatePrimeroUltimo;
			obj.refreshNumHijos=this.refreshNumHijos;
			obj.updateNumHijos=this.updateNumHijos;
			obj.traza=this.traza;
			obj.trazaTodo=this.trazaTodo;
			obj.recorrer=this.recorrer;
			obj.recorrerAsync=this.recorrerAsync;
			obj.comprobar=this.comprobar;
			obj.vaciar=this.vaciar;
			obj.balancear_acumulaNodos=this.balancear_acumulaNodos;
			obj.balancear=this.balancear;
			obj.push=this.push;
			obj.pop=this.pop;
			obj.top=this.top;
			obj.add=this.add;
			obj.addOrReplace=this.addOrReplace;
			obj.addNodo=this.addNodo;
			obj.changePadre=this.changePadre;
			obj.remove=this.remove;
			obj.length=this.length;
			
			return obj;
		}
		resetNodo(nodo){
				nodo.clave="";
				nodo.valor="";
				nodo.derecha="";
				nodo.izquierda="";
				nodo.anterior="";
				nodo.siguiente="";
				nodo.primero="";
				nodo.ultimo="";
				nodo.padre="";
				nodo.hermanos=[];
		//		nodo.keyInd=0;
				nodo.nHijos=0;
				nodo.getNumSubNodos=this.interno_nodo_getNumHijos;
				nodo.getPrimero=this.interno_nodo_getPrimero;
				nodo.getUltimo=this.interno_nodo_getUltimo;
				nodo.factoria=this;

		//		nodo.borrado=true;
			}
		interno_nodo_getPrimero(){
			if (this.primero!=""){
				return this.primero;
			} else {
				return this;
			}
		}
		interno_nodo_getUltimo(){
			var vUltimo="";
			if (this.ultimo!=""){
				vUltimo=this.ultimo;
			} else {
				vUltimo=this;
			}
			if (vUltimo.hermanos.length>0){
				vUltimo=vUltimo.hermanos[vUltimo.hermanos.length-1];
			}
			return vUltimo;
		}
		getPrimero(){
			if (this.nNodos==0){
				return "";
			} else if (this.nNodos==1){
				return this.raiz;
			} else if (this.raiz.primero==""){
				return this.raiz;
			} else {
				return this.raiz.primero;
			}
		}
		getUltimo(){
			if (this.nNodos==0){
				return "";
			} else if (this.nNodos==1){
				return this.raiz;
			} else if (this.raiz.ultimo==""){
				return this.raiz;
			} else {
				return this.raiz.ultimo;
			}
		}

		interno_nodo_getNumHijos(){
				var numHijos=(this.nHijos+this.hermanos.length);
		/*		chronoStart(arguments.callee.name,this.clave+"["+numHijos+"]");
				chronoStopFunction();
		*/		return numHijos;
			}
		length(){
			if (this.raiz==""){
				return 0;
			} else {
				return this.raiz.getNumSubNodos()+1;
			}
		}
		nuevoNodoVacio(){
				var nodo={};
				this.resetNodo(nodo);
		/*		nodo.resetNodo=this.resetNodo;
				nodo.findMaxClave=this.findMaxClave;
				nodo.findMinClave=this.findMinClave;
				nodo.findPos=this.findPos;
				nodo.find=this.find;
				nodo.updateUltimo=this.updateUltimo;
				nodo.updatePrimero=this.updatePrimero;
		*/
				return nodo;
			}
		nuevoNodo(clave,valor){
				var auxNodo;
		/*		if (this.indVacios.length>0){
					var indElem=this.indVacios.pop();
					auxNodo=this.elementos[indElem];
					auxNodo.resetNodo();
					auxNodo.keyInd=indElem;
				} else {
		*/			auxNodo=this.nuevoNodoVacio();
		//			this.elementos.push(auxNodo);
		//			auxNodo.keyInd=this.nNodos;
					this.nNodos++;
		//		}
				auxNodo.clave=clave;
				auxNodo.valor=valor;
				auxNodo.borrado=false;
				return auxNodo;
			}
		borradoLogico(nodo){
		//		chronoStart(arguments.callee.name,nodo.clave);
				//this.indVacios.push(nodo.keyInd);  // marca el elemento como borrado
				//nodo.borrado=true;
				
				this.updateNumHijos(nodo.padre,-(1+nodo.hermanos.length));
				this.nNodos-=(1+nodo.hermanos.length);
		//		chronoStopFunction();
			}
		findMaxClave(){
				var auxNodo=this;
				while (true){
					if (auxNodo.ultimo!=""){
						return auxNodo.ultimo.clave;
					} else if (auxNodo.derecha!=""){
						auxNodo=auxNodo.derecha;
					} else {
						return auxNodo.clave;
					}
				}
			}
		findMinClave(){
				var auxNodo=this;
				while (true){
					if (auxNodo.primero!=""){
						return auxnodo.primero.clave;
					} else if (auxNodo.izquierda!=""){
						auxNodo=auxNodo.izquierda;
					} else {
						return auxNodo.clave;
					}
				}
			}
		findPos(clave,nodoInicio){
				if (this.nNodos==0) return "";
				chronoStartFunction();
				if (this.nodoCache!=""){
					if (this.nodoCache.clave==clave){
						chronoStopFunction();
						return this.nodoCache;
					}
				}
				var auxNodo=this.raiz;
				if (typeof nodoInicio!=="undefined"){
					auxNodo=nodoInicio;
				}
				var antUltimo="";
				var antPrimero="";
				while (true) { 
					if (auxNodo.clave==clave){
						this.nodoCache=auxNodo;
						chronoStopFunction();
						return auxNodo;
					}
					if ((auxNodo.ultimo!="")&& (auxNodo.ultimo!=antUltimo)) {
						if ((auxNodo.ultimo.clave==clave)||(auxNodo.ultimo.clave<clave)){
							chronoStopFunction();
							this.nodoCache=auxNodo.ultimo;
							return auxNodo.ultimo;
						}
						antUltimo=auxNodo.ultimo;
					} 
					if ((auxNodo.primero!="")&& (auxNodo.primero!=antPrimero)) {
						if ((auxNodo.primero.clave==clave)||(auxNodo.primero.clave>clave)){
							chronoStopFunction();
							this.nodoCache=auxNodo.primero;
							return auxNodo.primero;
						}
						antPrimero=auxNodo.primero;
					} 
					if (auxNodo.clave<clave){
						if (auxNodo.derecha!=""){
							auxNodo=auxNodo.derecha;
						} else {
							chronoStopFunction();
							this.nodoCache=auxNodo;
							return auxNodo;
						}
					} else {
						if (auxNodo.izquierda!=""){
							auxNodo=auxNodo.izquierda;
						} else {
							chronoStopFunction();
							this.nodoCache=auxNodo;
							return auxNodo;
						}
					}
				}
			}
		find(clave){
				var pos=this.findPos(clave);
				if (pos.clave==clave){
					return pos;
				} else {
					return "";
				}
			}
		exists(clave){
				var pos=this.findPos(clave);
				if (pos.clave==clave){
					return true;
				} else {
					return false;
				}
			}
		getValor(clave){
				var pos=this.findPos(clave);
				if (pos.clave==clave){
					return pos.valor;
				} else {
					return "";
				}
			}
		setValor(clave,newValue){
			var pos=this.findPos(clave);
			if (pos.clave==clave){
				pos.valor=newValue;
			} else {
				add(clave,newValue);
			}
		}
		getValorByAttr(nombreFuncionAtributo,valorBuscado){
			var arrResults=[];
			var nodAux=this.getPrimero();
			var valAux;
			while (nodAux!=""){
				valAux=nodAux.valor;
				if (typeof valAux[nombreFuncionAtributo]!=="undefined"){
					var vAux=valAux[nombreFuncionAtributo]();
					if (vAux.id==valorBuscado){
						arrResults.push(valAux);
					}
				}
				nodAux=nodAux.siguiente;
			}
			return arrResults;
		}
		findByInd(ind,nodo){
				chronoStartFunction();
				var nodAux=this.raiz;
				if (typeof nodo!=="undefined"){
					nodAux=nodo;
				}
				var indAux=ind;
				var bEncontrado=false;
				var nodoResult;
				var vResult="";
				while (!bEncontrado) {
					var nNodosTotal=nodAux.getNumSubNodos();
					if (indAux>nNodosTotal){  // si se pasa de la lista se devuelve true.
						bEncontrado=true;
					} else if (indAux==0){
						bEncontrado=true;
						nodAux=nodAux.getPrimero();
						vResult=nodAux.valor;
					} else if (indAux==(nNodosTotal)){ // is es el último
						bEncontrado=true;
						nodoResult=nodAux.ultimo;
						if (nodoResult==""){
							nodoResult=nodAux;
						}
						if (nodoResult.hermanos.length>0){
							vResult=nodoResult.hermanos[nodoResult.hermanos.length-1].valor;
						} else {
							vResult=nodoResult.valor;
						}
					} else if (nodAux.izquierda!=""){
						nNodosTotal=nodAux.izquierda.getNumSubNodos();
						if (indAux<=nNodosTotal){ // si el indice es menor que todos los nodos a la izquierda
							nodAux=nodAux.izquierda;
						} else { // si el indice es mayor que todos los nodos a la izquierda
								 // se los restamos
							indAux-=(nNodosTotal+1);
							if (indAux<=nodAux.hermanos.length){ // si el nuevo indice es menor que el numero de hermanos
																// se devuelve el hermano
								if (indAux==0){
									vResult=nodAux.valor;
								} else {
									vResult=nodAux.hermanos[indAux-1].valor;
								}
								bEncontrado=true; // lo ha encontrado
							} else if (nodAux.derecha!=""){ // ahora se va a ir por la derecha
								indAux-=(nodAux.hermanos.length+1);
								nodAux=nodAux.derecha;
							} else {
								bEncontrado=true;
							}
						}
					} else if (nodAux.izquierda==""){
						if (indAux<=nodAux.hermanos.length){ // si el nuevo indice es menor que el numero de hermanos
															// se devuelve el hermano
							if (indAux==0){
								vResult=nodAux.valor;
							} else {
								vResult=nodAux.hermanos[indAux-1].valor;
							}
							bEncontrado=true; // lo ha encontrado
						} else if (nodAux.derecha!=""){ // ahora se va a ir por la derecha
							indAux-=(nodAux.hermanos.length+1);
							nodAux=nodAux.derecha;
						} else {
							bEncontrado=true;
						}
					}
				}
				chronoStopFunction();
				return vResult;
			}
		internal_updatePrimeroUltimo(nodo,sNombreCampo,sNombreSubNodo){
				if (nodo=="") return;
				chronoStartFunction(nodo.clave+"["+nodo.nHijos+"]");
				var antValor=nodo[sNombreCampo];
				var auxSubNodo=nodo[sNombreSubNodo];
				var nombreCampoSubNodo=auxSubNodo[sNombreCampo];
				var bDifiere=false;
				if (auxSubNodo==""){ // no tiene izda/decha
					nodo[sNombreCampo]="";
					bDifiere=(antValor!="");
				} else if (nombreCampoSubNodo==""){ // izda/decha.prim/ult ==""
					nodo[sNombreCampo]=auxSubNodo;
					bDifiere=(antValor!=auxSubNodo);
				} else {
					nodo[sNombreCampo]=nombreCampoSubNodo;
					bDifiere=(antValor!=nombreCampoSubNodo);
				}
				chronoStopFunction();
				return bDifiere;
			}
		updatePrimeroUltimo(nodo){
				if (nodo=="") return;
				chronoStartFunction(nodo.clave+"["+nodo.nHijos+"]");
				var raiz=nodo.factoria.raiz;
				var bUpdatePadre=true;
				var auxNodo=nodo;
				var bDifiere=false;
				bDifiere=this.internal_updatePrimeroUltimo(auxNodo,"primero","izquierda");
				bDifiere=this.internal_updatePrimeroUltimo(auxNodo,"ultimo","derecha") || bDifiere;
				var antNodo=auxNodo;
				auxNodo=auxNodo.padre;
				var iProf=0;
				while (bUpdatePadre){
					iProf++;
					if (auxNodo=="") {
						bUpdatePadre=false;
					} else {
						bDifiere=false;
						
						if (antNodo==auxNodo.izquierda){
							bDifiere=this.internal_updatePrimeroUltimo(auxNodo,"primero","izquierda");
						} else if (antNodo==auxNodo.derecha){
							bDifiere=this.internal_updatePrimeroUltimo(auxNodo,"ultimo","derecha");
						}
						
						if (bDifiere){
							antNodo=auxNodo;
							auxNodo=auxNodo.padre;
						} else {
							bUpdatePadre=false;
						}
					}
				}
				if (iProf>4){
					var nHijos=raiz.factoria.nNodos;
					var iProfMax=Math.log2(nHijos);
					if ((iProf/iProfMax)>1.5){
						raiz.factoria.balancear();
					}
				}
				chronoStopFunction();
			}
		refreshNumHijos(nodo){
				if (nodo=="") return;
				chronoStartFunction(nodo.clave+"_["+nodo.nHijos+"] H:"+nodo.hermanos.length+1);
				var antHijos=nodo.nHijos;
				nodo.nHijos=0;
				if (nodo.izquierda!=""){
					nodo.nHijos+=(nodo.izquierda.getNumSubNodos()+1);
				}
				if (nodo.derecha!=""){
					nodo.nHijos+=(nodo.derecha.getNumSubNodos()+1);
				}	
				chronoStopFunction();
		//		chronoStart(arguments.callee.name,"FINAL_"+nodo.clave+"_["+nodo.nHijos+"] H:"+nodo.hermanos.length+1);
		//		chronoStopFunction();
			}
		updateNumHijos(nodo,diferencial){
				var nodoAux=nodo;
				while (nodoAux!=""){
		//			chronoStart(arguments.callee.name,nodoAux.clave+
		//						"("+diferencial+") ["+nodoAux.nHijos+"-->"+(nodoAux.nHijos+diferencial)+"]");
					nodoAux.nHijos+=diferencial;
					nodoAux=nodoAux.padre;
		//			chronoStopFunction();
				}
			}
		traza(nodo,iProf,sIoD,callValor){
				if (nodo=="") return;
				var iDeep=0;
				if (typeof iProf!=="undefined"){
					iDeep=iProf;
				}
				var sLeft="";
		/*		if (sIoD=="I"){
					sLeft+="|-- ";
				} else {
					sLeft+="--- ";
				}*/
				var pNodoAux=nodo.padre;
				var hNodoAux=nodo;
				var pathNodo=[];
				for (var i=0;((i<iDeep)&&(pNodoAux!=""));i++){
					pathNodo.push([pNodoAux,hNodoAux]);
					if (pNodoAux==""){
						
					}
					hNodoAux=pNodoAux;
					pNodoAux=pNodoAux.padre;
				}
				var auxPath;
				var bTieneDerecha=false;
				var bEsIzquierda=true;
				while (pathNodo.length>0){
					auxPath=pathNodo.pop();
					pNodoAux=auxPath[0];
					hNodoAux=auxPath[1];
					bEsIzquierda=(pNodoAux.izquierda==hNodoAux);
					bTieneDerecha=(pNodoAux.derecha!="");
					if (pathNodo.length>0){
						if (bEsIzquierda){
							if (bTieneDerecha){
								sLeft+="|  ";
							} else {
								sLeft+="   ";
							}
						} else {
							sLeft+="   ";
						}
					} else {
						if (bEsIzquierda){
							if (bTieneDerecha){
								sLeft+="|--";
							} else {
								sLeft+="L--";
							}
						} else {
							sLeft+="L--";
						}
					}
				}

				var sLeftRight=" ";
				if (typeof sIoD!=="undefined"){
					sLeftRight=sIoD;
				}
				var nIzquierdas=0;
				var nDerechas=0;
				if (nodo.derecha!=""){
					nDerechas=nodo.derecha.getNumSubNodos()+1;
				}
				if (nodo.izquierda!=""){
					nIzquierdas=nodo.izquierda.getNumSubNodos()+1;
				}
				var fncTrazaNodo=function(sTexto,nNodo){
					return " "+sTexto+":"+((nNodo!="")?nNodo.clave+" ["+nodo.nHijos+"] ":"NO Tiene");
				}
				var sTraza="("+sLeftRight+")"+sLeft+nodo.clave+" ["+nodo.nHijos+"] I:"+nIzquierdas+" D:"+nDerechas + " H:"+nodo.hermanos.length;
				sTraza+=fncTrazaNodo("Padre",nodo.padre);
				sTraza+=fncTrazaNodo("Primero",nodo.primero);
				sTraza+=fncTrazaNodo("Ultimo",nodo.ultimo);
				log(sTraza);
				if (typeof callValor!=="undefined"){
					callValor(nodo.valor,iDeep,"   "+sLeft);
				}
				this.traza(nodo.izquierda,iDeep+1,"I",callValor);
				this.traza(nodo.derecha,iDeep+1,"D",callValor);
			}
		trazaTodo(callValor){
				var vUndef;
				log("============ Hash Map ==========");
				log("==                            ==");
				log("==                            ==");
				this.traza(this.raiz,vUndef,vUndef,callValor);
				log("==                            ==");
				log("==                            ==");
				log("================================");
				
			}
		recorrer(callNodo,iProf){
			var nodAux=this.getPrimero();
			var bContinuar=true;
			while ((nodAux!="")&&bContinuar){
				bContinuar=(callNodo(nodAux.valor,iProf,nodAux.clave)==false?false:true);
				
				for (var i=0;(i<nodAux.hermanos.length)&&bContinuar;i++){
					bContinuar=(callNodo(nodAux.hermanos[i].valor,iProf,nodAux.clave)==false?false:true);
				}
				nodAux=nodAux.siguiente;
			}
		}
		stepAsync(){
			var nNiveles=hashmapFactory.pilaAsyncCalls.length();
			if (nNiveles>0) { 
				var bPara=false;
				var initTimestamp=new Date().getTime();
				var nElementos=0;
				var objStep="";
				var callEnd;
				var callBloque;
				var callItem;
				var segsBucle;
				var bPrimero=true;
				var bFinaliza=false;
				var vResult;
				var tipo=0; // por defecto es recorre (0), bucle (1)
				var nodAux; // para tipos recorre
				var indAct=0,indMin,indMax; // para tipos bucle 
				while ((!bPara)&&(!bFinaliza)){
					objStep=hashmapFactory.pilaAsyncCalls.top();
					if (bPrimero){
						callEnd=objStep.callEnd;
						segsBucle=objStep.segsBucle;
						callItem=objStep.callItem;
						tipo=objStep.tipo;
						indAct=objStep.indice;
						if (tipo=="Recorre"){
							tipo=0;
						} else if (tipo=="Bucle"){
							tipo=1;
							indMin=objStep.indMin;
							indMax=objStep.indMax;
						}
						bPrimero=false;
					}
					if (tipo==0) {
						nodAux=objStep.nodoSiguiente;
						bFinaliza=(nodAux=="");
					} else {
						bFinaliza=(indAct>=indMax);
					}
					bPara=true;
					if (!bFinaliza) {
						objStep.indice++;
						indAct++;
						nElementos++;
						//factoriaHashMaps.pilaAsyncCalls.push(objStep);
						// tiene que devolver true o false (true:continua, false:finaliza)
						// si no devuelve nada entonces se entiende que continua
						if (tipo==0) {
							objStep.nodoActual=nodAux;
							objStep.nodoSiguiente=nodAux.siguiente;
							objStep.valor=nodAux.valor;
						} else if (tipo==1){
							objStep.valor=objStep.indice-1;
						}
						vResult=!callItem(objStep);
						bFinaliza=false;
						if (typeof vResult!=="undefined"){
							bFinaliza=!vResult;
						}
						bPara=(nNiveles!=hashmapFactory.pilaAsyncCalls.length());
						if (!bPara){
							bPara=((new Date().getTime()-initTimestamp)>segsBucle);
						}
					}
				}
//				if (objStep!=""){
				hashmapFactory.pilaAsyncCalls.recorrer(
							function (auxObjStep){
								hashmapFactory.asyncCallBloques(auxObjStep);
							});
//				}
				if (bFinaliza) { // final del recorrer
					var theParent=this;
					setTimeout(function(){
						var objStepAux=hashmapFactory.pilaAsyncCalls.top();
						if (objStepAux==objStep){
							hashmapFactory.pilaAsyncCalls.pop();
							// ultimo bloque
							if (typeof callEnd!=="undefined"){
								callEnd(objStep);
							}
							if (isDefined(objStep.barrier)){
								objStep.barrier.finish(objStep.hashmap);
							}
							if (hashmapFactory.pilaAsyncCalls.length()>0){
								hashmapFactory.stepAsync();	
							}
						} else {
							log("Se salta este paso porque el TOP no coincide con el que se esta procesando");
						}
					});
				} else {
					if (nNiveles==hashmapFactory.pilaAsyncCalls.length()){ // hay bloques porque el proceso hijo no tiene actividad asincrona
						setTimeout(function(){ // siguiente bloque
							hashmapFactory.stepAsync();	
						});
					}
				}
			}
		}
		asyncWait(){
			hashmapFactory.pilaAsyncCalls.push("WAIT");
		}
		asyncResume(){
			var lastElem=hashmapFactory.pilaAsyncCalls.pop();
			if (lastElem!="WAIT"){
				log("Error al continuar un proceso asinchrono");
			} else {
				setTimeout(function(){
					hashmapFactory.stepAsync();
				});
			}
		}
		asyncDefaultCallBloquePercent(objStep){
			hashmapFactory.asyncLogBloque(objStep);
		}
		asyncDefaultCallBloqueTime(objStep){
			hashmapFactory.asyncLogBloque(objStep);
		}
		asyncLogBloque(objStep){
			var sCad=objStep.tipo+" "+objStep.nombre+" ind. Actual:"+objStep.indice+ " ["+objStep.indMin+","+objStep.indMax+"] "
					+ "\n Operaciones Procesadas:"+objStep.opsProcesadas
					+ "\n Avance:"+objStep.lastBloquePorc.toFixed(2)+" % "
					+ "\n Rendimiento:"+objStep.opsPerSec.toFixed(2) + " Ops/s "
					+ "\n Tiempo/op:"+objStep.secsPerOp.toFixed(2) + " Secs/Ops"
					+ "\n Inicio:"+formatDate(new Date(objStep.initTimestamp),4)
					+ "\n Duracion:"+enEuros(((new Date().getTime()-objStep.initTimestamp)/1000),false) + " s"
					+ "\n T. Restante:"+enEuros(objStep.tiempoEstimado,false) + " s"
					+ "\n Bloques Tiempo:"+objStep.nBloqueTime+ (objStep.nBloqueTime>0?" ("+(objStep.opsProcesadas/objStep.nBloqueTime).toFixed(2)+" ops/blq)":"")
					+ "\n Bloques Porcentaje:"+objStep.nBloquePorc+ (objStep.nBloquePorc>0?" ("+(objStep.opsProcesadas/objStep.nBloquePorc).toFixed(2)+" ops/%)":"")
					+ "\n Anidamiento:"+objStep.profundidad;
			var sProfundidad="";
			hashmapFactory.pilaAsyncCalls.recorrer(function(stepAux){
				if (stepAux.profundidad<objStep.profundidad){
					sProfundidad+="["+stepAux.tipo+" "+stepAux.nombre+"("+stepAux.indice+")]";
				}
			});
			sCad=sProfundidad+sCad;
			log(sCad);
		}
		asyncCallBloques(objStep,force){
			/* que datos interesan 
				indice actual
				indice 
			*/
			objStep.bLanzarBloquePorcentaje=false;
			objStep.bLanzarBloqueTiempo=false;
			var nOps=(objStep.indice-objStep.indMin);
			objStep.opsProcesadas=nOps;
			var total=(objStep.indMax-objStep.indMin);
			var nOpsFaltan=0;
			if (total>0) {
				nOpsFaltan=total-nOps;
				objStep.porcProcesado=Math.round(100*nOps/total);
				if ((objStep.porcProcesado-objStep.lastBloquePorc)>1){
					objStep.nBloquePorc++;
					objStep.bLanzarBloquePorcentaje=true;
					objStep.lastBloquePorc=objStep.porcProcesado;
				} else {
					objStep.bLanzarBloquePorcentaje=false;
				}
			} else {
				objStep.bLanzarBloquePorcentaje=false;
			}
			
			if (objStep.lastBloqueTime==0){
				objStep.lastBloqueTime=new Date().getTime();
			} 
			var totalTime=(new Date().getTime()-objStep.initTimestamp)/1000;
	/*		var totalLastBloque=(new Date().getTime()-objStep.lastBloqueTime)/1000;
		*/	var timeBloque=(new Date().getTime()-objStep.lastBloqueTime)/1000;
			if (timeBloque>objStep.segsBucle){
				objStep.nBloqueTime++;
				objStep.bLanzarBloqueTiempo=true;
				objStep.lastBloqueTime=new Date().getTime();
			} else {
				objStep.bLanzarBloqueTiempo=false;
			}
			if ((typeof force!=="undefined")&&(force)){
				objStep.bLanzarBloqueTiempo=true;
				objStep.bLanzarBloquePorcentaje=true;
				objStep.nBloquePorc++;
				objStep.lastBloquePorc=100;
				objStep.nBloqueTime++;
				objStep.lastBloqueTime=new Date().getTime();
			}
			
			if (objStep.bLanzarBloqueTiempo||objStep.bLanzarBloquePorcentaje){
				if (totalTime>0){
					objStep.opsPerSec=nOps/totalTime;
				}
				if (nOps>0){
					objStep.secsPerOp=totalTime/(nOps);
				}
				objStep.tiempoEstimado=(nOpsFaltan*objStep.secsPerOp);
				if (objStep.bLanzarBloqueTiempo){
					objStep.callBloqueTime(objStep);
					objStep.bLanzarBloqueTiempo=false;
					
				}
				if (objStep.bLanzarBloquePorcentaje){
					objStep.callBloquePercent(objStep);
					objStep.bLanzarBloquePorcentaje=false;
				}
			}
		}
		recorrerAsync(sNombre,callNodo,callEnd,callBloquePercent,callBloqueTime,segsBucle,hsOtrosParams,barrier){
			if (isDefined(barrier)){
				barrier.start(this);
			}
			if (hashmapFactory.pilaAsyncCalls==""){
				hashmapFactory.pilaAsyncCalls=newHashMap();
			}
			var nodAux=this.getPrimero();
			var sBloq=3;
			if (typeof segsBucle!=="undefined"){
				sBloq=segsBucle;
			}
			var auxCallBloquePercent=hashmapFactory.asyncDefaultCallBloquePercent;
			var auxCallBloqueTime=hashmapFactory.asyncDefaultCallBloqueTime;
			
			if (typeof callBloquePercent!=="undefined"){
				if (callBloquePercent==false){
					auxCallBloquePercent=fncVacia;
				} else {
					auxCallBloquePercent=callBloquePercent;
				}
				/*auxCallBloque=function(nBloque,nElementos,lastIndex,profundidad,hashmap,procesosPendientes){
					log("Bloque:"+nBloque+" Elementos en Bloque:"+nElementos+ " Ultimo Indice:"+lastIndex+" Prof:"+profundidad+" Procesos Pendientes:"+procesosPendientes);
				};*/
			}
			if (typeof callBloqueTime!=="undefined"){
				if (auxCallBloqueTime==false){
					auxCallBloqueTime=fncVacia;
				} else {
					auxCallBloqueTime=callBloqueTime;
				}
			}
			var objStep={nombre:sNombre,tipo:"Recorre",valor:""
							,nodoActual:""
							,nodoSiguiente:nodAux,hashmap:this,indice:0,indMin:0,indMax:this.length()
							,profundidad:hashmapFactory.pilaAsyncCalls.length()
							,callItem:callNodo,callEnd:callEnd
							,initTimestamp:new Date().getTime()
							,lastBloqueTime:0
							,callBloquePercent:auxCallBloquePercent
							,callBloqueTime:auxCallBloqueTime
							,segsBucle:sBloq
							,porcProcesado:0.0
							,lastBloquePorc:0.0						
							,opsPerSec:0
							,secsPerOp:0
							,tiempoEstimado:0
							,bLanzarBloquePorcentaje:false
							,bLanzarBloqueTiempo:false
							,opsProcesadas:0
							,nBloquePorc:0
							,nBloqueTime:0
							,hsOtrosParametros:hsOtrosParams
							,barrier:barrier
							};
			hashmapFactory.pilaAsyncCalls.push(objStep);
//			setTimeout(function(){
			hashmapFactory.stepAsync();
//			});
		}
		bucleAsync(sNombre,indiceInicial,indiceFinal,callItem,callEnd
										,callBloquePercent,callBloqueTime,segsBucle,hsOtrosParams,barrier){
			if (isDefined(barrier)){
				barrier.start(this);
			}
			if (hashmapFactory.pilaAsyncCalls==""){
				hashmapFactory.pilaAsyncCalls=newHashMap();
			}
			var sBloq=3;
			if (typeof segsBucle!=="undefined"){
				sBloq=segsBucle;
			}
			var auxCallBloquePercent=hashmapFactory.asyncDefaultCallBloquePercent;
			var auxCallBloqueTime=hashmapFactory.asyncDefaultCallBloqueTime;

			if (typeof callBloquePercent!=="undefined"){
				if (callBloquePercent==false){
					auxCallBloquePercent=fncVacia;
				} else {
					auxCallBloquePercent=callBloquePercent;
				}
			}
			if (typeof callBloqueTime!=="undefined"){
				if (auxCallBloqueTime==false){
					auxCallBloquePercent=fncVacia;
				} else {
					auxCallBloqueTime=callBloqueTime;
				}
			}
			var objStep={nombre:sNombre,tipo:"Bucle",valor:indiceInicial,indice:indiceInicial,indMin:indiceInicial,indMax:indiceFinal
							,profundidad:hashmapFactory.pilaAsyncCalls.length()
							,callItem:callItem
							,callEnd:callEnd
							,initTimestamp:new Date().getTime()
							,lastBloqueTime:0
							,callBloquePercent:auxCallBloquePercent
							,callBloqueTime:auxCallBloqueTime
							,segsBucle:sBloq
							,porcProcesado:0.0
							,lastBloquePorc:0.0						
							,opsPerSec:0
							,secsPerOp:0
							,tiempoEstimado:0
							,bLanzarBloquePorcentaje:false
							,bLanzarBloqueTiempo:false
							,opsProcesadas:0
							,nBloquePorc:0
							,nBloqueTime:0
							,hsOtrosParametros:hsOtrosParams
							,barrier:barrier
							};
			hashmapFactory.pilaAsyncCalls.push(objStep);
//			setTimeout(function(){
			hashmapFactory.stepAsync();
//			});
		}

		comprobar(nodoInicio){
				if (nodoInicio=="") return;
				chronoStartFunction();
				var nodo=this.raiz;
				if (typeof nodoInicio!=="undefined"){
					nodo=nodoInicio;
				}
				var arrNodos=[nodo];
				var bResult=false;
				var bError=false;
				while ((arrNodos.length>0)&&(!bError)){
					nodo=arrNodos.pop();
					if (nodo!=""){
						if (nodo.padre==""){
							if ((nodo.getNumSubNodos())!=(this.nNodos-1)){
								bError=true;
								log("ERROR El nodo:" + nodo.clave + " es Raiz y debería tener "+ (this.nNodos-1) +" hijos pero tiene:"+(nodo.getNumSubNodos()));
							}
								
						} else {
							var bBienPadre=false;
							if (nodo.padre.izquierda!=""){
								if (nodo.padre.izquierda==nodo){
									bBienPadre=true;
								}
								if ((nodo.padre.primero==nodo)&&(nodo.primero!="")){
									bError=true;
									log("ERROR el Primero del padre " +nodo.padre.clave + " apuntan al nodo:" + nodo.clave + " y debería apuntar a "+ nodo.primero.clave);
								}
								if (nodo.padre.primero==""){
									bError=true;
									log("ERROR el Primero del padre " +nodo.padre.clave + " no esta bien establecido debería apuntar a " + nodo.clave + " y debería apuntar al nodo o a nodo.primero");
								}

							} 
							if (nodo.padre.derecha!=""){
								if (nodo.padre.derecha==nodo){
									if (bBienPadre){
										bError=true;
										log("ERROR los dos hijos del padre " +nodo.padre.clave + " apuntan al nodo:" + nodo.clave);
									}
									bBienPadre=true;
								}
								if ((nodo.padre.ultimo==nodo)&&(nodo.ultimo!="")){
									bError=true;
									log("ERROR el Ultimo del padre " +nodo.padre.clave + " apuntan al nodo:" + nodo.clave + " y debería apuntar a "+ nodo.ultimo.clave);
								}
								if (nodo.padre.ultimo==""){
									bError=true;
									log("ERROR el Ultimo del padre " +nodo.padre.clave + " no esta bien establecido debería apuntar a " + nodo.clave + " y debería apuntar al nodo o a nodo.primero");
								}
							} 
							if (!bBienPadre){
								bError=true;
								log("ERROR Ningún hijo del padre " +nodo.padre.clave + " apunta al nodo:" + nodo.clave);
							}
						}
						var nHijos=0;
						if ((nodo.primero!="")&&(nodo.izquierda!="")){
							if (nodo.izquierda.primero!=""){
								if (nodo.primero.clave!=nodo.izquierda.primero.clave){
									bError=true;
									log("ERROR el Primero del Nodo " +nodo.clave + " no esta bien establecido debería apuntar a " + nodo.izquierda.primero.clave);
								}
							} else {
								if (nodo.primero.clave!=nodo.izquierda.clave){
									bError=true;
									log("ERROR el Primero del Nodo " +nodo.clave + " no esta bien establecido debería apuntar a " + nodo.izquierda.clave);
								}
							}
							nHijos+=(nodo.izquierda.getNumSubNodos()+1);
						} else if ((nodo.primero=="")&&(nodo.izquierda!="")){
							nHijos+=(nodo.izquierda.getNumSubNodos()+1);
							bError=true;
							log("ERROR el Primero del Nodo " +nodo.clave + " no esta bien establecido debería apuntar a " + nodo.izquierda.clave);
						} else if ((nodo.primero!="")&&(nodo.izquierda=="")){
							bError=true;
							log("ERROR el Primero del Nodo " +nodo.clave + " no esta bien establecido. debería apuntar ser '' ");
						}
						if ((nodo.ultimo!="")&&(nodo.derecha!="")){
							if (nodo.derecha.ultimo!=""){
								if (nodo.ultimo.clave!=nodo.derecha.ultimo.clave){
									bError=true;
									log("ERROR el ultimo del Nodo " +nodo.clave + " no esta bien establecido debería apuntar a " + nodo.derecha.ultimo.clave);
								}
							} else {
								if (nodo.ultimo.clave!=nodo.derecha.clave){
									bError=true;
									log("ERROR el ultimo del Nodo " +nodo.clave + " no esta bien establecido debería apuntar a " + nodo.derecha.clave);
								}
							}
							nHijos+=(nodo.derecha.getNumSubNodos()+1);
						} else if ((nodo.ultimo=="")&&(nodo.derecha!="")){
							nHijos+=(nodo.derecha.getNumSubNodos()+1);
							bError=true;
							log("ERROR el Ultimo del Nodo " +nodo.clave + " no esta bien establecido debería apuntar a " + nodo.derecha.clave);
						} else if ((nodo.ultimo!="")&&(nodo.derecha=="")){
							bError=true;
							log("ERROR el Ultimo del Nodo " +nodo.clave + " no esta bien establecido. debería apuntar ser '' ");
						}
						if (nodo.nHijos!=nHijos){
							bError=true;
							log("ERROR no coincide el número de hijos del nodo:"+ nodo.clave+" I+D+(IH+DH):"+nHijos+ " en Nodo:"+nodo.nHijos);
						}
						
						if (bError){
							log("ERROR detectado en el nodo:" + nodo.clave);
						}
						arrNodos.push(nodo.izquierda);
						arrNodos.push(nodo.derecha);
						bResult=bResult || bError;
						bError=false;
					}
				}
				chronoStopFunction();
				return bResult;
			}
		balancear_acumulaNodos(arrNodos,nodoPadre){
				chronoStartFunction(nodoPadre.clave);
				for (var i=0;i<arrNodos.length;i++){
					var nodAux=arrNodos[i];
					if (nodAux!=""){
						if (nodAux.clave>nodoPadre.clave){
							if (nodoPadre.derecha!=""){
								log("error intentando asignar a la derecha... y parece que ya esta ocupada");
							}
							nodoPadre.derecha=nodAux; // derecha del superior es el segundo de los que aparecen
							nodoPadre.derecha.padre=nodoPadre;
							if (nodoPadre.derecha.ultimo!=""){
								nodoPadre.ultimo=nodoPadre.derecha.ultimo;
							} else {
								nodoPadre.ultimo="";
							}
							// tambien se actualiza el numero de hijos
							nodoPadre.nHijos+=nodoPadre.derecha.getNumSubNodos()+1;
						} else {
							if (nodoPadre.izquierda!=""){
								log("error intentando asignar a la izquierda... y parece que ya esta ocupada");
							}
							nodoPadre.izquierda=nodAux; // izquierda del superior es el primero de los que aparecen
							nodoPadre.izquierda.padre=nodoPadre; // se actualizan los padres de ambos nodos
							if (nodoPadre.izquierda.primero!=""){
								nodoPadre.primero=nodoPadre.izquierda.primero;
							} else {
								nodoPadre.primero="";
							}
							// tambien se actualiza el numero de hijos
							nodoPadre.nHijos+=nodoPadre.izquierda.getNumSubNodos()+1;
						}
					}
				}
				this.updatePrimeroUltimo(nodoPadre);
				chronoStopFunction();
			}
		vaciar(){
			this.nNodos=0;
			this.raiz="";
		}
		balancear(nodo){
				if (this.raiz=="") return;
				chronoStartFunction();
		//		this.comprobar(this.raiz);
		//		this.trazaTodo();
				var nodAux=this.raiz;
				if ((typeof nodo!=="undefined") && (nodo!="")){
					nodAux=nodo;
				}
				// primero buscamos el nodo mas alto que presenta balanceo
				var noBalanceado="";
				var nIzquierdas=0;
				var nDerechas=0;
				var nTotalNodos=0;
		/*		while (nodAux!=""){
					nIzquierdas=0;
					nDerechas=0;
					if (nodAux.derecha!=""){
						nDerechas=nodAux.derecha.getNumSubNodos()+1;
					}
					if (nodAux.izquierda!=""){
						nIzquierdas=nodAux.izquierda.getNumSubNodos()+1;
					}
					var nTotalNodos=nodAux.getNumSubNodos()+1;
					//(75-25)=50/100=0.5
					//(10-9)=1/100=0.01
					var nivelBalanceo=Math.abs(nIzquierdas-nDerechas);
					if (nivelBalanceo>3){
						nivelBalanceo=(nivelBalanceo/nTotalNodos);
					} else {
						nivelBalanceo=0;
					}
					if (nivelBalanceo>0.05) {
						noBalanceado=nodAux;
					}
					nodAux=nodAux.padre;
				}
				if (noBalanceado=="") {
					chronoStopFunction();
					return;
				}
				*/
		//		log("Va a balancear...");
				noBalanceado=this.raiz;
		//		log("Balancea desde la Raiz");
				var nodoInicial=noBalanceado;
				var elPadreInicial=noBalanceado.padre;

				var elPadre=noBalanceado;
				var nBits=0;
				var iInd=1;
				var nContadorNodos=0;
				var poolNodos=[];
				var nodoAct;
				if (elPadre.primero!=""){
					nodoAct=elPadre.primero;
				} else {
					nodoAct=elPadre;
				}
				var arrNodosNivel;
				var arrNodosNivelSup;
				var parentNod;
				var idNivel=1;
				var nivMask=1;
		/*		var me=this;
				var fncTrazaPool=function(){
					log("Trazando Pool");
					for (var i=(poolNodos.length-1);i>=0;i--){
						log("Nivel:"+i);
						for (var j=0;j<poolNodos[i].length;j++){
							me.traza(poolNodos[i][j]);
						}
					}
				}*/
				/*
				if (typeof poolNodos[idNivel]==="undefined"){ //si nunca se habia alcanzado ese nivel.
					//creamos los arrais que corresponden en el pool de nodos
					while (poolNodos.length<=idNivel){
						poolNodos.push([]);
					}
					// ahora ya existe y se añade el nodo.
				}*/
				for (var i=0;i<32;i++){
					poolNodos.push(["",""]);
				}

				chronoStart("procesandolista");
				while (nodoAct!=""){
					// hay que encontrar el nivel del nodo
					// ejemplo 1 ->    1 // nivel 1
					// ejemplo 5 ->  101 // nivel 1
					// ejemplo 8 -> 1000 // nivel 4
					// ejemplo 9 -> 1001 // nivel 1
					// ejemplo 14 ->1110 // nivel 2
					
					/*
					Para balanceo completo en dos niveles
					
					*/
					//fncTrazaPool();
					idNivel=1;
					nivMask=1;
					while((nivMask&iInd)==0){
						nivMask=nivMask<<1;
						idNivel++;
					}
					idNivel--;
					//se limpia el nodo
					nodoAct.padre="";
					nodoAct.izquierda="";
					nodoAct.derecha="";
					nodoAct.nHijos=0;
					nodoAct.primero="";
					nodoAct.ultimo="";

					if (poolNodos[idNivel][1]==""){ // si había 0 o 1 nodo en ese nivel.
						if (poolNodos[idNivel][0]==""){
							poolNodos[idNivel][0]=nodoAct; // añadimos otro nodo al nivel
						} else {
							poolNodos[idNivel][1]=nodoAct; // añadimos otro nodo al nivel
						}
					} else { // si había 2 nodos en el nivel
						// se van a quitar ambos añadiendoselos al nodo en el nivel superior
						arrNodosNivel=poolNodos[idNivel];  // se sacan ambos nodos.
						arrNodosNivelSup=poolNodos[idNivel+1];
						parentNod=arrNodosNivelSup[1];// se obtiene el ultimo de los nodos en el nivel superior
						if (parentNod==""){
							parentNod=arrNodosNivelSup[0];
						}
						//fncTrazaPool();
						this.balancear_acumulaNodos(arrNodosNivel,parentNod);
						//fncTrazaPool();
						poolNodos[idNivel][0]=nodoAct; // se quitan los dos nodos existentes y se mete el actual.
						poolNodos[idNivel][1]=""; // se quitan los dos nodos existentes y se mete el actual.
						//fncTrazaPool();
					}
					nContadorNodos+=nodoAct.hermanos.length+1;
					nodoAct=nodoAct.siguiente;
					iInd++;
				}
				chronoStop();
				// ha terminado con el listado... ahora esta todo en el pool de nodos.... hay que ir de 0 a length

				chronoStart("finalizandoLista");
				//fncTrazaPool();
				arrNodosNivel=poolNodos.pop();
				while (arrNodosNivel[0]==""){
					arrNodosNivel=poolNodos.pop(); //el único elemento del nivel mas alto
				}

		/*		if (arrNodosNivel.length>0){
					log("Varios Elementos a nivel RAIZ");
				}
		*/		var newArb=arrNodosNivel[0]; //el único elemento del nivel mas alto
				var nodAux=newArb;
				var antHijos=0;
				var difHijos=0;
				var nodAux2;
				while(poolNodos.length>0){
					//fncTrazaPool();
					arrNodosNivel=poolNodos.pop();  // se sacan ambos nodos.
					antHijos=nodAux.nHijos;
					/*if ((nodAux.izquierda!="")||(nodAux.derecha!="")){
						log("Ya tiene izquierda o derecha");
					}*/
					this.balancear_acumulaNodos(arrNodosNivel,nodAux);
					nodAux2=nodAux.padre;
					while (nodAux2!=""){
						this.refreshNumHijos(nodAux2);
						nodAux2=nodAux2.padre;
					}
					if (nodAux.derecha!=""){
						nodAux=nodAux.derecha;
					} else if (nodAux.izquierda!=""){
						nodAux=nodAux.izquierda;
					}
					while((nodAux.derecha!="")&&(nodAux.izquierda!="")&&(nodAux!="")){
						//log("Buscando un padre donde quepa el siguiente nodo");
						nodAux=nodAux.padre;
					}

					//fncTrazaPool();
				}
				this.refreshNumHijos(newArb);
				chronoStop();
				
				chronoStart("AsignandoPadreyComprobaciones");

				var nTotalNodosArb=newArb.getNumSubNodos()+1;
				if (nContadorNodos!=nTotalNodosArb){
					log("Difiere el numero de hijos "+nContadorNodos+"!="+nTotalNodosArb);
				}
				
				//fncTrazaPool();
				//this.traza(newArb);
				if (elPadreInicial==""){
					this.raiz=newArb;
					if (nTotalNodosArb!=this.nNodos){
						log("Difiere el numero de hijos con el Numero de nodos creados");
					}
				} else {
					var nHijos=0;
					var nHijosAntes=elPadreInicial.nHijos;
					if (elPadreInicial.clave<newArb.clave){
						nHijos+=(elPadreInicial.izquierda.getNumSubNodos()+1);
					} 
					if (elPadreInicial.derecha!=""){
						if (elPadreInicial.derecha.clave==nodoInicial.clave){
							elPadreInicial.derecha=newArb;
						}
						nHijos+=(elPadreInicial.derecha.getNumSubNodos()+1);
					}
					if (nHijosAntes!=nHijos){
						log("Difiere el numero de Hijos del Padre Inicial"+ nHijosAntes+"!="+nHijos);
					}
					elPadreInicial.nHijos=nHijos;
				}
				//this.trazaTodo();
				chronoStop();
				chronoStopFunction();
			}
		push(valor,clave){
				if (typeof clave!=="undefined"){
					this.add(clave,valor);
				} else {
					this.add("",valor);
				}
			}
		top(){
			var vNodo=this.findPos("",this.raiz);
			if (vNodo==""){
				return vNodo;
			}
			var vResult;
			if (vNodo.hermanos.length>0){
				vResult=vNodo.hermanos[vNodo.hermanos.length-1].valor;
			} else {
				vResult=vNodo.valor;
			}
			return vResult;
		}
		pop(){
				var vNodo=this.findPos("",this.raiz);
				if (vNodo==""){
					return vNodo;
				}
				var vResult;
				if (vNodo.hermanos.length>0){
					this.updateNumHijos(vNodo.padre,-1);
					this.nNodos--;
					vResult=vNodo.hermanos.pop().valor;
				} else {
					vResult=vNodo.valor;
					this.remove("");
				}
				return vResult;
			}
		addOrReplace(clave,valor){
			var nodAux=this.find(clave);
			if (nodAux==""){
				this.add(clave,valor);
			} else {
				nodAux.valor=valor;
			}
		}
		add(clave,valor){
				var vUndef;
				if (this.nNodos==0){ // el primer nodo del arbol... 
					this.raiz=this.nuevoNodo(clave,valor);
					return this.raiz;
				}
				var args=arguments;
				chronoStartFunction();
			//	this.comprobar(this.raiz);
				var newNodo=this.nuevoNodo(clave,valor);
			//	this.comprobar(this.raiz);
				newNodo=this.addNodo(this.raiz,newNodo);
				chronoStopFunction();
				return newNodo;
			}
		addNodo(nodoPadre,newNodo){
				if (this.nNodos==0){
					this.raiz=newNodo;
					return newNodo;
				}
				var clave=newNodo.clave;
				var pos=this.findPos(clave,nodoPadre);
				if (pos.clave==clave){
					pos.hermanos.push(newNodo);
					this.updateNumHijos(pos.padre,1);
					return newNodo;
				}
				chronoStartFunction();
				//pos=nodoPadre;
				if (pos.clave<newNodo.clave){ //El nuevo nodo se coloca a la derecha de POS
					if (pos.derecha=="") { // si no hay nadie a su derecha... que no debería haber nadie a la derecha
						pos.derecha=newNodo;
						if (pos.siguiente!=""){
							newNodo.siguiente=pos.siguiente;
							newNodo.siguiente.anterior=newNodo;
						}
						newNodo.anterior=pos;
						newNodo.anterior.siguiente=newNodo;
					} else {
						log("Pos Derecha debería estar VACIO");
						alert("Error al añadir nodo.. La posicion Derecha deberia estar VACIA:"+clave);
						vUndef.peta("MegaError");
						return "ERROR";
					}
				} else { //El nuevo nodo se coloca a la Izquierda de POS
					if (pos.izquierda=="") { // si no hay nadie a su izquierda... que no debería haber nadie a la izquierda
						pos.izquierda=newNodo;
						if (pos.anterior!=""){
							newNodo.anterior=pos.anterior;
							newNodo.anterior.siguiente=newNodo;
						}
						newNodo.siguiente=pos;
						newNodo.siguiente.anterior=newNodo;
					} else {
						log("Pos Izquierda debería estar VACIO");
						alert("Error al añadir nodo.. La posicion IZQUIERDA deberia estar VACIA:"+clave);
						vUndef.peta("MegaError");
						return "ERROR";
					}
				}
				newNodo.padre=pos;
				this.updateNumHijos(pos,1);
				this.updatePrimeroUltimo(newNodo);
		/*		if (newNodo.padre!=""){
					this.balancear(newNodo.padre.padre);
				} else {
					this.balancear(newNodo.padre);
				}*/
				chronoStopFunction();
				return newNodo;
			}

		changePadre(nodoPadre,antHijo,nuevoHijo){
				chronoStartFunction(nodoPadre.clave+"["+nodoPadre.nHijos+"]");
				var elPadre=nodoPadre;
				if (elPadre!=""){
					if (elPadre.izquierda!=""){
						if (elPadre.izquierda.clave==antHijo.clave){
							elPadre.izquierda=nuevoHijo;
							if (nuevoHijo!=""){
								nuevoHijo.padre=elPadre;
							}
							this.updatePrimeroUltimo(elPadre);
						}
					} 
					if (elPadre.derecha!=""){
						if (elPadre.derecha.clave==antHijo.clave){
							elPadre.derecha=nuevoHijo;
							if (nuevoHijo!=""){
								nuevoHijo.padre=elPadre;
							}
							this.updatePrimeroUltimo(elPadre);
						}
					}
				}
				chronoStopFunction();
			}
		remove(clave){
				chronoStartFunction(clave);
				var vUndef;
				var antAux;
				chronoStart("Buscar",clave);
				var pos=this.findPos(clave);
				chronoStop();
				if (pos.clave!=clave){
					chronoStopFunction();
					return "";
				} else {
					//logPush();
					//this.trazaTodo();
					//var sTrazaArbol=logPop(false);
					if (pos.padre==""){
						chronoStart("Borrando_Raiz",pos.clave);
					}
					this.borradoLogico(pos); // sacamos el nodo del arbol.
					//// quitamos el numero de hijos del padre y ancestros 
					//this.updateNumHijos(elPadre,-(1+pos.hermanos.length)); (lo hace borradologico)

					var elPadre=pos.padre; //cogemos el antiguo padre del que dependera el hijo sustituto
					
					// antes de tocar el arbol tenemos que sustituir los siguiente anterior que son independientes
					if ((pos.siguiente!="")&&(pos.anterior!="")){
						pos.siguiente.anterior=pos.anterior;
						pos.anterior.siguiente=pos.siguiente;
					} else if (pos.siguiente!=""){
						pos.siguiente.anterior="";
					} else if (pos.anterior!=""){
						pos.anterior.siguiente="";
					}
					
					
					// Ahora el arbol
					if (pos.derecha!=""){ // si el nodo a borrar tiene mayores
						chronoStart("TieneMayores");
						antAux=pos.derecha; // el nodo sustituto será uno de los de la derecha
						if (antAux.primero!=""){ // Si hay un menor identificado entre los mayores (será el que sustituirá al nodo borrado)
							antAux=antAux.primero;
							chronoStart("Sustituye_por_primero",antAux.clave);
							var antPadre=antAux.padre;
							//if (antPadre!=""){ //siempre tiene que tener primero porque la raiz no tiene ultimo.
									
								//todos los elementos derechos del sustituo son menores que su padre
								//los colgamos de su antiguo padre padre (changepadre controla que antAux.derecha sea "")
								this.changePadre(antPadre,antAux,antAux.derecha);
								// quitamos los hijos del padre y los ancestros.
								this.updateNumHijos(antPadre,-(1+antAux.hermanos.length));
								antAux.derecha=""; // como ya estan movidos al antiguo padre el antAux ahora no tiene derechos
								antAux.ultimo="";
							//}
							chronoStart("Asignamos_izda",antAux.clave);
							if (antAux.izquierda==""){
								antAux.izquierda=pos.izquierda; // colgamos todos los izquierdos del antiguo en el izquierdo del sustituto
								if (antAux.izquierda!=""){ // si el nuevo izquierdo es nodo
		//							chronoStart("Nodo Asignado",antAux.izquierda.clave);
									antAux.izquierda.padre=antAux; // asignamos el sustituto como padre
		//							chronoStop();
								}
							} else {
								alert("Error al eliminar nodo.. el Menor de los Mayores no debería tener IZQUIERDO:"+clave);
								vUndef.peta("MegaError");
							}
							chronoStop();
							chronoStart("Asignamos_dcha",antAux.clave);
							// si el nodo a sustitutir tenia nodos a la derecha hay que ponerlos a la derecha del sustituto
							// if (pos.derecha!=""){ // el nodo a sustituir en esta rama siempre tiene nodos a la derecha
								antAux.derecha=pos.derecha;
								if (antAux.derecha!=""){
									antAux.derecha.padre=antAux;
								}
							//}
							chronoStop();
							this.updateNumHijos(elPadre,1+antAux.hermanos.length);
							chronoStop();
						} else {
							chronoStart("Sustituye_por_hijoderecho",antAux.clave);
							// si el nodo derecho no tiene hijos izquierdos. ponemos el hijo derecho como sustituto del nodo a eliminar
							antAux.izquierda=pos.izquierda;
							if (antAux.izquierda!=""){
								chronoStart("Nodo Asignado",antAux.izquierda.clave);
								antAux.izquierda.padre=antAux;
								chronoStop();
							}
							chronoStop();
						}
						chronoStart("updateNodos",antAux.clave+"_Padre_"+antAux.padre.clave);
						antAux.padre=elPadre;
						this.updatePrimeroUltimo(antAux);
						// se establece la relacion padre/hijo
						this.changePadre(elPadre,pos,antAux);
						this.updatePrimeroUltimo(elPadre);
						//this.updateNumHijos(elPadre,1);
						this.refreshNumHijos(antAux);
						//this.refreshNumHijos(elPadre);
						chronoStop();
						chronoStop();
					} else { // si no tiene mayores simplemente subiremos el nodo izquierdo
						antAux=pos.izquierda;
						chronoStart("Sustituye_por_hijoizquierdo",antAux.clave);
						this.changePadre(elPadre,pos,antAux);
						//this.updateNumHijos(elPadre,-(1+pos.hermanos.length));
						this.refreshNumHijos(antAux);
						chronoStop();
					}
					if (pos.padre==""){ //si el borrado es el raiz la nueva raiz será antAux;
						this.raiz=antAux;
						chronoStop();
					} 
		//			chronoStopFunction();
		//			chronoStopFunction();
		/*			if (this.comprobar()){
						log("ERROR BORRANDO NODO:"+clave);
						log("ARBOL-SITUACION INICIAL");
						log(sTrazaArbol);
						log("ARBOL-SITUACION FINAL");
						this.trazaTodo();
						chronometros.listar();
					}*/
					chronoStopFunction();
					pos.anterior="";
					pos.siguiente="";
					pos.primero="";
					pos.ultimo="";
					pos.nHijos=0;
					if (this.nodoCache.clave==pos.clave){
						this.nodoCache="";
					}
					return pos;
				}
			}
	}	 

global.hashmapFactory=new FactoriaHashMaps(); 	

class HashMapUtils{
	constructor(){
		log("Creating ChronoUtils");
	}
	newHashMap(){
//		log("Start Chrono:"+sNombre);
		return hashmapFactory.newHashMap();
	}
}


module.exports=HashMapUtils;