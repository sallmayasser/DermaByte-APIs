/* eslint-disable guard-for-in */
/* eslint-disable no-await-in-loop */
const asyncHandler = require('express-async-handler');
const fs = require('fs');
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
const { createResult } = require('./resultController');
// Initialize a firebase application
initializeApp(config.firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

exports.uploadImage = uploadMixOfImages([
  {
    name: 'license',
    maxCount: 20,
  },
  {
    name: 'profilePic',
    maxCount: 1,
  },
  {
    name: 'diseasePhoto',
    maxCount: 1,
  },
  // {
  //   name: 'uploadedTest',
  //   maxCount: 30,
  // },
  {
    name: 'testResult',
    maxCount: 30,
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
      const responses = [];
      req.body.uploadedTest = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const key in req.files.uploadedTest) {
        const images = [];
        await Promise.all(
          req.files.uploadedTest[key].map(async (img, index) => {
            const imageName = `uploadedResult-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
            const storageRef = ref(storage, `uploads/Results/${imageName}`);
            const buffer = fs.readFileSync(img.filepath);
            const metadata = {
              contentType: img.mimetype,
            };

            // Upload the file to the bucket storage
            const snapshot = await uploadBytesResumable(
              storageRef,
              buffer,
              metadata,
            );
            const downloadURL = await getDownloadURL(snapshot.ref);
            images.push(downloadURL);
          }),
        );

        const tests = {
          testName: key,
          testResult: images,
        };
        req.body.uploadedTest.push(tests);
      }
    }
    if (req.files.testResult) {
      const responses = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const key in req.files.testResult) {
        req.body.testResult = [];
        // console.log(req.files.testResult)
        await Promise.all(
          req.files.testResult[key].map(async (img, index) => {
            const imageName = `Result-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
            const storageRef = ref(storage, `uploads/Results/${imageName}`);
            //  const fileBuffer = img.filepath.getBuffer();
            const buffer = fs.readFileSync(img.filepath);
            const metadata = {
              contentType: img.mimetype,
            };

            // Upload the file in the bucket storage
            const snapshot = await uploadBytesResumable(
              storageRef,
              buffer,
              metadata,
            );
            const downloadURL = await getDownloadURL(snapshot.ref);
            req.body.testResult.push(downloadURL);
          }),
        );
        req.body.testName = key;

        responses.push(await createResult(req, res));
      }
      res.status(201).json({ data: responses });
    } else {
      next();
    }
  } else {
    return next(new ApiError('incorrect role found ', 401));
  }
});
