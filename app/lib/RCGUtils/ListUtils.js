'use strict';
var BaseUtils = require('./BaseUtils.js');

class ListUtils{
	newID(arrObjetos){
		var iID=0;
		while (getFromListaById(arrObjetos,iID)!=""){
			iID++;
		}
		return iID;
	}
	getFromListaById(lista,id){
		if (!isUndefined(lista)){
			for (var i=0;i<lista.length;i++){
				var idAux=lista[i].id;
				if (idAux==id){
					return lista[i];
				}
			}
		}
		return "";
	}
	getFromMapaById(mapa,id){
		if (!isUndefined(mapa)){
			var vVal=mapa[id];
			if (isUndefined(vVal)){
				vVal="";
			}
			return vVal;
		}
		return "";
	}
	
	getFromLista(lista,ind){
		if (!isUndefined(lista)){
			if ((ind>=0)&&(ind<lista.length)){
				return lista[ind];
			}
		}
		return "";
	}
}
module.exports=ListUtils;