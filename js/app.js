const root = document.getElementById("root");
document.body.onload = main;

async function loadImage(src) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (err) => {
      reject(err);
    };
    img.src = src;
  });
}

function getRGBA(img) {
  let canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  let ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);
  return ctx.getImageData(0, 0, img.width, img.height);
}

//http://support.ptc.com/help/mathcad/en/index.html#page/PTC_Mathcad_Help/example_grayscale_and_color_in_images.html
function rgb2gray(img) {
  let pixels = getRGBA(img).data;
  let temp = [];
  for (let i = 0; i < pixels.length; i += 4) {
    let r = pixels[i] * 0.299;
    let g = pixels[i + 1] * 0.587;
    let b = pixels[i + 2] * 0.114;
    let grayscale = Math.floor(r + g + b);
    temp.push(grayscale);
    temp.push(grayscale);
    temp.push(grayscale);
    temp.push(pixels[i + 3]);
  }
  return new ImageData(Uint8ClampedArray.from(temp), img.width, img.height);
}

function drawImageData(root_element, img_data) {
  let img_width = img_data.width;
  let img_height = img_data.height;
  let canvas = document.createElement("canvas");
  canvas.width = img_width;
  canvas.height = img_height;
  ctx = canvas.getContext("2d");
  ctx.putImageData(img_data, 0, 0);
  root_element.appendChild(canvas);
}

function minRGB(img_data) {
  let pixels = img_data.data;
  let min = [255, 255, 255];
  for (let i = 0; i < pixels.length; i += 4) {
    let r = pixels[i];
    let g = pixels[i + 1];
    let b = pixels[i + 2];
    if (r < min[0]) {
      min[0] = r;
    } else if (g < min[1]) {
      min[1] = g;
    } else if (b < min[2]) {
      min[2] = b;
    }
  }
  return min;
}

function maxRGB(img_data) {
  let pixels = img_data.data;
  let max = [0, 0, 0];
  for (let i = 0; i < pixels.length; i += 4) {
    let r = pixels[i];
    let g = pixels[i + 1];
    let b = pixels[i + 2];
    if (r > max[0]) {
      max[0] = r;
    } else if (g > max[1]) {
      max[1] = g;
    } else if (b > max[2]) {
      max[2] = b;
    }
  }
  return max;
}

function simpleAutoContrast(img_data) {
  let fmin = minRGB(img_data);
  let fmax = maxRGB(img_data);
  let pixels = img_data.data;
  let temp = [];
  for (let i = 0; i < pixels.length; i += 4) {
    let r = Math.floor(((pixels[i] - fmin[0]) / (fmax[0] - fmin[0])) * 255);
    let g = Math.floor(((pixels[i + 1] - fmin[1]) / (fmax[1] - fmin[1])) * 255);
    let b = Math.floor(((pixels[i + 2] - fmin[2]) / (fmax[2] - fmin[2])) * 255);
    temp.push(r);
    temp.push(g);
    temp.push(b);
    temp.push(pixels[i + 3]);
  }
  return new ImageData(
    Uint8ClampedArray.from(temp),
    img_data.width,
    img_data.height
  );
}

function autoContrast(img_data, gmin = 0, gmax = 255) {
  let fmin = minRGB(img_data);
  let fmax = maxRGB(img_data);
  let pixels = img_data.data;
  let temp = [];
  for (let i = 0; i < pixels.length; i += 4) {
    let r = Math.floor(
      gmin + ((pixels[i] - fmin[0]) / (fmax[0] - fmin[0])) * (gmax - gmin)
    );
    let g = Math.floor(
      gmin + ((pixels[i + 1] - fmin[1]) / (fmax[1] - fmin[1])) * (gmax - gmin)
    );
    let b = Math.floor(
      gmin + ((pixels[i + 2] - fmin[2]) / (fmax[2] - fmin[2])) * (gmax - gmin)
    );

    temp.push(r);
    temp.push(g);
    temp.push(b);
    temp.push(pixels[i + 3]);
  }
  return new ImageData(
    Uint8ClampedArray.from(temp),
    img_data.width,
    img_data.height
  );
}

function medianFilter(img_data, filter_size = 3) {
  if (filter_size % 2 === 0)
    throw new Error("Invalid filter size (must be odd)");
  let pixels = img_data.data;
  for (let i = 0; i < pixels.length; i++) {}
}
/**
 * @param {*} array the one dimensional input array
 * @param {*} i_step the amount of values belonging to one index
 * @param {*} row_width the row_width that the two dimension output array should have
 * @returns a two dimensional array from the one dimensional input array
 */
function one2two(array, i_step, row_width) {
  row_width *= i_step;
  let result = [];
  let row = [];
  for (let i = 0; i < array.length; i++) {
    if (i === 0) {
      row.push(array[i]);
      continue;
    } else if (i % (row_width - 1) !== 0) {
      row.push(array[i]);
    } else {
      row.push(array[i]);
      result.push(row);
      row = [];
    }
  }
  return result;
}

function drawImage(root_element, img) {
  let img_data = getRGBA(img);
  let img_width = img.width;
  let img_height = img.height;
  let canvas = document.createElement("canvas");
  canvas.width = img_width;
  canvas.height = img_height;
  ctx = canvas.getContext("2d");
  ctx.putImageData(img_data, 0, 0);
  root_element.appendChild(canvas);
}

async function main() {
  var img = await loadImage("./images/4.png");
  let before1 = rgb2gray(img);
  let after1 = autoContrast(before1, 0, 255);
  let negative = autoContrast(after1, 255, 0);
  drawImageData(root, before1);
  drawImageData(root, after1);
  drawImageData(root, negative);
}
