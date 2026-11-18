import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

type Props = {
  targetId: string | null;
  controls: React.RefObject<OrbitControlsImpl | null>;
  panelOpen: boolean;
  sideView?: boolean;
};

const OVERVIEW = new Vector3(0, 20, 45);
const worldPos = new Vector3();
const desired = new Vector3();
const fromSun = new Vector3();
const side = new Vector3();

/** Hur många pixlar bilden ska förskjutas för att motivet inte ska hamna bakom panelen */
function panelOffset(wide: boolean) {
  const el = document.querySelector<HTMLElement>(
    ".mission-panel, .info-panel.open",
  );
  if (!el) return { x: 0, y: 0 };
  return wide
    ? { x: el.offsetWidth / 2, y: 0 }
    : { x: 0, y: el.offsetHeight / 2 };
}

export function CameraRig({ targetId, controls, panelOpen, sideView }: Props) {
  const lookAt = useRef(new Vector3());
  const lastTarget = useRef(new Vector3());
  const offset = useRef({ x: 0, y: 0 });
  const { camera, scene, size } = useThree();

  useFrame((_, delta) => {
    const wide = size.width / size.height >= 0.9;
    const narrow = wide ? 1 : 1.7;

    const target = targetId ? scene.getObjectByName(targetId) : null;
    if (target) {
      target.getWorldPosition(worldPos);
    } else {
      worldPos.set(0, 0, 0);
    }

    // Hoppade målet långt sedan förra bildrutan? Följ med direkt i stället för att glida.
    const jumped = worldPos.distanceTo(lastTarget.current) > 3;
    lastTarget.current.copy(worldPos);
    const t = jumped ? 1 : Math.min(1, delta * 2);

    if (target && sideView) {
      // Vinkelrätt mot solriktningen, så halva jorden alltid ligger i ljus
      fromSun.copy(worldPos).normalize();
      side.set(-fromSun.z, 0, fromSun.x);
      desired
        .copy(worldPos)
        .addScaledVector(side, 4.5 * narrow)
        .addScaledVector(fromSun, -0.6)
        .add(new Vector3(0, 2 * narrow, 0));
    } else if (target) {
      desired.copy(worldPos).add(new Vector3(0, 1.5 * narrow, 5 * narrow));
    } else {
      desired.copy(OVERVIEW).multiplyScalar(narrow);
    }

    camera.position.lerp(desired, t);
    lookAt.current.lerp(worldPos, t);

    // Förskjut bilden i sidled eller uppåt så panelen inte täcker motivet
    const want = panelOpen ? panelOffset(wide) : { x: 0, y: 0 };
    const k = jumped ? 1 : Math.min(1, delta * 5);
    offset.current.x += (want.x - offset.current.x) * k;
    offset.current.y += (want.y - offset.current.y) * k;
    camera.setViewOffset(
      size.width,
      size.height,
      offset.current.x,
      offset.current.y,
      size.width,
      size.height,
    );

    if (controls.current) {
      controls.current.target.copy(lookAt.current);
      controls.current.update();
    }
  });

  return null;
}
