const express = require('express');
const router = express.Router();

const db = require('../helpers/database');
const settings = require('../helpers/settings');
const response = require('../helpers/response');

const tableNames = {
  atms: process.env.TABLENAME_ATM || settings.sql.tableNameAtm,
  branches: process.env.TABLENAME_BRANCHES || settings.sql.tableNameBranches
}

// GET: Atms
router.get('/atms/:lat/:lon/:scale?/:radius?', (req, res) => {
  
  const lat = req.params.lat;
  const lon = req.params.lon;
  let scale = 6371;
  switch(req.params.scale){
    case 'mi' : 
      scale = 3959; 
      break;
    case 'm'  : 
      scale = 6371000; 
      break;
    case 'km':
    default: 
      // km
      scale = 6371;
  }

  const radius = req.params.radius || 1;

  let query = 'SELECT *, ( ? * acos( cos( radians( ? ) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians( ? ) ) + sin( radians( ? ) ) * sin( radians( latitude ) ) ) ) AS distance FROM `' + tableNames.atms +'` HAVING distance < ? ORDER BY distance;';

  db.execute(query,[scale, parseFloat(lat), parseFloat(lon), parseFloat(lat) , parseInt(radius)])
    .then((data) => {
      if(data.data.length > 0){
        //console.log(data);
        res.json(data);
      }else{
        res.json({
          errors: [{
            'code': 404,
            'message': 'Could not locate atms',
            description: ''
          }]
        });
      }
    })
    .catch((error) => {
      res.json(error);
    });

});

// GET: Branches
router.get('/branches/:lat/:lon/:scale?/:radius?', (req, res) => {
  const lat = req.params.lat;
  const lon = req.params.lon;
  let scale = 6371;
  switch(req.params.scale){
    case 'mi' : 
      scale = 3959; 
      break;
    case 'm'  : 
      scale = 6371000; 
      break;
    case 'km':
    default: 
      // km
      scale = 6371;
  }

  const radius = req.params.radius || 1;

  let query = 'SELECT *, ( ? * acos( cos( radians( ? ) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians( ? ) ) + sin( radians( ? ) ) * sin( radians( latitude ) ) ) ) AS distance FROM `' + tableNames.branches +'` HAVING distance < ? ORDER BY distance;';

  db.execute(query,[scale, parseFloat(lat), parseFloat(lon), parseFloat(lat) , parseInt(radius)])
    .then((data) => {
      if(data.data.length > 0){
        res.json(data);
      }else{
        res.json({
          errors: [{
            'code': 404,
            'message': 'Could not locate branches',
            description: ''
          }]
        });
      }
    })
    .catch((error) => {
      res.json(error);
    });

});


module.exports = router;