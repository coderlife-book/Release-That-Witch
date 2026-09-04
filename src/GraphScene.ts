import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { GraphLink, GraphNode, NodeKind } from './data';

const GROUP_COLORS: Record<string, number> = {
  'never-winter': 0xffd166,
  'witch-union': 0x66d9ef,
  'sleeping-island': 0xb8a1ff,
  'city-hall': 0x7bdcb5,
  military: 0xf6a261,
  industry: 0x8bd3dd,
  'royal-family': 0xd7aefb,
  church: 0xff718d,
  'ancient-witch': 0x8de2ff,
  graycastle: 0x93a8ff,
  kingdoms: 0xc8d1e8,
  geography: 0x73d6c7,
};

const RELATION_COLORS: Record<GraphLink['type'], number> = {
  core: 0xffd166,
  member: 0x66d9ef,
  leads: 0x7bdcb5,
  governs: 0x9be28f,
  'based-in': 0x73d6c7,
  family: 0xd7aefb,
  supports: 0x8bd3dd,
  military: 0xf6a261,
  allied: 0x7ee8b8,
  hostile: 0xff718d,
  'part-of': 0xa8b6d9,
  related: 0xe4c1f9,
};

const GROUP_CENTERS: Record<string, THREE.Vector3> = {
  'never-winter': new THREE.Vector3(0, 0, 0),
  'witch-union': new THREE.Vector3(-15, 5, 0),
  'city-hall': new THREE.Vector3(14, 5, 3),
  military: new THREE.Vector3(12, -8, 1),
  industry: new THREE.Vector3(20, 0, -5),
  'sleeping-island': new THREE.Vector3(-20, 2, -18),
  'royal-family': new THREE.Vector3(4, 13, -16),
  church: new THREE.Vector3(24, 8, -24),
  'ancient-witch': new THREE.Vector3(-6, -11, -21),
  graycastle: new THREE.Vector3(6, 17, 4),
  kingdoms: new THREE.Vector3(0, 22, -8),
  geography: new THREE.Vector3(-24, -5, -4),
};

interface NodeVisual {
  node: GraphNode;
  group: THREE.Group;
  mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
  glow: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
  label: THREE.Sprite;
}

interface EdgeVisual {
  link: GraphLink;
  line: THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>;
}

export class GraphScene {
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private nodeVisuals = new Map<string, NodeVisual>();
  private edgeVisuals: EdgeVisual[] = [];
  private nodeById: Map<string, GraphNode>;
  private links: GraphLink[];
  private visibleIds = new Set<string>();
  private selectedId: string | null = 'roland';
  private hoveredId: string | null = null;
  private frame = 0;
  private resizeObserver: ResizeObserver;

  onHover?: (node: GraphNode | null) => void;
  onSelect?: (node: GraphNode | null) => void;

  constructor(private container: HTMLElement, nodes: GraphNode[], links: GraphLink[]) {
    this.nodeById = new Map(nodes.map((node) => [node.id, node]));
    this.links = links;
    nodes.forEach((node) => this.visibleIds.add(node.id));

    this.scene.background = new THREE.Color(0x070b16);
    this.scene.fog = new THREE.FogExp2(0x070b16, 0.012);

    this.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 500);
    this.camera.position.set(0, 20, 55);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.minDistance = 12;
    this.controls.maxDistance = 120;

    this.scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(20, 35, 25);
    this.scene.add(keyLight);

    this.addBackgroundStars();
    const positions = this.buildPositions(nodes);
    nodes.forEach((node) => this.addNode(node, positions.get(node.id)!));
    links.forEach((link) => this.addEdge(link, positions));

    this.renderer.domElement.addEventListener('pointermove', this.handlePointerMove);
    this.renderer.domElement.addEventListener('click', this.handleClick);
    this.renderer.domElement.addEventListener('dblclick', () => this.focus('roland'));

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);
    this.resize();
    this.refreshVisualState();
    this.animate();
  }

  setVisible(ids: Iterable<string>) {
    this.visibleIds = new Set(ids);
    for (const [id, visual] of this.nodeVisuals) visual.group.visible = this.visibleIds.has(id);
    for (const edge of this.edgeVisuals) {
      edge.line.visible = this.visibleIds.has(edge.link.source) && this.visibleIds.has(edge.link.target);
    }
    if (this.selectedId && !this.visibleIds.has(this.selectedId)) this.selectedId = null;
    this.refreshVisualState();
  }

  focus(id: string) {
    const visual = this.nodeVisuals.get(id);
    if (!visual || !this.visibleIds.has(id)) return;
    this.selectedId = id;
    this.hoveredId = null;
    this.onSelect?.(visual.node);
    this.refreshVisualState();

    const target = visual.group.position.clone();
    const direction = this.camera.position.clone().sub(this.controls.target).normalize();
    this.controls.target.copy(target);
    this.camera.position.copy(target.clone().add(direction.multiplyScalar(30)));
  }

  resetView() {
    this.selectedId = 'roland';
    this.hoveredId = null;
    this.camera.position.set(0, 20, 55);
    this.controls.target.set(0, 0, 0);
    this.onSelect?.(this.nodeById.get('roland') ?? null);
    this.refreshVisualState();
  }

  dispose() {
    cancelAnimationFrame(this.frame);
    this.resizeObserver.disconnect();
    this.renderer.domElement.removeEventListener('pointermove', this.handlePointerMove);
    this.renderer.domElement.removeEventListener('click', this.handleClick);
    this.controls.dispose();
    this.renderer.dispose();
    this.container.replaceChildren();
  }

  private buildPositions(nodes: GraphNode[]) {
    const positions = new Map<string, THREE.Vector3>();
    const groupCounts = new Map<string, number>();

    for (const node of nodes) {
      if (node.id === 'roland') {
        positions.set(node.id, new THREE.Vector3(0, 0, 0));
        continue;
      }
      const index = groupCounts.get(node.group) ?? 0;
      groupCounts.set(node.group, index + 1);
      const center = GROUP_CENTERS[node.group] ?? new THREE.Vector3();
      const angle = index * 2.399963229728653;
      const radius = 3.8 + Math.sqrt(index) * 3.5;
      const vertical = ((index % 3) - 1) * 2.3;
      positions.set(
        node.id,
        center.clone().add(new THREE.Vector3(Math.cos(angle) * radius, vertical, Math.sin(angle) * radius)),
      );
    }
    return positions;
  }

  private addNode(node: GraphNode, position: THREE.Vector3) {
    const color = GROUP_COLORS[node.group] ?? 0x9fb7ff;
    const group = new THREE.Group();
    group.position.copy(position);

    const mesh = new THREE.Mesh(this.geometryFor(node.kind, node.importance), new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: node.importance >= 5 ? 0.42 : 0.2,
      roughness: 0.42,
      metalness: 0.12,
      transparent: true,
    }));
    mesh.userData.nodeId = node.id;
    group.add(mesh);

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(1.7 + node.importance * 0.16, 20, 20),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.09, depthWrite: false }),
    );
    glow.userData.nodeId = node.id;
    group.add(glow);

    const label = this.makeLabel(node.name, color);
    label.position.set(0, 2.7 + node.importance * 0.14, 0);
    group.add(label);

    this.scene.add(group);
    this.nodeVisuals.set(node.id, { node, group, mesh, glow, label });
  }

  private addEdge(link: GraphLink, positions: Map<string, THREE.Vector3>) {
    const source = positions.get(link.source);
    const target = positions.get(link.target);
    if (!source || !target) return;
    const geometry = new THREE.BufferGeometry().setFromPoints([source, target]);
    const material = new THREE.LineBasicMaterial({
      color: RELATION_COLORS[link.type],
      transparent: true,
      opacity: 0.34 + link.weight * 0.08,
    });
    const line = new THREE.Line(geometry, material);
    this.scene.add(line);
    this.edgeVisuals.push({ link, line });
  }

  private geometryFor(kind: NodeKind, importance: number): THREE.BufferGeometry {
    const scale = 0.75 + importance * 0.13;
    if (kind === 'organization') return new THREE.OctahedronGeometry(scale * 1.2, 0);
    if (kind === 'location') return new THREE.TorusGeometry(scale, scale * 0.28, 12, 28);
    if (kind === 'kingdom') return new THREE.DodecahedronGeometry(scale * 1.25, 0);
    if (kind === 'concept') return new THREE.IcosahedronGeometry(scale * 1.35, 1);
    return new THREE.SphereGeometry(scale, 28, 28);
  }

  private makeLabel(text: string, color: number) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'rgba(7, 11, 22, 0.88)';
    ctx.beginPath();
    ctx.roundRect(8, 16, 496, 96, 24);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = `#${new THREE.Color(color).getHexString()}`;
    ctx.stroke();
    ctx.fillStyle = '#f4f7ff';
    ctx.font = '600 32px system-ui, "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 64, 460);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
    sprite.scale.set(7.2, 1.8, 1);
    return sprite;
  }

  private addBackgroundStars() {
    const positions = new Float32Array(1100 * 3);
    for (let i = 0; i < 1100; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 220;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 220;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.scene.add(new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x9fb7ff, size: 0.18, transparent: true, opacity: 0.65 })));
  }

  private pick(event: PointerEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const objects = [...this.nodeVisuals.values()].filter((visual) => visual.group.visible).map((visual) => visual.mesh);
    const hit = this.raycaster.intersectObjects(objects, false)[0];
    return hit?.object.userData.nodeId as string | undefined;
  }

  private handlePointerMove = (event: PointerEvent) => {
    const id = this.pick(event) ?? null;
    if (id === this.hoveredId) return;
    this.hoveredId = id;
    this.renderer.domElement.style.cursor = id ? 'pointer' : 'grab';
    this.onHover?.(id ? this.nodeById.get(id) ?? null : null);
    this.refreshVisualState();
  };

  private handleClick = (event: MouseEvent) => {
    const id = this.pick(event as PointerEvent) ?? null;
    this.selectedId = id;
    this.onSelect?.(id ? this.nodeById.get(id) ?? null : null);
    this.refreshVisualState();
  };

  private refreshVisualState() {
    const focusId = this.hoveredId ?? this.selectedId;
    const neighbors = new Set<string>();
    if (focusId) {
      neighbors.add(focusId);
      for (const link of this.links) {
        if (link.source === focusId) neighbors.add(link.target);
        if (link.target === focusId) neighbors.add(link.source);
      }
    }

    for (const [id, visual] of this.nodeVisuals) {
      if (!visual.group.visible) continue;
      const active = !focusId || neighbors.has(id);
      const focused = id === focusId;
      visual.mesh.material.opacity = active ? 1 : 0.16;
      visual.mesh.material.emissiveIntensity = focused ? 0.7 : active ? 0.25 : 0.04;
      visual.glow.material.opacity = focused ? 0.22 : active ? 0.08 : 0.015;
      visual.label.material.opacity = active ? 1 : 0.18;
      visual.group.scale.setScalar(focused ? 1.22 : active ? 1 : 0.92);
    }

    for (const edge of this.edgeVisuals) {
      if (!edge.line.visible) continue;
      const connected = !!focusId && (edge.link.source === focusId || edge.link.target === focusId);
      edge.line.material.opacity = focusId ? (connected ? 0.95 : 0.055) : 0.34 + edge.link.weight * 0.08;
    }
  }

  private resize() {
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  private animate = () => {
    this.frame = requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };
}
