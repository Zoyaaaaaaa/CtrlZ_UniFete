// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');

// cloudinary.config(
//     cloud_name=process.env.CLOUD_NAME
//     cloud_api=process.env.CLOUD_API
//     cloud_secret=process.env.CLOUD_SECRET
// )
// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: 'some-folder-name',
//       format: async (req, file) => 'png', // supports promises as well
//       public_id: (req, file) => 'computed-filename-using-request',
//     },
//   });