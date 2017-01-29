"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialize = undefined;

var _FileComponent = require("./FileComponent");

var _FileComponent2 = _interopRequireDefault(_FileComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function initialize(dataSource, callback) {
  dataSource.connector = new _FileComponent2.default(dataSource.settings);
  dataSource.connector.connect(callback);
} /**
   * Loopback Intialization Hook
   * @param dataSource
   * @param callback
   */
exports.initialize = initialize;