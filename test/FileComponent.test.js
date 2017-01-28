"use strict";
import FileComponent from "../lib/FileComponent";

describe("FileComponent Test Suite", ()=>{
  const _files = "test string";
  const _root = global.APP_ROOT || process.env.PWD;
  const _file = "a_file.txt"

  const _loader = new FileComponent({
      name: "files",
      path: _root,
      file: _file
  });

  it("should get/set contents", () => {
    _loader.contents = _files;
    _loader.contents.should.eq(_files);
  });
  it("should write to a file", (done)=>{
    _loader.save((e)=> {
      expect(e).to.not.exist;
      fs.access( path.join(_root, "files", _file), (e)=>{
        expect(e).to.not.exist;
      });
      done();
    })
  });
  it("should load a file", (done)=>{
    _loader.load((e, files)=> {
      expect(e).to.not.exist;
      files.should.eq(_files);
      done();
    });

  });
  it("should rename a file", (done)=>{
    let newName = "renamed.txt";
    _loader.rename(newName, (e)=>{
      expect(e).to.not.exist;
      // tests for renamed file
      fs.lstat( path.join(_root, "files", newName), (e, r)=>{
        expect(e).to.not.exist;
        expect(r).to.exist;
        // tests if original file has been removed
        fs.lstat( path.join(_root, "files", "___"), (e, r)=>{
          expect(e).to.exist;
          expect(r).to.not.exist;
          done();
        });
      });
    });
  });
  it("should delete a file", (done)=>{
    _loader.destroy((e)=>{
      expect(e).to.not.exist;
      fs.lstat( path.join(_root, "files", _file), (e)=>{
        // expect(e).to.exist;
        done();
      });
    });
  });
});
