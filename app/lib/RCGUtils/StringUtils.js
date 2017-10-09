'use strict';
module.exports=class StringUtils{
	number_format(number,ndecimals,decPoint,milPoint){
		var nAux=parseFloat(number).toFixed(ndecimals);
		var nStr = ''+nAux;
		var x = nStr.split('.');
		var x1 = x[0];
		var x2 = x.length > 1 ? decPoint + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + milPoint + '$2');
		}
		return x1 + x2;
	};
	
    inSeconds(numero,bClearZero){
    	var sAux=enEuros((numero/1000.0),false,bClearZero);
    	if ((sAux=="")&&(bClearZero)){
    		return "";
    	}
    	sAux+="s";
    	return sAux;
    }	
    inPercent(numero,bClearZero){
    	var sAux=enEuros((numero*100.0),false,bClearZero);
    	if ((sAux=="")&&(bClearZero)){
    		return "";
    	}
    	sAux+="%";
    	return sAux;
    }	
	enEuros(numero,bWithMoneySign,bClearZero){
		var numAux=numero+""; // por si es un string
		if (numAux==""){
			numAux=0;
		}
		numAux=parseFloat(numAux).toFixed(2);
		if (numAux==0) {
			if (typeof bClearZero!=="undefined"){
				if (bClearZero){
					return "";
				}
			}
		}
		numAux=number_format(numAux,2,",",".");
		if (typeof bWithMoneySign!=="undefined"){
			if (bWithMoneySign){
				numAux+=" €";
			}
		}
		return numAux;
	};
	
	fillLetrasLeft (iNumLetras,sCadena,sLetraFill){
		var sLetra="0";
		if (typeof sLetraFill!=="undefined"){
			sLetra=sLetraFill;
		}
		var sCad=sCadena+"";
		while (sCad.length<iNumLetras){
			sCad=sLetra+sCad;
		}
		return sCad;
	};
	
	replaceAll(str, find, replace) {
		  return str.replace(new RegExp(find, 'g'), replace);
	};

	prepareComparation(str,bCaseInsensitive,bSinAcentos){
			var sValue=str;
			if (typeof bCaseInsensitive !=="undefined"){
				if (bCaseInsensitive){
					sValue=sValue.toUpperCase();
				}
			}
			if (typeof bSinAcentos!=="undefined"){
				if (bSinAcentos){
					sValue=replaceAll(sValue,'Á','A');
					sValue=replaceAll(sValue,'É','E');
					sValue=replaceAll(sValue,'Í','I');
					sValue=replaceAll(sValue,'Ó','O');
					sValue=replaceAll(sValue,'Ú','U');
					sValue=replaceAll(sValue,'á','a');
					sValue=replaceAll(sValue,'é','e');
					sValue=replaceAll(sValue,'í','i');
					sValue=replaceAll(sValue,'ó','o');
					sValue=replaceAll(sValue,'ú','u');
				}
			}
					
			return sValue;
	};
}