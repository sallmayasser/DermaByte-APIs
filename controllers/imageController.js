const asyncHandler = require('express-async-handler');
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
  {
    name: 'diseasePhoto',
    maxCount: 1,
  },
  {
    name: 'uploadedTest',
    maxCount: 30,
  },
  {
    name: 'testResult',
    maxCount: 30,
  },
]);

exports.resizeImage = asyncHandler(async (req, res, next) => {
  // console.log(req.body.role);
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
      // Upload the file in the bucket storage
      const snapshot = await uploadBytesResumable(
        storageRef,
        req.files.profilePic[0].buffer,
        metadata,
      );
      const downloadURL = await getDownloadURL(snapshot.ref);
      req.body.profilePic = downloadURL;
    }

    if (req.files.diseasePhoto) {
      const filename = `scanphoto-${uuidv4()}-${Date.now()}.jpeg`;
      const storageRef = ref(storage, `uploads/scans/${filename}`);
      const metadata = {
        contentType: req.files.diseasePhoto[0].mimetype,
      };
      // Upload the file in the bucket storage
      const snapshot = await uploadBytesResumable(
        storageRef,
        req.files.diseasePhoto[0].buffer,
        metadata,
      );
      const downloadURL = await getDownloadURL(snapshot.ref);
      req.body.diseasePhoto = downloadURL;
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
          req.body.license.push(downloadURL);
        }),
      );
    }
    //2)image processing for images
    if (req.files.uploadedTest) {
      req.body.uploadedTest = [];
      await Promise.all(
        req.files.uploadedTest.map(async (img, index) => {
          const imageName = `reservation-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
          const storageRef = ref(storage, `uploads/reservations/${imageName}`);

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
          req.body.uploadedTest.push(downloadURL);
        }),
      );
    }
    if (req.files.testResult) {
      req.body.testResult = [];
      await Promise.all(
        req.files.testResult.map(async (img, index) => {
      
          const imageName = `Result-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
          const storageRef = ref(storage, `uploads/Results/${imageName}`);

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
          req.body.testResult.push(downloadURL);
        }),
      );
    }
    next();
  } else {
    return next(new ApiError('incorrect role found ', 401));
  }
});
