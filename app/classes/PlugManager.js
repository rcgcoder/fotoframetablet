'use strict';
const Hs100Api = require('hs100-api');
const hs100Client = new self.Hs100Api.Client();

class PlugManager {
  constructor(dynobjBase) {//mainManager
    var self = this;
    dynobjBase.addAtributo("Config","Configuracion","Valor");
    dynobjBase.addAtributo("MainManager","Gestor","Valor");
    dynobjBase.addAtributo("Plug","Enchufe","Valor");
    dynobjBase.addAtributo("PlugIP","IP del Enchufe","Valor");
	dynobjBase.funciones.add("on",this.on);
	dynobjBase.funciones.add("off",this.off);
	dynobjBase.funciones.add("isOn",this.isOn);
	dynobjBase.funciones.add("isOff",this.isOff);
	dynobjBase.funciones.add("info",this.info);
	dynobjBase.funciones.add("initialize",this.initialize);

  }
  initialize(objConfig,objMainManager){
//    self.mainManager=mainManager;
//    self.ip=ip;
//    self.plug=hs100Client.getPlug({host: mainManager.config.plug.ip});
	  this.setMainManager(objMainManager);
	  this.setConfig(objConfig);
	  this.setPlugIP(objConfig.ip);
	  var hs100Plug=hs100Client.getPlug({host: this.getIP()});
	  this.setPlug(hs100Plug);
  }
  
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

module.exports=PlugManager;