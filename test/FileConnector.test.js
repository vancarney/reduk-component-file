"use strict";
import FileConnector from "../lib/FileConnector";

describe("FileConnector Test Suite", ()=>{
  let _root = global.APP_ROOT || process.env.PWD;
  let _containerPath = _root;
  let _fileName = "file_connector_write_test.txt";
  let _filePath = path.join(_containerPath, "files", _fileName);
  let _writeString = "testing write string";
  let _con = new FileConnector(_containerPath, "files");

  it("should provide Storage API", () => {
    let _keys = Object.keys(_con.connector);
    _keys.indexOf("createContainer").should.be.above(-1);
    _keys.indexOf("destroyContainer").should.be.above(-1);
    _keys.indexOf("download").should.be.above(-1);
    _keys.indexOf("downloadStream").should.be.above(-1);
    _keys.indexOf("getContainer").should.be.above(-1);
    _keys.indexOf("getContainers").should.be.above(-1);
    _keys.indexOf("getFile").should.be.above(-1);
    _keys.indexOf("getFiles").should.be.above(-1);
    _keys.indexOf("removeFile").should.be.above(-1);
    _keys.indexOf("upload").should.be.above(-1);
    _keys.indexOf("download").should.be.above(-1);
    _keys.indexOf("uploadStream").should.be.above(-1);
  });

  it("should write a file to a path", (done)=>{
    _con.write(_fileName, _writeString, "utf8", (e)=> {
      expect(e).to.not.exist;
      fs.lstat( _filePath, (e, r)=>{
        expect(e).to.not.exist;
        expect(r).to.exist;
        done();
      });

    });
  });

  it("should load a file from a path", (done)=>{
    let _ = _con.read( _fileName, "utf8", (e ,data)=> {
      data.should.eq(_writeString);
      done();
    });
  });

  it("should remove a file at path", (done)=>{
    _con.remove( _fileName, (e)=>{
      expect(e).to.not.exist;
      fs.lstat( _filePath, (e, r)=>{
        expect(e).to.exist;
        expect(r).to.not.exist;
        done();
      });
    });
  });
});
