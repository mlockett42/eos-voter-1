var express = require('express');
var router = express.Router();
var blockproducers = require('./blockproducers')
var chaininpector = require('../tasks/chainInspector')

/*
function ValidURL(str) {
  var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
    '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
    '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
    '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
    '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
    '(\#[-a-z\d_]*)?$','i'); // fragment locater
  if(!pattern.test(str)) {
    alert("Please enter a valid URL.");
    return false;
  } else {
    return true;
  }
}
*/
function ValidURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locater
  if(!pattern.test(str)) {
    //alert("Please enter a valid URL.");
    return false;
  } else {
    return true;
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {

    /*
    return blockproducers.get_block_producers_from_db().then(
        (result) => {
                       res.render('index', { title: 'EOS Voter',
                                             chainname: chaininpector.chain_name,
                                             'activeblockproducers': result,
                                             'backupblockproducers': blockproducers.getBackupBlockProducers(),
                                             });
                     }
    );
    */

    let active_block_producers = chaininpector.get_active_block_producers().map((x) => {
        return { 'id': x.owner, 'name': x.owner, 'votes': parseInt(x.total_votes), 'statement': x.url, 'valid_url': ValidURL(x.url) };
    });
    res.render('index', { title: 'EOS Voter',
                          chainname: chaininpector.chain_name,
                         'activeblockproducers': active_block_producers,
                         'backupblockproducers': blockproducers.getBackupBlockProducers(),
                         });
});

module.exports = router;
