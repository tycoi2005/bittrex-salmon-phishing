var bittrex = require('node.bittrex.api');
var numeral = require('numeral');

const prefix = 'https://bittrex.com/Market/Index?MarketName=';
function calcTangNumber(obj){
	obj.TangNumber = ((obj.High-obj.Last) - (obj.Last - obj.Low))/(obj.Last)

    //obj.TangNumber = ((obj.High-obj.Last))/(obj.Last)
    // obj.TangNumber = ((obj.High-obj.Last) - (obj.Last - obj.Low))/(obj.High-obj.Low) // coin giam dan deu
    // obj.TangNumber = -((obj.High-obj.Last) - (obj.Last - obj.Low))/(obj.High-obj.Low) // coin tang dan deu
	if (! /^BTC.*/.test(obj.MarketName)){
		obj.TangNumber = -100;
	}
}

function format(number){
    return numeral(number).format('0.000');
}

function compareObject(a, b){
	var keyA = a.TangNumber,
        keyB = b.TangNumber;
    // Compare the 2 dates
    if(keyA < keyB) return 1;
    if(keyA > keyB) return -1;
    return 0;
}

bittrex.getmarketsummaries( function( data ) {
  for( var i in data.result ) {
    var result = data.result[i];
    calcTangNumber(result);
  }
  var list = data.result;
  list.sort(compareObject);

    console.log("ID\t", prefix + "Market"  , "\t" , "TangNumber", "\tk", "Volume", "\t", "Last");
  for (var i =0; i< 30; i++){
  	var item = list[i]
  	console.log("", i, '\t', prefix + item.MarketName  , "\t" , format(item.TangNumber), "\t", format(item.Volume), "\t", item.Last);
  }
});