const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');
const createToken = require('../utils/createToken');

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }

   // Trigger "remove" event when update document
    // document.remove();
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
     const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
       new: true,
     });

    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404),
      );
    }
    // Trigger "save" event when update document
    document.save();
    res.status(200).json({ data: document });
  });

  exports.AppendOne = (Model) =>
    asyncHandler(async (req, res, next) => {
      const document = await Model.findByIdAndUpdate(
        req.params.id,
        { $push: req.body },
        {
          new: false,
          returnOriginal: true,
        },
      );

      if (!document) {
        return next(
          new ApiError(`No document for this id ${req.params.id}`, 404),
        );
      }
      // Trigger "save" event when update document
      document.save();
      res.status(200).json({ data: document });
    });
    
// exports.createOne = (Model, populationOpt) =>
//   asyncHandler(async (req, res) => {

//     let newDoc = await Model.create(req.body);
//         if (populationOpt) {
//           // Populate the specified fields
//           newDoc = await newDoc.populate(populationOpt).execPopulate();
//         }
//     res.status(201).json({ data: newDoc });
//   });
exports.createOne = (Model, populationOpt) =>
  asyncHandler(async (req, res) => {
    let newDoc = await Model.create(req.body);

    // Check if population option is provided
    if (populationOpt) {
      // Populate the specified fields
      newDoc = await newDoc.populate(populationOpt).execPopulate();
    }

    // Convert the document to JSON with virtuals
    const responseData = newDoc.toJSON({ virtuals: true });
    res.status(201).json({ data: responseData });
  });


exports.getOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 1) Build query
    let query = Model.findById(id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }
    // 2) Execute query
    const document = await query;
    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

exports.getAll = (Model, populationOpt,modelName = '') =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    
    // Build query
    const documentsCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCounts)
      .filter()
      .search(modelName)
      .limitFields()
      .sort();
      if (populationOpt) {
        apiFeatures.mongooseQuery = apiFeatures.mongooseQuery.populate(populationOpt);
      }
    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;
    
    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });

  exports.createFilterObj = (req, res, next, filterType) => {
    let filterObject = {};
  
    if (filterType === 'patient') {
      filterObject = { patient: req.params.id };
    } else if (filterType === 'dermatologist') {
      filterObject = { dermatologist: req.params.id };
    } else if (filterType === 'lab') {
      filterObject = { lab: req.params.id };
    }
    req.filterObj = filterObject;
     console.log(filterObject)
    next();
};
  
exports.changeUserPassword =(Model)=> asyncHandler(async (req, res, next) => {
  const document = await Model.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    },
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});
// @desc    Get Logged user data
// @route   GET /api/v1/users/getMe
// @access  Private/Protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc    Update logged user password
// @route   PUT /api/v1/users/updateMyPassword
// @access  Private/Protect
exports.updateLoggedUserPassword = (Model)=>asyncHandler(async (req, res, next) => {
  // 1) Update user password based user payload (req.user._id)
  const user = await Model.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    },
  );

  // 2) Generate token
  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});



// @desc    Deactivate logged user
// @route   DELETE /api/v1/users/deleteMe
// @access  Private/Protect
exports.deleteLoggedUserData =(Model) => asyncHandler(async (req, res, next) => {
  await Model.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: 'Success' });
});