import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRapier, useRopeJoint, useSphericalJoint, type RapierRigidBody } from '@react-three/rapier';
import { Suspense, useCallback, useEffect, useMemo, useRef } from 'react';
import { BufferAttribute, BufferGeometry, CanvasTexture, CatmullRomCurve3, DoubleSide, Euler, Quaternion, RepeatWrapping, SRGBColorSpace, Vector3 } from 'three';
import { BADGE_SIZE, BADGE_STAGE } from './badge-design';
import type { LanyardSceneItem } from './lanyard-runtime';

type Props = {
  items: readonly LanyardSceneItem[];
  worldKey: string;
  active: boolean;
  onReady: () => void;
  onFailure: () => void;
};

const ZOOM = 100;
const REST_Y = .08;
const ANCHOR_Y = BADGE_STAGE.height / ZOOM / 2;
const SEGMENT = (ANCHOR_Y - REST_Y - 1.4) / 3;
const SAMPLES = 32;
const LABEL_HEIGHT = 40;

function ribbonGeometry() {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(new Float32Array((SAMPLES + 1) * 6), 3));
  const uv = new Float32Array((SAMPLES + 1) * 4);
  const indices: number[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const offset = i * 4;
    uv[offset] = 0;
    uv[offset + 1] = i / SAMPLES;
    uv[offset + 2] = 1;
    uv[offset + 3] = i / SAMPLES;
  }
  geometry.setAttribute('uv', new BufferAttribute(uv, 2));
  for (let i = 0; i < SAMPLES; i++) {
    const n = i * 2;
    indices.push(n, n + 1, n + 2, n + 1, n + 3, n + 2);
  }
  geometry.setIndex(indices);
  return geometry;
}

function labelTexture(label: string, gap: number) {
  const scale = 4;
  const width = BADGE_SIZE.strapWidth - BADGE_SIZE.strapBorder * 2;
  const height = LABEL_HEIGHT + gap;
  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const context = canvas.getContext('2d')!;
  context.scale(scale, scale);
  context.translate(width / 2, height - LABEL_HEIGHT / 2);
  context.rotate(Math.PI / 2);
  context.fillStyle = '#ffffff';
  context.font = '700 7px Arial, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(label, 0, 0);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapT = RepeatWrapping;
  return texture;
}

function Band({ item, active, onReady }: { item: LanyardSceneItem; active: boolean; onReady: (id: string) => void }) {
  const anchor = useRef<RapierRigidBody>(null!);
  const first = useRef<RapierRigidBody>(null!);
  const second = useRef<RapierRigidBody>(null!);
  const third = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);
  const { rapier } = useRapier();
  const invalidate = useThree(state => state.invalidate);
  useRopeJoint(anchor, first, [[0, 0, 0], [0, 0, 0], SEGMENT]);
  useRopeJoint(first, second, [[0, 0, 0], [0, 0, 0], SEGMENT]);
  useRopeJoint(second, third, [[0, 0, 0], [0, 0, 0], SEGMENT]);
  useSphericalJoint(third, card, [[0, 0, 0], [0, 1.4, 0]]);
  const objects = useMemo(() => ({
    curve: new CatmullRomCurve3([new Vector3(), new Vector3(), new Vector3(), new Vector3()]),
    point: new Vector3(), tangent: new Vector3(), start: new Vector3(), target: new Vector3(),
    quaternion: new Quaternion(), euler: new Euler(), angular: new Vector3(),
    outer: ribbonGeometry(), inner: ribbonGeometry(), label: ribbonGeometry(),
    labelTexture: item.design.strapLabel ? labelTexture(item.design.strapLabel, item.design.strapLabelGap) : undefined
  }), [item.design.strapLabel, item.design.strapLabelGap]);
  const mode = useRef(false);
  const sequence = useRef(-1);
  const initialized = useRef(false);
  const lastFrame = useRef('');

  useEffect(() => {
    invalidate();
    return () => {
      objects.outer.dispose();
      objects.inner.dispose();
      objects.label.dispose();
      objects.labelTexture?.dispose();
      if (item.face.current) item.face.current.style.transform = '';
    };
  }, [invalidate, item.face, objects]);
  useEffect(() => { if (active) invalidate(); }, [active, invalidate]);

  useFrame(() => {
    if (!card.current || !anchor.current || !first.current || !second.current || !third.current || !item.face.current) return;
    const body = card.current;
    if (item.drag.current.active && sequence.current !== item.drag.current.sequence) {
      sequence.current = item.drag.current.sequence;
      objects.start.copy(body.translation());
      first.current.wakeUp();
      second.current.wakeUp();
      third.current.wakeUp();
    }
    if (mode.current !== item.drag.current.active) {
      mode.current = item.drag.current.active;
      body.setBodyType(mode.current ? rapier.RigidBodyType.KinematicPositionBased : rapier.RigidBodyType.Dynamic, true);
      if (!mode.current) {
        body.setLinvel({ x: 0, y: 0, z: 0 }, true);
        body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      }
    }
    if (mode.current) {
      objects.target.set(objects.start.x + item.drag.current.dx / ZOOM, objects.start.y - item.drag.current.dy / ZOOM, 0);
      objects.target.x = Math.max(item.minX, Math.min(item.maxX, objects.target.x));
      objects.target.y = Math.max(REST_Y - BADGE_SIZE.maxPull / ZOOM, Math.min(REST_Y + .4, objects.target.y));
      body.setNextKinematicTranslation(objects.target);
      first.current.wakeUp();
      second.current.wakeUp();
      third.current.wakeUp();
    }
    const position = body.translation();
    objects.quaternion.copy(body.rotation());
    objects.euler.setFromQuaternion(objects.quaternion);
    if (!mode.current && !body.isSleeping()) {
      objects.angular.copy(body.angvel());
      objects.angular.x -= objects.euler.x * .12;
      objects.angular.y -= objects.euler.y * .16;
      body.setAngvel(objects.angular, false);
    }
    const transform = `translate3d(${(position.x - item.restX) * ZOOM}px,${(REST_Y - position.y) * ZOOM}px,0) rotateZ(${-objects.euler.z}rad) rotateY(${objects.euler.y}rad) rotateX(${objects.euler.x}rad)`;
    if (transform !== lastFrame.current) {
      item.face.current.style.transform = transform;
      lastFrame.current = transform;
    }
    objects.curve.points[0].copy(anchor.current.translation());
    objects.curve.points[1].copy(first.current.translation());
    objects.curve.points[2].copy(second.current.translation());
    objects.curve.points[3].copy(third.current.translation());
    for (let layer = 0; layer < (objects.labelTexture ? 3 : 2); layer++) {
      const geometry = layer === 0 ? objects.outer : layer === 1 ? objects.inner : objects.label;
      const attr = geometry.getAttribute('position') as BufferAttribute;
      const width = (BADGE_SIZE.strapWidth - (layer > 0 ? BADGE_SIZE.strapBorder * 2 : 0)) / ZOOM / 2;
      let curveLength = 0;
      let lastX = 0;
      let lastY = 0;
      for (let i = 0; i <= SAMPLES; i++) {
        objects.curve.getPoint(i / SAMPLES, objects.point);
        if (layer === 2) {
          if (i > 0) curveLength += Math.hypot(objects.point.x - lastX, objects.point.y - lastY);
          lastX = objects.point.x;
          lastY = objects.point.y;
        }
        objects.curve.getTangent(i / SAMPLES, objects.tangent);
        const nx = -objects.tangent.y * width;
        const ny = objects.tangent.x * width;
        attr.setXYZ(i * 2, objects.point.x + nx, objects.point.y + ny, .1 + layer * .01);
        attr.setXYZ(i * 2 + 1, objects.point.x - nx, objects.point.y - ny, .1 + layer * .01);
      }
      attr.needsUpdate = true;
      if (layer === 2 && objects.labelTexture) {
        objects.labelTexture.repeat.y = curveLength * ZOOM / (LABEL_HEIGHT + item.design.strapLabelGap);
      }
    }
    if (!initialized.current) {
      initialized.current = true;
      onReady(item.id);
    }
  });

  return <>
    <RigidBody ref={anchor} type="fixed" position={[item.restX, ANCHOR_Y, 0]} colliders={false} />
    <RigidBody ref={first} position={[item.restX, ANCHOR_Y - SEGMENT, 0]} colliders={false} linearDamping={5} angularDamping={5}><BallCollider args={[.06]} mass={.1} collisionGroups={0} /></RigidBody>
    <RigidBody ref={second} position={[item.restX, ANCHOR_Y - SEGMENT * 2, 0]} colliders={false} linearDamping={5} angularDamping={5}><BallCollider args={[.06]} mass={.1} collisionGroups={0} /></RigidBody>
    <RigidBody ref={third} position={[item.restX, ANCHOR_Y - SEGMENT * 3, 0]} colliders={false} linearDamping={5} angularDamping={5}><BallCollider args={[.06]} mass={.1} collisionGroups={0} /></RigidBody>
    <RigidBody ref={card} position={[item.restX + .05, REST_Y + .12, 0]} colliders={false} linearDamping={5} angularDamping={7} enabledTranslations={[true, true, false]}><CuboidCollider args={[1.12, 1.52, .04]} mass={1} collisionGroups={0} /></RigidBody>
    <mesh geometry={objects.outer} frustumCulled={false}><meshBasicMaterial color={item.design.strapBorderColor} side={DoubleSide} /></mesh>
    <mesh geometry={objects.inner} frustumCulled={false}><meshBasicMaterial color={item.design.strapColor} side={DoubleSide} /></mesh>
    {objects.labelTexture && <mesh geometry={objects.label} frustumCulled={false}><meshBasicMaterial map={objects.labelTexture} transparent alphaTest={.1} depthWrite={false} toneMapped={false} side={DoubleSide} /></mesh>}
  </>;
}

export default function LanyardScene({ items, worldKey, active, onReady, onFailure }: Props) {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const readyIds = useRef(new Set<string>());
  useEffect(() => { readyIds.current.clear(); }, [worldKey]);
  const markReady = useCallback((id: string) => {
    readyIds.current.add(id);
    if (readyIds.current.size === items.length) onReady();
  }, [items.length, onReady]);
  useEffect(() => {
    const node = canvas.current;
    const failure = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    node?.addEventListener('webglcontextlost', failure);
    return () => node?.removeEventListener('webglcontextlost', failure);
  }, [onFailure]);

  return <Canvas ref={canvas} orthographic camera={{ position: [0, 0, 10], zoom: ZOOM, near: .1, far: 30 }}
    dpr={[1, 1.5]} frameloop={active ? 'always' : 'never'} gl={{ alpha: true, antialias: true }}>
    <Suspense fallback={null}>
      <Physics key={worldKey} gravity={[0, -28, 0]} timeStep={1 / 60} paused={!active} colliders={false}>
        {items.map(item => <Band key={item.id} item={item} active={active} onReady={markReady} />)}
      </Physics>
    </Suspense>
  </Canvas>;
}
