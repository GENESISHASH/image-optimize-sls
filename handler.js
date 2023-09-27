let fs = require('fs').promises;
let MarkdownIt = require('markdown-it');
let md = new MarkdownIt();

let optimizeImage = require('./lib/optimizeImage');

module.exports.optimize = async (event) => {
  let imageUrl = event.queryStringParameters?.url;
  let options = event.queryStringParameters;

  if (!imageUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'url parameter is required' }),
    };
  }

  try {
    let optimizedImage = await optimizeImage(imageUrl, options);

    let returnObj = {
      statusCode: 200,
      headers: { 'Content-Type': 'image/' + optimizedImage.options.format },
      body: optimizedImage.buffer.toString('base64'),
      isBase64Encoded: true,
    };

    if (options.debug) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          result: returnObj,
          options: optimizedImage.options,
          meta: optimizedImage.meta,
        }),
      }
    }

    return returnObj;

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Image optimization failed', error: error.toString() }),
    };
  }
};

module.exports.readme = async (event) => {
  try {
    let readmeContent = await fs.readFile('./readme.md', 'utf-8');
    let htmlContent = md.render(readmeContent);
    let styleContent = `
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          max-width: 900px;
          margin: auto;
          padding: 20px;
        }
        h1, h2, h3 {
          margin-top: 1em;
          border-bottom: 1px solid #eaecef;
        }
        code {
          background-color: #f6f8fa;
          border: 1px solid #eaecef;
          border-radius: 3px;
          padding: 0.2em 0.4em;
        }
        pre {
          border: 1px solid #eaecef;
          border-radius: 3px;
          padding: 16px;
          overflow: auto;
        }
      </style>
    `;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: styleContent + htmlContent,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to load readme.md', error: error.toString() }),
    };
  }
};


