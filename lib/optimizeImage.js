let axios = require('axios');
let sharp = require('sharp');
//
// let fs = require('fs').promises;

async function optimizeImage(imageUrl, options = {}) {
  options.height = options.height || null;
  options.width = options.width || null;
  options.format = options.format || 'webp';
  options.fit = options.fit || null;
  options.quality = options.quality || 100;
  options.compression = options.compression || 10;
  options.thumbnail = options.thumbnail || false;

  let response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  let originalImgBuffer = Buffer.from(response.data, 'binary');

  let meta = {}
  meta.bytesOriginal = originalImgBuffer.length;

  console.log(`Original image size: ${originalImgBuffer.length} bytes`);

  let sharpInstance = sharp(originalImgBuffer);

  if (options.thumbnail) {
    sharpInstance.resize(150, 150, { fit: 'cover' }).extract({ left: 0, top: 0, width: 150, height: 150 });
  } else {
    let resizeOptions = {
      width: options.width ? parseInt(options.width) : null,
      height: options.height ? parseInt(options.height) : null,
      fit: options.fit || 'inside',
    };

    if (resizeOptions.width !== null || resizeOptions.height !== null) {
      sharpInstance.resize(resizeOptions);
    }
  }

  let optimizedImgBuffer = await sharpInstance
    .toFormat(options.format, { 
      quality: parseInt(options.quality),
      compressionLevel: parseInt(options.compression),
      mozjpeg: true,
      lossless: true,
    })
    .toBuffer();

  console.log(`Optimized image size: ${optimizedImgBuffer.length} bytes`);

  meta.bytesResult = optimizedImgBuffer.length;
  meta.bytesSaved = meta.bytesOriginal - meta.bytesResult;

  let suffix = options.thumbnail ? '_thumbnail' : '';

  //await fs.writeFile(`optimized_image${suffix}.${options.format}`, optimizedImgBuffer);
  //console.log(`Image has been optimized and saved as optimized_image${suffix}.${options.format}`);

  return {
    buffer: optimizedImgBuffer,
    options,
    meta,
  };
}

//
if (!module.parent) {
  console.log('testing');
}else{
  module.exports = optimizeImage;
}

