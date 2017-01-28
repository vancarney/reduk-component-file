"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _loopbackDatasourceJuggler = require("loopback-datasource-juggler");

var _loopbackComponentStorage = require("loopback-component-storage");

var storage = _interopRequireWildcard(_loopbackComponentStorage);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var connectors = new WeakMap();

var FileConnector = function () {
    /**
     *
     * @param _path
     */
    function FileConnector(_path, _name) {
        _classCallCheck(this, FileConnector);

        var _ = new _loopbackDatasourceJuggler.DataSource({
            connector: storage,
            provider: "filesystem",
            root: _path
        });
        connectors.set(this, {
            name: _name,
            ds: _.createModel(_name)
        });
    }

    /**
     * getter for container name
     */


    _createClass(FileConnector, [{
        key: "read",


        /**
         *
         * @param file
         * @param encoding
         * @param cb
         */
        value: function read(file, encoding, cb) {
            var _this = this,
                _arguments = arguments;

            var res = null;
            var _ = this.connector.downloadStream(this.name, file, null, function (e, res) {
                if (cb !== null) {
                    cb.apply(_this, _arguments);
                }
            });
            _.setEncoding(encoding);
            _.on("data", function (data) {
                res = res !== null ? res + data : data;
            });
            _.on("end", function () {
                if (cb !== null) {
                    cb(null, res);
                }
            });
        }

        /**
         *
         * @param file
         * @param data
         * @param encoding
         * @param cb
         */

    }, {
        key: "write",
        value: function write(file, data, encoding, cb) {
            var _this2 = this,
                _arguments2 = arguments;

            var _ = this.connector.uploadStream(this.name, file, null, function (e, res) {
                if (cb !== null) {
                    cb.apply(_this2, _arguments2);
                }
            });
            _.write(data, encoding, cb);
        }

        /**
         *
         * @param oldname
         * @param newName
         * @param encoding
         * @param cb
         */

    }, {
        key: "rename",
        value: function rename(oldName, newName, encoding, cb) {
            var _this3 = this;

            this.read(oldName, encoding, function (e, data) {
                if (e) {
                    if (cb && typeof cb === "function") {
                        cb(e);
                    }
                    return;
                }
                _this3.write(newName, data, encoding, function (e) {
                    if (e) {
                        if (cb && typeof cb === "function") {
                            cb(e);
                        }
                        return;
                    }
                    return _this3.connector.removeFile(_this3.name, oldName, cb);
                });
            });
        }

        /**
         *
         * @param cb
         */

    }, {
        key: "remove",
        value: function remove(fileName, cb) {
            this.connector.removeFile(this.name, fileName, cb);
        }
    }, {
        key: "name",
        get: function get() {
            return connectors.get(this).name;
        }

        /**
         * getter for connection
         * @returns {*}
         */

    }, {
        key: "connector",
        get: function get() {
            return connectors.get(this).ds;
        }
    }]);

    return FileConnector;
}();

exports.default = FileConnector;