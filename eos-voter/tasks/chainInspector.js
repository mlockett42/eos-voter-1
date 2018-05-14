var exports = module.exports = {};

// Connect to EOS
var Eos = require('eosjs') // Eos = require('./src')
 
// eos = Eos.Localnet() // 127.0.0.1:8888

var options = {
  httpEndpoint: 'http://dev.cryptolions.io:28888', // default
  debug: false,
  fetchConfiguration: {}
}

exports.chain_name = 'Jungle Testnet';
//exports.chain_name = 'EOS Main Net';


eos = Eos.Testnet(options) // testnet at eos.io

// Connect to mongo
var mongo = require('mongodb'); 

var url = "mongodb://mongo:27017/eos-voter";
var MongoClient = mongo.MongoClient;

var db = null;
var block_producers_collection = null;

console.log('Attempting to connect to mongodb');
MongoClient.connect(url, function(err, connected_db) {
  if (err) throw err;
  console.log("Database created!");
  db = connected_db;
  var dbo = db.db("eos-voter");
  dbo.createCollection("block_producers", function(err, res) {
    if (err) throw err;
    //console.log("Collection created! res=", res);
    block_producers_collection = res;
    block_producers_collection.createIndex({'id': 1}, {unique: true});
    //db.close();
    inspectChain();
  });
});

//var block_producers = new Set()
var first_run = true;

function inspectChain()
{
     block_producers_collection.find({}).sort({'name': 1}).toArray(function(err, result) {
       if (err) throw err;
       //console.log('block producers in mongodb=', result);
     });
    //console.log('Known block producers =', block_producers);
    eos.getInfo({}).then(
        (result) => {
                     for (var i = result.last_irreversible_block_num; i > result.last_irreversible_block_num - 21 * 9 && i >= 0; i--) {
                         //eos.getBlock(i).then(result => { block_producers.add(result.producer); })
                         eos.getBlock(i).then(result => { //console.log('getBlock esult.producer=', result.producer);
                                                          block_producers_collection.replaceOne({'id': result.producer}, {'id': result.producer,
                                                                                                 'name': result.producer,
                                                                                                 'votes': 0,
                                                                                                 'statement': ''}, {upsert: true});
                                                         });
                     }
                     setTimeout(inspectChain, (first_run ? 5 : 60) * 1000);
                     first_run = false;
                    }).catch(
        (result) => {
                     setTimeout(inspectChain, 5 * 1000);
                    })
}
 
// All API methods print help when called with no-arguments.
//eos.getBlock()
 
// Next, your going to need eosd running on localhost:8888

//eos.getInfo() 
//eos.getInfo({}).then(result => console.log(result)).catch(result => console.error(result))
//inspectChain();
 
// If a callback is not provided, a Promise is returned
/*
eos.getBlock(1).then(result => {console.log(result)})
 
// Parameters can be sequential or an object
eos.getBlock({block_num_or_id: 1}).then(result => console.log(result))
 
// Callbacks are similar
callback = (err, res) => {err ? console.error(err) : console.log(res)}
eos.getBlock(1, callback)
eos.getBlock({block_num_or_id: 1}, callback)
 
// Provide an empty object or a callback if an API call has no arguments
eos.getInfo({}).then(result => {console.log(result)})
*/
 
