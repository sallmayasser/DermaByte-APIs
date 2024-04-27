const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require('firebase/storage');
const { initializeApp } = require('firebase/app');
const { uploadMixOfImages } = require('../middleware/uploadImageMiddleware');
const ApiError = require('../utils/apiError');
const config = require('../Configs/firebase');

// Initialize a firebase application
initializeApp(config.firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

exports.uploadImage = uploadMixOfImages([
  {
    name: 'profilePic',
    maxCount: 1,
  },
  {
    name: 'license',
    maxCount: 20,
  },
]);

exports.resizeImage = asyncHandler(async (req, res, next) => {
  ///1)image processing for profile Name
  if (
    req.body.role === 'patient' ||
    req.body.role === 'dermatologist' ||
    req.body.role === 'lab'
  ) {
    if (req.files.profilePic) {
      const filename = `${req.body.role}-${uuidv4()}-${Date.now()}.jpeg`;
      const storageRef = ref(storage, `uploads/${req.body.role}s/${filename}`);
      const metadata = {
        contentType: req.files.profilePic[0].mimetype,
      };
      console.log(req.files.profilePic[0].mimetype);
      // Upload the file in the bucket storage
      const snapshot = await uploadBytesResumable(
        storageRef,
        req.files.profilePic[0].buffer,
        metadata,
      );
      const downloadURL = await getDownloadURL(snapshot.ref);
      req.body.profilePic = downloadURL;
    }
    ///2)image processing for images
    if (req.files.license) {
      req.body.license = [];
      await Promise.all(
        req.files.license.map(async (img, index) => {
          const filename = `${req.body.role}-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
           const storageRef = ref(
             storage,
             `uploads/${req.body.role}s/${filename}`,
           );

           const metadata = {
             contentType: img.mimetype,
           };

           // Upload the file in the bucket storage
           const snapshot = await uploadBytesResumable(
             storageRef,
             img.buffer,
             metadata,
           );

           const downloadURL = await getDownloadURL(snapshot.ref);

           // save the download URL to the license array
           req.body.license.push(downloadURL);
          // await sharp(img.buffer)
          //   .resize(600, 600)
          //   .toFormat('jpeg')
          //   .jpeg({ quality: 95 })
          //   .toFile(`uploads/${req.body.role}s/${filename}`);
          // // save image into our database
          // req.body.license.push(filename);
        }),
      );
    }
    next();
  } else {
    return next(new ApiError('incorrect role found ', 401));
  }
});
