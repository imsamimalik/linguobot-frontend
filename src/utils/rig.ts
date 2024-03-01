import { Euler, Quaternion, SkeletonHelper, Vector3 } from 'three';
// import { modelMap } from './rpm.mapping'
import { modelMap } from './mixamo.mapping'

var initRotation: any = {};


export const rigRotation = (
  name: any,
  skeletonHelper: SkeletonHelper,
  rotation: any = { x: 0, y: 0, z: 0 },
  dampener = 1,
  lerpAmount = 0.3
) => {
  var skname = modelMap[name].name; // convert name with model json binding info
  if (skname == undefined) {
    return;
  }
  // find bone in bones by name
  var b = skeletonHelper.bones.find((bone: any) => bone.name == skname);

  if (b) {
    if (!initRotation[name]) {
      initRotation[name] = {
        x: b.rotation.x,
        y: b.rotation.y,
        z: b.rotation.z,
      };
    }
    var bindingFunc = modelMap[name].func;
    const x = rotation.x * dampener;
    const y = rotation.y * dampener;
    const z = rotation.z * dampener;

    let euler = new Euler(
      initRotation[name].x + eval(bindingFunc.fx),
      initRotation[name].y + eval(bindingFunc.fy),
      initRotation[name].z + eval(bindingFunc.fz),
      rotation.rotationOrder || 'XYZ'
    );
    let quaternion = new Quaternion().setFromEuler(euler);
    b.quaternion.slerp(quaternion, lerpAmount); // interpolate
  } else {
    console.log( name + 'bone not found');
  }
};

// Animate Position Helper Function
export const rigPosition = (
  name: any,
  skeletonHelper: SkeletonHelper,
  position = { x: 0, y: 0, z: 0 },
  dampener = 1,
  lerpAmount = 0.3
) => {
  name = modelMap[name].name; // convert name with model json binding info
  // find bone in bones by name
  var b = skeletonHelper.bones.find((bone: any) => bone.name == name);
  if (b) {
    let vector = new Vector3(
      position.x * dampener,
      position.y * dampener,
      -position.z * dampener
    );
    b.position.lerp(vector, lerpAmount); // interpolate
  } else {
    console.log( name + 'bone not found');
  }
};

export const rigFace = (riggedFace: any) => {

}
