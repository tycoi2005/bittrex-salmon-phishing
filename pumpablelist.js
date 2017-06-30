var bittrex = require('node.bittrex.api');
const prefix = 'https://bittrex.com/Market/Index?MarketName=';

Array.prototype.sum = function (prop) {
    var total = 0
    for ( var i = 0, _len = this.length; i < _len; i++ ) {
        total += this[i][prop]
    }
    return total
}

function calcOrders(obj){
    bittrex.getorderbook({ market : obj.MarketName, depth : 50, type : 'both' }, function( data ) {
        var sumbuy = data.result.buy.sum("Quantity");
        var sumsell = data.result.sell.sum("Quantity");
        var lastsell = data.result.sell[data.result.sell.length -1];

        console.log("sumbuy", sumbuy)
        console.log("sumsell", sumsell)
        console.log("lastsell", lastsell)
    });
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
    console.log(result);
    calcOrders(result);
    return;
  }
  var list = data.result;
  list.sort(compareObject);

  for (var i =0; i< 20; i++){
  	var item = list[i]
  	console.log(prefix + item.MarketName  , " : " , item.TangNumber, " : ", item.Volume, " , ", item.Last);
  }
});