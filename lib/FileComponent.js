"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * FileComponent
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Van Carney <carney.van@gmail.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _path2 = require("path");

var _path3 = _interopRequireDefault(_path2);

var _wfUtils = require("wf-utils");

var utils = _interopRequireWildcard(_wfUtils);

var _FileConnector = require("./FileConnector");

var _FileConnector2 = _interopRequireDefault(_FileConnector);

var _schemaroller = require("schemaroller");

var _schemaroller2 = _interopRequireDefault(_schemaroller);

var _ds_configJsd = require("./ds_config.jsd.json");

var JSD = _interopRequireWildcard(_ds_configJsd);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _SchemaRoller = (0, _schemaroller2.default)(),
    Schema = _SchemaRoller.Schema;

var __data = new WeakMap();
var __loaderRefs = new WeakMap();

var FileComponent = function () {
    /**
     *
     * @param fullFilePath
     * @param modelName
     */
    function FileComponent(config) {
        _classCallCheck(this, FileComponent);

        config = new Schema(JSD).set(config);
        if (typeof config === "string") {
            throw config;
        }
        var _name = config.get("name");
        var _path = config.get("path");
        var _file = config.get("file");
        var _ds = new _FileConnector2.default(_path, _name);
        __data.set(this, null);
        __loaderRefs.set(this, {
            path: _path,
            file: _file,
            filePath: _path3.default.join(_path, _name, _file),
            name: _name,
            ds: _ds
        });
    }

    _createClass(FileComponent, [{
        key: "exists",


        /**
         *
         * @param _path
         * @returns {*}
         */
        value: function exists(callback) {
            return this.container.connector.getFile(this.name, this.file, function (e, res) {
                callback(res !== null);
            });
        }

        /**
         *
         * @param callback
         * @returns {boolean}
         */

    }, {
        key: "load",
        value: function load(callback) {
            var _this = this;

            return this.container.read(this.file, "utf8", function (e, data) {
                _this.contents = data || null;
                callback(e, data);
            });
        }

        /**
         *
         * @returns {*}
         */

    }, {
        key: "save",


        /**
         * Saves Loaded File
         * @param callback
         * @returns {*}
         */
        value: function save(callback) {
            if (this.path === null) {
                // sets error if path is null
                if (utils.exists(callback)) {
                    callback("path was not defined", null);
                }
                return;
            }

            return this.container.write(this.file, this.contents, "utf8", callback);
        }

        /**
         * renames loaded file
         * @param newPath
         * @param callback
         * @returns {*}
         */

    }, {
        key: "rename",
        value: function rename(newPath, callback) {
            var _this2 = this;

            return this.container.rename(this.file, newPath, "utf8", function (e) {
                var _ = __loaderRefs.get(_this2);
                _.file = newPath;
                __loaderRefs.set(_this2, _);
                callback(e);
            });
        }

        /**
         * deletes Loaded File
         * @param callback
         * @returns {boolean}
         */

    }, {
        key: "destroy",
        value: function destroy(cb) {
            return this.container.remove(this.file, cb);
        }

        /**
         * returns raw contents of loaded file
         * @returns {*}
         */

    }, {
        key: "valueOf",
        value: function valueOf() {
            return this.contents || null;
        }

        /**
         * returns JSON-formatted contents of loaded file
         * @returns JSON
         */

    }, {
        key: "toJSON",
        value: function toJSON() {
            return JSON.parse(this.toString());
        }

        /**
         *
         * @param readable
         * @returns string representation of File
         */

    }, {
        key: "toString",
        value: function toString() {
            var readable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (typeof this.valueOf() === "string") {
                return this.valueOf();
            }
            return JSON.stringify(this.valueOf(), this.replacer, readable ? 2 : undefined);
        }

        // - Loopback DS Methods
        /**
         *
         * @param cb
         */

    }, {
        key: "connect",
        value: function connect(cb) {
            cb();
        }

        /**
         *
         * @param cb
         */

    }, {
        key: "disconnect",
        value: function disconnect(cb) {
            cb();
        }
    }, {
        key: "path",
        get: function get() {
            return __loaderRefs.get(this).path;
        }
    }, {
        key: "container",
        get: function get() {
            return __loaderRefs.get(this).ds;
        }
    }, {
        key: "name",
        get: function get() {
            return __loaderRefs.get(this).name;
        }
    }, {
        key: "filePath",
        get: function get() {
            return __loaderRefs.get(this).filePath;
        }
    }, {
        key: "file",
        get: function get() {
            return __loaderRefs.get(this).file;
        }
    }, {
        key: "contents",
        get: function get() {
            return __data.get(this);
        }

        /**
         *
         * @param value
         */
        ,
        set: function set(value) {
            __data.set(this, value);
        }
    }]);

    return FileComponent;
}();

exports.default = FileComponent;