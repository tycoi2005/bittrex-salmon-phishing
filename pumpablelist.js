var bittrex = require('node.bittrex.api');
var syncLoop = require('sync-loop');
const prefix = 'https://bittrex.com/Market/Index?MarketName=';

Array.prototype.sum = function (prop) {
    var total = 0
    for ( var i = 0, _len = this.length; i < _len; i++ ) {
        total += this[i][prop]
    }
    return total
}

function calcOrders(obj, callback){
    bittrex.getorderbook({ market : obj.MarketName, depth : 50, type : 'both' }, function( data ) {
        var sumbuy = data.result.buy.sum("Quantity");
        var sumsell = data.result.sell.sum("Quantity");
        var lastsell = data.result.sell[data.result.sell.length -1];

        console.log("sumbuy", sumbuy)
        console.log("sumsell", sumsell)
        console.log("lastsell", lastsell)
        callback();
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
        console.log(result);
        calcOrders(result);
        return;
    }
    syncLoop(data.result.length, function (loop) {
        // loop body
        var index = loop.iteration(); // index of loop, value from 0 to (numberOfLoop - 1)
        var result = data.result[index];
        calcOrders(result, function(){
            // This is callback of your function

            loop.next(); // call `loop.next()` for next iteration
        })
    }, function () {
        console.log("This is finish function")
    });
    var list = data.result;
    list.sort(compareObject);

    for (var i =0; i< 20; i++){
        var item = list[i]
        console.log(prefix + item.MarketName  , " : " , item.TangNumber, " : ", item.Volume, " , ", item.Last);
    }
});