import { type OsgObject } from "./core/osg";
import { convertModel } from "./core/osg/converting";

Object.assign(window as unknown as never, {
  convertModel(model: OsgObject) {
    const result = convertModel(model);
    return result;
  },
  saveModel(model: OsgObject) {
    const result = convertModel(model);
    return JSON.stringify(result);
  },
});
