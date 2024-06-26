import { palette } from "../palette.js";

// At odds with in-game behavior... doesn't enforce a size with stretching.
export function bitmapTextToImageData(string) {
  const rows = string.trim().split("\n").map(x => x.trim());
  const rowLengths = rows.map(x => x.length);
  const isRect = rowLengths.every(val => val === rowLengths[0])
  if (!isRect) throw new Error("Level must be rect.");
  const width = rows[0].length || 1;
  const height = rows.length || 1;
  const data = new Uint8ClampedArray(width*height*4);
  
  const colors = Object.fromEntries(palette);
  
  const nonSpace = string.split("").filter(x => x !== " " && x !== "\n"); // \S regex was too slow
  for (let i = 0; i < width*height; i++) {
    const type = nonSpace[i] || ".";
  
    if (!(type in colors)) {
      const err = `in sprite string: no known color for char "${type}"`;
      console.error(err + '\n' + string);
      throw new Error(err + ' (invalid sprite in console)');
    }

    const [ r, g, b, a ] = colors[type] ?? colors["."];
    data[i*4] = r;
    data[i*4 + 1] = g;
    data[i*4 + 2] = b;
    data[i*4 + 3] = a;
  }

  return new ImageData(data, width, height);
}
