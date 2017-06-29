var bittrex = require('node.bittrex.api');
const prefix = 'https://bittrex.com/Market/Index?MarketName=';
function calcTangNumber(obj){
	obj.TangNumber = ((obj.High-obj.Last) - (obj.Last - obj.Low))/obj.High
	if (! /^BTC.*/.test(obj.MarketName)){
		obj.TangNumber = -100;
	}
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

  for (var i =0; i< 20; i++){
  	var item = list[i]
  	console.log(prefix + item.MarketName  , " : " , item.TangNumber, " : ", item.Volume, " , ", item.Last);
  }
});