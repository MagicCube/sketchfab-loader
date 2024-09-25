import { convertModel } from "./core/sketchfab/converter";
import { type SFObject } from "./core/sketchfab/types";

Object.assign(window as unknown as any, {
  convertModel(model: SFObject) {
    const result = convertModel(model);
    return result;
  },
  saveModel(model: SFObject) {
    const result = convertModel(model);
    return JSON.stringify(result);
  },
});
