//'use strict';
var execAsync = require('exec-async' );
const sCmdActivateScreenSaver="ActivateScreenSaver";
const sCommand='kodi-send --host=__IP__ --action="__COMMAND__"';
let script = "echo \'hello\' $(whoami)\nls -l\necho 'bye'";
exports.KodiManager = class KodiManager {
  constructor(mainManager) {
    var self = this;
    self.mainManager=mainManager;
    self.ip=self.mainManager.config.tablet.ip;
  };

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
