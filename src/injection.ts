import { type SFObject } from "./core/sketchfab";
import { convertModel } from "./core/sketchfab/converting";

Object.assign(window as unknown as never, {
  convertModel(model: SFObject) {
    const result = convertModel(model);
    return result;
  },
  saveModel(model: SFObject) {
    const result = convertModel(model);
    return JSON.stringify(result);
  },
});
