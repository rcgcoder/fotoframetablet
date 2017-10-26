'use strict';
module.exports.TabletManager=class TabletManager {
  constructor(dynobjBase) {//mainManager
	    dynobjBase.addAtributo("Config","Configuracion","Valor");
	    dynobjBase.addAtributo("MainManager","Gestor","Valor");
	    dynobjBase.addAtributo("Tablet","tablet","Valor");
	    dynobjBase.addAtributo("TabletIP","IP del Enchufe","Valor");
  }
};