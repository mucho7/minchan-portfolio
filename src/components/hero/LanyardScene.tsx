import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRapier, useRopeJoint, useSphericalJoint, type RapierRigidBody } from '@react-three/rapier';
import { Suspense, useEffect, useMemo, useRef, type RefObject } from 'react';
import { BufferAttribute, BufferGeometry, CatmullRomCurve3, DoubleSide, Euler, Quaternion, Vector3 } from 'three';
import { BADGE_SIZE, type BadgeDrag, type resolveBadgeDesign } from './badge-design';

type Props = {
  face: RefObject<HTMLAnchorElement | null>;
  drag: RefObject<BadgeDrag>;
  design: ReturnType<typeof resolveBadgeDesign>;
  active: boolean;
  onReady: () => void;
  onFailure: () => void;
};
const ZOOM = 100;
const STAGE_HEIGHT = 528;
const REST_Y = .08;
const ANCHOR_Y = STAGE_HEIGHT / ZOOM / 2;
const SEGMENT = (ANCHOR_Y - REST_Y - 1.4) / 3;
const SAMPLES = 32;

function ribbonGeometry() {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(new Float32Array((SAMPLES + 1) * 6), 3));
  const indices: number[] = [];
  for (let i = 0; i < SAMPLES; i++) {
    const n = i * 2;
    indices.push(n, n + 1, n + 2, n + 1, n + 3, n + 2);
  }
  geometry.setIndex(indices);
  return geometry;
}

function Band({ face, drag, design, active, onReady }: Props) {
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
    outer: ribbonGeometry(), inner: ribbonGeometry()
  }), []);
  const mode = useRef(false);
  const sequence = useRef(-1);
  const initialized = useRef(false);
  const lastFrame = useRef('');
  useEffect(() => {
    invalidate();
    return () => { objects.outer.dispose(); objects.inner.dispose(); if (face.current) face.current.style.transform = ''; };
  }, [objects, face, invalidate]);
  useEffect(() => { if (active) invalidate(); }, [active, invalidate]);
  useFrame(() => {
    if (!card.current || !anchor.current || !first.current || !second.current || !third.current || !face.current) return;
    const body = card.current;
    if (drag.current.active && sequence.current !== drag.current.sequence) {
      sequence.current = drag.current.sequence;
      objects.start.copy(body.translation());
      first.current.wakeUp(); second.current.wakeUp(); third.current.wakeUp();
    }
    if (mode.current !== drag.current.active) {
      mode.current = drag.current.active;
      body.setBodyType(mode.current ? rapier.RigidBodyType.KinematicPositionBased : rapier.RigidBodyType.Dynamic, true);
      // Clamp release velocity; rapid pointer movement must not launch the badge.
      if (!mode.current) { body.setLinvel({ x: 0, y: 0, z: 0 }, true); body.setAngvel({ x: 0, y: 0, z: 0 }, true); }
    }
    if (mode.current) {
      objects.target.set(objects.start.x + drag.current.dx / ZOOM, objects.start.y - drag.current.dy / ZOOM, 0);
      objects.target.x = Math.max(-.45, Math.min(.45, objects.target.x));
      objects.target.y = Math.max(REST_Y - BADGE_SIZE.maxPull / ZOOM, Math.min(REST_Y + .4, objects.target.y));
      body.setNextKinematicTranslation(objects.target);
      first.current.wakeUp(); second.current.wakeUp(); third.current.wakeUp();
    }
    const position = body.translation();
    objects.quaternion.copy(body.rotation());
    objects.euler.setFromQuaternion(objects.quaternion);
    // Front-facing restoration is deliberately stronger than free tumbling.
    if (!mode.current && !body.isSleeping()) {
      objects.angular.copy(body.angvel());
      objects.angular.x -= objects.euler.x * .12;
      objects.angular.y -= objects.euler.y * .16;
      body.setAngvel(objects.angular, false);
    }
    const transform = `translate3d(${position.x * ZOOM}px,${(REST_Y - position.y) * ZOOM}px,0) rotateZ(${-objects.euler.z}rad) rotateY(${objects.euler.y}rad) rotateX(${objects.euler.x}rad)`;
    if (transform !== lastFrame.current) { face.current.style.transform = transform; lastFrame.current = transform; }
    objects.curve.points[0].copy(anchor.current.translation());
    objects.curve.points[1].copy(first.current.translation());
    objects.curve.points[2].copy(second.current.translation());
    objects.curve.points[3].copy(third.current.translation());
    for (let layer = 0; layer < 2; layer++) {
      const geometry = layer === 0 ? objects.outer : objects.inner;
      const attr = geometry.getAttribute('position') as BufferAttribute;
      const width = (BADGE_SIZE.strapWidth - (layer === 1 ? BADGE_SIZE.strapBorder * 2 : 0)) / ZOOM / 2;
      for (let i = 0; i <= SAMPLES; i++) {
        objects.curve.getPoint(i / SAMPLES, objects.point);
        objects.curve.getTangent(i / SAMPLES, objects.tangent);
        const nx = -objects.tangent.y * width;
        const ny = objects.tangent.x * width;
        attr.setXYZ(i * 2, objects.point.x + nx, objects.point.y + ny, .1 + layer * .01);
        attr.setXYZ(i * 2 + 1, objects.point.x - nx, objects.point.y - ny, .1 + layer * .01);
      }
      attr.needsUpdate = true;
    }
    if (!initialized.current) { initialized.current = true; onReady(); }
  });
  return <>
    <RigidBody ref={anchor} type="fixed" position={[0, ANCHOR_Y, 0]} colliders={false} />
    <RigidBody ref={first} position={[0, ANCHOR_Y - SEGMENT, 0]} colliders={false} linearDamping={5} angularDamping={5}><BallCollider args={[.06]} mass={.1} collisionGroups={0} /></RigidBody>
    <RigidBody ref={second} position={[0, ANCHOR_Y - SEGMENT * 2, 0]} colliders={false} linearDamping={5} angularDamping={5}><BallCollider args={[.06]} mass={.1} collisionGroups={0} /></RigidBody>
    <RigidBody ref={third} position={[0, ANCHOR_Y - SEGMENT * 3, 0]} colliders={false} linearDamping={5} angularDamping={5}><BallCollider args={[.06]} mass={.1} collisionGroups={0} /></RigidBody>
    <RigidBody ref={card} position={[.05, REST_Y + .12, 0]} colliders={false} linearDamping={5} angularDamping={7} enabledTranslations={[true, true, false]}><CuboidCollider args={[1.12, 1.52, .04]} mass={1} collisionGroups={0} /></RigidBody>
    <mesh geometry={objects.outer} frustumCulled={false}><meshBasicMaterial color={design.strapBorderColor} side={DoubleSide} /></mesh>
    <mesh geometry={objects.inner} frustumCulled={false}><meshBasicMaterial color={design.strapColor} side={DoubleSide} /></mesh>
  </>;
}

export default function LanyardScene(props: Props) {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const node = canvas.current;
    const failure = (event: Event) => { event.preventDefault(); props.onFailure(); };
    node?.addEventListener('webglcontextlost', failure);
    return () => node?.removeEventListener('webglcontextlost', failure);
  }, [props.onFailure]);
  return <Canvas ref={canvas} orthographic camera={{ position: [0, 0, 10], zoom: ZOOM, near: .1, far: 30 }}
    dpr={[1, 1.5]} frameloop={props.active ? 'always' : 'never'} gl={{ alpha: true, antialias: true }}>
    <Suspense fallback={null}><Physics gravity={[0, -28, 0]} timeStep={1 / 60} paused={!props.active} colliders={false}>
      <Band {...props} />
    </Physics></Suspense>
  </Canvas>;
}