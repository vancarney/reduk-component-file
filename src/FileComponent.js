/**
 * FileComponent
 * @author Van Carney <carney.van@gmail.com>
 *
 */
import path from "path";
import * as utils from "wf-utils";
import FileConnector from "./FileConnector";
import SchemaRoller from "schemaroller";
import * as JSD from "./ds_config.jsd.json";
const {Schema} = SchemaRoller();
var __data       = new WeakMap();
var __loaderRefs = new WeakMap();
class FileComponent {
  /**
   *
   * @param fullFilePath
   * @param modelName
   */
  constructor(config) {
    config = (new Schema(JSD)).set(config);
    if (typeof config === "string") {
      throw config;
    }
    let _name = config.get("name");
    let _path = config.get("path");
    let _file = config.get("file");
    let _ds = new FileConnector(_path, _name);
    __data.set(this, null);
    __loaderRefs.set(this, {
      path: _path,
      file: _file,
      filePath: path.join(_path, _name, _file),
      name: _name,
      ds: _ds,
    });
  }

  get path() {
    return __loaderRefs.get(this).path;
  }

  get container() {
    return __loaderRefs.get(this).ds;
  }

  get name() {
    return __loaderRefs.get(this).name;
  }

  get filePath() {
    return __loaderRefs.get(this).filePath;
  }

  get file() {
    return __loaderRefs.get(this).file;
  }

  /**
   *
   * @param _path
   * @returns {*}
   */
  exists(callback) {
    return this.container.connector.getFile(this.name, this.file, (e, res)=> {
      callback(res !== null);
    });
  }

  /**
   *
   * @param callback
   * @returns {boolean}
   */
  load(callback) {
    return this.container.read(this.file, "utf8", (e, data)=> {
      this.contents = data || null;
      callback(e, data);
    });
  }

  /**
   *
   * @returns {*}
   */
  get contents() {
    return __data.get(this);
  }

  /**
   *
   * @param value
   */
  set contents(value) {
    __data.set(this, value);
  }

  /**
   * Saves Loaded File
   * @param callback
   * @returns {*}
   */
  save(callback) {
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
  rename(newPath, callback) {
    return this.container.rename(this.file, newPath, "utf8", (e)=>{
      let _ = __loaderRefs.get(this);
      _.file = newPath;
      __loaderRefs.set(this, _);
      callback(e);
    });
  }

  /**
   * deletes Loaded File
   * @param callback
   * @returns {boolean}
   */
  destroy(cb) {
    return this.container.remove(this.file, cb);
  }

  /**
   * returns raw contents of loaded file
   * @returns {*}
   */
  valueOf() {
    return this.contents || null;
  }

  /**
   * returns JSON-formatted contents of loaded file
   * @returns JSON
   */
  toJSON() {
    return JSON.parse(this.toString());
  }

  /**
   *
   * @param readable
   * @returns string representation of File
   */
  toString(readable = false) {
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
  connect(cb) {
    cb();
  }

  /**
   *
   * @param cb
   */
  disconnect(cb) {
    cb();
  }
}
export default FileComponent;
