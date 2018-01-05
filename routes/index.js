const express = require('express');
const router = express.Router();

const db = require('../helpers/database');
const settings = require('../helpers/settings');
const response = require('../helpers/response');
const utils = require('../helpers/utils');

const tableNames = {
  atms: process.env.TABLENAME_ATM || settings.sql.tableNameAtm,
  branches: process.env.TABLENAME_BRANCHES || settings.sql.tableNameBranches
}

// ATMS
/*************************/

// Direct route
router.get('/atms', (req, res, next) => {
  res.json(
    {
      "errors": [{
          "code": "404",
          "message": "Could not locate atms",
          "description": "Latitude and Longitude required."
        }]
    }
  );
});

// Error handling for single param entered
router.get('/atms/:lat', (req, res, next) => {
  if(utils.validateLat(req.params.lat)){
    res.json(
      {
        "errors": [{
            "code": "404",
            "message": "Could not locate atms",
            "description": "Longitude required."
          }]
      }
    );
  }else{
    res.json({
      "errors": [{
        "code": 404,
        "message": "Could not locate atms",
        "description": "Latitude not valid and Longtitude missing."
      }]
    });
  }
});

// Error handling for invalid entries
router.get('/atms/:lat/:lon', (req, res, next) => {
  if(utils.validateLong(req.params.lon)){
    next();
  }else{
    res.json({
      "errors": [{
        "code": 404,
        "message": "Could not locate atms",
        "description": "Longtitude not valid."
      }]
    });
  }
});

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


// BRANCHES
/*************************/

// Direct route
router.get('/branches', (req, res, next) => {
  res.json(
    {
      "errors": [{
          "code": "404",
          "message": "Could not locate branches",
          "description": "Latitude and Longitude required."
        }]
    }
  );
});

// Error handling for single param entered
router.get('/branches/:lat', (req, res, next) => {
  if(utils.validateLat(req.params.lat)){
    res.json(
      {
        "errors": [{
            "code": "404",
            "message": "Could not locate branches",
            "description": "Longitude required."
          }]
      }
    );
  }else{
    res.json({
      "errors": [{
        "code": 404,
        "message": "Could not locate branches",
        "description": "Latitude not valid and Longtitude missing."
      }]
    });
  }
});

// Error handling for invalid entries
router.get('/branches/:lat/:lon', (req, res, next) => {
  if(utils.validateLong(req.params.lon)){
    next();
  }else{
    res.json({
      "errors": [{
        "code": 404,
        "message": "Could not locate branches",
        "description": "Longtitude not valid."
      }]
    });
  }
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
            description: 'Try editing the radius.'
          }]
        });
      }
    })
    .catch((error) => {
      res.json(error);
    });

});


module.exports = router;