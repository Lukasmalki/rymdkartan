import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

type Props = {
  targetId: string | null;
  controls: React.RefObject<OrbitControlsImpl | null>;
  panelOpen: boolean;
};

const OVERVIEW = new Vector3(0, 20, 45);
const worldPos = new Vector3();
const desired = new Vector3();

export function CameraRig({ targetId, controls, panelOpen }: Props) {
  const lookAt = useRef(new Vector3());
  const { camera, scene, size } = useThree();

  useFrame((_, delta) => {
    const t = Math.min(1, delta * 2);
    const narrow = size.width / size.height < 0.9 ? 1.7 : 1;
    const wide = size.width / size.height >= 0.9;
    const shift = panelOpen ? (wide ? 3.5 : 0) : 0;
    const lift = panelOpen && !wide ? 2 : 0;
    const target = targetId ? scene.getObjectByName(targetId) : null;

    if (target) {
      target.getWorldPosition(worldPos);
      desired
        .copy(worldPos)
        .add(new Vector3(shift, 1.5 * narrow + lift, 5 * narrow));
    } else {
      worldPos.set(0, 0, 0);
      desired.copy(OVERVIEW).multiplyScalar(narrow);
    }

    camera.position.lerp(desired, t);
    worldPos.x += shift * 0.55;
    worldPos.y += lift * 0.5;
    lookAt.current.lerp(worldPos, t);
    if (controls.current) {
      controls.current.target.copy(lookAt.current);
      controls.current.update();
    }
  });

  return null;
}
