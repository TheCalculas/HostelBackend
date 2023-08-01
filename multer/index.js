const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Student = require("../models/student");
var jwt = require("jsonwebtoken");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: async function (req, file, cb) {
    console.log("Hello : Request Inside Multer : ->");
    console.log(req);
    console.log("Hello File: ", file);
    let checkStudent;
   
    console.log("Body: ", req.body);
    const {studentToken} = await req.body;
    let data = jwt.verify(studentToken, `${process.env.JWT_SECRET}`);

    const studentId = data._id;
    // console.log(studentId);
    checkStudent = await Student.findOne({ _id: studentId });
    

    cb(null, (checkStudent ? (checkStudent.email ? checkStudent.email.slice(0, 11).toUpperCase() : "") : "" ) + "_" + file.originalname);
  },
});

//********** MULTER *******/
const upload = multer({
  storage: storage,
  // fileFilter: function (req, file, cb) {
  //   // Set the filetypes, it is optional
  //   var filetypes = /xlsx|xls/;
  //   var mimetype = filetypes.test(file.mimetype);

  //   var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  //   if (mimetype && extname) {
  //     return cb(null, true);
  //   }

  //   cb(
  //     "Error: File upload only supports the " +
  //       "following filetypes - " +
  //       filetypes
  //   );
  // },
});

let removeFile = async (filename) => {
  try {
    fs.unlinkSync("/uploads" + "/" +  filename);
    // console.log("hello - remove");
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  // cloudinary,
  upload,
  removeFile,
};
