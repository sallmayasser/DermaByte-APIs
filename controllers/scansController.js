const axios = require('axios');
const asyncHandler = require('express-async-handler');
const Scans = require('../models/scansModel');
const factory = require('./handlersFactory');
const ApiError = require('../utils/apiError');
const scansModel = require('../models/scansModel');

// async function getDiseasePrediction(diseasePhoto) {
//   const client = new Client('DermaByte/DermaByteApp');
//   const result = await client.predict({
//     image_url: diseasePhoto,
//     api_name: '/predict',
//   });
//   return result.data;
// }

exports.getScans = factory.getAll(Scans);

exports.getScan = factory.getOne(Scans);

exports.createScan = asyncHandler(async (req, res, next) => {
  const { diseasePhoto } = req.body;
  // console.log(diseasePhoto);
  try {
    const response = await axios.post(
      'https://dermabytemodel.onrender.com/predict',
      {
        image_url: diseasePhoto,
      },
    );
    req.body.diseaseName = response.data.predicted_class;
    req.body.description = description(req.body.diseaseName);
    const newDoc = await scansModel.create(req.body);
    res.status(200).json({data:newDoc});
  } catch (error) {
    // Handle error
    console.error(error);
    return next(new ApiError(`Please try again later `, 500));
  }
});

exports.deleteScan = factory.deleteOne(Scans);

exports.setPatientIdToBody = (req, res, next) => {
  // Nested route (Create)
  if (!req.body.patient) req.body.patient = req.params.id;
  next();
};

function description(diseaseName) {
  switch (diseaseName) {
    case 'nail-fungus':
      return 'Nail fungus, also known as onychomycosis, is a common condition caused by fungal infection of the nails. It often occurs due to prolonged exposure to warm and moist environments. To protect yourself, keep your feet clean and dry, avoid walking barefoot in public places like swimming pools and locker rooms, and wear clean socks and well-ventilated shoes.';
    case 'ringworm':
      return 'Ringworm is a common fungal infection of the skin and is not caused by a worm. It spreads through direct contact with an infected person or animal, or by touching contaminated objects. To prevent ringworm, practice good hygiene, avoid sharing personal items like towels and clothing, and keep your skin clean and dry.';
    case 'shingles':
      return 'Shingles is a viral infection that causes a painful rash. It is caused by the varicella-zoster virus, the same virus that causes chickenpox. After a person has had chickenpox, the virus can remain dormant in the body and reactivate later in life, causing shingles. To reduce the risk of shingles, get vaccinated and maintain a healthy immune system.';
    case 'impetigo':
      return 'Impetigo is a highly contagious bacterial skin infection. It is commonly caused by Staphylococcus aureus or Streptococcus pyogenes bacteria. Impetigo spreads through direct contact with infected skin or objects contaminated with the bacteria. To prevent impetigo, practice good hygiene, avoid sharing personal items, and promptly treat any cuts or scrapes.';
    case 'athlete-foot':
      return "Athlete's foot is a fungal infection that usually affects the skin between the toes. It thrives in warm and moist environments, such as sweaty shoes and locker room floors. To prevent athlete's foot, keep your feet clean and dry, wear clean socks and shoes, and avoid walking barefoot in public places.";
    case 'chickenpox':
      return 'Chickenpox is a highly contagious viral infection characterized by an itchy rash and red spots. It is caused by the varicella-zoster virus. Chickenpox spreads through respiratory droplets or direct contact with the rash. To prevent chickenpox, get vaccinated and avoid close contact with infected individuals.';
    case 'cutaneous-larva-migrans':
      return 'Cutaneous larva migrans is a skin condition caused by hookworm larvae. The larvae penetrate the skin and cause a winding red rash. Infection occurs through contact with contaminated soil or sand. To prevent cutaneous larva migrans, avoid walking barefoot in areas where hookworms are prevalent and use protective footwear.';
    case 'cellulitis':
      return 'Cellulitis is a bacterial infection of the skin that can spread rapidly. It is usually caused by bacteria such as Staphylococcus or Streptococcus. Cellulitis can occur when bacteria enter the skin through cuts, wounds, or cracks. To prevent cellulitis, practice good wound care, keep your skin clean, and promptly treat any skin injuries.';
    default:
      return 'Unexpected disease.';
  }
}
