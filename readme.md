# image-optimize-sls
an image optimizing proxy designed to sit behind cloudfront or another cdn service
that for caching and edge distribution.

## required
- `url`: the url of the image you want to optimize.

## optional
- `format`: the format to convert the image to (e.g., 'webp', 'jpeg') (default: webp).
- `width`: the width to resize the image to.
- `height`: the height to resize the image to.
- `fit`: how to fit the image when both width and height are provided ('cover', 'contain', 'fill', 'inside', 'outside').
- `quality`: the quality of the image (0-100).
- `thumbnail`: whether to generate a thumbnail (true/false).
- `debug`: return debugging information in json (true/false).

## examples
- `https://your-api.com/optimize?url=https://example.com/image.jpg`
- `https://your-api.com/optimize?url=https://example.com/image.jpg&format=webp&width=300&quality=85`
- `https://your-api.com/optimize?url=https://example.com/image.jpg&thumbnail=1`

