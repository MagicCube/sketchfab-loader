import { type OSGObject } from "./core/osg";
import { convertModel } from "./core/osg/converting";

Object.assign(window as unknown as never, {
  convertModel(model: OSGObject) {
    const result = convertModel(model);
    return result;
  },
  saveModel(model: OSGObject) {
    const result = convertModel(model);
    return JSON.stringify(result);
  },
});
