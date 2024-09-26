import { type Object } from "./core/osg";
import { convertModel } from "./core/osg/converting";

Object.assign(window as unknown as never, {
  convertModel(model: Object) {
    const result = convertModel(model);
    return result;
  },
  saveModel(model: Object) {
    const result = convertModel(model);
    return JSON.stringify(result);
  },
});
