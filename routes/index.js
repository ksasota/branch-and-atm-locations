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

// Error handling
router.get('/atms', (req, res, next) => {
    const lat = req.query.lat;
    const lon = req.query.lon;
    let scale = 6371;
    switch(req.query.scale){
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
    const radius = req.query.radius || 1;
    if(utils.validateLat(lat) && utils.validateLong(lon)){
      next();
    } else if (lat === undefined && lon === undefined && scale === 6371 && radius === 1) {
      let query = 'SELECT * FROM `' + tableNames.atms +'`';
              db.execute(query)
                .then((data) => {
                  if(data.data.length > 0){
                    res.json(data);
                  }else{
                    res.status(404).json({
                      errors: [{
                        'code': 404,
                        'message': 'Not Found',
                        description: ''
                      }]
                    });
                  }
                })
                .catch((error) => {
                  res.json(error);
                });
      } else if (lat === undefined && lon === undefined) {
      res.status(404).json(
        response.Error('Latitude and longitude is missing.','Could not locate atms.', 404)
      );
  } else if (lon === undefined && !utils.validateLat(lat)) {
      res.status(404).json(
        response.Error('Latitude not valid and longitude is missing.','Could not locate atms.', 404)
      );
  } else if (lat === undefined && !utils.validateLong(lon)) {
      res.status(404).json(
        response.Error('Longitude not valid and latitude is missing.','Could not locate atms.', 404)
      );
  } else if (lat === undefined) {
         res.status(404).json(
        response.Error('Latitude is missing','Could not locate atms.', 404)
      );
  } else if (lon === undefined) {
          res.status(404).json(
        response.Error('Longitude is missing','Could not locate atms.', 404)
      );
  } else if(!utils.validateLat(lat) && !utils.validateLong(lon)){
    res.status(404).json(
      response.Error('Latitude and longitude not valid.','Could not locate atms.',404)
    ); 
    return;
  } else if (!utils.validateLat(lat)){
    res.status(404).json(
      response.Error('Latitude not valid.','Could not locate atms.',404)
    ); 
    return;
  } else if (!utils.validateLong(lon)){
    res.status(404).json(
      response.Error('Longtitude not valid.','Could not locate atms.',404)
    );  
    return;
  }
});

// GET: Atms
router.get('/atms', (req, res) =>{  
    const lat = req.query.lat;
    const lon = req.query.lon;
    let scale = 6371;
    switch(req.query.scale){
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
    const radius = req.query.radius || 1;
      let query = 'SELECT *, ( ? * acos( cos( radians( ? ) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians( ? ) ) + sin( radians( ? ) ) * sin( radians( latitude ) ) ) ) AS distance FROM `' + tableNames.atms +'` HAVING distance < ? ORDER BY distance;';
        db.execute(query,[scale, parseFloat(lat), parseFloat(lon), parseFloat(lat) , parseInt(radius)])
          .then((data) => {
            if(data.data.length > 0){
              //console.log(data);
              res.json(data);
              
            }else{
              res.status(404).json({
                errors: [{
                  'code': 404,
                  'message': 'Could not locate ATMs',
                  description: 'No ATMs at radius ' + radius
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

// Error handling for invalid entries and missing fields
router.get('/branches', (req, res, next) => {
  const lat = req.query.lat;
    const lon = req.query.lon;
    let scale = 6371;
    switch(req.query.scale){
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
    const radius = req.query.radius || 1;
    if(utils.validateLat(req.query.lat) && utils.validateLong(req.query.lon)){
      next();
    } else if (lat === undefined && lon === undefined && scale === 6371 && radius === 1) {
      let query = 'SELECT * FROM `' + tableNames.branches +'`';
              db.execute(query)
                .then((data) => {
                  if(data.data.length > 0){
                    res.json(data);
                  }else{
                    res.status(404).json({
                      errors: [{
                        'code': 404,
                        'message': 'Not Found',
                        description: ''
                      }]
                    });
                  }
                })
                .catch((error) => {
                  res.json(error);
                });
      } else if (lat === undefined && lon === undefined) {
          res.status(404).json(
            response.Error('Latitude and longitude is missing.','Could not locate atms.', 404)
          );
      } else if (lon === undefined && !utils.validateLat(lat)) {
          res.status(404).json(
            response.Error('Latitude not valid and longitude is missing.','Could not locate atms.', 404)
          );
      } else if (lat === undefined && !utils.validateLong(lon)) {
          res.status(404).json(
            response.Error('Longitude not valid and latitude is missing.','Could not locate atms.', 404)
          );
      } else if (lat === undefined) {
             res.status(404).json(
            response.Error('Latitude is missing','Could not locate atms.', 404)
          );
      } else if (lon === undefined) {
              res.status(404).json(
            response.Error('Longitude is missing','Could not locate atms.', 404)
          );
      } else if(!utils.validateLat(lat) && !utils.validateLong(lon)){
        res.status(404).json(
          response.Error('Latitude and longitude not valid.','Could not locate atms.',404)
        ); 
        return;
      } else if (!utils.validateLat(lat)){
        res.status(404).json(
          response.Error('Latitude not valid.','Could not locate atms.',404)
        ); 
        return;
      } else if (!utils.validateLong(lon)){
        res.status(404).json(
          response.Error('Longtitude not valid.','Could not locate atms.',404)
        );  
        return;
      }
});



// GET: Branches
router.get('/branches', (req, res) => {
  const lat = req.query.lat;
    const lon = req.query.lon;
    let scale = 6371;
    switch(req.query.scale){
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
    const radius = req.query.radius || 1;
      let query = 'SELECT *, ( ? * acos( cos( radians( ? ) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians( ? ) ) + sin( radians( ? ) ) * sin( radians( latitude ) ) ) ) AS distance FROM `' + tableNames.branches +'` HAVING distance < ? ORDER BY distance;';
        db.execute(query,[scale, parseFloat(lat), parseFloat(lon), parseFloat(lat) , parseInt(radius)])
          .then((data) => {
            if(data.data.length > 0){
              //console.log(data);
              res.json(data);
              
            }else{
              res.status(404).json({
                errors: [{
                  'code': 404,
                  'message': 'Could not locate branches',
                  description: 'No Branches at radius ' + radius
                }]
              });
            }
          })
          .catch((error) => {
            res.json(error);
          });
});


module.exports = router;