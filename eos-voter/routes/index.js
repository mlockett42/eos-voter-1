var express = require('express');
var router = express.Router();
var chaininpector = require('../tasks/chainInspector')
var utils = require('../utils/utils.js');
var settings = require('../config/settings.js');

/* GET home page. */
router.get('/', function(req, res, next) {

    let active_block_producers = chaininpector.get_active_block_producers().map(utils.format_block_producer);
    let backup_block_producers = chaininpector.get_backup_block_producers().map(utils.format_block_producer);
    res.render('index', { title: 'EOS Voter',
                          chainname: settings.chain_name,
                         'activeblockproducers': active_block_producers,
                         'backupblockproducers': backup_block_producers,
                         'block_producer_list_empty': (active_block_producers.length + backup_block_producers.length) == 0,
                         });
});

module.exports = router;
