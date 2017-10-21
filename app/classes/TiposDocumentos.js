'use strict';

class TiposDocumentos{
	constructor(dynobjBase){
		dynobjBase.generarTipos=this.generarTipos;
		dynobjBase.funciones.add("generarTipo",this.generarTipo);
	}

	generarTipo(dynobjFases){
			var fases=dynobjFases;
			var sTipo=this.id;
			var idTipo=this.id;
			log("Tipo Fase:"+idTipo +" - " +this.nombre);
			fases.funciones.add("nuevaFase",function(idTipo,procedimiento,nombre){
					var auxFase=fases.nuevaFase(idTipo,procedimiento,nombre);
					this.addFaseSiguiente(auxFase);
					auxFase.setFaseAnterior(this);
					return auxFase;
				});
			fases["nuevo"+sTipo]=function(procedimiento,nombre){
				var newFase=fases.nuevo(nombre,this.getNewId(procedimiento.id+"_"+sTipo));
				newFase.setTipo(idTipo);
				newFase.setProcedimiento(procedimiento);
				procedimiento.addFase(newFase);
				newFase.simular=fases.simularFase;
				return newFase;
			};
	}

	generarTipos(dynobjFases){
		var auxFases=dynobjFases;
		this.listado.recorrer(function(tipoFase){
			tipoFase.generarTipo(auxFases);
		});
	}
}


module.exports=TiposDocumentos;
