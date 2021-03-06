var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var Checks = require('../modules/checks');
var Place = require('../models/place');

router.get('/', Checks.db, getPlacesHeaders);
router.get('/:id', Checks.db, getPlaceInfo);


function getPlacesHeaders(req, res, next) {
  var filter = {};

  // Date filter
  if (req.query.when) {
    var date = (req.query.when === 'now')
      ? new Date()
      : new Date(req.query.when)

      if (isNaN(date.valueOf())) {
        var err = new Error('Bad request: invalid date');
        err.status = 400;
        return next(err);
      }

      filter.$and = [
        { $or: [
            { startDate: { $lte: date } },
            { startDate: null }
          ] },
        { $or: [
            { endDate: { $gte: date } },
            { endDate: null }
          ] }
      ];
  }

  // Location filter
  if (req.query.lat || req.query.long || req.query.height || req.query.width) {
    if (!(req.query.lat && req.query.long && req.query.height && req.query.width)) {
      var err = new Error('Bad request: lat, long, height and width must be set together');
      err.status = 400;
      return next(err);
    }

    var latitude = parseFloat(req.query.lat);
    var longitude = parseFloat(req.query.long);
    var height = parseFloat(req.query.height);
    var width = parseFloat(req.query.width);

    if (isNaN(latitude) || isNaN(longitude) || isNaN(height) || isNaN(width)) {
       var err = new Error('Bad request: lat, long, height and width must be numbers');
       err.status = 400;
       return next(err);
    }

    var minLatitude = latitude - height / 2.0;
    var maxLatitude = latitude + height / 2.0;
    var minLongitude = longitude - width / 2.0;
    var maxLongitude = longitude + width / 2.0;

    if (!Array.isArray(filter.$and))
      filter.$and = [];

    filter.$and.push(
      { "location.latitude": { $gte: minLatitude } },
      { "location.latitude": { $lte: maxLatitude } },
      { "location.longitude": { $gte: minLongitude } },
      { "location.longitude": { $lte: maxLongitude } });
  }
  
  // Get only the header
  var projection = {
    location: true,
    title: true
  };

  Place.find(filter, projection, function returnPlacesHeaders(error, placeHeaders) {
    if (error) return next(error);
    res.send(placeHeaders);
  });
}


function getPlaceInfo(req, res, next) {
  // TODO: Implémenter la requête

  var err = new Error('Not Implemented');
  err.status = 501;
  next(err);
}


module.exports = router;

/* vim: set ts=2 sw=2 et si : */
