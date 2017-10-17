var stack = require('callsite');
function getStack(){
	  // compile new function from the string representation of another one
//	  var sneaky = Function('return arguments.caller.name;');
//	  console.log(sneaky());
	  
	  
	  var orig = Error.prepareStackTrace;
	  Error.prepareStackTrace = function(_, stack){ return stack; };
	  var err = new Error;
	  Error.captureStackTrace(err, arguments.callee);
	  var stack = err.stack;
	  Error.prepareStackTrace = orig;
	  return stack;
	  
/*	
		let stack = new Error().stack || '';
	    stack = stack.split('\n').map(function (line) { return line.trim(); });
	    return stack.splice(stack[0] == 'Error' ? 2 : 1);
	    */
}

class StackUtils{
	getStackFunctionName(fncIndex){
//		var callee=	arguments.callee;
		var index=1;
		if (isDefined(fncIndex)){
			index+=fncIndex; // we don´t want the getStackFunctionName
		}
		var theStack=getStack();
		var site=theStack[index];
		if (isUndefined(site)) return "not defined";
		if (isString(site)){
			var arrNameParts=site.split(" ");
			var sName=arrNameParts[1];
			if (isUndefined(sName)) return "anonymous";
			return sName;
		}
		var functionName=site.getFunctionName();
		if (isUndefined(functionName)) return "anonymous";
		return functionName;
	}
}

module.exports=StackUtils;
