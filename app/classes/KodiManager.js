//'use strict';
var execAsync = require('exec-async' );
const sCmdActivateScreenSaver="ActivateScreenSaver";
const sCommand='kodi-send --host=__IP__ --action="__COMMAND__"';
let script = "echo \'hello\' $(whoami)\nls -l\necho 'bye'";

class KodiManager {
	
  constructor(dynobjBase) {//mainManager
	    var self = this;
	    dynobjBase.addAtributo("Config","Configuracion","Valor");
	    dynobjBase.addAtributo("MainManager","Gestor","Valor");
	    dynobjBase.addAtributo("KodiIP","IP del Kodi","Valor");
		dynobjBase.funciones.add("on",this.on);
		dynobjBase.funciones.add("off",this.off);
		dynobjBase.funciones.add("isOn",this.isOn);
		dynobjBase.funciones.add("isOff",this.isOff);
		dynobjBase.funciones.add("info",this.info);
		dynobjBase.funciones.add("initialize",this.initialize);

  }
  initialize(objConfig,objMainManager){
	  this.setMainManager(objMainManager);
	  this.setConfig(objConfig);
	    //self.ip=self.mainManager.config.tablet.ip;

	  this.setPlugIP(objConfig.ip);
  }
  executeKodiCommand(sKodiCommand){
	  var self=this;
	  var action=self.mainManager.startAction("executing Kodi command:"+sKodiCommand);
	  var sAuxCommand = sCommand.replace(/__IP__/g, self.ip);
	  sAuxCommand=sAuxCommand.replace(/__COMMAND__/g, sKodiCommand);
	  execAsync('sh', ['-c', sAuxCommand]).then(
			  function(){
				  self.mainManager.stopAction(action);
			  }
	  	).catch(
	  		  function(){
	  			  self.mainManager.stopAction(action);
	  		  }
	    );
  };
  
  screenSaver(){
	  var self=this;
	  var action=self.mainManager.startAction("Kodi ScreenSaver");
	  self.executeKodiCommand(sCmdActivateScreenSaver);
	  self.mainManager.stopAction(action);
  };
  
  on(){
	  var self=this;
	  var action=self.mainManager.startAction("plugOn");
	  var fncSetPowerOn=function(){
		  if (!self.isOn()){
			  self.plug.setPowerState(true);
			  setTimeout(fncSetPowerOn,3000);
		  } else {
			  self.mainManager.stopAction(action);
		  }
	  }
  }

  off(ip){
	  var self=this;
	  var action=self.mainManager.startAction("plugOn");
	  var fncSetPowerOff=function(){
		  if (!self.isOff()){
			  self.plug.setPowerState(false);
			  setTimeout(fncSetPowerOn,3000);
		  } else {
			  self.mainManager.stopAction(action);
		  }
	  }
  }
  
  isOn(){
	  var action=self.mainManager.startAction("plugIsOn");
	  var bIsOn=this.plug.getPowerState();
	  self.mainManager.stopAction(action);
	  return bIsOn; 
  }

  isOff(){
	  var action=self.mainManager.startAction("plugIsOff");
	  var bIsOff=!this.plug.getPowerState();
	  self.mainManager.stopAction(action);
	  return bIsOff;
  }
  
  info(ip){
	  var action=self.mainManager.startAction("plugIsOff");
	  var info=this.plug.getSysInfo();
	  self.mainManager.stopAction(action);
	  return info
  }
  
};
module.exports = KodiManager;