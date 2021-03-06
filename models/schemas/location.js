/**
 * Location schema
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = new Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true }
});

module.exports = locationSchema;

/* vim: set ts=2 sw=2 et si : */
