const multer = require("multer");
var fs = require("fs");

// Return multer object

module.exports = {
	uploader(destination, fileNamePrefix, fileExt) {
		let defaultPath = "./public";

		const storage = multer.diskStorage({
			destination: (req, file, cb) => {
				const dir = defaultPath + destination;
				if (fs.existsSync(dir)) {
					cb(null, dir);
				} else {
					fs.mkdir(dir, { recursive: true }, (err) => cb(err, dir));
				}
			},
			filename: (req, file, cb) => {
				let originalname = file.originalname;
				let ext = originalname.split(".");
				let filename = fileNamePrefix + Date.now() + file.originalname;
				cb(null, filename);
			},
		});

		const fileFilter = (req, file, cb) => {
			const ext = fileExt || /\.(jpg|JPG|jpeg|JPEG|png|PNG)$/;
			if (!file.originalname.match(ext)) {
				return cb(new Error("Only selected files are allowed"), false);
			}
			cb(null, true);
		};

		return multer({
			storage,
			fileFilter,
		});
	},
};
