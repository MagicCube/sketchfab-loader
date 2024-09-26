import { type Object } from "./core/osg";
import { convertModel } from "./core/osg/converting";
import osgJSON from "./core/osgjson/tesla-model-3.osg.json";

Object.assign(window as unknown as never, {
  convertModel(model: Object) {
    const result = convertModel(model, osgJSON);
    return result;
  },
  saveModel(model: Object) {
    const result = convertModel(model, osgJSON);
    return JSON.stringify(result);
  },
});
