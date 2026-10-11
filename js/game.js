// @ts-nocheck
import * as THREE from "https://esm.sh/three@0.186.0";
import { GLTFLoader } from "https://esm.sh/three@0.186.0/examples/jsm/loaders/GLTFLoader.js";

let BVH_READY = false;
const BVH_QUEUE = [];
import("https://esm.sh/three-mesh-bvh@0.7.8?deps=three@0.186.0").then(BVH => {
  if (BVH && typeof BVH.computeBoundsTree === "function" && BVH.acceleratedRaycast) {
    THREE.BufferGeometry.prototype.computeBoundsTree = BVH.computeBoundsTree;
    THREE.BufferGeometry.prototype.disposeBoundsTree = BVH.disposeBoundsTree;
    THREE.Mesh.prototype.raycast = BVH.acceleratedRaycast;
    BVH_READY = true;
    for (const geo of BVH_QUEUE) { try { geo.computeBoundsTree(); } catch(e){} }
    BVH_QUEUE.length = 0;
  }
}).catch(() => {});
function tryBuildBVH(geo) { if (!geo || geo.boundsTree) return; if (BVH_READY) { try { geo.computeBoundsTree(); } catch(e){} } else BVH_QUEUE.push(geo); }
const $ = id => document.getElementById(id);

const MODELS = {
  rumah: "../Models/modern_brick_cabin_game_ready_3d_house.glb",
  house404: "../Models/low_poly_suburban_house_with_interior.glb",
  buildings: "../Models/pack_-_low_poly_-_15_building.glb",
  road: "../Models/road_free.glb",
  security: "../Models/securityparking_booth_-_game_asset.glb",
  supermarket: "../Models/simple_mini_market_low_poly.glb",
  workshop: "../Models/car_workshop.glb"
};

const WORLD_DATA = [
  ["Road 3","road",[32.108,0,-89.210],[0,Math.PI/2,0],[1.443,1,20.4]],
  ["Sidewalk 4","sidewalk",[47.677,0.04,3.841],[0,0,0],[1,1,0.867]],
  ["Sidewalk 5","sidewalk",[29.018,0.04,-13.159],[0,0,0],[1,1,0.703]],
  ["Wall 6","wall",[-149.244,1.5,1.636],[0,0,0],[1,1,1.471]],
  ["Wall 7","wall",[148.465,1.5,-0.609],[0,0,0],[1.3,1,1.585]],
  ["Wall 8","wall",[23.299,1.5,148.659],[0,Math.PI/2,0],[1.3,1,1.354]],
  ["Streetlight 15","streetlight",[47.996,0,-23.996],[0,0,0],[1,1,1]],
  ["Streetlight 16","streetlight",[29.438,0,-13.916],[0,0,0],[1,1,1]],
  ["Streetlight 17","streetlight",[28.965,0,52.518],[0,0,0],[1,1,1]],
  ["Streetlight 18","streetlight",[48.320,0,21.066],[0,0,0],[1,1,1]],
  ["Streetlight 19","streetlight",[-20,0,-78.702],[0,0,0],[1,1,1]],
  ["Streetlight 20","streetlight",[29.203,0,-78.888],[0,0,0],[1,1,1]],
  ["Sidewalk 5 Copy","sidewalk",[-20.768,0.04,-78.971],[0,Math.PI/2,0],[1,1,0.521]],
  ["Sidewalk 5 Copy Copy","sidewalk",[39.467,0.04,-98.598],[0,Math.PI/2,0],[1,1,1.157]],
  ["Wall 6 Copy","wall",[39.285,1.5,-106.033],[0,Math.PI/2,0],[1,1,1.152]],
  ["Wall 6 Copy 2","wall",[-69.163,1.5,-127.822],[0,0,0],[1,1,0.221]],
  ["Sidewalk 5 Copy Copy 2","sidewalk",[96.112,0.04,-78.971],[0,Math.PI/2,0],[1,1,0.521]],
  ["Road 3 Copy","road",[37.553,0,-19.689],[0,0,0],[1.325,1,14.681]],
  ["Road 3 Copy Copy","road",[39.553,0,47.773],[0,0,0],[1.256,1,5.166]],
  ["Road 3 Copy Copy Copy","road",[42.429,0,60.242],[0,0,0],[0.752,1,5.166]],
  ["Wall 6 Copy Copy","wall",[-109.833,1.5,-148.955],[0,Math.PI/2,0],[1,1,0.439]],
  ["Wall 6 Copy 3","wall",[-69.186,1.5,35.936],[0,0,0],[1,1,1.195]],
  ["Road 3 Copy 2","road",[-115.384,0,-31.948],[0,0,0],[1.443,1,23.463]],
  ["Road 3 Copy 2 Copy","road",[-91.815,0,-88.804],[0,Math.PI/2,0],[1.443,1,4.563]],
  ["Sidewalk 4 Copy","sidewalk",[-105.888,0,3.841],[0,0,0],[1,1,0.867]],
  ["Sidewalk 4 Copy Copy","sidewalk",[-126.569,0,-23.687],[0,0,0],[1,1,1.145]],
  ["Sidewalk 4 Copy Copy Copy","sidewalk",[-106.015,0,-124.270],[0,0,0],[1,1,0.267]],
  ["Sidewalk 4 Copy Copy Copy Copy","sidewalk",[-81.601,0,-98.598],[0,Math.PI/2,0],[1,1,0.267]],
  ["Sidewalk 4 Copy Copy Copy Copy Copy","sidewalk",[-81.614,0,-78.956],[0,Math.PI/2,0],[1,1,0.267]],
  ["House 404","house404",[133.584,1,-93.843],[0,-Math.PI/2,0],[1.1,1.1,1.1]],
  ["Supermarket","supermarket",[-133.484,0.165,-137.894],[0,0,0],[0.05,0.05,0.05]],
  ["Rumah","rumah",[142.032,0,57.027],[0,0,0],[1,1,1]],
  ["Workshop","workshop",[-127.699,5,115.010],[-Math.PI,0,-Math.PI],[0.02,0.02,0.02]],
  ["Security Post","security",[-66.084,0,-102.025],[0,Math.PI/2,0],[2.023,1,1.935]],
  ["Building Pack Copy","buildings",[88.509,0,103.999],[0,0,0],[1,1,1]],
  ["Building Pack","buildings",[88.230,0,-5],[0,0,0],[1,1,1]],
  ["Building Pack Copy Copy","buildings",[1.096,0,77.573],[-Math.PI,0,-Math.PI],[1,1,1]],
  ["Building Pack Copy Copy Copy","buildings",[-11.090,0,-32.013],[-Math.PI,0,-Math.PI],[1,1,1]]
];

const PH = 1.65;
const EYE_HEIGHT = 1.5;
const INTERIOR_ORIGIN = new THREE.Vector3(300, -50, 300);

const POS = {
  home: new THREE.Vector3(142.032, PH, 57.027),
  homeDoor: new THREE.Vector3(142.0, PH, 50.0),
  supermarket: new THREE.Vector3(-127.07, PH, -136.49),
  workScene: new THREE.Vector3(-125.55, PH, 72.62),
  boss: new THREE.Vector3(-137.17, PH, 70.91),
  security: new THREE.Vector3(-66.084, PH, -102.025),
  kidnapCenter: new THREE.Vector3(28.47, PH, -78.76),
  key: new THREE.Vector3(136, 1, -91),
  door: new THREE.Vector3(133, 1, -94),
  kidnapper: new THREE.Vector3(138, PH, -88),
  toilet: new THREE.Vector3(0, 0, 0),
  dapur: new THREE.Vector3(0, 0, 0),
  kasur: new THREE.Vector3(0, 0, 0),
  interiorExit: new THREE.Vector3(0, 0, 0),
  cashier: new THREE.Vector3(-142.51, PH, -144.45),
  phoneKidnapper: new THREE.Vector3(140, 1, -90),
  cat: new THREE.Vector3(47, PH, -25),
  atm: new THREE.Vector3(-140, 0.1, -100),
  kurir: new THREE.Vector3(-80, 0.1, 55),
  diary: new THREE.Vector3(138, 1, -90)
};

const SHOP_ITEMS = [
  { id: "beras", name: "Beras 5kg", price: 45000, pos: new THREE.Vector3(-142.8, 0.6, -139.5) },
  { id: "susu", name: "Susu 1L", price: 18000, pos: new THREE.Vector3(-142.3, 0.6, -139.5) },
  { id: "telur", name: "Telur 1kg", price: 27000, pos: new THREE.Vector3(-141.8, 0.6, -139.5) },
  { id: "roti", name: "Roti Tawar", price: 15000, pos: new THREE.Vector3(-142.8, 0.6, -141.8) },
  { id: "ayam", name: "Ayam 1kg", price: 38000, pos: new THREE.Vector3(-142.3, 0.6, -141.8) },
  { id: "sayur", name: "Sayur", price: 12000, pos: new THREE.Vector3(-141.8, 0.6, -141.8) }
];

const SPAWNS = {
  1: new THREE.Vector3(-136.54, PH, -146.14),
  2: new THREE.Vector3(142.54, PH, 49.58),
  3: new THREE.Vector3(142.54, PH, 49.58),
  4: new THREE.Vector3(142.54, PH, 49.58),
  5: new THREE.Vector3(142.54, PH, 49.58),
  6: new THREE.Vector3(136.12, PH, -90)
};

const JOBS = {
  3: { start: "08:00", end: "20:00", pay: 250000 },
  4: { start: "08:00", end: "22:00", pay: 320000 },
  5: { start: "08:00", end: "22:00", pay: 320000 }
};

const FLOW = {
  1: [
    { cs: [{ text: "Pada hari itu aku pulang dari Indomaret tetapi barang yg mau ku beli habis.\nlebih baik aku pulang saja lah." }] },
    { phase: "d1_home" },
    { autoEnter: true },
    { cs: [{ text: "Ah akhirnya aku sampai rumah, aku lelah sekali.\nAku ingin tidur lalu besok pergi Indomaret." }] },
    { mini: "rumah_malam" },
    { nextday: 2 }
  ],
  2: [
    { cs: [{ text: "Ah... ternyata sudah pagi." }] },
    { cs: [{ text: "📱 Ada notifikasi di HP...", auto: 2200 }] },
    { phone: { from: "Bos", text: "Besok gajian. Kerja yang rajin ya." } },
    { cs: [{ text: "Bos ngasih semangat pagi ini. Baik juga dia.", auto: 2200 }] },
    { phase: "d2_market" },
    { cs: [{ text: "Yeaa akhirnya aku sampai di Indomaret. Semoga saja barang yang ingin kubeli ada.", blackAfter: 1800 }] },
    { cs: [{ text: "Akhirnya barang yang kuinginkan ada. Aku harus membelinya 2.", blackAfter: 1800 }] },
    { shopping: true },
    { cs: [{ text: "Aku beli pulsa juga tadi. Lumayan buat internetan.", auto: 2200 }] },
    { cs: [{ text: "Aku harus pulang ke rumah. Karena barang yang kubeli sudah ada di tangan." }] },
    { phase: "d2_home" },
    { autoEnter: true },
    { cs: [{ text: "Ahh akhirnya sampai rumah aku lelah sekali." }] },
    { mini: "rumah_malam" },
    { nextday: 3 }
  ],
  3: [
    { cs: [{ text: "aku harus pergi ke tempat kerja, bos pasti sudah nungguku." }] },
    { phone: { from: "Bos", text: "Jam 8 harus sudah di tempat, jangan telat." } },
    { phase: "d3_work" },
    { cs: [{ text: "Akhirnya aku sampai ditempat kerja, aku harus bekerja kalo tidak aku sudah pasti dimarahin bos ku.", blackAfter: 2200, blackText: "12 JAM BERLALU" }] },
    { cs: [{ text: "Ahhh sudah sore, waktunya untuk pulang, aku harus bilang ke bos sebelum pulang." }] },
    { phase: "d3_boss" },
    { cs: [
      { type: "dialog", speaker: "Bos", text: "Kamu sudah selesai semua pekerjaan hari ini?" },
      { type: "dialog", text: "Sudah bos. Semuanya sudah beres." },
      { type: "dialog", speaker: "Bos", text: "Bagus. Silakan pulang, hati-hati di jalan." },
      { type: "dialog", text: "Terima kasih bos." }
    ]},
    { salary: 3 },
    { cs: [{ text: "Ada paket yang datang katanya. Mampir dulu ke kurir.", auto: 2500 }] },
    { phase: "d3_home" },
    { autoEnter: true },
    { cs: [{ text: "Ahh akhirnya sampai rumah aku lelah sekali. lebih baik aku tidur lalu bekerja lagi besok." }] },
    { mini: "rumah_malam" },
    { nextday: 4 }
  ],
  4: [
    { cs: [{ text: "Ternyata sudah pagi, aku harus pergi ke tempat kerja, bos pasti sudah nungguku." }] },
    { phone: { from: "Bos", text: "Ada meeting pagi. Jangan sampai telat." } },
    { phase: "d4_work" },
    { cs: [{ text: "Akhirnya aku sampai ditempat kerja, aku harus bekerja kalo tidak aku sudah pasti dimarahin bos ku.", blackAfter: 2200, blackText: "14 JAM BERLALU" }] },
    { cs: [{ text: "Ahhh sudah sore, waktunya untuk pulang, aku harus bilang ke bos sebelum pulang." }] },
    { phase: "d4_boss" },
    { cs: [
      { type: "dialog", speaker: "Bos", text: "Bagaimana? Ada kendala hari ini?" },
      { type: "dialog", text: "Tidak ada bos. Semuanya lancar." },
      { type: "dialog", speaker: "Bos", text: "Oke, silakan pulang." },
      { type: "dialog", text: "Terima kasih bos." }
    ]},
    { salary: 4 },
    { phase: "d4_home" },
    { autoEnter: true },
    { cs: [{ text: "Ahh akhirnya sampai rumah aku lelah sekali." }] },
    { tvScene: true },
    { cs: [{ text: "Lebih baik aku tidur. Besok kerja lagi.", auto: 2200 }] },
    { mini: "rumah_malam" },
    { nextday: 5 }
  ],
  5: [
    { cs: [{ text: "Ternyata sudah pagi lagi.\nAku harus pergi ke tempat kerja, bos pasti sudah menungguku." }] },
    { phone: { from: "Bos", text: "Hari ini lembur. Sampai malam." } },
    { phone: { from: "PLN", text: "Reminder: Tagihan listrik & air bulan ini belum dibayar." } },
    { phase: "d5_work" },
    { cs: [{ text: "Akhirnya aku sampai di tempat kerja.\nAku harus menemui bos terlebih dahulu." }] },
    { phase: "d5_boss" },
    { cs: [
      { type: "dialog", text: "Halo bos, saya sudah sampai." },
      { type: "dialog", speaker: "Bos", text: "Oke. Kamu bisa mulai bekerja." },
      { type: "dialog", text: "Oke, bos.", auto: 1500, blackAfter: 2200, blackText: "14 JAM BERLALU" }
    ]},
    { cs: [
      { type: "dialog", text: "Ahhh... sudah sore." },
      { type: "dialog", text: "Tidak terasa sudah 14 jam berlalu." },
      { type: "dialog", text: "Sepertinya pekerjaanku sudah selesai." },
      { type: "dialog", text: "Aku harus pulang sekarang sebelum terlalu malam." },
      { type: "dialog", text: "Tapi sebelum pulang aku harus izin dulu, dan bayar tagihan." }
    ]},
    { teleport: { x: -137.17, z: 56, yaw: Math.PI } },
    { phase: "d5_izin" },
    { cs: [
      { type: "dialog", text: "Bos, saya izin pulang." },
      { type: "dialog", speaker: "Bos", text: "Oke, hati-hati di jalan." }
    ]},
    { salary: 5 },
    { cs: [{ text: "Mampir dulu ke ATM bayar tagihan.", auto: 2500 }] },
    { cs: [{ text: "Aku jalan keluar kantor...", auto: 1800 }] },
    { cs: [{ text: "Tiba-tiba mesin motorku mati.", auto: 2000 }] },
    { phase: "d5_motor" },
    { phase: "d5_walk_1" },
    { cs: [{ text: "Jalanan hari ini terasa lebih sepi dari biasanya.\nAku tidak melihat banyak orang seperti biasanya.", mini: true }] },
    { phase: "d5_walk_2" },
    { cs: [{ text: "Mungkin karena sudah terlalu sore.", mini: true }] },
    { phase: "d5_walk_3" },
    { cs: [{ text: "Player mulai melihat sesuatu yang mencurigakan di jalan.\nPlayer berjalan beberapa meter.", mini: true }] },
    { phase: "d5_walk_4" },
    { cs: [{ text: "Terdengar suara langkah kaki.\nSiapa itu?", mini: true }] },
    { phase: "d5_walk_5" },
    { cs: [{ text: "Player melihat seseorang mendekat.\nTunggu... siapa kamu?", mini: true }] },
    { kidnapScene: true },
    { cs: [{ text: "Malam itu, sesuatu terjadi kepada dirinya.", auto: 2500 }] },
    { nextday: 6 }
  ],
  6: [
    { cs: [
      { text: "Terdengar suara dari sekitar.", auto: 2500, red: true, blood: true, scream: true },
      { text: "Layar perlahan terbuka...\nPlayer membuka mata dan melihat sekeliling.", auto: 3500, red: true, blood: true, fadeIn: true, autoRotate: true },
      { text: "Di mana aku...?\nTempat apa ini?\n\nAku harus keluar dari sini.", red: true, blood: true }
    ]},
    { phase: "d6_key" }
  ]
};

const PHASE = {
  d1_home: { tgt: POS.home, obj: "Pulang ke rumah", r: 10, box: 12 },
  d2_market: { tgt: POS.supermarket, obj: "Pergi ke Indomaret", r: 12, box: 14 },
  d2_home: { tgt: POS.home, obj: "Pulang ke rumah", r: 10, box: 12 },
  d3_work: { tgt: POS.workScene, obj: "Pergi ke tempat kerja", r: 15, box: 18 },
  d3_boss: { tgt: POS.boss, obj: "Temui bos dan izin pulang", r: 5 },
  d3_home: { tgt: POS.home, obj: "Pulang ke rumah", r: 10, box: 12 },
  d4_work: { tgt: POS.workScene, obj: "Pergi ke tempat kerja", r: 15, box: 18 },
  d4_boss: { tgt: POS.boss, obj: "Temui bos dan izin pulang", r: 5 },
  d4_home: { tgt: POS.home, obj: "Pulang ke rumah", r: 10, box: 12 },
  d5_work: { tgt: POS.workScene, obj: "Pergi ke tempat kerja", r: 15, box: 18 },
  d5_boss: { tgt: POS.boss, obj: "Temui bos", r: 5 },
  d5_izin: { tgt: POS.boss, obj: "Izin dan pulang", r: 5 },
  d5_motor: { tgt: new THREE.Vector3(-125, PH, 60), obj: "Dorong motor sampai nyala", r: 3 },
  d5_walk_1: { tgt: new THREE.Vector3(-110, PH, 60), obj: "Lanjutkan perjalanan pulang", r: 10, box: 12 },
  d5_walk_2: { tgt: new THREE.Vector3(-70, PH, 40), obj: "Lanjutkan perjalanan pulang", r: 10, box: 12 },
  d5_walk_3: { tgt: new THREE.Vector3(-30, PH, 10), obj: "Lanjutkan perjalanan pulang", r: 10, box: 12 },
  d5_walk_4: { tgt: new THREE.Vector3(0, PH, -20), obj: "Lanjutkan perjalanan pulang", r: 10, box: 12 },
  d5_walk_5: { tgt: new THREE.Vector3(17, PH, -79), obj: "Lanjutkan perjalanan pulang", r: 8 },
  d6_key: { tgt: POS.key, obj: "Cari kunci pintu", r: 4, noTarget: true }
};

const MINI = {
  rumah_malam: {
    steps: [
      { pre: [{ type: "dialog", text: "aku rasa harus ke air dulu" }], obj: "Buang air dulu", tgt: POS.toilet, r: 3.5, done: "Kamu sudah buang air kecil." },
      { pre: [{ type: "dialog", text: "aku sudah buang air kecil tapi kenapa aku lapar ya?" }], obj: "Makan malam", tgt: POS.dapur, r: 3.5, done: "Kamu sudah makan." },
      { pre: [{ type: "dialog", text: "piring kotor nih, cuci dulu ah." }], obj: "Cuci piring", tgt: POS.dapur, r: 3.5, done: "Piring sudah bersih." },
      { pre: [{ type: "dialog", text: "sikat gigi dulu sebelum tidur." }], obj: "Sikat gigi", tgt: POS.toilet, r: 3.5, done: "Gigi sudah bersih.", onDone: () => { if (G.day === 4) triggerMirrorScare(); } },
      { pre: [{ type: "dialog", text: "aku sudah makan lanjut tidur karna sudah mengantuk juga" }], obj: "Waktunya tidur", tgt: POS.kasur, r: 3.5, done: "Kamu tertidur." }
    ],
    after: { t: "auto" }
  }
};
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0e17);
scene.fog = new THREE.Fog(0x0a0e17, 80, 200);
const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.05, 500);
camera.position.set(142, PH, 70);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.25));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = 1.35;
renderer.shadowMap.enabled = false;
renderer.domElement.style.touchAction = "none";
($("game-area") || document.body).appendChild(renderer.domElement);
const world = new THREE.Group();
scene.add(world);
scene.add(new THREE.AmbientLight(0xd8e0ec, 0.65));
scene.add(new THREE.AmbientLight(0x8090a0, 0.25));
const hemiLight = new THREE.HemisphereLight(0xa5c2e0, 0x2a3040, 1.15);
scene.add(hemiLight);
const moon = new THREE.DirectionalLight(0xc4d4ea, 0.85); moon.position.set(-80,100,60); scene.add(moon);
const fill = new THREE.DirectionalLight(0xa8b8d0, 0.35); fill.position.set(60,40,-90); scene.add(fill);

const LAMP_POSITIONS = [];
const LAMP_POOL_SIZE = 6;
const LAMP_RANGE = 30;
const lampPool = [];
let lampPoolT = 0;
function registerLamp(x, y, z) { LAMP_POSITIONS.push(new THREE.Vector3(x, y, z)); }
function initLampPool() {
  if (lampPool.length) return;
  for (let i = 0; i < LAMP_POOL_SIZE; i++) {
    const l = new THREE.PointLight(0xffd98a, 0, 18);
    l.position.set(0, -1000, 0);
    scene.add(l);
    lampPool.push(l);
  }
}
function updateLampPool(dt) {
  lampPoolT -= dt;
  if (lampPoolT > 0) return;
  lampPoolT = 0.4;
  if (!lampPool.length) return;
  const px = camera.position.x, pz = camera.position.z;
  const sorted = LAMP_POSITIONS.map(p => ({ p, d: (p.x-px)*(p.x-px)+(p.z-pz)*(p.z-pz) })).sort((a,b) => a.d-b.d);
  for (let i = 0; i < lampPool.length; i++) {
    const s = sorted[i];
    if (s && s.d < LAMP_RANGE * LAMP_RANGE) { lampPool[i].position.copy(s.p); lampPool[i].intensity = 0.8; }
    else lampPool[i].intensity = 0;
  }
}

const BUILDING_PACKS = [];
const PACK_CULL_DIST = 120;
function registerPack(obj, posArr) { BUILDING_PACKS.push({ obj, center: new THREE.Vector3(posArr[0], 0, posArr[2]) }); }
function updatePackVisibility() {
  const px = camera.position.x, pz = camera.position.z;
  for (let i = 0; i < BUILDING_PACKS.length; i++) {
    const p = BUILDING_PACKS[i];
    const d = Math.hypot(p.center.x - px, p.center.z - pz);
    p.obj.visible = d < PACK_CULL_DIST;
  }
}

const SOLID = [];
const GRID_CELL = 30, GRID_MIN = -160;
const grid = new Map();
function gridCoords(x, z) { return [Math.floor((x-GRID_MIN)/GRID_CELL), Math.floor((z-GRID_MIN)/GRID_CELL)]; }
function gridKey(cx, cz) { return cx + "|" + cz; }
function addToGrid(mesh) {
  const wb = mesh.userData.worldAABB; if (!wb) return;
  const [minCx, minCz] = gridCoords(wb.min.x, wb.min.z);
  const [maxCx, maxCz] = gridCoords(wb.max.x, wb.max.z);
  for (let cx = minCx; cx <= maxCx; cx++) for (let cz = minCz; cz <= maxCz; cz++) {
    const k = gridKey(cx, cz);
    if (!grid.has(k)) grid.set(k, []);
    grid.get(k).push(mesh);
  }
}
const _cand = new Set();
function getNearby(x, z) {
  _cand.clear();
  const [cx, cz] = gridCoords(x, z);
  for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) {
    const arr = grid.get(gridKey(cx+dx, cz+dz));
    if (arr) for (const m of arr) _cand.add(m);
  }
  return _cand;
}
const ray = new THREE.Raycaster();
const _o = new THREE.Vector3(), _d = new THREE.Vector3(), _b = new THREE.Box3();
const H_HITS_REL = [0.35, 0.9, 1.5];
const FAN = [-0.4, 0, 0.4];
const PR = 0.32, PAD = 0.08;
function rayHit(ox, oy, oz, dx, dy, dz, far, cand) {
  const ex = ox+dx*far, ey = oy+dy*far, ez = oz+dz*far;
  _b.min.set(Math.min(ox,ex), Math.min(oy,ey), Math.min(oz,ez));
  _b.max.set(Math.max(ox,ex), Math.max(oy,ey), Math.max(oz,ez));
  _b.expandByScalar(0.05);
  const f = [];
  for (const m of cand) { const wb = m.userData.worldAABB; if (!wb || wb.intersectsBox(_b)) f.push(m); }
  if (!f.length) return false;
  _o.set(ox, oy, oz); _d.set(dx, dy, dz);
  ray.set(_o, _d); ray.far = far;
  return ray.intersectObjects(f, false).length > 0;
}
function insideSolidAt(x, z, py) {
  const c = getNearby(x, z); if (!c.size) return false;
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  let n = 0;
  for (const hRel of H_HITS_REL) { const h = py + hRel; for (const [dx, dz] of dirs) if (rayHit(x, h, z, dx, 0, dz, 0.2, c)) n++; }
  return n >= H_HITS_REL.length * 3;
}
function canMoveAt(fx, fz, tx, tz, py) {
  const dx = tx-fx, dz = tz-fz;
  const d = Math.hypot(dx, dz);
  if (d < 0.0005) return true;
  const ndx = dx/d, ndz = dz/d;
  const far = PR + PAD;
  const c = getNearby(fx, fz); if (!c.size) return true;
  for (const hRel of H_HITS_REL) {
    const h = py + hRel;
    for (const a of FAN) {
      const cs = Math.cos(a), sn = Math.sin(a);
      if (rayHit(fx, h, fz, ndx*cs - ndz*sn, 0, ndx*sn + ndz*cs, far, c)) return false;
    }
  }
  return true;
}
const _downDir = new THREE.Vector3(0, -1, 0);
function findGroundY(x, z, feetY) {
  const c = getNearby(x, z);
  if (!c.size) return 0;
  _o.set(x, feetY + 0.15, z);
  ray.set(_o, _downDir); ray.far = 20;
  const hits = ray.intersectObjects(Array.from(c), false);
  let best = null;
  for (const h of hits) if (h.point.y <= feetY + 0.2) if (best === null || h.point.y > best) best = h.point.y;
  return best === null ? 0 : best;
}

const glbLoader = new GLTFLoader();
const glbCache = new Map();
function loadGLB(p) {
  if (glbCache.has(p)) return glbCache.get(p);
  const pr = new Promise((res, rej) => glbLoader.load(p, res, undefined, rej));
  glbCache.set(p, pr); return pr;
}
function meshVisible(m) { let c = m; while (c) { if (!c.visible) return false; c = c.parent; } return true; }
function meshHasMat(m) {
  const arr = Array.isArray(m.material) ? m.material : [m.material];
  return arr.some(x => x && x.visible !== false && !(x.opacity !== undefined && x.opacity <= 0.01));
}
const SKIP_TOKENS = new Set(["yard","patio","porch","deck","grass","terrain","path","road","walkway","sidewalk","pavement","roof","glass","leaf","leaves","bush","plant","tree","rug","carpet","mat","sign","curtain","blind","sketchfab","empty","hull","collider","trigger","helper","sky","cube","probe","reflection","lod"]);
function isSkippedName(name) {
  const toks = String(name||"").replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase().split(/[^a-z]+/).filter(Boolean);
  return toks.some(t => SKIP_TOKENS.has(t) || (t.length > 3 && t.endsWith("s") && SKIP_TOKENS.has(t.slice(0,-1))));
}
function collectSolid(root) {
  root.traverse(o => {
    if (!o.isMesh || !o.geometry) return;
    if (!meshVisible(o) || !meshHasMat(o)) return;
    if (isSkippedName(o.name)) return;
    if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
    o.updateWorldMatrix(true, false);
    o.userData.worldAABB = new THREE.Box3().setFromObject(o);
    tryBuildBVH(o.geometry); SOLID.push(o); addToGrid(o);
  });
}
function addBox(name, x, y, z, w, h, d, color) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color, roughness: 1 }));
  m.name = name; m.position.set(x, y, z); world.add(m); return m;
}
function makePrimitive(type, name, p, r, s) {
  let obj;
  if (type === "road") obj = addBox(name, p[0], p[1], p[2], 14, 0.08, 10, 0x1a1e26);
  else if (type === "sidewalk") obj = addBox(name, p[0], p[1], p[2], 2, 0.12, 190, 0x5a6068);
  else if (type === "wall") obj = addBox(name, p[0], p[1], p[2], 2, 3, 190, 0x2f3238);
  else if (type === "streetlight") {
    obj = new THREE.Group(); obj.name = name;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.11,4,8), new THREE.MeshStandardMaterial({ color: 0x1c1f24 }));
    pole.position.y = 2; obj.add(pole);
    registerLamp(p[0], p[1]+4, p[2]);
    obj.position.set(p[0], p[1], p[2]); world.add(obj);
  }
  if (!obj) return null;
  obj.rotation.set(r[0], r[1], r[2]); obj.scale.fromArray(s); obj.updateMatrixWorld(true);
  obj.traverse(o => { if (o.isMesh) { if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); o.updateWorldMatrix(true, false); o.userData.worldAABB = new THREE.Box3().setFromObject(o); tryBuildBVH(o.geometry); SOLID.push(o); addToGrid(o); } });
  return obj;
}
async function placeGLB(path, pos, rot, scale, name) {
  const gltf = await loadGLB(path);
  const obj = gltf.scene.clone(true);
  obj.name = name;
  obj.position.fromArray(pos); obj.rotation.set(rot[0], rot[1], rot[2]); obj.scale.fromArray(scale);
  const isPack = name.startsWith("Building Pack");
  obj.traverse(o => {
    if (o.isMesh) {
      o.frustumCulled = true; o.castShadow = false; o.receiveShadow = false;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach(m => { if (!m) return; m.toneMapped = true; if (m.color && m.color.isColor) { const {r,g,b} = m.color; if (r<0.02 && g<0.02 && b<0.02 && !m.map) m.color.setHex(0x555b66); } });
    }
  });
  world.add(obj); obj.updateMatrixWorld(true);
  if (name === "Workshop") {
    const collMesh = new THREE.Mesh(new THREE.BoxGeometry(14, 6, 14), new THREE.MeshBasicMaterial());
    collMesh.position.set(pos[0], 3, pos[2]); collMesh.visible = false;
    collMesh.updateMatrixWorld(true);
    collMesh.userData.worldAABB = new THREE.Box3().setFromObject(collMesh);
    world.add(collMesh); SOLID.push(collMesh); addToGrid(collMesh);
  } else collectSolid(obj);
  if (isPack) registerPack(obj, pos);
  return obj;
}

const G = {
  phase: "loading", day: 1, flowIndex: 0,
  csTexts: null, csIdx: 0, csStage: 0, csOnFinish: null, csLocked: false,
  csAutoRotate: false, csRotateDir: 1,
  currentPhase: null, currentMini: null, miniStep: 0, miniStage: "pre",
  currentShopping: false,
  cooldown: 0, gameOver: false, flashlight: false, hasKey: false,
  yaw: Math.PI, pitch: 0, speed: 3.2, runSpeed: 6.4, running: false,
  timeLeft: 60*60, stamina: 100, staminaMax: 100, drain: 22, regen: 16, minRun: 8,
  jumpscarePlayed: false,
  py: 0, vy: 0, onGround: true, fallStartY: 0,
  health: 100, maxHealth: 100, lastEnemyHit: 0,
  bobT: 0, money: 200000, cart: [],
  phoneOpen: false, phoneMessages: [], phoneUnread: 0,
  weather: "clear", weatherTimer: 30, rainOn: false,
  lastVehicleHit: 0, vehicleKnockbackVX: 0, vehicleKnockbackVZ: 0,
  lookSens: 1.0,
  ownerMode: false, ownerSpeedMul: 1, ownerFly: false, ownerFlyY: 0,
  ownerPanelOpen: false, ownerFlyUp: false, ownerFlyDown: false,
  kidnapActive: false, kidnapDone: false,
  inInterior: false, savedExteriorPos: null, savedExteriorYaw: 0,
  chatOpenWith: null, captureActive: false,
  endingsUnlocked: { tertangkap: false, selamat: false, secret: false },
  hasPhoneKidnapper: false, policeHanded: false,
  catFed: false, mirrorScareDone: false, tvWatched: false,
  atmBillPaid: false, kurirPackageTaken: false, pulsaBought: false,
  motorBought: false, motorOwned: false, motorProgress: 0, motorDone: false,
  diaryRead: false, photoCount: 0, photos: [],
  achievements: {}, sanity: 100, sanityMax: 100,
  catFollowing: false, cheatsUsed: {}, godMode: false, xrayMode: false,
  idleTime: 0, idleSecretDone: false, lastPosSnapshot: { x: 0, z: 0 }
};
const keys = {};
const touch = { moveX: 0, moveY: 0 };
const GRAVITY = 25;
const STEP_UP_SAMPLES = [0.3, 0.55];
const FALL_SAFE_HEIGHT = 3.5;
const FALL_DAMAGE_PER_M = 15;
try { const sv = localStorage.getItem("houseOf404_endings"); if (sv) Object.assign(G.endingsUnlocked, JSON.parse(sv)); } catch(e){}

function applyGraphicsSettings() {
  const q = localStorage.getItem("graphicQuality") || "medium";
  let pixelRatio, fogFar;
  if (q === "low") { pixelRatio = 0.75; fogFar = 120; }
  else if (q === "high") { pixelRatio = Math.min(devicePixelRatio, 1.75); fogFar = 300; }
  else { pixelRatio = Math.min(devicePixelRatio, 1.25); fogFar = 200; }
  renderer.setPixelRatio(pixelRatio);
  scene.fog.far = fogFar;
  const s = parseFloat(localStorage.getItem("lookSensitivity") || "50");
  G.lookSens = s / 50;
}
function setObjective(t) { const e = $("objective"); if (e) e.textContent = t; }
function setInteract(v) { const e = $("interactBtn"); if (e) e.style.display = v ? "flex" : "none"; }
function setFlashUI(on) { const e = $("flashlightStatus"); if (e) e.textContent = "FLASHLIGHT: " + (on ? "ON" : "OFF"); }
function setInvUI() {
  const e = $("inventory"); if (!e) return;
  let txt = "INVENTORY: KOSONG";
  if (G.hasKey) txt = "INVENTORY: 🔑 KUNCI";
  if (G.hasPhoneKidnapper) txt += " | 📱 HP PENCULIK";
  if (G.policeHanded) txt += " | 👮 DISERAHKAN";
  e.textContent = txt;
}
function setTimerUI(v) { const e = $("timerWrap"); if (e) e.style.display = v ? "block" : "none"; }
function setWalletUI() { const e = $("wallet"); if (e) e.textContent = "Rp " + G.money.toLocaleString("id-ID"); }
function setCartUI() {
  const hud = $("cartHud"), cnt = $("cartCount"), tot = $("cartTotal");
  if (!hud) return;
  if (G.cart.length === 0) hud.classList.remove("show");
  else { hud.classList.add("show"); const sum = G.cart.reduce((s, i) => s + i.price, 0); cnt.textContent = G.cart.length; tot.textContent = "Rp " + sum.toLocaleString("id-ID"); }
}
let msgT = null;
function flash(t, ms = 2000) {
  const e = $("message"); if (!e) return;
  e.textContent = t; e.style.opacity = "1";
  e.style.transform = "translateX(-50%) translateY(0)";
  clearTimeout(msgT);
  msgT = setTimeout(() => { e.style.opacity = "0"; e.style.transform = "translateX(-50%) translateY(6px)"; }, ms);
}
function addMoney(amount) { G.money += amount; setWalletUI(); }
function spendMoney(amount) { if (G.money < amount) return false; G.money -= amount; setWalletUI(); return true; }
function giveSalary(day) {
  const j = JOBS[day]; if (!j) return;
  addMoney(j.pay);
  flash("Gaji masuk: Rp " + j.pay.toLocaleString("id-ID"), 3000);
  pushPhoneMessage("Bank", `Gaji hari ini Rp ${j.pay.toLocaleString("id-ID")} sudah masuk ke rekeningmu.`);
}

/* WEATHER */
let rainPoints = null;
const RAIN_COUNT = 800, RAIN_AREA = 40, RAIN_HEIGHT = 25;
const rainVelocity = [];
function createRainSystem() {
  if (rainPoints) return;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(RAIN_COUNT * 3);
  for (let i = 0; i < RAIN_COUNT; i++) { positions[i*3+0] = (Math.random() - 0.5) * RAIN_AREA * 2; positions[i*3+1] = Math.random() * RAIN_HEIGHT; positions[i*3+2] = (Math.random() - 0.5) * RAIN_AREA * 2; rainVelocity.push(28 + Math.random() * 12); }
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ color: 0xaaccff, size: 0.08, transparent: true, opacity: 0.85, sizeAttenuation: true, depthWrite: false });
  rainPoints = new THREE.Points(geo, mat);
  rainPoints.frustumCulled = false; rainPoints.visible = false;
  scene.add(rainPoints);
}
function updateRain(dt) {
  if (!rainPoints || !rainPoints.visible) return;
  const pos = rainPoints.geometry.attributes.position;
  const arr = pos.array;
  const px = camera.position.x, pz = camera.position.z, py = camera.position.y;
  for (let i = 0; i < RAIN_COUNT; i++) {
    const i3 = i*3;
    arr[i3+1] -= rainVelocity[i] * dt;
    if (arr[i3+1] < py - 3) { arr[i3+0] = px + (Math.random() - 0.5) * RAIN_AREA * 2; arr[i3+1] = py + RAIN_HEIGHT; arr[i3+2] = pz + (Math.random() - 0.5) * RAIN_AREA * 2; }
  }
  pos.needsUpdate = true;
}
const WEATHER_LABEL = { clear: "☀️ Cerah", rain: "🌧️ Hujan", storm: "⛈️ Badai" };
function setWeather(w, silent = false) {
  const prev = G.weather;
  G.weather = w;
  if (!rainPoints) createRainSystem();
  if (w === "rain") { rainPoints.visible = true; rainPoints.material.opacity = 0.75; scene.fog.color.setHex(0x1a2530); scene.background.setHex(0x1a2530); hemiLight.color.setHex(0x8aa8c0); hemiLight.intensity = 0.85; renderer.toneMappingExposure = 0.95; }
  else if (w === "storm") { rainPoints.visible = true; rainPoints.material.opacity = 1.0; scene.fog.color.setHex(0x101820); scene.background.setHex(0x101820); hemiLight.color.setHex(0x6a88a0); hemiLight.intensity = 0.7; renderer.toneMappingExposure = 0.85; }
  else { if (rainPoints) rainPoints.visible = false; scene.fog.color.setHex(0x0a0e17); scene.background.setHex(0x0a0e17); hemiLight.color.setHex(0xa5c2e0); hemiLight.intensity = 1.15; renderer.toneMappingExposure = 1.35; }
  if (!silent && prev !== w) { flash("Cuaca berubah: " + WEATHER_LABEL[w], 2500); if (w === "rain" || w === "storm") pushPhoneMessage("Cuaca", `Info cuaca: ${WEATHER_LABEL[w]} di daerahmu.`); }
}
let weatherCheckT = 0;
function updateWeather(dt) {
  weatherCheckT -= dt;
  if (weatherCheckT <= 0) {
    const r = Math.random();
    let newW = "clear";
    if (r < 0.5) newW = "clear"; else if (r < 0.82) newW = "rain"; else newW = "storm";
    if (newW !== G.weather) setWeather(newW, false); else setWeather(newW, true);
    weatherCheckT = 40 + Math.random() * 50;
  }
  updateRain(dt);
}

/* COORD OVERLAY */
let coordOverlayEl = null, coordUpdateT = 0, coordVisible = true;
function ensureCoordOverlay() {
  if (coordOverlayEl) return;
  coordOverlayEl = document.createElement("div"); coordOverlayEl.id = "coordOverlay";
  coordOverlayEl.style.cssText = `position:fixed;bottom:max(90px,calc(env(safe-area-inset-bottom) + 90px));right:8px;padding:6px 10px;background:rgba(0,0,0,.82);color:#7aff7a;font-family:monospace;font-size:10px;line-height:1.55;border:1px solid rgba(120,255,120,.4);border-radius:8px;z-index:200000;pointer-events:none;white-space:pre;display:block;text-shadow:0 0 4px rgba(120,255,120,.5);max-width:42vw;max-height:55vh;overflow:hidden;`;
  document.body.appendChild(coordOverlayEl);
  const tb = document.createElement("button"); tb.id = "coordToggleBtn"; tb.textContent = "📊";
  tb.style.cssText = `position:fixed;bottom:max(30px,calc(env(safe-area-inset-bottom) + 30px));left:160px;width:44px;height:44px;background:rgba(0,0,0,.72);color:#7aff7a;border:1px solid rgba(120,255,120,.5);border-radius:10px;font-size:18px;z-index:200001;pointer-events:auto;cursor:pointer;touch-action:manipulation;box-shadow:0 4px 12px rgba(0,0,0,.5);`;
  tb.addEventListener("pointerdown", e => { e.preventDefault(); e.stopPropagation(); toggleCoordOverlay(); }, { passive: false });
  document.body.appendChild(tb);
}
function toggleCoordOverlay() { coordVisible = !coordVisible; if (coordOverlayEl) coordOverlayEl.style.display = coordVisible ? "block" : "none"; }
function updateCoordOverlay(dt) {
  if (!coordVisible || !coordOverlayEl) return;
  coordUpdateT -= dt; if (coordUpdateT > 0) return;
  coordUpdateT = 0.15;
  const p = camera.position;
  let vehStr = "";
  for (let i = 0; i < Math.min(vehicles.length, 4); i++) vehStr += "\n  V" + i + " " + vehicles[i].obj.position.x.toFixed(1) + "," + vehicles[i].obj.position.z.toFixed(1);
  if (vehicles.length > 4) vehStr += "\n  +" + (vehicles.length - 4) + " lain";
  coordOverlayEl.textContent =
    "POS   " + p.x.toFixed(2) + " , " + p.y.toFixed(2) + " , " + p.z.toFixed(2) + "\n" +
    "FEET  " + G.py.toFixed(2) + "\n" +
    "YAW   " + (G.yaw * 180 / Math.PI).toFixed(1) + "°\n" +
    "DAY   " + G.day + " | " + G.phase + "\n" +
    "PHASE " + (G.currentPhase || G.currentMini || "-") + "\n" +
    "HP    " + G.health.toFixed(0) + " / " + G.maxHealth + "\n" +
    "SAN   " + G.sanity.toFixed(0) + " / " + G.sanityMax + "\n" +
    "$$    Rp " + G.money.toLocaleString("id-ID") + "\n" +
    "TIME  " + getClockString() + "\n" +
    "WTHR  " + G.weather + "\n" +
    "OWNER " + (G.ownerMode ? "ON x" + G.ownerSpeedMul + (G.ownerFly ? " FLY" : "") : "OFF") + "\n" +
    "KIDNAP " + (G.kidnapActive ? "ACTIVE" : "no") + "\n" +
    "INV   " + (G.hasKey ? "🔑" : "-") + " " + (G.hasPhoneKidnapper ? "📱" : "-") + " " + (G.policeHanded ? "👮" : "-") + "\n" +
    "VEH   " + vehicles.length + vehStr;
}

/* OWNER PANEL */
let ownerPanelEl = null, ownerToggleBtn = null;
function ensureOwnerPanel() {
  if (ownerToggleBtn) return;
  ownerToggleBtn = document.createElement("button"); ownerToggleBtn.id = "ownerToggleBtn"; ownerToggleBtn.textContent = "👑";
  ownerToggleBtn.style.cssText = `position:fixed;bottom:max(30px,calc(env(safe-area-inset-bottom) + 30px));left:212px;width:44px;height:44px;background:rgba(0,0,0,.72);color:#ffcc44;border:1px solid rgba(255,200,80,.6);border-radius:10px;font-size:18px;z-index:200001;pointer-events:auto;cursor:pointer;touch-action:manipulation;box-shadow:0 4px 12px rgba(0,0,0,.5);`;
  ownerToggleBtn.addEventListener("pointerdown", e => { e.preventDefault(); e.stopPropagation(); toggleOwnerPanel(); }, { passive: false });
  document.body.appendChild(ownerToggleBtn);
  ownerPanelEl = document.createElement("div"); ownerPanelEl.id = "ownerPanel";
  ownerPanelEl.style.cssText = `position:fixed;bottom:max(90px,calc(env(safe-area-inset-bottom) + 90px));left:20px;width:250px;max-height:62vh;overflow-y:auto;padding:12px;background:rgba(20,15,5,.96);color:#ffe8a0;font-family:monospace;font-size:11px;border:1px solid rgba(255,200,80,.5);border-radius:10px;z-index:200002;display:none;box-shadow:0 8px 24px rgba(0,0,0,.7);`;
  ownerPanelEl.innerHTML = `
    <div style="font-weight:bold;color:#ffcc44;margin-bottom:8px;">👑 OWNER PANEL</div>
    <label style="display:block;margin:6px 0;cursor:pointer;"><input type="checkbox" id="ownerModeChk"> Owner Mode ON</label>
    <div style="margin:8px 0;"><div style="margin-bottom:4px;">Speed: <span id="ownerSpeedVal">1x</span></div>
    <input type="range" id="ownerSpeedSlider" min="1" max="20" value="1" step="1" style="width:100%;"></div>
    <label style="display:block;margin:6px 0;cursor:pointer;"><input type="checkbox" id="ownerFlyChk"> ✈️ Fly Mode</label>
    <div style="display:flex;gap:6px;margin:6px 0;">
      <button id="ownerFlyUpBtn" style="flex:1;padding:10px;background:#2a4a6a;color:#aaddff;border:1px solid #6a8aac;border-radius:6px;font-size:14px;cursor:pointer;font-weight:bold;">▲ NAIK</button>
      <button id="ownerFlyDownBtn" style="flex:1;padding:10px;background:#4a2a2a;color:#ffaaaa;border:1px solid #8a6a6a;border-radius:6px;font-size:14px;cursor:pointer;font-weight:bold;">▼ TURUN</button>
    </div>
    <button id="ownerHealBtn" style="width:100%;padding:6px;margin:4px 0;background:#2a4a2a;color:#aaffaa;border:1px solid #6a8a6a;border-radius:4px;cursor:pointer;">❤️ Heal</button>
    <button id="ownerMoneyBtn" style="width:100%;padding:6px;margin:4px 0;background:#4a4a2a;color:#ffffaa;border:1px solid #8a8a6a;border-radius:4px;cursor:pointer;">💰 +100rb</button>
    <button id="ownerTpHomeBtn" style="width:100%;padding:6px;margin:4px 0;background:#2a2a4a;color:#aaaaff;border:1px solid #6a6a8a;border-radius:4px;cursor:pointer;">🏠 TP Home</button>
    <button id="ownerTpKidnapBtn" style="width:100%;padding:6px;margin:4px 0;background:#4a2a6a;color:#ddaaff;border:1px solid #8a6aaa;border-radius:4px;cursor:pointer;">📍 TP Titik Culik</button>
    <button id="ownerKidnapBtn" style="width:100%;padding:6px;margin:4px 0;background:#4a2a2a;color:#ffaaaa;border:1px solid #8a6a6a;border-radius:4px;cursor:pointer;">▶ Adegan Culik</button>
    <button id="ownerSaveBtn" style="width:100%;padding:6px;margin:4px 0;background:#2a4a6a;color:#aaddff;border:1px solid #6a8aac;border-radius:4px;cursor:pointer;">💾 SAVE GAME</button>
    <button id="ownerLoadBtn" style="width:100%;padding:6px;margin:4px 0;background:#4a6a2a;color:#aaffaa;border:1px solid #8aac6a;border-radius:4px;cursor:pointer;">📂 LOAD GAME</button>
  `;
  document.body.appendChild(ownerPanelEl);
  const modeChk = ownerPanelEl.querySelector("#ownerModeChk");
  modeChk.checked = G.ownerMode;
  modeChk.addEventListener("change", () => {
    G.ownerMode = modeChk.checked;
    if (!G.ownerMode) { G.ownerSpeedMul = 1; G.ownerFly = false; ownerPanelEl.querySelector("#ownerSpeedSlider").value = 1; ownerPanelEl.querySelector("#ownerFlyChk").checked = false; ownerPanelEl.querySelector("#ownerSpeedVal").textContent = "1x"; }
    flash("Owner Mode: " + (G.ownerMode ? "ON" : "OFF"), 1500);
  });
  ownerPanelEl.querySelector("#ownerSpeedSlider").addEventListener("input", (e) => { G.ownerSpeedMul = parseInt(e.target.value); ownerPanelEl.querySelector("#ownerSpeedVal").textContent = G.ownerSpeedMul + "x"; });
  ownerPanelEl.querySelector("#ownerFlyChk").addEventListener("change", (e) => {
    G.ownerFly = e.target.checked;
    if (G.ownerFly) { G.ownerMode = true; ownerPanelEl.querySelector("#ownerModeChk").checked = true; G.ownerFlyY = camera.position.y - EYE_HEIGHT; G.py = G.ownerFlyY; G.vy = 0; G.onGround = false; }
    else G.vy = 0;
  });
  ownerPanelEl.querySelector("#ownerHealBtn").addEventListener("click", () => { G.health = G.maxHealth; updateHealthUI(); flash("❤️ HP penuh"); });
  ownerPanelEl.querySelector("#ownerMoneyBtn").addEventListener("click", () => { addMoney(100000); flash("💰 +Rp 100.000"); });
  ownerPanelEl.querySelector("#ownerTpHomeBtn").addEventListener("click", () => { camera.position.set(POS.home.x, PH, POS.home.z); G.py = 0; G.vy = 0; });
  ownerPanelEl.querySelector("#ownerTpKidnapBtn").addEventListener("click", () => { camera.position.set(17, PH, -79); G.py = 0; G.vy = 0; });
  ownerPanelEl.querySelector("#ownerKidnapBtn").addEventListener("click", () => {
    const idx = FLOW[5].findIndex(it => it.kidnapScene);
    if (idx < 0) return;
    G.ownerMode = false; G.ownerFly = false; G.ownerSpeedMul = 1;
    ownerPanelEl.querySelector("#ownerModeChk").checked = false;
    ownerPanelEl.querySelector("#ownerFlyChk").checked = false;
    G.ownerPanelOpen = false; ownerPanelEl.style.display = "none";
    G.vy = 0; hideMarker(); csHide();
    G.day = 5; G.flowIndex = idx; G.currentPhase = null; flowNext();
  });
  ownerPanelEl.querySelector("#ownerSaveBtn").addEventListener("click", () => { if (typeof saveGame === "function") saveGame(); });
  ownerPanelEl.querySelector("#ownerLoadBtn").addEventListener("click", () => { if (typeof loadGame === "function") loadGame(); });
  const upBtn = ownerPanelEl.querySelector("#ownerFlyUpBtn"), downBtn = ownerPanelEl.querySelector("#ownerFlyDownBtn");
  if (upBtn) { upBtn.addEventListener("pointerdown", e => { e.preventDefault(); G.ownerFlyUp = true; }, { passive: false }); ["pointerup","pointerleave","pointercancel"].forEach(t => upBtn.addEventListener(t, () => { G.ownerFlyUp = false; })); }
  if (downBtn) { downBtn.addEventListener("pointerdown", e => { e.preventDefault(); G.ownerFlyDown = true; }, { passive: false }); ["pointerup","pointerleave","pointercancel"].forEach(t => downBtn.addEventListener(t, () => { G.ownerFlyDown = false; })); }
}
function toggleOwnerPanel() {
  if (!ownerPanelEl) return;
  G.ownerPanelOpen = !G.ownerPanelOpen;
  ownerPanelEl.style.display = G.ownerPanelOpen ? "block" : "none";
}
/* PHONE CHAT + AI */
const PHONE_CHATS = {};
const CHAT_AVATARS = { "Bos": "👨‍💼", "Bank": "🏦", "Cuaca": "🌤️", "Ibu": "👩", "Anonim": "👤", "PLN": "⚡" };
function ensureChatThread(from) {
  if (!PHONE_CHATS[from]) PHONE_CHATS[from] = { name: from, avatar: CHAT_AVATARS[from] || "👤", messages: [], unread: 0 };
  return PHONE_CHATS[from];
}
function pushPhoneMessage(from, text, urgent = false) {
  const chat = ensureChatThread(from);
  chat.messages.push({ from: "them", text, time: getClockString(), urgent });
  if (!G.phoneOpen || G.chatOpenWith !== from) chat.unread++;
  G.phoneUnread++;
  updatePhoneBadge(); updateChatAppBadge();
  if (!G.phoneOpen) showPhoneNotification(from, text, urgent);
  else if (G.chatOpenWith && G.chatOpenWith !== from) showPhoneNotification(from, text, urgent);
  else if (G.chatOpenWith === from) openChatDetail(from);
}
function normalizeText(t) { return String(t || "").toLowerCase().replace(/[?!.,;:]/g, " ").replace(/\s+/g, " ").trim(); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

const AI_PROFILES = {
  "Ibu": {
    fallback: ["Iya nak? Ada apa?", "Ibu di rumah aja nak.", "Ada apa nak? Cerita ke ibu.", "Ibu kangen kamu nak...", "Nak, jangan lupa istirahat ya."],
    rules: [
      { keywords: ["makan", "lapar", "sarapan", "belum makan"], replies: ["Ibu udah makan nak. Kamu udah makan belum?", "Udah kok nak. Kamu jangan lupa makan ya.", "Ibu baru selesai masak. Kamu makan apa hari ini?", "Kalau belum makan, cepetan makan nak.", "Ibu kangen masak buat kamu nak... 🥲"] },
      { keywords: ["sehat", "sakit", "demam", "pusing", "capek", "lelah"], replies: ["Ibu sehat nak. Kamu kenapa? Sakit ya?", "Alhamdulillah ibu sehat. Kamu jangan lupa istirahat.", "Kalau kamu sakit, minum obat nak.", "Ibu khawatir. Kamu jangan lupa makan teratur ya."] },
      { keywords: ["kerja", "kantor", "gaji", "lembur", "bos"], replies: ["Kerja yang rajin nak, tapi jangan lupa istirahat.", "Kalau capek kerja, pulang ya nak. Ibu tunggu.", "Gajian? Yang ditabung ya nak.", "Ibu bangga kamu udah kerja nak. 🥲"] },
      { keywords: ["rumah", "pulang", "kangen", "rindu"], replies: ["Ibu kangen banget nak. Kapan pulang?", "Pulang dong nak, ibu masak buat kamu.", "Rumah selalu nungguin kamu nak."] },
      { keywords: ["halo", "hai", "pagi", "siang", "malam", "assalam"], replies: ["Halo nak! Ibu kangen kamu. 😊", "Iya nak, ibu di sini. Ada apa?", "Pagi nak, udah sarapan belum?"] },
      { keywords: ["sayang", "cinta", "love"], replies: ["Ibu juga sayang kamu nak ❤️", "Ibu selalu cinta kamu, nak.", "Love you too nak ❤️"] },
      { keywords: ["uang", "kirim", "transfer", "butuh", "pinjam"], replies: ["Ibu ada sedikit nak, nanti ibu kirim ya.", "Jangan malu minta uang sama ibu nak.", "Duitnya dipake yang bener ya nak."] }
    ]
  },
  "Bos": {
    fallback: ["Iya, ada apa?", "Cepat, saya sibuk.", "Ada masalah?", "Nanti kita bahas di kantor."],
    rules: [
      { keywords: ["izin", "pulang", "cuti"], replies: ["Izin diterima. Besok jangan telat.", "Oke. Tapi kerjaan kamu selesaikan dulu.", "Cuti boleh, tapi ada potongan gaji."] },
      { keywords: ["telat", "maaf", "lambat"], replies: ["Jangan sampe kejadian lagi.", "Kali ini saya maafin. Lain kali potong gaji.", "Saya gak mau denger alasan."] },
      { keywords: ["gaji", "gajian", "bonus"], replies: ["Gajian tanggal 25. Jangan nanya lagi.", "Bonus nanti saya pertimbangkan.", "Gaji standar. Ada masalah?"] },
      { keywords: ["halo", "hai", "pagi", "siang"], replies: ["Pagi. Langsung ke intinya.", "Ya, ada apa?", "Halo. Cepat, saya sibuk."] }
    ]
  },
  "Bank": {
    fallback: ["Terima kasih telah menghubungi Bank Central.", "Ada yang bisa kami bantu?", "Mohon tunggu."],
    rules: [
      { keywords: ["saldo", "cek", "uang", "tabungan"], replies: ["Saldo Anda dapat dilihat di menu Bank aplikasi.", "Untuk cek saldo, buka app Bank.", "Terima kasih, saldo Anda aman."] },
      { keywords: ["transfer", "kirim", "bayar"], replies: ["Transfer sedang diproses.", "Konfirmasi transfer berhasil.", "Biaya admin Rp 6.500."] }
    ]
  },
  "Cuaca": {
    fallback: ["Info cuaca akan diupdate berkala.", "Mohon tunggu update berikutnya."],
    rules: [
      { keywords: ["hujan", "gerimis"], replies: ["Potensi hujan 60% sore ini.", "Bawa payung.", "Hujan diperkirakan nanti malam."] },
      { keywords: ["panas", "cerah"], replies: ["Suhu 32°C, cerah sepanjang hari.", "Cuaca cerah, cocok aktivitas outdoor."] }
    ]
  },
  "PLN": {
    fallback: ["Pesan otomatis. Mohon dibayar tagihan Anda.", "Terima kasih."],
    rules: [
      { keywords: ["tagihan", "bayar", "listrik", "air"], replies: ["Tagihan Anda sudah dibayar. Terima kasih.", "Pembayaran diterima."] }
    ]
  },
  "Anonim": {
    fallback: ["...", "Aku masih di sini.", "Kamu tidak sendiri.", "Aku mengawasimu.", "Jangan lihat ke belakang.", "Kita akan bertemu. Segera."],
    rules: [
      { keywords: ["siapa", "kamu siapa"], replies: ["Kamu akan tahu. Segera.", "Aku... seseorang yang mengenalmu.", "Nama tidak penting.", "Kita pernah bertemu."] },
      { keywords: ["takut", "seram", "ngeri"], replies: ["Rasa takut itu wajar.", "Aku tidak akan menyakitimu... mungkin.", "Kamu tidak bisa lari dariku.", "Teruslah takut. Itu membuatku senang."] },
      { keywords: ["mau apa", "maunya"], replies: ["Aku hanya ingin... bertemu.", "Kamu akan tahu nanti.", "Aku ingin melihatmu tersenyum. Sebelum..."] },
      { keywords: ["dimana", "lokasi"], replies: ["Dekat. Sangat dekat.", "Di belakangmu.", "Aku bisa melihatmu sekarang."] },
      { keywords: ["pergi", "stop", "berhenti"], replies: ["Terlambat.", "Sudah tidak bisa dihentikan.", "Kita sudah terikat."] }
    ]
  }
};
function generateAIReply(npcId, userText) {
  const profile = AI_PROFILES[npcId];
  if (!profile) return "....";
  const text = normalizeText(userText);
  let bestRule = null, bestScore = 0;
  for (const rule of profile.rules) {
    let score = 0;
    for (const k of rule.keywords) if (text.includes(k)) score += k.split(" ").length * 2 + k.length * 0.1;
    if (score > bestScore) { bestScore = score; bestRule = rule; }
  }
  if (bestRule && bestScore > 0) return pick(bestRule.replies);
  return pick(profile.fallback);
}
function sendChatMessage(from, text) {
  if (checkAdvancedCheat(text)) return;
  const chat = ensureChatThread(from);
  chat.messages.push({ from: "me", text, time: getClockString() });
  openChatDetail(from);
  setTimeout(() => showTypingIndicator(from), 300);
  const delay = 1000 + Math.random() * 1500;
  setTimeout(() => {
    const reply = generateAIReply(from, text);
    const c = ensureChatThread(from);
    hideTypingIndicator();
    c.messages.push({ from: "them", text: reply, time: getClockString() });
    if (!G.phoneOpen || G.chatOpenWith !== from) { c.unread++; G.phoneUnread++; updatePhoneBadge(); updateChatAppBadge(); showPhoneNotification(from, reply); }
    else openChatDetail(from);
  }, delay);
}
function showTypingIndicator(from) {
  const bubbles = $("posChatBubbles"); if (!bubbles) return;
  hideTypingIndicator();
  const t = document.createElement("div");
  t.id = "typingIndicator"; t.className = "pos-bubble them";
  t.innerHTML = `<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>`;
  bubbles.appendChild(t); bubbles.scrollTop = bubbles.scrollHeight;
}
function hideTypingIndicator() { const t = $("typingIndicator"); if (t) t.remove(); }
function updateChatAppBadge() {
  const badge = $("appChatBadge"); if (!badge) return;
  let totalUnread = 0;
  for (const id in PHONE_CHATS) totalUnread += PHONE_CHATS[id].unread || 0;
  if (totalUnread > 0) { badge.textContent = totalUnread > 9 ? "9+" : totalUnread; badge.style.display = "block"; }
  else badge.style.display = "none";
}
function updatePhoneBadge() {
  const b = $("phoneBadge"); if (!b) return;
  if (G.phoneUnread > 0) { b.textContent = G.phoneUnread > 9 ? "9+" : G.phoneUnread; b.classList.add("show"); }
  else b.classList.remove("show");
}
function showPhoneNotification(from, text, urgent = false) {
  const chat = PHONE_CHATS[from] || { name: from, avatar: CHAT_AVATARS[from] || "👤" };
  const old = document.querySelector(".phone-notif-banner"); if (old) old.remove();
  const banner = document.createElement("div");
  banner.className = "phone-notif-banner" + (urgent ? " urgent" : "");
  banner.innerHTML = `<div class="phone-notif-avatar">${chat.avatar}</div><div class="phone-notif-content"><div class="phone-notif-from">${chat.name}</div><div class="phone-notif-text">${text}</div></div>`;
  banner.onclick = () => { banner.remove(); openPhoneOS(); openChatDetail(from); };
  document.body.appendChild(banner);
  setTimeout(() => { if (banner.parentNode) banner.remove(); }, 5000);
}

let phoneOSEl = null;
function injectPhoneOSStyles() {
  if ($("phoneOSStyles")) return;
  const style = document.createElement("style"); style.id = "phoneOSStyles";
  style.textContent = `
    #phoneOS{position:fixed;inset:0;z-index:150000;background:#000;display:none;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
    #phoneOS.open{display:block}
    .pos-screen{position:absolute;inset:0;background:linear-gradient(160deg,#1a2540 0%,#2a1a3a 50%,#0a0f1a 100%);display:flex;flex-direction:column;color:#fff}
    .pos-statusbar{display:flex;justify-content:space-between;align-items:center;padding:8px 20px;font-size:12px;font-weight:600;background:rgba(0,0,0,.35);flex-shrink:0}
    .pos-statusbar .left,.pos-statusbar .right{display:flex;gap:6px;align-items:center}
    .pos-home{flex:1;display:flex;flex-direction:column;padding:40px 24px;overflow-y:auto}
    .pos-clock{text-align:center;margin-bottom:60px}
    .pos-clock-time{font-size:72px;font-weight:100;letter-spacing:-3px;line-height:1;text-shadow:0 4px 20px rgba(120,180,255,.4)}
    .pos-clock-date{font-size:14px;opacity:.65;margin-top:8px}
    .pos-apps{display:grid;grid-template-columns:repeat(4,1fr);gap:22px 14px}
    .pos-app{display:flex;flex-direction:column;align-items:center;cursor:pointer;position:relative}
    .pos-app:active{transform:scale(.92)}
    .pos-app-icon{width:58px;height:58px;border-radius:15px;display:flex;align-items:center;justify-content:center;font-size:30px;box-shadow:0 6px 18px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.2)}
    .pos-app-name{font-size:11px;margin-top:6px;text-shadow:0 1px 4px rgba(0,0,0,.8)}
    .pos-app-badge{position:absolute;top:-3px;right:calc(50% - 32px);min-width:19px;height:19px;padding:0 5px;background:#ef4444;color:#fff;border-radius:999px;font-size:11px;font-weight:700;line-height:19px;text-align:center}
    .pos-app-view{position:absolute;inset:0;background:#0f1219;z-index:10;display:none;flex-direction:column}
    .pos-app-view.active{display:flex}
    .pos-appbar{display:flex;align-items:center;gap:12px;padding:12px 16px;background:#1a1e28;border-bottom:1px solid rgba(255,255,255,.08);flex-shrink:0}
    .pos-appbar button{background:none;border:none;color:#7ab8ff;font-size:16px;font-weight:600;cursor:pointer;padding:4px 8px}
    .pos-appbar .title{font-size:16px;font-weight:700}
    .pos-home-bar{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);width:120px;height:5px;background:rgba(255,255,255,.5);border-radius:999px;cursor:pointer;z-index:20}
    .pos-chat-list{flex:1;overflow-y:auto}
    .pos-chat-item{display:flex;gap:12px;padding:12px 16px;cursor:pointer;align-items:center;border-bottom:1px solid rgba(255,255,255,.05)}
    .pos-chat-item:active{background:rgba(255,255,255,.05)}
    .pos-chat-avatar{width:46px;height:46px;border-radius:50%;background:rgba(90,120,180,.35);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
    .pos-chat-preview{flex:1;min-width:0}
    .pos-chat-name{font-size:14px;font-weight:700;margin-bottom:3px}
    .pos-chat-last{font-size:12px;opacity:.6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .pos-chat-time{font-size:11px;opacity:.5;flex-shrink:0}
    .pos-chat-unread{min-width:20px;height:20px;padding:0 6px;background:#3b82f6;border-radius:999px;font-size:11px;font-weight:700;line-height:20px;text-align:center;margin-left:6px}
    .pos-chat-bubbles{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:8px}
    .pos-bubble{max-width:75%;padding:9px 13px;border-radius:16px;font-size:14px;line-height:1.4;word-wrap:break-word}
    .pos-bubble.them{align-self:flex-start;background:#2a3142;border-bottom-left-radius:4px}
    .pos-bubble.me{align-self:flex-end;background:#2563eb;border-bottom-right-radius:4px}
    .pos-bubble-time{font-size:10px;opacity:.55;margin-top:3px;text-align:right}
    .pos-chat-input{display:flex;gap:8px;padding:10px 12px;background:#1a1e28;border-top:1px solid rgba(255,255,255,.08);flex-shrink:0}
    .pos-chat-input input{flex:1;background:#0a0d13;border:1px solid rgba(255,255,255,.1);border-radius:22px;padding:10px 16px;color:#fff;font-size:14px;outline:none}
    .pos-chat-input button{width:44px;height:44px;border-radius:50%;background:#2563eb;color:#fff;border:none;font-size:18px;cursor:pointer;flex-shrink:0}
    .pos-empty{padding:60px 20px;text-align:center;opacity:.5;font-size:14px}
    .pos-bank-card{margin:20px;padding:24px;background:linear-gradient(135deg,#f59e0b,#dc2626);border-radius:18px}
    .pos-bank-label{font-size:12px;opacity:.8;letter-spacing:2px}
    .pos-bank-balance{font-size:32px;font-weight:800;margin-top:8px}
    .pos-bank-history{margin:12px 20px}
    .pos-bank-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.06);font-size:13px}
    .pos-settings-row{display:flex;justify-content:space-between;align-items:center;padding:14px 20px;border-bottom:1px solid rgba(255,255,255,.06);font-size:14px}
    .typing-dot{display:inline-block;width:6px;height:6px;background:rgba(255,255,255,.6);border-radius:50%;margin:0 2px;animation:typingBounce 1.2s infinite}
    .typing-dot:nth-child(2){animation-delay:.15s}
    .typing-dot:nth-child(3){animation-delay:.3s}
    @keyframes typingBounce{0%,60%,100%{transform:translateY(0);opacity:.5}30%{transform:translateY(-5px);opacity:1}}
    .phone-notif-banner{position:fixed;top:max(56px,calc(env(safe-area-inset-top) + 56px));left:10px;right:10px;max-width:520px;margin:0 auto;padding:11px 14px;background:rgba(28,34,46,.96);backdrop-filter:blur(14px);border:1px solid rgba(120,160,220,.35);border-radius:14px;display:flex;gap:12px;align-items:center;z-index:155000;cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.6);animation:phoneNotifIn .4s cubic-bezier(.16,1,.3,1);color:#fff}
    .phone-notif-banner.urgent{border-color:rgba(255,80,80,.7);background:rgba(60,20,20,.96)}
    .phone-notif-avatar{width:36px;height:36px;border-radius:10px;background:rgba(90,120,180,.4);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
    .phone-notif-content{flex:1;min-width:0}
    .phone-notif-from{font-size:11px;font-weight:700;opacity:.7;letter-spacing:1px;text-transform:uppercase}
    .phone-notif-text{font-size:13px;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    @keyframes phoneNotifIn{from{transform:translateY(-90px);opacity:0}to{transform:translateY(0);opacity:1}}
  `;
  document.head.appendChild(style);
}
function ensurePhoneOS() {
  if (phoneOSEl) return;
  injectPhoneOSStyles();
  phoneOSEl = document.createElement("div"); phoneOSEl.id = "phoneOS";
  phoneOSEl.innerHTML = `
    <div class="pos-screen">
      <div class="pos-statusbar">
        <div class="left"><span>IndoNet</span><span>📶</span></div>
        <div class="right"><span id="posTime">--:--</span><span>🔋 79%</span></div>
      </div>
      <div class="pos-home" id="posHome">
        <div class="pos-clock"><div class="pos-clock-time" id="posClockTime">--:--</div><div class="pos-clock-date" id="posClockDate">—</div></div>
        <div class="pos-apps">
          <div class="pos-app" data-app="chat"><div class="pos-app-icon" style="background:linear-gradient(135deg,#4ade80,#16a34a)">💬</div><div class="pos-app-name">Chat</div><div class="pos-app-badge" id="appChatBadge" style="display:none">0</div></div>
          <div class="pos-app" data-app="bank"><div class="pos-app-icon" style="background:linear-gradient(135deg,#fbbf24,#d97706)">💰</div><div class="pos-app-name">Bank</div></div>
          <div class="pos-app" data-app="gallery"><div class="pos-app-icon" style="background:linear-gradient(135deg,#ec4899,#be185d)">📸</div><div class="pos-app-name">Galeri</div></div>
          <div class="pos-app" data-app="settings"><div class="pos-app-icon" style="background:linear-gradient(135deg,#94a3b8,#475569)">⚙️</div><div class="pos-app-name">Setelan</div></div>
        </div>
      </div>
      <div class="pos-app-view" id="posAppView"></div>
      <div class="pos-home-bar" id="posHomeBar"></div>
    </div>`;
  document.body.appendChild(phoneOSEl);
  phoneOSEl.querySelectorAll(".pos-app").forEach(el => {
    el.addEventListener("click", () => {
      const app = el.dataset.app;
      if (app === "chat") openChatApp();
      else if (app === "bank") openBankApp();
      else if (app === "gallery") openGallery();
      else if (app === "settings") openSettingsApp();
    });
  });
  $("posHomeBar").addEventListener("click", closePhoneOS);
  updatePhoneOSClock();
  setInterval(updatePhoneOSClock, 30000);
}
function updatePhoneOSClock() {
  const t = $("posClockTime"), d = $("posClockDate"), st = $("posTime");
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0"), mm = String(now.getMinutes()).padStart(2, "0");
  if (t) t.textContent = hh + ":" + mm;
  if (st) st.textContent = hh + ":" + mm;
  if (d) { const days = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"]; const mons = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"]; d.textContent = days[now.getDay()] + ", " + now.getDate() + " " + mons[now.getMonth()]; }
}
function openPhoneOS() {
  ensurePhoneOS();
  G.phoneOpen = true; G.phoneUnread = 0;
  for (const id in PHONE_CHATS) PHONE_CHATS[id].unread = 0;
  updatePhoneBadge(); updateChatAppBadge();
  phoneOSEl.classList.add("open");
  $("posAppView").classList.remove("active");
  updatePhoneOSClock();
}
function closePhoneOS() { G.phoneOpen = false; G.chatOpenWith = null; if (phoneOSEl) phoneOSEl.classList.remove("open"); }
function openChatApp() {
  const view = $("posAppView"); view.classList.add("active");
  view.innerHTML = `<div class="pos-appbar"><button id="posBackBtn">← Kembali</button><div class="title">Chat</div></div><div class="pos-chat-list" id="posChatList"></div>`;
  $("posBackBtn").onclick = () => view.classList.remove("active");
  const list = $("posChatList");
  const threads = Object.entries(PHONE_CHATS);
  if (threads.length === 0) { list.innerHTML = `<div class="pos-empty">Belum ada pesan</div>`; return; }
  threads.sort((a, b) => { const la = a[1].messages[a[1].messages.length-1]; const lb = b[1].messages[b[1].messages.length-1]; return (lb?.time || "").localeCompare(la?.time || ""); });
  for (const [id, chat] of threads) {
    const last = chat.messages[chat.messages.length - 1];
    const item = document.createElement("div"); item.className = "pos-chat-item";
    item.innerHTML = `<div class="pos-chat-avatar">${chat.avatar}</div><div class="pos-chat-preview"><div class="pos-chat-name">${chat.name}</div><div class="pos-chat-last">${last ? last.text : "—"}</div></div><div class="pos-chat-time">${last ? last.time : ""}</div>${chat.unread > 0 ? `<div class="pos-chat-unread">${chat.unread}</div>` : ""}`;
    item.onclick = () => openChatDetail(id);
    list.appendChild(item);
  }
}
function openChatDetail(chatId) {
  const chat = PHONE_CHATS[chatId]; if (!chat) return;
  chat.unread = 0; G.chatOpenWith = chatId;
  updateChatAppBadge();
  const view = $("posAppView"); view.classList.add("active");
  view.innerHTML = `<div class="pos-appbar"><button id="posBackBtn">←</button><div class="title">${chat.avatar} ${chat.name}</div></div><div class="pos-chat-bubbles" id="posChatBubbles"></div><div class="pos-chat-input"><input type="text" id="posChatInput" placeholder="Ketik pesan..." autocomplete="off"><button id="posChatSend">➤</button></div>`;
  $("posBackBtn").onclick = () => { G.chatOpenWith = null; openChatApp(); };
  const bubbles = $("posChatBubbles");
  for (const msg of chat.messages) {
    const b = document.createElement("div");
    b.className = "pos-bubble " + (msg.from === "me" ? "me" : "them");
    b.innerHTML = `${escapeHtml(msg.text)}<div class="pos-bubble-time">${msg.time}</div>`;
    bubbles.appendChild(b);
  }
  bubbles.scrollTop = bubbles.scrollHeight;
  const input = $("posChatInput");
  const send = () => { const t = input.value.trim(); if (!t) return; input.value = ""; sendChatMessage(chatId, t); };
  $("posChatSend").onclick = send;
  input.addEventListener("keydown", e => { if (e.key === "Enter") send(); });
}
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function openBankApp() {
  const view = $("posAppView"); view.classList.add("active");
  const bankChat = PHONE_CHATS["Bank"];
  const history = bankChat ? bankChat.messages.slice().reverse() : [];
  view.innerHTML = `
    <div class="pos-appbar"><button id="posBackBtn">← Kembali</button><div class="title">Bank</div></div>
    <div class="pos-bank-card"><div class="pos-bank-label">SALDO ANDA</div><div class="pos-bank-balance">Rp ${G.money.toLocaleString("id-ID")}</div></div>
    <div class="pos-bank-history">
      <div style="font-size:12px;opacity:.6;margin-bottom:8px;letter-spacing:1px;">RIWAYAT TRANSAKSI</div>
      ${history.length === 0 ? '<div class="pos-empty">Belum ada transaksi.<br><span style="font-size:11px;">Gaji masuk tiap hari kerja</span></div>' : history.map(m => `<div class="pos-bank-row"><span>${m.text}</span><span style="opacity:.5;">${m.time}</span></div>`).join("")}
    </div>`;
  $("posBackBtn").onclick = () => view.classList.remove("active");
}
function openGallery() {
  const view = $("posAppView"); view.classList.add("active");
  view.innerHTML = `
    <div class="pos-appbar"><button id="posBackBtn">← Kembali</button><div class="title">📸 Galeri</div></div>
    <div style="flex:1;overflow-y:auto;padding:12px;display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
      ${G.photos.length === 0 ? '<div class="pos-empty" style="grid-column:1/3;">Belum ada foto.<br><span style="font-size:11px;">Tekan 📸 untuk foto</span></div>' :
        G.photos.map(p => `<div style="position:relative;border-radius:8px;overflow:hidden;background:#1a1a1a;"><img src="${p.data}" style="width:100%;display:block;"><div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,.8));padding:6px;font-size:10px;color:#fff;">Day ${p.day} · ${p.time}</div></div>`).join("")}
    </div>`;
  $("posBackBtn").onclick = () => view.classList.remove("active");
}
function openSettingsApp() {
  const view = $("posAppView"); view.classList.add("active");
  view.innerHTML = `
    <div class="pos-appbar"><button id="posBackBtn">← Kembali</button><div class="title">Setelan</div></div>
    <div class="pos-settings-row"><span>Grafik</span><select id="posGraphicSel" style="background:#0a0d13;color:#fff;border:1px solid #333;border-radius:6px;padding:6px"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
    <div class="pos-settings-row"><span>Sensitivitas</span><input type="range" id="posSensSlider" min="10" max="100" value="${Math.round(G.lookSens * 50)}"></div>`;
  $("posBackBtn").onclick = () => view.classList.remove("active");
  const sel = $("posGraphicSel"); sel.value = localStorage.getItem("graphicQuality") || "medium";
  sel.onchange = () => { localStorage.setItem("graphicQuality", sel.value); applyGraphicsSettings(); };
  $("posSensSlider").oninput = (e) => { localStorage.setItem("lookSensitivity", e.target.value); applyGraphicsSettings(); };
}
function openPhone() { openPhoneOS(); }
function closePhone() { closePhoneOS(); }
function getClockString() { const d = new Date(); return String(d.getHours()).padStart(2,"0") + ":" + String(d.getMinutes()).padStart(2,"0"); }

/* DOOR */
const doors = [];
function createDoor(x, z, rotY = 0, opts = {}) {
  const width = opts.width || 1.0, height = opts.height || 2.2;
  const pivot = new THREE.Group();
  pivot.position.set(x, 0, z); pivot.rotation.y = rotY;
  pivot.userData.baseRotY = rotY; world.add(pivot);
  const mat = new THREE.MeshStandardMaterial({ color: opts.color || 0x6a4a2a, roughness: 0.75 });
  const panel = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.08), mat);
  panel.position.set(width / 2, height / 2, 0); pivot.add(panel);
  const handle = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.3 }));
  handle.position.set(width - 0.15, height * 0.5, 0.08); pivot.add(handle);
  const door = { pivot, panel, width, height, locked: !!opts.locked, keyRequired: !!opts.keyRequired, opened: false, targetAngle: 0, currentAngle: 0, x, z, radius: opts.radius || 2.5, label: opts.label || "Pintu" };
  doors.push(door); return door;
}
function updateDoors(dt) { for (const d of doors) { d.currentAngle += (d.targetAngle - d.currentAngle) * Math.min(1, dt * 7); d.pivot.rotation.y = d.pivot.userData.baseRotY + d.currentAngle; } }
function findNearestDoor(maxDist = 2.5) {
  let best = null, bestD = maxDist;
  for (const d of doors) { const dist = Math.hypot(camera.position.x - d.x, camera.position.z - d.z); if (dist < bestD) { best = d; bestD = dist; } }
  return best;
}
function tryOpenDoor() {
  const door = findNearestDoor(2.5); if (!door) return false;
  if (door.locked) { if (door.keyRequired && !G.hasKey) { flash("🔒 Pintu terkunci."); return true; } door.locked = false; flash("🔑 Terbuka."); }
  door.opened = !door.opened;
  door.targetAngle = door.opened ? -Math.PI * 0.55 : 0;
  flash(door.opened ? "🚪 Dibuka" : "🚪 Ditutup", 900);
  return true;
}

/* HOUSE INTERIOR */
let interiorCooldown = 0;
function addInteriorBox(geo, relX, relY, relZ, color, name = "interior") {
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, roughness: 0.9 }));
  m.name = name;
  m.position.set(INTERIOR_ORIGIN.x + relX, INTERIOR_ORIGIN.y + relY, INTERIOR_ORIGIN.z + relZ);
  world.add(m); m.updateMatrixWorld(true);
  m.userData.worldAABB = new THREE.Box3().setFromObject(m);
  tryBuildBVH(m.geometry); SOLID.push(m); addToGrid(m);
  return m;
}
function buildHouseInterior() {
  const O = INTERIOR_ORIGIN, H = 3.0, T = 0.15;
  const COL_FLOOR = 0x5a4a3a, COL_WALL = 0x9a8a7a, COL_WOOD = 0x6a4a2a;
  addInteriorBox(new THREE.BoxGeometry(22, 0.2, 22), 0, -0.1, 0, COL_FLOOR, "lantai");
  addInteriorBox(new THREE.BoxGeometry(22, 0.2, 22), 0, H + 0.1, 0, 0x3a2f22, "plafon");
  addInteriorBox(new THREE.BoxGeometry(22, H, T), 0, H/2, -11, COL_WALL);
  addInteriorBox(new THREE.BoxGeometry(T, H, 22), -11, H/2, 0, COL_WALL);
  addInteriorBox(new THREE.BoxGeometry(T, H, 22), 11, H/2, 0, COL_WALL);
  addInteriorBox(new THREE.BoxGeometry(8, H, T), -7, H/2, 11, COL_WALL);
  addInteriorBox(new THREE.BoxGeometry(8, H, T), 7, H/2, 11, COL_WALL);
  addInteriorBox(new THREE.BoxGeometry(T, H, 4), 0, H/2, -9, COL_WALL);
  addInteriorBox(new THREE.BoxGeometry(T, H, 3), 0, H/2, -2.5, COL_WALL);
  addInteriorBox(new THREE.BoxGeometry(3, H, T), 3, H/2, 0, COL_WALL);
  addInteriorBox(new THREE.BoxGeometry(5, H, T), 8.5, H/2, 0, COL_WALL);
  addInteriorBox(new THREE.BoxGeometry(2.2, 0.25, 3.2), -7, 0.12, -7, 0x3a3a6a, "kasur_dasar");
  addInteriorBox(new THREE.BoxGeometry(2.2, 0.15, 3.2), -7, 0.32, -7, 0x6a6aaa);
  addInteriorBox(new THREE.BoxGeometry(2, 0.15, 0.6), -7, 0.47, -8.3, 0xffffff, "bantal");
  addInteriorBox(new THREE.BoxGeometry(1.5, 2.0, 0.6), -10, 1.0, -8, COL_WOOD, "lemari");
  const lampuKamar = new THREE.PointLight(0xffd98a, 1.2, 6, 1); lampuKamar.position.set(O.x - 8, O.y + 1.5, O.z - 5); scene.add(lampuKamar);
  addInteriorBox(new THREE.BoxGeometry(0.5, 0.4, 0.7), 6, 0.2, -7, 0xf0f0f0, "toilet");
  addInteriorBox(new THREE.BoxGeometry(0.5, 0.7, 0.15), 6, 0.6, -7.4, 0xf0f0f0);
  addInteriorBox(new THREE.BoxGeometry(1.4, 1.0, 1.4), 9.5, 0.5, -8.5, 0x4a5a6a, "bak_mandi");
  addInteriorBox(new THREE.BoxGeometry(0.7, 0.2, 0.5), 9.5, 0.9, -4, 0xffffff, "wastafel");
  const lampuWC = new THREE.PointLight(0xddeeff, 1.0, 5, 1); lampuWC.position.set(O.x + 6, O.y + 2.2, O.z - 6); scene.add(lampuWC);
  addInteriorBox(new THREE.BoxGeometry(2.5, 0.15, 1.5), 6, 0.78, 6, COL_WOOD, "meja_makan");
  for (const [cx, cz] of [[4.5, 5], [7.5, 5], [4.5, 7], [7.5, 7]]) addInteriorBox(new THREE.BoxGeometry(0.5, 0.05, 0.5), cx, 0.45, cz, 0x8a6a3a, "kursi");
  addInteriorBox(new THREE.BoxGeometry(2.5, 0.9, 0.7), 9, 0.45, 3, 0x7a7a7a, "kompor");
  addInteriorBox(new THREE.BoxGeometry(0.8, 1.8, 0.7), 9.8, 0.9, 6, 0xdddddd, "kulkas");
  const lampuDapur = new THREE.PointLight(0xfff0d0, 1.3, 7, 1); lampuDapur.position.set(O.x + 7, O.y + 2.3, O.z + 5); scene.add(lampuDapur);
  addInteriorBox(new THREE.BoxGeometry(3.2, 0.5, 1.2), -6, 0.25, 5, 0x3a3a5a, "sofa");
  addInteriorBox(new THREE.BoxGeometry(2.2, 0.5, 0.5), -6, 0.25, 1, COL_WOOD, "meja_tv");
  addInteriorBox(new THREE.BoxGeometry(1.7, 1.0, 0.08), -6, 1.05, 1, 0x111111, "tv");
  const lampuTamu = new THREE.PointLight(0xffd9a0, 1.1, 8, 1); lampuTamu.position.set(O.x - 6, O.y + 2.5, O.z + 3); scene.add(lampuTamu);
  createDoor(O.x, O.z + 11, 0, { color: 0x5a3a1a, label: "Pintu Keluar" });
  const ambientInterior = new THREE.PointLight(0xa0b0d0, 0.4, 30, 1); ambientInterior.position.set(O.x, O.y + H - 0.3, O.z); scene.add(ambientInterior);
  POS.kasur.set(O.x - 7, O.y + PH, O.z - 5);
  POS.toilet.set(O.x + 6, O.y + PH, O.z - 6);
  POS.dapur.set(O.x + 6, O.y + PH, O.z + 5);
  POS.interiorExit.set(O.x, O.y + PH, O.z + 9);
}
function enterHouseInterior() {
  if (G.inInterior || interiorCooldown > 0) return;
  G.inInterior = true;
  G.savedExteriorPos = camera.position.clone();
  G.savedExteriorYaw = G.yaw;
  camera.position.set(INTERIOR_ORIGIN.x, INTERIOR_ORIGIN.y + PH, INTERIOR_ORIGIN.z + 5);
  G.py = INTERIOR_ORIGIN.y; G.vy = 0; G.onGround = true; G.fallStartY = G.py;
  G.yaw = Math.PI; G.pitch = 0;
  interiorCooldown = 1.5;
  showMarker(POS.interiorExit);
  flash("🚪 Dekati pintu & tekan E untuk keluar", 3500);
}
function exitHouseInterior() {
  if (!G.inInterior) return;
  G.inInterior = false;
  hideMarker();
  if (G.savedExteriorPos) { camera.position.copy(G.savedExteriorPos); camera.position.z += 4; G.yaw = G.savedExteriorYaw; }
  else camera.position.set(142, PH, 44);
  G.py = 0; G.vy = 0; G.onGround = true;
  interiorCooldown = 1.5;
  flash("🚪 Keluar rumah", 1200);
}
function checkHouseAutoEnter() {
  if (G.inInterior || interiorCooldown > 0) return;
  if (G.phase !== "gameplay") return;
  if (G.currentPhase !== "d1_home" && G.currentPhase !== "d2_home" && G.currentPhase !== "d3_home" && G.currentPhase !== "d4_home") return;
  const d = Math.hypot(camera.position.x - POS.homeDoor.x, camera.position.z - POS.homeDoor.z);
  if (d < 3) enterHouseInterior();
}
function checkHouseExit() { return; }

/* SAVE/LOAD */
function saveGame() {
  try {
    const save = {
      day: G.day, flowIndex: G.flowIndex,
      money: G.money, health: G.health, stamina: G.stamina, sanity: G.sanity,
      pos: { x: camera.position.x, z: camera.position.z, y: G.py },
      yaw: G.yaw, pitch: G.pitch,
      hasKey: G.hasKey, hasPhoneKidnapper: G.hasPhoneKidnapper, policeHanded: G.policeHanded,
      catFed: G.catFed, mirrorScareDone: G.mirrorScareDone, tvWatched: G.tvWatched,
      atmBillPaid: G.atmBillPaid, kurirPackageTaken: G.kurirPackageTaken, pulsaBought: G.pulsaBought,
      motorBought: G.motorBought, diaryRead: G.diaryRead, catFollowing: G.catFollowing,
      endingsUnlocked: G.endingsUnlocked, achievements: G.achievements,
      cheatsUsed: G.cheatsUsed, godMode: G.godMode, xrayMode: G.xrayMode,
      timestamp: Date.now()
    };
    localStorage.setItem("houseOf404_save", JSON.stringify(save));
    flash("💾 Game tersimpan!", 2000);
    if (typeof unlockAchievement === "function") unlockAchievement("first_save");
  } catch(e) { flash("❌ Gagal save", 1500); }
}
function loadGame() {
  try {
    const s = localStorage.getItem("houseOf404_save");
    if (!s) { flash("Belum ada save", 1500); return; }
    const data = JSON.parse(s);
    G.day = data.day; G.flowIndex = data.flowIndex;
    G.money = data.money; G.health = data.health; G.stamina = data.stamina; G.sanity = data.sanity || 100;
    camera.position.set(data.pos.x, data.pos.y + PH, data.pos.z);
    G.py = data.pos.y; G.yaw = data.yaw; G.pitch = data.pitch;
    G.hasKey = data.hasKey; G.hasPhoneKidnapper = data.hasPhoneKidnapper; G.policeHanded = data.policeHanded;
    G.catFed = data.catFed; G.mirrorScareDone = data.mirrorScareDone; G.tvWatched = data.tvWatched;
    G.atmBillPaid = data.atmBillPaid; G.kurirPackageTaken = data.kurirPackageTaken; G.pulsaBought = data.pulsaBought;
    G.motorBought = data.motorBought || false; G.diaryRead = data.diaryRead || false; G.catFollowing = data.catFollowing || false;
    if (data.endingsUnlocked) G.endingsUnlocked = data.endingsUnlocked;
    if (data.achievements) G.achievements = data.achievements;
    if (data.cheatsUsed) G.cheatsUsed = data.cheatsUsed;
    G.godMode = data.godMode || false; G.xrayMode = data.xrayMode || false;
    updateHealthUI(); setWalletUI(); setInvUI();
    flowStart(G.day);
    flash("📂 Game dimuat!", 2000);
  } catch(e) { flash("❌ Gagal load", 1500); }
}
/* CUTSCENE */
let blackT = null;
function csShow() { const el = $("cutscene"); if (el) { el.style.display = "flex"; el.classList.add("active"); } }
function csHide() {
  G.csLocked = false; G.csAutoRotate = false;
  const el = $("cutscene");
  if (el) { el.classList.remove("active","red","dialog-mode"); el.style.display = "none"; el.style.background = ""; el.style.opacity = ""; el.style.transition = ""; }
  const dEl = $("cutsceneDay"); if (dEl) dEl.textContent = "";
  const tEl = $("cutsceneText"); if (tEl) tEl.textContent = "";
  const hEl = $("cutsceneHint"); if (hEl) hEl.textContent = "";
  const sp = $("dialogSpeaker"); if (sp) { sp.textContent = ""; sp.classList.remove("show"); }
  const dt = $("dialogText"); if (dt) dt.textContent = "";
  const dh = $("dialogHint"); if (dh) dh.textContent = "";
  clearTimeout(blackT); setBlood(false);
  const dBx = $("dialogBox"); if (dBx) dBx.style.display = "";
}
function csRender() {
  const t = G.csTexts?.[G.csIdx]; if (!t) return;
  const el = $("cutscene"); if (!el) return;
  const isDialog = t.type === "dialog";
  const dEl = $("cutsceneDay"), tEl = $("cutsceneText"), hEl = $("cutsceneHint");
  if (dEl) dEl.textContent = ""; if (tEl) tEl.textContent = ""; if (hEl) hEl.textContent = "";
  if (isDialog) { el.classList.add("dialog-mode"); el.classList.remove("red"); el.style.background = ""; }
  else {
    el.classList.remove("dialog-mode");
    if (t.red) el.classList.add("red"); else el.classList.remove("red");
    if (t.mini) el.style.background = "rgba(0,0,0,.35)";
    else el.style.background = "rgba(0,0,0,.94)";
  }
  if (t.fadeIn) {
    el.style.transition = "none"; el.style.background = "#000"; el.style.opacity = "1";
    void el.offsetWidth; el.style.transition = "background 2s ease";
    requestAnimationFrame(() => { el.style.background = "rgba(0,0,0,.5)"; });
  }
  if (t.autoRotate) { G.csAutoRotate = true; G.csRotateDir = Math.random() < 0.5 ? -1 : 1; }
  else G.csAutoRotate = false;
  setBlood(!!t.blood);
  if (t.scream && !G.jumpscarePlayed) { G.jumpscarePlayed = true; playScream(); }
  if (isDialog) {
    const sp = $("dialogSpeaker"), dt = $("dialogText"), dh = $("dialogHint");
    if (t.speaker) { sp.textContent = t.speaker; sp.classList.add("show"); }
    else { sp.textContent = ""; sp.classList.remove("show"); }
    dt.textContent = t.text || "";
    dh.textContent = t.auto ? "" : "TAP TO CONTINUE";
    clearTimeout(blackT);
    if (t.auto) blackT = setTimeout(csAdvance, t.auto);
    return;
  }
  if (t.auto && G.csStage === 0) G.csStage = 1;
  if (G.csStage === 0) {
    if (dEl) dEl.textContent = "DAY " + G.day;
    if (tEl) tEl.textContent = "";
    if (hEl) hEl.textContent = "TAP UNTUK MELANJUTKAN";
  } else {
    if (dEl) dEl.textContent = "DAY " + G.day;
    if (tEl) tEl.textContent = t.text || "";
    if (hEl) hEl.textContent = t.auto ? "" : "TAP UNTUK LANJUT";
  }
  clearTimeout(blackT);
  if (G.csStage === 1 && t.auto) blackT = setTimeout(csAdvance, t.auto);
}
function csStart(day, texts, onFinish) {
  G.csLocked = false; G.csAutoRotate = false;
  G.day = day; G.csTexts = texts; G.csIdx = 0; G.csStage = 0;
  G.csOnFinish = onFinish || null; G.phase = "cutscene";
  csShow(); csRender();
}
function csAdvance() {
  if (G.phase !== "cutscene" || G.csLocked) return;
  const t = G.csTexts?.[G.csIdx]; if (!t) return;
  const isDialog = t.type === "dialog";
  if (!isDialog && G.csStage === 0 && !t.auto) { G.csStage = 1; csRender(); return; }
  if (t.blackAfter) {
    G.csLocked = true; G.csAutoRotate = false;
    const el = $("cutscene"), dEl = $("cutsceneDay"), tEl = $("cutsceneText"), hEl = $("cutsceneHint"), dBx = $("dialogBox");
    if (el) { el.style.background = "#000"; el.style.opacity = "1"; el.classList.remove("dialog-mode"); }
    if (dEl) dEl.textContent = "";
    if (tEl) tEl.textContent = t.blackText || "";
    if (hEl) hEl.textContent = "";
    if (dBx) dBx.style.display = "none";
    clearTimeout(blackT);
    blackT = setTimeout(() => {
      G.csLocked = false;
      if (tEl) tEl.textContent = "";
      const dBx2 = $("dialogBox"); if (dBx2) dBx2.style.display = "";
      const el2 = $("cutscene"); if (el2) el2.style.background = "rgba(0,0,0,.94)";
      csNext();
    }, t.blackAfter);
    return;
  }
  csNext();
}
function csNext() {
  G.csIdx++;
  if (G.csIdx >= G.csTexts.length) {
    csHide(); G.csTexts = null; G.csIdx = 0; G.csStage = 0;
    if (G.csOnFinish) { const f = G.csOnFinish; G.csOnFinish = null; f(); }
    else flowAdvance();
    return;
  }
  G.csStage = 1; csRender();
}

/* KIDNAP */
let kidnapAnim = null;
const KIDNAP_TRIGGER_POS = new THREE.Vector3(17, PH, -79);
const KIDNAP_TRIGGER_RADIUS = 5;
function startKidnapScene() {
  G.phase = "cutscene"; G.kidnapActive = true; G.kidnapDone = false;
  const camDir = new THREE.Vector3();
  camera.getWorldDirection(camDir); camDir.y = 0; camDir.normalize();
  const spawnPos = camera.position.clone().add(camDir.multiplyScalar(25)); spawnPos.y = 0;
  enemy.position.set(spawnPos.x, 0, spawnPos.z); enemy.visible = true;
  enemy.lookAt(camera.position.x, 1, camera.position.z);
  kidnapAnim = { startTime: performance.now(), spawnPos: spawnPos.clone(), duration: 5000 };
  csShow();
  const el = $("cutscene");
  if (el) { el.classList.remove("dialog-mode", "red"); el.style.background = "rgba(0,0,0,.25)"; }
  const dEl = $("cutsceneDay"); if (dEl) dEl.textContent = "DAY 5";
  const tEl = $("cutsceneText"); if (tEl) tEl.textContent = "Seseorang berjalan mendekat...";
  const hEl = $("cutsceneHint"); if (hEl) hEl.textContent = "";
  const dBx = $("dialogBox"); if (dBx) dBx.style.display = "none";
}
function updateKidnapScene(dt) {
  if (!G.kidnapActive || !kidnapAnim) return;
  const elapsed = (performance.now() - kidnapAnim.startTime) / 1000;
  const t = Math.min(elapsed / (kidnapAnim.duration / 1000), 1);
  const startPos = kidnapAnim.spawnPos;
  const endPos = new THREE.Vector3(camera.position.x, 0, camera.position.z);
  enemy.position.x = startPos.x + (endPos.x - startPos.x) * t;
  enemy.position.z = startPos.z + (endPos.z - startPos.z) * t;
  enemy.lookAt(camera.position.x, 1, camera.position.z);
  const tEl = $("cutsceneText");
  if (tEl) {
    if (t < 0.25) tEl.textContent = "Seseorang berjalan mendekat...";
    else if (t < 0.55) tEl.textContent = "Siapa itu?";
    else if (t < 0.85) tEl.textContent = "Tunggu... siapa kamu?";
    else tEl.textContent = "";
  }
  if (t >= 1 && !G.kidnapDone) {
    G.kidnapDone = true; playScream(); setBlood(true);
    const el = $("cutscene");
    if (el) { el.style.transition = "background .3s ease"; el.style.background = "#000"; }
    const tEl2 = $("cutsceneText"); if (tEl2) tEl2.textContent = "";
    setTimeout(() => {
      G.kidnapActive = false; G.kidnapDone = false; kidnapAnim = null;
      enemy.visible = false; csHide(); setBlood(false); flowAdvance();
    }, 1500);
  }
}
function checkKidnapTrigger() {
  if (G.day !== 5 || G.ownerMode || G.kidnapActive || G.gameOver) return;
  if (G.phase === "cutscene") return;
  const d = Math.hypot(camera.position.x - KIDNAP_TRIGGER_POS.x, camera.position.z - KIDNAP_TRIGGER_POS.z);
  if (d > KIDNAP_TRIGGER_RADIUS) return;
  const idx = FLOW[5].findIndex(it => it.kidnapScene);
  if (idx < 0) return;
  G.flowIndex = idx; G.currentPhase = null;
  resetStuck(); hideMarker(); flowNext();
}

/* TRIGGER CAPTURE */
function triggerCapture() {
  if (G.gameOver || G.captureActive) return;
  G.captureActive = true;
  G.phase = "cutscene"; G.kidnapActive = true;
  csShow();
  const el = $("cutscene");
  if (el) { el.classList.remove("dialog-mode"); el.classList.add("red"); el.style.background = "rgba(0,0,0,.6)"; }
  const dEl = $("cutsceneDay"); if (dEl) dEl.textContent = "DAY 6";
  const tEl = $("cutsceneText"); if (tEl) tEl.textContent = "TANGANNYA MENANGKAPKU!";
  const hEl = $("cutsceneHint"); if (hEl) hEl.textContent = "";
  playScream(); setBlood(true);
  setTimeout(() => { if (tEl) tEl.textContent = "AKU TIDAK BISA LARI..."; }, 1500);
  setTimeout(() => { if (el) el.style.background = "#000"; if (tEl) tEl.textContent = ""; setBlood(false); }, 3000);
  setTimeout(() => { endGame("KAMU TERTANGKAP 💀", "Dia berhasil menangkapmu. Sekarang kamu berada di tempat yang tidak akan pernah kamu tinggalkan.\n\nSelamat datang di rumah barumu.", "tertangkap"); }, 4000);
}

/* TV SCENE */
function startTvScene() {
  if (G.tvWatched) { flowAdvance(); return; }
  G.tvWatched = true;
  csStart(G.day, [
    { text: "Sebelum tidur, aku nyalakan TV sebentar...", auto: 2000 },
    { text: "📺 BERITA MALAM\n\n\"...kembali dilaporkan hilangnya seorang pria berusia 34 tahun di wilayah timur kota...\"", auto: 4500 },
    { text: "\"...pelaku masih dalam penyelidikan pihak berwajib...\"", auto: 3500 },
    { text: "Aneh... kenapa akhir-akhir ini banyak orang hilang?\n\nAku harap yang hilang cepat ditemukan.", auto: 3000 }
  ]);
}

/* MIRROR SCARE */
function triggerMirrorScare() {
  if (G.mirrorScareDone) return;
  G.mirrorScareDone = true;
  csStart(G.day, [
    { text: "Aku menggosok gigi sambil melihat cermin...", auto: 2000 },
    { text: "Tiba-tiba...", auto: 1200 },
    { text: "ADA BAYANGAN DI BELAKANGKU DI CERMIN!!", red: true, blood: true, scream: true, auto: 2200 },
    { text: "Aku menoleh cepat...\n\nTidak ada siapa-siapa.", auto: 2500 },
    { text: "Aku pasti hanya terlalu lelah. Aku harus istirahat.", auto: 2200 }
  ]);
}

/* FLOW */
function setPlayer(x, z, yaw = 0) { camera.position.set(x, PH, z); G.yaw = yaw; G.pitch = 0; }
function flowStart(day) { G.day = day; G.flowIndex = 0; applyDayNight(day); flowNext(); }
function flowNext() {
  const list = FLOW[G.day];
  if (!list) { endGame("SELESAI", "Cerita berakhir.", null); return; }
  const item = list[G.flowIndex];
  if (!item) { endGame("SELESAI", "Cerita berakhir.", null); return; }
  if (item.cs) csStart(G.day, item.cs);
  else if (item.phase) enterPhase(item.phase);
  else if (item.mini) startMini(item.mini);
  else if (item.nextday) { spawnPlayer(item.nextday); flowStart(item.nextday); }
  else if (item.salary) { giveSalary(item.salary); flowAdvance(); }
  else if (item.phone) { pushPhoneMessage(item.phone.from, item.phone.text); flowAdvance(); }
  else if (item.shopping) { startShopping(); }
  else if (item.kidnapScene) { startKidnapScene(); }
  else if (item.tvScene) { startTvScene(); }
  else if (item.autoEnter) { enterHouseInterior(); flowAdvance(); }
  else if (item.teleport) { setPlayer(item.teleport.x, item.teleport.z, item.teleport.yaw || Math.PI); G.py = 0; G.vy = 0; G.onGround = true; G.fallStartY = 0; flowAdvance(); }
}
function flowAdvance() { G.flowIndex++; flowNext(); }
function enterPhase(name) {
  const p = PHASE[name]; if (!p) { flowAdvance(); return; }
  G.phase = "gameplay"; G.currentPhase = name; G.cooldown = 0.6;
  setObjective("OBJECTIVE: " + p.obj);
  setInteract(G.day === 6);
  setTimerUI(G.day === 6);
  hideMarker();
  if (name === "d5_walk_5") showMarker(p.tgt);
  resetStuck();
}
let stuckAcc = 0, stuckPX = 0, stuckPZ = 0, stuckInit = false;
function resetStuck() { stuckAcc = 0; stuckInit = false; }
function isMovingInput() { return Math.hypot(touch.moveX, touch.moveY) > 0.05 || keys.w || keys.a || keys.s || keys.d; }
function updatePhase(dt) {
  if (G.phase !== "gameplay" || G.ownerMode) return;
  if (G.cooldown > 0) { G.cooldown -= dt; return; }
  const p = PHASE[G.currentPhase]; if (!p || p.noTarget) return;
  const dx = camera.position.x - p.tgt.x, dz = camera.position.z - p.tgt.z;
  const d = Math.hypot(dx, dz);
  if (d <= (p.r || 8)) { phaseReached(); return; }
  if (p.box && Math.max(Math.abs(dx), Math.abs(dz)) <= p.box) { phaseReached(); return; }
  if (d <= 4) { phaseReached(); return; }
  if (!stuckInit) { stuckPX = camera.position.x; stuckPZ = camera.position.z; stuckInit = true; return; }
  const moved = Math.hypot(camera.position.x - stuckPX, camera.position.z - stuckPZ);
  stuckPX = camera.position.x; stuckPZ = camera.position.z;
  if (isMovingInput() && moved < 0.006) { stuckAcc += dt; if (stuckAcc > 0.6 && d <= 30) { phaseReached(); return; } if (stuckAcc > 3.0) { phaseReached(); return; } }
  else stuckAcc = 0;
}
function phaseReached() { if (G.phase !== "gameplay") return; resetStuck(); hideMarker(); flowAdvance(); }
function startMini(name) {
  const m = MINI[name]; if (!m) { flowAdvance(); return; }
  if (name === "rumah_malam" && !G.inInterior) enterHouseInterior();
  G.phase = "mini"; G.currentMini = name; G.miniStep = 0; G.miniStage = "pre"; G.cooldown = 0.4;
  miniShowPre();
}
function miniShowPre() {
  const m = MINI[G.currentMini]; if (!m) return;
  const s = m.steps[G.miniStep]; if (!s) { miniFinish(); return; }
  if (s.pre && s.pre.length > 0) { G.miniStage = "pre"; csStart(G.day, s.pre, () => miniShowStep()); }
  else miniShowStep();
}
function miniShowStep() {
  const m = MINI[G.currentMini]; if (!m) return;
  const s = m.steps[G.miniStep]; if (!s) { miniFinish(); return; }
  G.phase = "mini"; G.miniStage = "step"; csHide();
  setObjective("OBJECTIVE: " + s.obj);
  showMarker(s.tgt); G.cooldown = 0.4;
}
function updateMini(dt) {
  if (G.phase !== "mini") return;
  if (G.cooldown > 0) { G.cooldown -= dt; return; }
  const m = MINI[G.currentMini]; if (!m) return;
  const s = m.steps[G.miniStep]; if (!s) return;
  const d = Math.hypot(camera.position.x - s.tgt.x, camera.position.z - s.tgt.z);
  if (d <= s.r) {
    if (s.done) flash(s.done, 1600);
    if (s.onDone) s.onDone();
    hideMarker();
    G.miniStep++;
    if (G.miniStep >= m.steps.length) miniFinish();
    else setTimeout(miniShowPre, 400);
  }
}
function miniFinish() { hideMarker(); csHide(); G.currentMini = null; if (G.inInterior) exitHouseInterior(); flowAdvance(); }
function spawnPlayer(day) {
  const sp = SPAWNS[day] || SPAWNS[1];
  camera.position.set(sp.x, PH, sp.z);
  G.py = 0; G.vy = 0; G.onGround = true; G.fallStartY = 0;
  G.yaw = Math.PI; G.pitch = 0;
  G.currentPhase = null; G.currentMini = null;
  G.vehicleKnockbackVX = 0; G.vehicleKnockbackVZ = 0;
  G.inInterior = false; G.captureActive = false;
  if (day === 6) { enemy.position.copy(POS.kidnapper); enemyChasing = false; }
  hideMarker(); resetStuck();
}
function updateMovement(dt) {
  if (G.gameOver) return;
  if (G.phase !== "gameplay" && G.phase !== "mini" && G.phase !== "shopping") return;
  let sx = 0, sz = 0;
  if (keys.w) sz -= 1; if (keys.s) sz += 1; if (keys.a) sx -= 1; if (keys.d) sx += 1;
  sx += touch.moveX; sz += touch.moveY;
  const len = Math.hypot(sx, sz); if (len > 1) { sx /= len; sz /= len; }
  const mul = G.ownerMode ? G.ownerSpeedMul : 1;
  if (G.ownerFly) {
    const baseSp = 8 * mul;
    const fwd = new THREE.Vector3(Math.sin(G.yaw), 0, Math.cos(G.yaw));
    const rgt = new THREE.Vector3(Math.cos(G.yaw), 0, -Math.sin(G.yaw));
    camera.position.x += (rgt.x * sx + fwd.x * sz) * baseSp * dt;
    camera.position.z += (rgt.z * sx + fwd.z * sz) * baseSp * dt;
    const flySpeed = 10;
    if (keys.q || keys[" "] || keys.arrowup || G.ownerFlyUp) G.py += flySpeed * dt;
    if (keys.e || keys.arrowdown || G.ownerFlyDown) G.py -= flySpeed * dt;
    if (G.py < 0.5 && !G.inInterior) G.py = 0.5;
    if (G.py > 60) G.py = 60;
    G.vy = 0; G.onGround = false;
    return;
  }
  const running = (G.running && G.stamina > 0) || G.ownerMode;
  const sp = (running ? G.runSpeed : G.speed) * mul;
  const fwd = new THREE.Vector3(Math.sin(G.yaw), 0, Math.cos(G.yaw));
  const rgt = new THREE.Vector3(Math.cos(G.yaw), 0, -Math.sin(G.yaw));
  const mvX = (rgt.x * sx + fwd.x * sz) * sp * dt;
  const mvZ = (rgt.z * sx + fwd.z * sz) * sp * dt;
  let kx = 0, kz = 0;
  if (Math.abs(G.vehicleKnockbackVX) > 0.01 || Math.abs(G.vehicleKnockbackVZ) > 0.01) {
    kx = G.vehicleKnockbackVX * dt; kz = G.vehicleKnockbackVZ * dt;
    G.vehicleKnockbackVX *= 0.88; G.vehicleKnockbackVZ *= 0.88;
  }
  const totalX = mvX + kx, totalZ = mvZ + kz;
  const moveLen = Math.hypot(totalX, totalZ);
  if (G.ownerMode) {
    camera.position.x += totalX; camera.position.z += totalZ;
    if (!G.inInterior) { camera.position.x = THREE.MathUtils.clamp(camera.position.x, -148, 148); camera.position.z = THREE.MathUtils.clamp(camera.position.z, -148, 148); }
    G.vy -= GRAVITY * dt; if (G.vy < -30) G.vy = -30;
    G.py += G.vy * dt;
    const groundY = findGroundY(camera.position.x, camera.position.z, G.py + 1);
    if (G.py <= groundY + 0.001) { G.py = groundY; G.vy = 0; G.onGround = true; G.fallStartY = groundY; }
    else { if (G.onGround) G.fallStartY = G.py; G.onGround = false; }
    return;
  }
  const subSteps = Math.max(1, Math.ceil(moveLen / 0.15));
  const stepX = totalX / subSteps, stepZ = totalZ / subSteps;
  for (let s = 0; s < subSteps; s++) {
    if (insideSolidAt(camera.position.x, camera.position.z, G.py)) { camera.position.x += stepX; camera.position.z += stepZ; continue; }
    const tryX = camera.position.x + stepX;
    let okX = canMoveAt(camera.position.x, camera.position.z, tryX, camera.position.z, G.py);
    let newPyX = G.py;
    if (!okX) for (const step of STEP_UP_SAMPLES) if (canMoveAt(camera.position.x, camera.position.z, tryX, camera.position.z, G.py + step)) { okX = true; newPyX = G.py + step; break; }
    if (okX) { camera.position.x = tryX; if (newPyX > G.py) G.py = newPyX; }
    const tryZ = camera.position.z + stepZ;
    let okZ = canMoveAt(camera.position.x, camera.position.z, camera.position.x, tryZ, G.py);
    let newPyZ = G.py;
    if (!okZ) for (const step of STEP_UP_SAMPLES) if (canMoveAt(camera.position.x, camera.position.z, camera.position.x, tryZ, G.py + step)) { okZ = true; newPyZ = G.py + step; break; }
    if (okZ) { camera.position.z = tryZ; if (newPyZ > G.py) G.py = newPyZ; }
  }
  if (!G.inInterior) { camera.position.x = THREE.MathUtils.clamp(camera.position.x, -148, 148); camera.position.z = THREE.MathUtils.clamp(camera.position.z, -148, 148); }
  G.vy -= GRAVITY * dt; if (G.vy < -30) G.vy = -30;
  G.py += G.vy * dt;
  const groundY = findGroundY(camera.position.x, camera.position.z, G.py + 1);
  if (G.py <= groundY + 0.001) {
    if (!G.onGround) { const fallDist = G.fallStartY - groundY; if (fallDist > FALL_SAFE_HEIGHT && !G.ownerMode) { const dmg = Math.round((fallDist - FALL_SAFE_HEIGHT) * FALL_DAMAGE_PER_M); if (dmg > 0) takeDamage(dmg, "fall"); } }
    G.py = groundY; G.vy = 0; G.onGround = true; G.fallStartY = groundY;
  } else { if (G.onGround) G.fallStartY = G.py; G.onGround = false; }
}

/* UI HEALTH/STAMINA/SANITY */
function ensureHealthUI() {
  if ($("healthWrap")) return;
  const wrap = document.createElement("div"); wrap.id = "healthWrap";
  wrap.style.cssText = "position:fixed;left:50%;transform:translateX(-50%);top:max(64px,calc(env(safe-area-inset-top) + 64px));width:min(200px,52vw);height:10px;background:rgba(28,30,34,.85);border:1px solid rgba(180,184,190,.35);border-radius:999px;overflow:hidden;z-index:55;pointer-events:none;box-shadow:0 4px 14px rgba(0,0,0,.5);";
  const fill = document.createElement("div"); fill.id = "healthFill";
  fill.style.cssText = "width:100%;height:100%;background:linear-gradient(90deg,#c85a5a,#e88a8a);border-radius:999px;transition:width .25s ease,background .3s;";
  wrap.appendChild(fill); document.body.appendChild(wrap);
}
function updateHealthUI() {
  const fill = $("healthFill"); if (!fill) return;
  const pct = (G.health / G.maxHealth) * 100;
  fill.style.width = pct + "%";
  if (pct < 30) fill.style.background = "linear-gradient(90deg,#7a1a1a,#c83030)";
  else if (pct < 60) fill.style.background = "linear-gradient(90deg,#b87040,#d89060)";
  else fill.style.background = "linear-gradient(90deg,#c85a5a,#e88a8a)";
}
function ensureSanityUI() {
  if ($("sanityWrap")) return;
  const wrap = document.createElement("div"); wrap.id = "sanityWrap";
  wrap.style.cssText = "position:fixed;left:50%;transform:translateX(-50%);top:max(80px,calc(env(safe-area-inset-top) + 80px));width:min(200px,52vw);height:8px;background:rgba(28,30,34,.85);border:1px solid rgba(180,184,190,.35);border-radius:999px;overflow:hidden;z-index:55;pointer-events:none;transition:opacity .3s;";
  const fill = document.createElement("div"); fill.id = "sanityFill";
  fill.style.cssText = "width:100%;height:100%;background:linear-gradient(90deg,#7a3aff,#3a1a6a);border-radius:999px;transition:width .3s;";
  wrap.appendChild(fill); document.body.appendChild(wrap);
}
function updateSanityUI() {
  const fill = $("sanityFill"); if (!fill) return;
  const pct = (G.sanity / G.sanityMax) * 100;
  fill.style.width = pct + "%";
  if (pct < 30) fill.style.background = "linear-gradient(90deg,#ff3333,#7a1a1a)";
  else if (pct < 60) fill.style.background = "linear-gradient(90deg,#ff8c3a,#aa4a1a)";
  else fill.style.background = "linear-gradient(90deg,#7a3aff,#3a1a6a)";
  const blurAmt = pct < 50 ? (50 - pct) * 0.06 : 0;
  renderer.domElement.style.filter = blurAmt > 0.5 ? `blur(${blurAmt}px) saturate(0.7)` : "";
}
function takeDamage(amount, cause) {
  if (G.gameOver || G.ownerMode) return;
  if (G.godMode) { flash("🛡️ GOD MODE — damage blocked!", 1000); return; }
  G.health = Math.max(0, G.health - amount);
  updateHealthUI();
  if (cause === "fall") flash("Kamu jatuh! -" + amount, 1500);
  else if (cause === "kidnapper") flash("Kamu terkena serangan! -" + amount, 1500);
  else if (cause === "vehicle") { }
  else flash("Kamu terluka! -" + amount, 1500);
  if (G.health <= 0) {
    if (G.day === 6 && cause === "kidnapper") triggerCapture();
    else endGame("KAMU TEWAS", "Kamu tidak bisa melanjutkan perjalanan...", null);
  }
}
let marker = null;
function showMarker(p) {
  hideMarker();
  const g = new THREE.RingGeometry(0.8, 1.05, 40);
  const m = new THREE.MeshBasicMaterial({ color: 0xe0e4ea, side: THREE.DoubleSide, transparent: true, opacity: 0.9, depthTest: false });
  marker = new THREE.Mesh(g, m);
  marker.rotation.x = -Math.PI / 2;
  marker.position.set(p.x, p.y - EYE_HEIGHT + 0.15, p.z);
  marker.renderOrder = 999; world.add(marker);
}
function hideMarker() { if (!marker) return; world.remove(marker); marker.geometry.dispose(); marker.material.dispose(); marker = null; }
function setBlood(on) { const b = $("bloodOverlay"); if (b) b.classList.toggle("on", !!on); }
let audioCtx = null;
function ensureAudio() { if (audioCtx) return audioCtx; try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){} return audioCtx; }
function playScream() {
  const ctx = ensureAudio(); if (!ctx) return;
  const t0 = ctx.currentTime;
  try {
    const bufSize = Math.floor(ctx.sampleRate * 0.7);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random()*2-1) * Math.pow(1 - i/bufSize, 1.8);
    const noise = ctx.createBufferSource(); noise.buffer = buf;
    const ng = ctx.createGain(); ng.gain.setValueAtTime(0.45, t0); ng.gain.exponentialRampToValueAtTime(0.001, t0 + 0.7);
    noise.connect(ng).connect(ctx.destination); noise.start(t0);
    const osc = ctx.createOscillator(); osc.type = "sawtooth";
    osc.frequency.setValueAtTime(2200, t0); osc.frequency.exponentialRampToValueAtTime(90, t0 + 0.8);
    const og = ctx.createGain(); og.gain.setValueAtTime(0.32, t0); og.gain.exponentialRampToValueAtTime(0.001, t0 + 0.85);
    osc.connect(og).connect(ctx.destination); osc.start(t0); osc.stop(t0 + 0.9);
    const sub = ctx.createOscillator(); sub.type = "sine";
    sub.frequency.setValueAtTime(70, t0); sub.frequency.exponentialRampToValueAtTime(28, t0 + 0.9);
    const sg = ctx.createGain(); sg.gain.setValueAtTime(0.4, t0); sg.gain.exponentialRampToValueAtTime(0.001, t0 + 0.95);
    sub.connect(sg).connect(ctx.destination); sub.start(t0); sub.stop(t0 + 1.0);
  } catch(e) {}
}
function ensureStaminaUI() {
  if ($("staminaWrap")) return;
  const wrap = document.createElement("div"); wrap.id = "staminaWrap";
  wrap.style.cssText = "position:fixed;left:50%;bottom:max(100px,calc(env(safe-area-inset-bottom) + 100px));transform:translateX(-50%) translateY(10px);width:min(200px,52vw);opacity:0;transition:opacity .3s,transform .3s;pointer-events:none;z-index:65;";
  const bar = document.createElement("div");
  bar.style.cssText = "width:100%;height:9px;background:rgba(28,30,34,.85);border:1px solid rgba(180,184,190,.3);border-radius:999px;overflow:hidden;";
  const f = document.createElement("div"); f.id = "staminaFill";
  f.style.cssText = "width:100%;height:100%;background:linear-gradient(90deg,#d8dade,#a8acb2);border-radius:999px;transition:width .08s linear,background .25s;";
  bar.appendChild(f); wrap.appendChild(bar); document.body.appendChild(wrap);
}
function updateStamina(dt) {
  if (G.ownerMode) G.stamina = G.staminaMax;
  else if (G.phase === "gameplay" || G.phase === "mini" || G.phase === "shopping") {
    const moving = isMovingInput();
    if (G.running && moving) { G.stamina = Math.max(0, G.stamina - G.drain*dt); if (G.stamina <= 0) G.running = false; }
    else G.stamina = Math.min(G.staminaMax, G.stamina + G.regen*dt);
  }
  const wrap = $("staminaWrap"), fill = $("staminaFill");
  if (!wrap || !fill) return;
  const pct = (G.stamina / G.staminaMax) * 100;
  fill.style.width = pct + "%";
  fill.style.background = pct < 25 ? "linear-gradient(90deg,#b88c8c,#8e6464)" : "linear-gradient(90deg,#d8dade,#a8acb2)";
  const show = (G.running || G.stamina < G.staminaMax - 0.5) && !G.ownerMode;
  wrap.style.opacity = show ? "1" : "0";
  wrap.style.transform = show ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(10px)";
}
function updateSanity(dt) {
  if (G.gameOver || G.ownerMode) return;
  const hour = getInGameHour();
  const isNight = hour >= 20 || hour < 5;
  const inDark = isNight && !G.flashlight;
  let delta = 0;
  if (inDark) delta = -3 * dt;
  else if (G.flashlight || !isNight) delta = 5 * dt;
  if (G.inInterior && !G.flashlight) delta = -2 * dt;
  G.sanity = Math.max(0, Math.min(G.sanityMax, G.sanity + delta));
  updateSanityUI();
  if (G.sanity <= 0 && !G.insanityTriggered) {
    G.insanityTriggered = true;
    flash("😰 Kamu merasa sangat ketakutan...", 3000);
    playScream();
    setTimeout(() => { G.insanityTriggered = false; }, 10000);
  }
}
function getInGameHour() {
  const now = performance.now() / 1000;
  const totalGameTime = 60 * 60;
  const elapsed = (totalGameTime - G.timeLeft) % totalGameTime;
  const hourFloat = 8 + (elapsed / totalGameTime) * 24;
  return Math.floor(hourFloat) % 24;
}

const flashlight = new THREE.SpotLight(0xffffff, 0, 24, Math.PI / 6, 0.55, 1);
scene.add(flashlight); scene.add(flashlight.target);
function toggleFlashlight() { G.flashlight = !G.flashlight; flashlight.intensity = G.flashlight ? 9 : 0; setFlashUI(G.flashlight); const btn = $("flashBtn"); if (btn) btn.classList.toggle("on", G.flashlight); }

function tryInteract() {
  if (G.gameOver) return;
  if (G.phase === "shopping") { tryPickupItem(); return; }
  if (G.phase !== "gameplay" && G.phase !== "mini") return;
  // Exit rumah manual
  if (G.inInterior) {
    const dExit = Math.hypot(camera.position.x - POS.interiorExit.x, camera.position.z - POS.interiorExit.z);
    if (dExit < 2.5) { exitHouseInterior(); return; }
    flash("Dekati pintu keluar & tekan E.", 1200);
    return;
  }
  if (tryOpenDoor()) return;
  // Diary (Day 6)
  if (G.day === 6 && !G.diaryRead) {
    const dD = Math.hypot(camera.position.x - POS.diary.x, camera.position.z - POS.diary.z);
    if (dD < 3) { showDiary(); return; }
  }
  // Day 6: HP kidnapper
  if (G.day === 6 && !G.hasPhoneKidnapper && !G.policeHanded) {
    const dHP = Math.hypot(camera.position.x - POS.phoneKidnapper.x, camera.position.z - POS.phoneKidnapper.z);
    if (dHP < 4) { G.hasPhoneKidnapper = true; setInvUI(); flash("📱 Kamu menemukan HP penculik. Ada bukti di dalamnya!", 3500); pushPhoneMessage("Anonim", "Kamu menemukan HP-ku... menarik. 👁️", true); return; }
  }
  // Day 6: serahkan ke satpam
  if (G.day === 6 && G.hasPhoneKidnapper && !G.policeHanded) {
    const dSP = Math.hypot(camera.position.x - POS.security.x, camera.position.z - POS.security.z);
    if (dSP < 4) { G.policeHanded = true; G.hasPhoneKidnapper = false; setInvUI(); flash("👮 HP diserahkan ke satpam! Bukti kuat untuk polisi.", 4000); pushPhoneMessage("Anonim", "KAMU TIDAK BISA SELAMAT DENGAN CARA ITU.", true); return; }
  }
  // Kucing
  if (G.day >= 2 && G.day <= 5) {
    const dCat = Math.hypot(camera.position.x - POS.cat.x, camera.position.z - POS.cat.z);
    if (dCat < 3) {
      if (!G.catFed) { G.catFed = true; flash("🐱 Kamu kasih makan kucing. Dia senang!", 3000); pushPhoneMessage("Ibu", "Nak, kamu baik banget ke kucing. Ibu bangga ❤️"); return; }
      if (!G.catFollowing) { G.catFollowing = true; unlockAchievement("cat_pet"); flash("🐱 Kucing mengikutimu pulang!", 3000); pushPhoneMessage("Ibu", "Nak, kamu bawa kucing pulang? Ibu izinin kok ❤️"); return; }
    }
  }
  // ATM
  if (G.day === 5 && !G.atmBillPaid) {
    const dAtm = Math.hypot(camera.position.x - POS.atm.x, camera.position.z - POS.atm.z);
    if (dAtm < 3) { if (G.money < 150000) { flash("Uang tidak cukup. Butuh Rp 150.000", 2500); return; } G.money -= 150000; setWalletUI(); G.atmBillPaid = true; unlockAchievement("atm_pay"); flash("💸 Tagihan listrik & air Rp 150.000 dibayar.", 3500); pushPhoneMessage("PLN", "Pembayaran listrik berhasil. Terima kasih."); return; }
  }
  // Kurir
  if (G.day === 3 && !G.kurirPackageTaken) {
    const dKurir = Math.hypot(camera.position.x - POS.kurir.x, camera.position.z - POS.kurir.z);
    if (dKurir < 3) { G.kurirPackageTaken = true; flash("📦 Paket diterima! Isi: baju baru.", 3000); return; }
  }
  if (G.day < 6) {
    if (Math.hypot(camera.position.x - POS.security.x, camera.position.z - POS.security.z) < 3) { flash("Satpam: Hati-hati pulang malam.", 2500); return; }
    flash("Tidak ada yang perlu dilakukan."); return;
  }
  const dk = Math.hypot(camera.position.x - POS.key.x, camera.position.z - POS.key.z);
  const dd = Math.hypot(camera.position.x - POS.door.x, camera.position.z - POS.door.z);
  if (!G.hasKey && dk < 4) { G.hasKey = true; setObjective("OBJECTIVE: Keluar dari House No. 404"); setInvUI(); flash("🔑 Kamu menemukan kunci pintu."); return; }
  if (G.hasKey && dd < 4) {
    if (G.policeHanded) endGame("SECRET ENDING 🌟", "Kamu kabur, menyerahkan HP penculik ke polisi, dan pelaku tertangkap.\n\nKeadilan ditegakkan. Kamu adalah penyintas sejati.", "secret");
    else endGame("KAMU SELAMAT ✅", "Kamu berhasil keluar dari House No. 404.\n\nTapi... apakah pelaku masih berkeliaran di luar sana? 👁️", "selamat");
  }
}

/* ENEMY */
const enemy = new THREE.Group();
const eb = new THREE.Mesh(new THREE.BoxGeometry(0.65,1.7,0.45), new THREE.MeshStandardMaterial({ color: 0x111111 }));
eb.position.y = 0.85; enemy.add(eb);
const eh = new THREE.Mesh(new THREE.SphereGeometry(0.27,12,8), new THREE.MeshStandardMaterial({ color: 0x1b1b1b }));
eh.position.y = 1.85; enemy.add(eh);
enemy.position.copy(POS.kidnapper); world.add(enemy); enemy.visible = false;
let enemyChasing = false;
function updateEnemy(dt) {
  if (G.ownerMode) { enemy.visible = false; return; }
  if (G.kidnapActive) return;
  if (G.day !== 6 || G.phase === "cutscene" || G.gameOver) return;
  enemy.visible = true;
  if (!G.hasKey) return;
  if (G.xrayMode) enemy.visible = true;
  const d = Math.hypot(enemy.position.x - camera.position.x, enemy.position.z - camera.position.z);
  if (d < 18) enemyChasing = true;
  if (enemyChasing) {
    const dx = camera.position.x - enemy.position.x, dz = camera.position.z - enemy.position.z;
    const l = Math.hypot(dx, dz) || 1;
    enemy.position.x += dx/l*1.2*dt; enemy.position.z += dz/l*1.2*dt;
    enemy.lookAt(camera.position.x, camera.position.y, camera.position.z);
    if (d < 1.4 && performance.now() - G.lastEnemyHit > 1500) { G.lastEnemyHit = performance.now(); triggerCapture(); }
  }
}
function tickTimer(dt) {
  if (G.ownerMode) return;
  if (G.day !== 6 || G.phase === "cutscene" || G.gameOver) return;
  G.timeLeft = Math.max(0, G.timeLeft - dt);
  const t = $("timer");
  if (t) t.textContent = String(Math.floor(G.timeLeft/60)).padStart(2,"0") + ":" + String(Math.floor(G.timeLeft%60)).padStart(2,"0");
  if (G.timeLeft <= 0) endGame("WAKTU HABIS", "Kamu tidak berhasil keluar dari House No. 404.", null);
}
function updateCamera() {
  const moving = (G.phase === "gameplay" || G.phase === "mini" || G.phase === "shopping") && isMovingInput() && G.onGround;
  const running = (G.running && G.stamina > 0) || (G.ownerMode && G.ownerSpeedMul > 1);
  if (moving && !G.ownerFly) G.bobT += running ? 1.2 : 0.85; else G.bobT *= 0.9;
  const ampY = running ? 0.035 : 0.018;
  const bobY = G.ownerFly ? 0 : Math.sin(G.bobT) * ampY;
  camera.position.y = G.py + EYE_HEIGHT + bobY;
  camera.rotation.order = "YXZ";
  camera.rotation.y = G.yaw; camera.rotation.x = G.pitch; camera.rotation.z = 0;
  flashlight.position.copy(camera.position);
  const dir = new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion);
  flashlight.target.position.copy(camera.position);
  flashlight.target.position.add(dir.multiplyScalar(10));
}

/* ENDGAME */
function endGame(title, desc, endingType) {
  if (G.gameOver && G.phase !== "ended") return;
  G.gameOver = true; G.phase = "ended";
  if (endingType) {
    G.endingsUnlocked[endingType] = true;
    try { localStorage.setItem("houseOf404_endings", JSON.stringify(G.endingsUnlocked)); } catch(e){}
  }
  const s = $("endingScreen"), t = $("endingTitle"), p = $("endingText"), b = $("endingButton");
  if (!s) return;
  if (t) t.textContent = title;
  const unlockedCount = Object.values(G.endingsUnlocked).filter(v => v).length;
  const badge = (on, bg, tx) => `padding:5px 12px;border-radius:8px;font-size:11px;font-weight:700;margin:2px;display:inline-block;` + (on ? `background:${bg};color:${tx};` : `background:#2a2a2a;color:#555;`);
  if (p) {
    p.innerHTML = desc + `
      <div style="margin-top:24px;padding-top:20px;border-top:1px solid rgba(180,184,190,.15);">
        <div style="font-size:11px;letter-spacing:2px;color:rgba(200,204,210,.5);margin-bottom:12px;">ENDING TERBUKA · ${unlockedCount}/3</div>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
          <span style="${badge(G.endingsUnlocked.tertangkap,'#7a1a1a','#ffaaaa')}">${G.endingsUnlocked.tertangkap?'💀 TERTANGKAP':'🔒 TERTANGKAP'}</span>
          <span style="${badge(G.endingsUnlocked.selamat,'#1a4a1a','#aaffaa')}">${G.endingsUnlocked.selamat?'✅ SELAMAT':'🔒 SELAMAT'}</span>
          <span style="${badge(G.endingsUnlocked.secret,'#4a1a6a','#ddaaff')}">${G.endingsUnlocked.secret?'🌟 SECRET':'🔒 SECRET'}</span>
        </div>
      </div>`;
  }
  if (b) {
    if (endingType === "tertangkap" || !endingType) { b.textContent = "🔄 COBA LAGI"; b.onclick = () => location.reload(); }
    else {
      b.textContent = "🏠 KEMBALI KE MENU";
      b.onclick = () => { window.location.href = "index.html"; };
      setTimeout(() => { window.location.href = "index.html"; }, 10000);
    }
  }
  s.classList.add("active");
}

/* NPC */
function createNPC(name, position, uniformColor, capColor, skinColor = 0xc58d68) {
  const npc = new THREE.Group(); npc.name = name;
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.9, 4, 8), new THREE.MeshStandardMaterial({ color: uniformColor, roughness: 0.9 }));
  body.position.y = 0.90; npc.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 8), new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.9 }));
  head.position.y = 1.70; npc.add(head);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.08, 12), new THREE.MeshStandardMaterial({ color: capColor, roughness: 0.9 }));
  cap.position.y = 1.93; npc.add(cap);
  npc.position.copy(position); world.add(npc); return npc;
}

/* TOUCH */
function setupTouch() {
  const joy = $("joystick"), knob = $("joyKnob"), look = $("lookZone");
  if (!joy || !knob || !look) return;
  joy.style.touchAction = "none"; look.style.touchAction = "none";
  let mId = null, lId = null, lx = 0, ly = 0;
  function jm(e) { const r = joy.getBoundingClientRect(); const cx = r.left + r.width/2, cy = r.top + r.height/2; let dx = e.clientX - cx, dy = e.clientY - cy; const max = r.width * 0.34, L = Math.hypot(dx, dy); if (L > max) { dx = dx/L*max; dy = dy/L*max; } touch.moveX = dx/max; touch.moveY = dy/max; knob.style.transform = `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))`; }
  function rj() { mId = null; touch.moveX = 0; touch.moveY = 0; knob.style.transform = "translate(-50%,-50%)"; }
  joy.addEventListener("pointerdown", e => { e.preventDefault(); mId = e.pointerId; jm(e); joy.setPointerCapture?.(e.pointerId); }, { passive: false });
  joy.addEventListener("pointermove", e => { if (e.pointerId !== mId) return; jm(e); });
  joy.addEventListener("pointerup", e => { if (e.pointerId === mId) rj(); });
  joy.addEventListener("pointercancel", rj);
  look.addEventListener("pointerdown", e => { if (lId !== null) return; e.preventDefault(); lId = e.pointerId; lx = e.clientX; ly = e.clientY; look.setPointerCapture?.(e.pointerId); }, { passive: false });
  look.addEventListener("pointermove", e => { if (e.pointerId !== lId) return; const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY; G.yaw -= dx * 0.004 * G.lookSens; G.pitch -= dy * 0.003 * G.lookSens; G.pitch = Math.max(-1.25, Math.min(1.25, G.pitch)); });
  look.addEventListener("pointerup", () => { lId = null; });
  look.addEventListener("pointercancel", () => { lId = null; });
  const rb = $("runBtn");
  if (rb) { rb.addEventListener("pointerdown", e => { e.preventDefault(); if (G.stamina > G.minRun) G.running = true; }, { passive: false }); ["pointerup","pointercancel","pointerleave"].forEach(t => rb.addEventListener(t, () => { G.running = false; })); }
}
window.addEventListener("keydown", e => {
  const k = e.key.toLowerCase();
  if (k === " " || k === "arrowup" || k === "arrowdown") e.preventDefault();
  keys[k] = true;
  if (k === "e") { if (!G.ownerFly) tryInteract(); }
  if (k === "f") toggleFlashlight();
  if (k === "p") { G.phoneOpen ? closePhoneOS() : openPhoneOS(); }
  if (k === "c") toggleCoordOverlay();
  if (k === "o") toggleOwnerPanel();
  if (k === "k") takePhoto();
  if (k === "shift" && G.stamina > G.minRun) G.running = true;
});
window.addEventListener("keyup", e => { const k = e.key.toLowerCase(); keys[k] = false; if (k === "shift") G.running = false; });
(function bindCS() { const el = $("cutscene"); if (!el) return; el.addEventListener("pointerdown", e => { e.preventDefault(); e.stopPropagation(); if (G.phase === "cutscene" && !G.kidnapActive) csAdvance(); }, { passive: false }); })();
(function bindIB() { const b = $("interactBtn"); if (b) b.addEventListener("pointerdown", e => { e.preventDefault(); e.stopPropagation(); tryInteract(); }, { passive: false }); })();
(function bindFlash() { const b = $("flashBtn"); if (b) b.addEventListener("pointerdown", e => { e.preventDefault(); e.stopPropagation(); toggleFlashlight(); }, { passive: false }); })();
(function bindPhone() { const b = $("phoneBtn"); if (b) b.addEventListener("pointerdown", e => { e.preventDefault(); e.stopPropagation(); openPhoneOS(); }, { passive: false }); })();

/* SHOP */
const shopMarkers = [];
function spawnShopMarkers() {
  for (const item of SHOP_ITEMS) {
    const mat = new THREE.MeshStandardMaterial({ color: 0xffd77a, emissive: 0xffaa33, emissiveIntensity: 0.5 });
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), mat);
    m.position.copy(item.pos); m.userData.shopItem = item; m.visible = false;
    world.add(m); shopMarkers.push(m);
  }
  const cg = new THREE.RingGeometry(1.2, 1.5, 40);
  const cm = new THREE.MeshBasicMaterial({ color: 0x7aff7a, transparent: true, opacity: 0.7, side: THREE.DoubleSide, depthTest: false });
  const cM = new THREE.Mesh(cg, cm);
  cM.rotation.x = -Math.PI / 2; cM.position.set(POS.cashier.x, 0.15, POS.cashier.z);
  cM.renderOrder = 998; cM.visible = false;
  world.add(cM); shopMarkers.push(cM);
}
function showShopMarkers(show) { for (const m of shopMarkers) m.visible = show; }
function startShopping() {
  G.currentShopping = true; G.phase = "shopping"; G.cart = [];
  setCartUI(); setObjective("OBJECTIVE: Ambil barang → bayar di kasir");
  showShopMarkers(true); setInteract(true);
  flash("Tekan E untuk ambil barang", 2500);
}
function tryPickupItem() {
  if (!G.currentShopping) return false;
  for (const m of shopMarkers) {
    const it = m.userData.shopItem; if (!it || !m.visible) continue;
    const d = Math.hypot(camera.position.x - m.position.x, camera.position.z - m.position.z);
    if (d < 1.6) { G.cart.push(it); m.visible = false; setCartUI(); flash(`Diambil: ${it.name} - Rp${it.price.toLocaleString("id-ID")}`, 1600); return true; }
  }
  const dCash = Math.hypot(camera.position.x - POS.cashier.x, camera.position.z - POS.cashier.z);
  if (dCash < 2.2) {
    if (G.cart.length === 0) { flash("Keranjang kosong."); return true; }
    const total = G.cart.reduce((s, i) => s + i.price, 0);
    if (!spendMoney(total)) { flash("Uang tidak cukup!"); return true; }
    flash(`Pembayaran berhasil. Total Rp ${total.toLocaleString("id-ID")}`, 2500);
    G.cart = []; setCartUI();
    G.currentShopping = false; showShopMarkers(false); setInteract(false);
    G.phase = "cutscene"; setTimeout(() => flowAdvance(), 1800);
    return true;
  }
  return false;
}

/* NPC ROUTINES */
const npcRoutines = [];
function registerNPCRoutine(npc, points) { npcRoutines.push({ npc, points, curIdx: 0, waitUntil: 0 }); }
function updateNPCRoutines(dt) {
  for (const r of npcRoutines) {
    const now = performance.now() / 1000;
    if (now < r.waitUntil) continue;
    const target = r.points[r.curIdx];
    const dx = target.x - r.npc.position.x, dz = target.z - r.npc.position.z;
    const d = Math.hypot(dx, dz);
    if (d < 0.3) { r.waitUntil = now + 5 + Math.random() * 5; r.curIdx = (r.curIdx + 1) % r.points.length; continue; }
    const sp = 1.0 * dt;
    r.npc.position.x += dx / d * sp; r.npc.position.z += dz / d * sp;
    r.npc.lookAt(target.x, r.npc.position.y, target.z);
  }
}

/* VEHICLES */
const vehicles = [];
const _tmpLook = new THREE.Vector3();
function makeLoopMain() { return [new THREE.Vector3(30,0.5,-170), new THREE.Vector3(30,0.5,-10), new THREE.Vector3(31,0.5,0), new THREE.Vector3(32,0.5,5), new THREE.Vector3(33,0.5,0), new THREE.Vector3(34,0.5,-10), new THREE.Vector3(34,0.5,-170), new THREE.Vector3(33,0.5,-178), new THREE.Vector3(32,0.5,-182), new THREE.Vector3(31,0.5,-178)]; }
function makeLoopRoadCopy() { return [new THREE.Vector3(35.5,0.5,-20), new THREE.Vector3(35.5,0.5,50), new THREE.Vector3(36.5,0.5,60), new THREE.Vector3(37.5,0.5,64), new THREE.Vector3(38.5,0.5,60), new THREE.Vector3(39.5,0.5,50), new THREE.Vector3(39.5,0.5,-20), new THREE.Vector3(38.5,0.5,-25), new THREE.Vector3(37.5,0.5,-28), new THREE.Vector3(36.5,0.5,-25)]; }
function makeLoopSupermarket() { return [new THREE.Vector3(-117,0.5,-140), new THREE.Vector3(-117,0.5,40), new THREE.Vector3(-116,0.5,50), new THREE.Vector3(-115,0.5,55), new THREE.Vector3(-114,0.5,50), new THREE.Vector3(-113.5,0.5,40), new THREE.Vector3(-113.5,0.5,-140), new THREE.Vector3(-114,0.5,-148), new THREE.Vector3(-115,0.5,-152), new THREE.Vector3(-116,0.5,-148)]; }
function makeLoopStoryRoad() { return [new THREE.Vector3(-110,0.5,-87), new THREE.Vector3(-75,0.5,-87), new THREE.Vector3(-72,0.5,-88.8), new THREE.Vector3(-75,0.5,-90.5), new THREE.Vector3(-110,0.5,-90.5), new THREE.Vector3(-113,0.5,-88.8)]; }
function buildVehicleMesh(color) {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.3, emissive: color, emissiveIntensity: 0.2 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.65, 3.6), bodyMat); body.position.y = 0.85; g.add(body);
  const topMat = new THREE.MeshStandardMaterial({ color: 0x1a1e26, roughness: 0.4, metalness: 0.4 });
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.55, 1.9), topMat); top.position.set(0, 1.4, 0.1); g.add(top);
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x223344, roughness: 0.15, metalness: 0.7 });
  const glassF = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.45, 0.06), glassMat); glassF.position.set(0, 1.4, -0.85); g.add(glassF);
  const glassR = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.42, 0.06), glassMat); glassR.position.set(0, 1.4, 1.05); g.add(glassR);
  const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.26, 16);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0c, roughness: 0.95 });
  for (const [wx, wy, wz] of [[0.86,0.38,-1.15],[-0.86,0.38,-1.15],[0.86,0.38,1.15],[-0.86,0.38,1.15]]) { const wheel = new THREE.Mesh(wheelGeo, wheelMat); wheel.rotation.z = Math.PI / 2; wheel.position.set(wx, wy, wz); g.add(wheel); }
  const hlMat = new THREE.MeshStandardMaterial({ color: 0xffffee, emissive: 0xffee88, emissiveIntensity: 2.0 });
  const hl1 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.16, 0.06), hlMat); hl1.position.set(0.55, 0.95, -1.82); g.add(hl1);
  const hl2 = hl1.clone(); hl2.position.set(-0.55, 0.95, -1.82); g.add(hl2);
  const tlMat = new THREE.MeshStandardMaterial({ color: 0xff4040, emissive: 0xff0000, emissiveIntensity: 1.8 });
  const tl1 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.06), tlMat); tl1.position.set(0.55, 0.95, 1.82); g.add(tl1);
  const tl2 = tl1.clone(); tl2.position.set(-0.55, 0.95, 1.82); g.add(tl2);
  return g;
}
function spawnVehicle(loopPoints, speed, color, delay = 0) {
  const g = buildVehicleMesh(color); world.add(g);
  const curve = new THREE.CatmullRomCurve3(loopPoints, true, 'catmullrom', 0.3);
  const totalLen = curve.getLength();
  const p0 = curve.getPointAt(0);
  g.position.set(p0.x, 0, p0.z);
  vehicles.push({ obj: g, curve, speed, t: delay % 1, totalLen });
}
function updateVehicles(dt) {
  const now = performance.now();
  for (const v of vehicles) {
    v.t += (v.speed * dt) / v.totalLen;
    v.t = ((v.t % 1) + 1) % 1;
    const p = v.curve.getPointAt(v.t), tan = v.curve.getTangentAt(v.t);
    v.obj.position.set(p.x, 0, p.z);
    _tmpLook.set(p.x + tan.x * 3, 0, p.z + tan.z * 3);
    v.obj.lookAt(_tmpLook);
    if (G.gameOver) continue;
    if (G.phase !== "gameplay" && G.phase !== "mini" && G.phase !== "shopping") continue;
    const dx = camera.position.x - v.obj.position.x, dz = camera.position.z - v.obj.position.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 2.0 && now - G.lastVehicleHit > 1200) {
      G.lastVehicleHit = now; takeDamage(35, "vehicle");
      flash("🚗 Kamu tertabrak mobil! -35 HP", 2200);
      const l = dist || 1;
      G.vehicleKnockbackVX = (dx / l) * 9; G.vehicleKnockbackVZ = (dz / l) * 9;
    }
  }
}

/* ZEBRA + TREES */
const ZEBRA_POSITIONS = [
  { x: 32.0, z: -50, rot: 0, w: 8.0, s: 12 },
  { x: 32.0, z: 15, rot: 0, w: 8.0, s: 12 },
  { x: 37.5, z: -30, rot: 0, w: 8.0, s: 12 },
  { x: -115, z: -100, rot: 0, w: 8.0, s: 12 },
  { x: -115, z: 40, rot: 0, w: 8.0, s: 12 },
  { x: 32.0, z: -150, rot: Math.PI / 2, w: 8.0, s: 12 }
];
function spawnZebraCross(x, z, rotY = 0, width = 8.0, stripes = 12) {
  const g = new THREE.Group();
  g.position.set(x, 0.13, z); g.rotation.y = rotY;
  const totalWidth = stripes * 0.75;
  for (let i = 0; i < stripes; i++) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.02, width), new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.75 }));
    stripe.position.set(-totalWidth/2 + 0.375 + i * 0.75, 0, 0);
    g.add(stripe);
  }
  world.add(g);
}
function spawnAllZebra() { for (const p of ZEBRA_POSITIONS) spawnZebraCross(p.x, p.z, p.rot || 0, p.w || 8.0, p.s || 12); }
function makeTree(x, z, scale = 1) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(scale);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3520, roughness: 0.95 });
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 2.0, 8), trunkMat); trunk.position.y = 1.0; g.add(trunk);
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x2e5c2e, roughness: 0.9 });
  const l1 = new THREE.Mesh(new THREE.ConeGeometry(1.4, 1.8, 8), leafMat); l1.position.y = 2.3; g.add(l1);
  const l2 = new THREE.Mesh(new THREE.ConeGeometry(1.1, 1.6, 8), leafMat); l2.position.y = 3.3; g.add(l2);
  const l3 = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.4, 8), leafMat); l3.position.y = 4.3; g.add(l3);
  world.add(g); return g;
}
function makeBush(x, z, scale = 1) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(scale);
  const mat = new THREE.MeshStandardMaterial({ color: 0x3a6b3a, roughness: 0.9 });
  const b1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6), mat); b1.position.y = 0.4; g.add(b1);
  const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 6), mat); b2.position.set(0.4, 0.3, 0.2); g.add(b2);
  const b3 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 6), mat); b3.position.set(-0.3, 0.35, -0.3); g.add(b3);
  world.add(g); return g;
}
function isPositionSafeForTree(x, z) {
  const margin = 2.0;
  const nearby = getNearby(x, z);
  for (const mesh of nearby) { const wb = mesh.userData.worldAABB; if (!wb) continue; if (x >= wb.min.x - margin && x <= wb.max.x + margin && z >= wb.min.z - margin && z <= wb.max.z + margin) return false; }
  const roadZones = [{ xMin: 27, xMax: 44, zMin: -200, zMax: 25 }, { xMin: 34, xMax: 45, zMin: -35, zMax: 70 }, { xMin: -120, xMax: -110, zMin: -160, zMax: 65 }, { xMin: -118, xMax: -68, zMin: -94, zMax: -84 }];
  for (const r of roadZones) if (x >= r.xMin && x <= r.xMax && z >= r.zMin && z <= r.zMax) return false;
  const zones = [[POS.home.x, POS.home.z, 18], [POS.supermarket.x, POS.supermarket.z, 16], [POS.cashier.x, POS.cashier.z, 10], [-142.3, -140.5, 8], [POS.workScene.x, POS.workScene.z, 18], [POS.boss.x, POS.boss.z, 10], [POS.security.x, POS.security.z, 10], [POS.key.x, POS.key.z, 16], [POS.door.x, POS.door.z, 16], [POS.kidnapCenter.x, POS.kidnapCenter.z, 14]];
  for (const [cx, cz, r] of zones) if (Math.hypot(x - cx, z - cz) < r) return false;
  if (x > 72 && x < 104 && z > -22 && z < 118) return false;
  if (x > -22 && x < 18 && z > 58 && z < 98) return false;
  if (x > -32 && x < 8 && z > -52 && z < -14) return false;
  if (x > 122 && x < 162 && z > 38 && z < 82) return false;
  for (const day in SPAWNS) { const sp = SPAWNS[day]; if (Math.hypot(x - sp.x, z - sp.z) < 5) return false; }
  return true;
}
function spawnTreesAndParks() {
  const candidates = [];
  const minSpacing = 5.0;
  let attempts = 0;
  while (candidates.length < 80 && attempts < 20000) {
    attempts++;
    const x = -145 + Math.random() * 290, z = -145 + Math.random() * 290;
    if (!isPositionSafeForTree(x, z)) continue;
    let ok = true;
    for (const [cx, cz] of candidates) if (Math.hypot(x - cx, z - cz) < minSpacing) { ok = false; break; }
    if (!ok) continue;
    candidates.push([x, z]);
  }
  for (const [x, z] of candidates) makeTree(x, z, 0.85 + Math.random() * 0.5);
  let bushCount = 0; attempts = 0;
  while (bushCount < 30 && attempts < 8000) {
    attempts++;
    const x = -145 + Math.random() * 290, z = -145 + Math.random() * 290;
    if (!isPositionSafeForTree(x, z)) continue;
    makeBush(x, z, 0.8 + Math.random() * 0.4);
    bushCount++;
  }
}
/* ============ SOUND AMBIENT ============ */
const Sound = {
  ctx: null, ambientGain: null, ambientNodes: [],
  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.value = 0.15;
      this.ambientGain.connect(this.ctx.destination);
    } catch(e) {}
  },
  playCricket() {
    if (!this.ctx) return; this.stop();
    const osc = this.ctx.createOscillator(); osc.type = "square"; osc.frequency.value = 4200;
    const lfo = this.ctx.createOscillator(); lfo.frequency.value = 12;
    const lfoGain = this.ctx.createGain(); lfoGain.gain.value = 300;
    lfo.connect(lfoGain).connect(osc.frequency);
    const g = this.ctx.createGain(); g.gain.value = 0.02;
    const trem = this.ctx.createOscillator(); trem.frequency.value = 8;
    const tg = this.ctx.createGain(); tg.gain.value = 0.02;
    trem.connect(tg).connect(g.gain);
    osc.connect(g).connect(this.ambientGain);
    osc.start(); lfo.start(); trem.start();
    this.ambientNodes.push(osc, lfo, trem);
  },
  playWind() {
    if (!this.ctx) return; this.stop();
    const bufSize = this.ctx.sampleRate * 2;
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufSize; i++) { const w = Math.random()*2-1; last = (last + 0.02*w)/1.02; data[i] = last*3; }
    const src = this.ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const filter = this.ctx.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.value = 400;
    const g = this.ctx.createGain(); g.gain.value = 0.06;
    src.connect(filter).connect(g).connect(this.ambientGain);
    src.start(); this.ambientNodes.push(src);
  },
  playRain() {
    if (!this.ctx) return; this.stop();
    const bufSize = this.ctx.sampleRate * 2;
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random()*2-1) * 0.4;
    const src = this.ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const filter = this.ctx.createBiquadFilter(); filter.type = "highpass"; filter.frequency.value = 1200;
    const g = this.ctx.createGain(); g.gain.value = 0.05;
    src.connect(filter).connect(g).connect(this.ambientGain);
    src.start(); this.ambientNodes.push(src);
  },
  playFootstep() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator(); osc.type = "sine"; osc.frequency.value = 120;
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.08);
    const g = this.ctx.createGain(); g.gain.setValueAtTime(0.08, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.connect(g).connect(this.ctx.destination);
    osc.start(t); osc.stop(t + 0.12);
  },
  playClick() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator(); osc.type = "square"; osc.frequency.value = 800;
    const g = this.ctx.createGain(); g.gain.setValueAtTime(0.05, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    osc.connect(g).connect(this.ctx.destination);
    osc.start(t); osc.stop(t + 0.06);
  },
  stop() { this.ambientNodes.forEach(n => { try { n.stop(); } catch(e){} }); this.ambientNodes = []; },
  updateForWeather(weather, hour) {
    if (!this.ctx) return;
    if (weather === "rain" || weather === "storm") this.playRain();
    else if (hour >= 20 || hour < 5) this.playCricket();
    else this.playWind();
  }
};
Sound.init();

/* ============ DAY/NIGHT VISUAL ============ */
const DAY_COLORS = {
  1: { bg: 0x2a3a5a, sun: 0xd8e0ec, intensity: 0.8 },
  2: { bg: 0x1a2a4a, sun: 0xc8d0dc, intensity: 0.7 },
  3: { bg: 0x2a2a3a, sun: 0xb8c0cc, intensity: 0.6 },
  4: { bg: 0x1a1a2a, sun: 0xa8b0bc, intensity: 0.5 },
  5: { bg: 0x0a0a1a, sun: 0x8090a0, intensity: 0.35 },
  6: { bg: 0x050508, sun: 0x404050, intensity: 0.2 }
};
function applyDayNight(day) {
  const c = DAY_COLORS[day] || DAY_COLORS[1];
  scene.background = new THREE.Color(c.bg);
  scene.fog.color.setHex(c.bg);
  hemiLight.color.setHex(c.sun);
  hemiLight.intensity = c.intensity;
  moon.color.setHex(c.sun);
  moon.intensity = c.intensity * 0.7;
}

/* ============ ACHIEVEMENT SYSTEM ============ */
const ACHIEVEMENTS = [
  { id: "first_save", name: "Backup Data", desc: "Save game pertama kali" },
  { id: "cat_friend", name: "Sahabat Kucing", desc: "Kasih makan kucing liar" },
  { id: "cat_pet", name: "Anak Kucing", desc: "Bawa kucing pulang" },
  { id: "atm_pay", name: "Warga Teladan", desc: "Bayar tagihan listrik" },
  { id: "buy_motor", name: "Pemotor Baru", desc: "Beli motor di Day 5" },
  { id: "read_diary", name: "Saksi Rahasia", desc: "Baca diary korban" },
  { id: "photo_1", name: "Fotografer", desc: "Ambil 1 foto" },
  { id: "photo_5", name: "Jurnalis", desc: "Ambil 5 foto" },
  { id: "cheat_404", name: "Hacker", desc: "Gunakan kode rahasia" },
  { id: "idle_secret", name: "Sabar Itu Berkah", desc: "Diam 5 menit" },
  { id: "ending_tertangkap", name: "Korban", desc: "Ending: Tertangkap" },
  { id: "ending_selamat", name: "Penyintas", desc: "Ending: Selamat" },
  { id: "ending_secret", name: "Pahlawan", desc: "Ending: Secret" },
  { id: "weather_seen", name: "Alam Nusantara", desc: "Lihat 3 cuaca berbeda" }
];
let weatherSeen = new Set();
function unlockAchievement(id) {
  if (!G.achievements) G.achievements = {};
  if (G.achievements[id]) return;
  G.achievements[id] = Date.now();
  const ach = ACHIEVEMENTS.find(a => a.id === id);
  if (!ach) return;
  const banner = document.createElement("div");
  banner.style.cssText = `position:fixed;top:60px;left:50%;transform:translateX(-50%) translateY(-100px);padding:12px 20px;background:linear-gradient(135deg,#fbbf24,#d97706);color:#fff;border-radius:12px;font-family:system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.6);z-index:200000;transition:transform .5s cubic-bezier(.16,1,.3,1);text-align:center;`;
  banner.innerHTML = `<div style="font-size:11px;opacity:.85;letter-spacing:2px;">🏆 ACHIEVEMENT UNLOCKED</div><div style="font-size:16px;font-weight:800;margin-top:4px;">${ach.name}</div><div style="font-size:12px;opacity:.85;margin-top:2px;">${ach.desc}</div>`;
  document.body.appendChild(banner);
  requestAnimationFrame(() => banner.style.transform = "translateX(-50%) translateY(0)");
  setTimeout(() => { banner.style.transform = "translateX(-50%) translateY(-100px)"; setTimeout(() => banner.remove(), 500); }, 3500);
  if (typeof Sound !== "undefined") Sound.playClick();
}

/* ============ CAT PET ============ */
let catObj = null;
function createCat() {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x8a6a3a, roughness: 0.9 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.22, 0.6), mat); body.position.y = 0.18; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), mat); head.position.set(0, 0.3, -0.35); g.add(head);
  const earL = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.12, 4), mat); earL.position.set(-0.09, 0.44, -0.35); g.add(earL);
  const earR = earL.clone(); earR.position.set(0.09, 0.44, -0.35); g.add(earR);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffdd44 });
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 6), eyeMat); eyeL.position.set(-0.07, 0.33, -0.47); g.add(eyeL);
  const eyeR = eyeL.clone(); eyeR.position.set(0.07, 0.33, -0.47); g.add(eyeR);
  g.position.copy(POS.cat);
  world.add(g); catObj = g;
  registerLamp(POS.cat.x, 1.5, POS.cat.z);
}
let catHintMarker = null, catGlowLight = null, catArrow = null;
function updateCatHint() {
  const show = G.day >= 2 && G.day <= 5 && !G.catFed;
  if (!catHintMarker && show) {
    const geo = new THREE.RingGeometry(0.9, 1.5, 32);
    const mat = new THREE.MeshBasicMaterial({ color: 0x88ff88, side: THREE.DoubleSide, transparent: true, opacity: 0.6, depthTest: false });
    catHintMarker = new THREE.Mesh(geo, mat);
    catHintMarker.rotation.x = -Math.PI / 2; catHintMarker.renderOrder = 998;
    world.add(catHintMarker);
    catGlowLight = new THREE.PointLight(0x88ff88, 1.2, 8);
    world.add(catGlowLight);
    const ag = new THREE.Group();
    const amat = new THREE.MeshBasicMaterial({ color: 0x88ff88, transparent: true, opacity: 0.9 });
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.7, 4), amat);
    cone.position.y = -0.35; cone.rotation.z = Math.PI; ag.add(cone);
    catArrow = ag; world.add(catArrow);
  }
  if (catHintMarker) {
    catHintMarker.visible = show;
    if (show) { catHintMarker.position.set(POS.cat.x, 0.2, POS.cat.z); catHintMarker.rotation.z += 0.04; }
  }
  if (catGlowLight) {
    catGlowLight.visible = show;
    if (show) { catGlowLight.position.set(POS.cat.x, 1.5, POS.cat.z); catGlowLight.intensity = 0.8 + Math.sin(performance.now()/300) * 0.5; }
  }
  if (catArrow) {
    catArrow.visible = show;
    if (show) { catArrow.position.x = POS.cat.x; catArrow.position.z = POS.cat.z; catArrow.position.y = 3.0 + Math.sin(performance.now()/400) * 0.3; catArrow.rotation.y += 0.05; }
  }
}
function updateCatFollow(dt) {
  if (!G.catFollowing || !catObj) return;
  const dx = camera.position.x - catObj.position.x;
  const dz = camera.position.z - catObj.position.z;
  const d = Math.hypot(dx, dz);
  catObj.visible = true;
  if (d > 2.5) {
    const speed = 3.0 * dt;
    catObj.position.x += (dx / d) * speed;
    catObj.position.z += (dz / d) * speed;
  }
  catObj.lookAt(camera.position.x, catObj.position.y, camera.position.z);
}

/* ============ MOTOR OBJECT (Day 5) ============ */
let motorObj = null;
function createMotor() {
  if (motorObj) return;
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0xcc2222, roughness: 0.6, metalness: 0.3 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 1.8), mat); body.position.y = 0.55; g.add(body);
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.15, 0.7), new THREE.MeshStandardMaterial({ color: 0x111111 })); seat.position.set(0, 0.78, -0.1); g.add(seat);
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.7), new THREE.MeshStandardMaterial({ color: 0x333333 }));
  handle.rotation.z = Math.PI/2; handle.position.set(0, 1.0, 0.85); g.add(handle);
  const wGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.15, 16);
  const wMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0c });
  for (const wz of [0.7, -0.7]) { const w = new THREE.Mesh(wGeo, wMat); w.rotation.z = Math.PI/2; w.position.set(0, 0.3, wz); g.add(w); }
  g.position.set(-125, 0, 60);
  world.add(g); motorObj = g;
  registerLamp(-125, 1.5, 60);
}
let motorPanel = null;
function showMotorPanel() {
  if (motorPanel) return;
  const panel = document.createElement("div");
  panel.id = "motorPanel";
  panel.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:min(88%,320px);padding:20px;background:rgba(20,24,32,.97);border:1px solid rgba(255,140,80,.5);border-radius:16px;color:#fff;z-index:200000;font-family:system-ui,sans-serif;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.85);`;
  panel.innerHTML = `
    <div style="font-size:18px;font-weight:800;margin-bottom:6px;">🏍️ Motor Mogok</div>
    <div style="font-size:12px;opacity:.6;margin-bottom:14px;">Tahan tombol DORONG sampai motor bisa jalan</div>
    <div style="width:100%;height:18px;background:#1a1a1a;border:1px solid #444;border-radius:999px;overflow:hidden;margin-bottom:14px;">
      <div id="motorBar" style="height:100%;width:0%;background:linear-gradient(90deg,#ff8c3a,#ff4444);transition:width .15s;"></div>
    </div>
    <button id="motorPushBtn" style="width:100%;padding:16px;background:#4a2a2a;color:#ffaaaa;border:2px solid #8a4a4a;border-radius:10px;font-size:16px;font-weight:800;cursor:pointer;touch-action:none;user-select:none;">HOLD — DORONG</button>
    <div style="font-size:11px;opacity:.5;margin-top:10px;">Progress: <span id="motorPct">0%</span></div>
  `;
  document.body.appendChild(panel);
  motorPanel = panel;
  const btn = panel.querySelector("#motorPushBtn");
  const bar = panel.querySelector("#motorBar");
  const pct = panel.querySelector("#motorPct");
  let pushing = false, pushInterval = null;
  const startPush = (e) => {
    e.preventDefault();
    if (pushing) return;
    pushing = true;
    btn.style.background = "#6a3a3a";
    pushInterval = setInterval(() => {
      G.motorProgress = Math.min(100, G.motorProgress + 3);
      bar.style.width = G.motorProgress + "%";
      pct.textContent = G.motorProgress + "%";
      if (G.motorProgress >= 100) { clearInterval(pushInterval); finishMotor(); }
    }, 100);
  };
  const stopPush = () => {
    pushing = false;
    btn.style.background = "#4a2a2a";
    if (pushInterval) clearInterval(pushInterval);
    const decay = setInterval(() => {
      if (pushing || G.motorProgress >= 100) { clearInterval(decay); return; }
      G.motorProgress = Math.max(0, G.motorProgress - 2);
      bar.style.width = G.motorProgress + "%";
      pct.textContent = G.motorProgress + "%";
      if (G.motorProgress <= 0) clearInterval(decay);
    }, 150);
  };
  btn.addEventListener("pointerdown", startPush, { passive: false });
  btn.addEventListener("pointerup", stopPush);
  btn.addEventListener("pointerleave", stopPush);
  btn.addEventListener("pointercancel", stopPush);
}
function finishMotor() {
  G.motorDone = true;
  if (motorPanel) { motorPanel.remove(); motorPanel = null; }
  if (motorObj) { world.remove(motorObj); motorObj = null; }
  flash("✅ Motor berhasil dinyalakan!", 3000);
  setObjective("OBJECTIVE: " + (PHASE[G.currentPhase]?.obj || "Lanjutkan perjalanan"));
  if (G.currentPhase === "d5_motor") { resetStuck(); hideMarker(); flowAdvance(); }
}
let motorShopShown = false;
function showMotorShop() {
  if ($("motorShop")) return;
  const panel = document.createElement("div");
  panel.id = "motorShop";
  panel.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:min(90%,340px);padding:20px;background:rgba(20,24,32,.97);border:1px solid rgba(255,80,80,.5);border-radius:16px;color:#fff;z-index:200000;font-family:system-ui,sans-serif;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.85);`;
  panel.innerHTML = `
    <div style="font-size:18px;font-weight:800;margin-bottom:6px;">🏍️ Bengkel Motor</div>
    <div style="font-size:12px;opacity:.6;margin-bottom:14px;">Motor rusak parah, mau beli baru?</div>
    <div style="background:#1a1a2a;padding:14px;border-radius:10px;margin-bottom:14px;">
      <div style="font-size:13px;opacity:.7;margin-bottom:6px;">Motor Baru</div>
      <div style="font-size:22px;font-weight:800;color:#ffcc44;">Rp 2.500.000</div>
    </div>
    <div style="display:flex;gap:8px;">
      <button id="motorBuyYes" style="flex:1;padding:12px;background:#2a4a2a;color:#aaffaa;border:1px solid #6a8a6a;border-radius:10px;font-size:14px;cursor:pointer;font-weight:700;">✅ BELI</button>
      <button id="motorBuyNo" style="flex:1;padding:12px;background:#4a2a2a;color:#ffaaaa;border:1px solid #8a6a6a;border-radius:10px;font-size:14px;cursor:pointer;font-weight:700;">❌ BATAL</button>
    </div>
  `;
  document.body.appendChild(panel);
  panel.querySelector("#motorBuyNo").onclick = () => panel.remove();
  panel.querySelector("#motorBuyYes").onclick = () => {
    if (G.money < 2500000) { flash("💰 Uang tidak cukup.", 2500); return; }
    G.money -= 2500000; setWalletUI();
    G.motorBought = true; G.motorOwned = true;
    unlockAchievement("buy_motor");
    flash("🏍️ Motor baru terbeli!", 4000);
    pushPhoneMessage("Ibu", "Nak, kamu beli motor? Hati-hati ya ❤️");
    panel.remove();
    G.speed = 5.5; G.runSpeed = 9.0;
    if (G.currentPhase === "d5_motor") { resetStuck(); hideMarker(); flowAdvance(); }
  };
}

/* ============ ATM/KURIR OBJECTS ============ */
function createATM() {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x2a3a5a, roughness: 0.7, metalness: 0.3 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 0.6), mat); body.position.y = 1.1; g.add(body);
  const sc = new THREE.MeshStandardMaterial({ color: 0x66ffcc, emissive: 0x33ff99, emissiveIntensity: 0.7 });
  const screen = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.02), sc); screen.position.set(0, 1.5, 0.31); g.add(screen);
  g.position.copy(POS.atm); world.add(g);
  registerLamp(POS.atm.x, 2.5, POS.atm.z);
}
function createKurir() {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0xcc3333, roughness: 0.8 });
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.6), mat); box.position.y = 0.25; g.add(box);
  g.position.copy(POS.kurir); world.add(g);
  registerLamp(POS.kurir.x, 1.5, POS.kurir.z);
}
function createPhoneItem() {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0x3366ff, emissiveIntensity: 0.8 });
  const phone = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.02, 0.28), mat); phone.position.y = 0.5; g.add(phone);
  const glow = new THREE.PointLight(0x3366ff, 1.2, 5); glow.position.y = 0.5; g.add(glow);
  g.position.copy(POS.phoneKidnapper); world.add(g);
}
function createDiary() {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x8a6a3a, roughness: 0.9 });
  const book = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, 0.4), mat); book.position.y = 0.5; g.add(book);
  const glow = new THREE.PointLight(0xffaa66, 0.6, 3); glow.position.y = 0.5; g.add(glow);
  g.position.copy(POS.diary); g.visible = false;
  world.add(g);
  setTimeout(() => { g.visible = true; }, 500);
}

/* ============ PULSA MENU ============ */
let pulsaMenu = null;
function showPulsaMenu() {
  if (pulsaMenu) return;
  const panel = document.createElement("div");
  panel.id = "pulsaMenu";
  panel.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:min(90%,340px);padding:20px;background:rgba(20,24,32,.97);border:1px solid rgba(120,180,255,.5);border-radius:16px;color:#fff;z-index:200000;font-family:system-ui,sans-serif;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.85);`;
  panel.innerHTML = `
    <div style="font-size:18px;font-weight:800;margin-bottom:6px;">📱 Beli Pulsa</div>
    <div style="font-size:12px;opacity:.6;margin-bottom:16px;">Pilih nominal pulsa</div>
    <div style="display:flex;flex-direction:column;gap:8px;">
      <button data-p="10000" style="padding:12px;background:#2a4a6a;color:#aaddff;border:1px solid #6a8aac;border-radius:10px;font-size:14px;cursor:pointer;font-weight:600;">Rp 10.000</button>
      <button data-p="25000" style="padding:12px;background:#2a4a6a;color:#aaddff;border:1px solid #6a8aac;border-radius:10px;font-size:14px;cursor:pointer;font-weight:600;">Rp 25.000</button>
      <button data-p="50000" style="padding:12px;background:#2a4a6a;color:#aaddff;border:1px solid #6a8aac;border-radius:10px;font-size:14px;cursor:pointer;font-weight:600;">Rp 50.000</button>
      <button data-p="0" style="padding:10px;background:#3a2a2a;color:#ffaaaa;border:1px solid #6a4a4a;border-radius:10px;font-size:13px;cursor:pointer;">Batal</button>
    </div>
  `;
  document.body.appendChild(panel); pulsaMenu = panel;
  panel.querySelectorAll("button").forEach(btn => {
    btn.onclick = () => {
      const harga = parseInt(btn.dataset.p);
      if (harga === 0) { pulsaMenu.remove(); pulsaMenu = null; return; }
      if (G.money < harga) { flash("💰 Uang tidak cukup!", 2000); pulsaMenu.remove(); pulsaMenu = null; return; }
      G.money -= harga; setWalletUI();
      const nom = (harga/1000).toFixed(0) + "rb";
      flash("📱 Pulsa Rp " + harga.toLocaleString("id-ID") + " berhasil!", 3000);
      pushPhoneMessage("Bank", "Pulsa " + nom + " berhasil diisi. Terima kasih!");
      G.pulsaBought = true;
      pulsaMenu.remove(); pulsaMenu = null;
    };
  });
}

/* ============ DIARY PANEL ============ */
function showDiary() {
  if ($("diaryPanel")) return;
  if (G.diaryRead) { flash("Sudah dibaca.", 1500); return; }
  const panel = document.createElement("div");
  panel.id = "diaryPanel";
  panel.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:min(92%,400px);max-height:80vh;overflow-y:auto;padding:24px;background:rgba(240,230,200,.98);color:#3a2a1a;z-index:200000;font-family:'Courier New',monospace;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,.9);`;
  panel.innerHTML = `
    <div style="font-size:11px;opacity:.5;margin-bottom:16px;">— DIARY KORBAN #4 —</div>
    <div style="font-size:14px;line-height:1.8;margin-bottom:16px;">
      <strong>Hari 7 di sini.</strong><br><br>
      Aku gak tau siapa yang bawa aku ke sini. Setiap malam aku denger suara langkah kaki di lorong.<br><br>
      Ada tulisan di dinding: <em>"RUMAH NO. 404 - KORBAN SEBELUMNYA"</em><br><br>
      Kalau kamu baca ini, <strong>JANGAN PERCAYA SIAPA PUN</strong>.<br>
      Pelakunya...<br><br>
      <em>— tulisan terhenti —</em>
    </div>
    <div style="text-align:center;">
      <button id="diaryClose" style="padding:10px 24px;background:#3a2a1a;color:#f0e6c8;border:none;border-radius:6px;font-size:13px;cursor:pointer;font-weight:700;">TUTUP</button>
    </div>
  `;
  document.body.appendChild(panel);
  panel.querySelector("#diaryClose").onclick = () => panel.remove();
  G.diaryRead = true;
  unlockAchievement("read_diary");
  pushPhoneMessage("Anonim", "Kamu baca tulisannya ya? Bagus...", true);
}

/* ============ FOTOGRAFI ============ */
function takePhoto() {
  if (G.phase !== "gameplay" && G.phase !== "mini") return;
  const dataURL = renderer.domElement.toDataURL("image/jpeg", 0.6);
  G.photos.push({ data: dataURL, time: getClockString(), day: G.day });
  G.photoCount++;
  flash("📸 Foto diambil! (" + G.photoCount + " foto)", 2000);
  Sound.playClick();
  if (G.photoCount === 1) unlockAchievement("photo_1");
  if (G.photoCount === 5) unlockAchievement("photo_5");
  const flashEl = document.createElement("div");
  flashEl.style.cssText = "position:fixed;inset:0;background:#fff;z-index:200000;pointer-events:none;opacity:0.8;transition:opacity .3s;";
  document.body.appendChild(flashEl);
  requestAnimationFrame(() => { flashEl.style.opacity = "0"; setTimeout(() => flashEl.remove(), 350); });
}
setTimeout(() => {
  if ($("photoBtn")) return;
  const btn = document.createElement("button");
  btn.id = "photoBtn"; btn.textContent = "📸";
  btn.style.cssText = `position:fixed;right:max(22px, env(safe-area-inset-right));bottom:max(290px, calc(env(safe-area-inset-bottom) + 290px));width:56px;height:56px;font-size:22px;background:radial-gradient(circle at 35% 30%, rgba(255,120,180,.7), rgba(160,40,90,.75));border:1.5px solid rgba(255,180,220,.5);border-radius:50%;color:#fff;z-index:70;pointer-events:auto;touch-action:none;backdrop-filter:blur(8px);box-shadow:0 6px 18px rgba(0,0,0,.4);`;
  btn.addEventListener("pointerdown", e => { e.preventDefault(); e.stopPropagation(); takePhoto(); btn.style.transform = "scale(.88)"; setTimeout(() => btn.style.transform = "scale(1)", 100); }, { passive: false });
  document.body.appendChild(btn);
}, 1500);

/* ============ CHEAT LANJUTAN ============ */
function checkAdvancedCheat(input) {
  const code = input.trim().toLowerCase().replace(/\s+/g, "");
  if (!code) return false;
  if (code === "404" && !G.cheatsUsed.basic) { G.cheatsUsed.basic = true; unlockAchievement("cheat_404"); flash("🎮 CHEAT MODE UNLOCKED!", 4000); pushPhoneMessage("Anonim", "Kamu menemukan rahasianya... 4-0-4.", true); addMoney(500000); G.staminaMax = 200; G.stamina = 200; G.speed *= 1.3; G.runSpeed *= 1.3; return true; }
  if (code === "arianyala" && !G.cheatsUsed.god) { G.cheatsUsed.god = true; G.godMode = true; unlockAchievement("cheat_404"); flash("🛡️ GOD MODE ON", 4000); pushPhoneMessage("Anonim", "Kamu menemukan nama asliku...", true); return true; }
  if (code === "kaburkangenting" && !G.cheatsUsed.skipday) { G.cheatsUsed.skipday = true; flash("⏩ LONCAT KE DAY 6...", 3000); setTimeout(() => { G.day = 6; spawnPlayer(6); csStart(6, [{ text: "Kamu membuka pintu dimensi...", auto: 2000 }, { text: "Tiba-tiba kamu berada di tempat asing.", red: true, blood: true, auto: 2500 }]); }, 1000); return true; }
  if (code === "kunciemasibu" && !G.cheatsUsed.allitem) { G.cheatsUsed.allitem = true; G.hasKey = true; G.hasPhoneKidnapper = true; setInvUI(); flash("🔑 Semua item didapat!", 4000); pushPhoneMessage("Ibu", "Nak, kunci itu dari ibu ❤️"); return true; }
  if (code === "gajianboskaya" && !G.cheatsUsed.money) { G.cheatsUsed.money = true; addMoney(10000000); flash("💰 +Rp 10.000.000", 4000); pushPhoneMessage("Bos", "Bonus tahunan. Jangan boros."); return true; }
  if (code === "malamkelam404" && !G.cheatsUsed.kidnap) { G.cheatsUsed.kidnap = true; const idx = FLOW[5].findIndex(it => it.kidnapScene); if (idx < 0) return true; G.ownerMode = false; G.ownerFly = false; G.vy = 0; hideMarker(); csHide(); G.day = 5; G.flowIndex = idx; G.currentPhase = null; flowNext(); return true; }
  if (code === "tigajalanpulang" && !G.cheatsUsed.endings) { G.cheatsUsed.endings = true; G.endingsUnlocked = { tertangkap: true, selamat: true, secret: true }; try { localStorage.setItem("houseOf404_endings", JSON.stringify(G.endingsUnlocked)); } catch(e){} flash("🌟 Semua ending terbuka!", 4000); return true; }
  if (code === "dibelakangmu" && !G.cheatsUsed.xray) { G.cheatsUsed.xray = true; G.xrayMode = true; flash("👁️ X-RAY mode ON", 4000); pushPhoneMessage("Anonim", "Kamu bisa melihatku sekarang.", true); return true; }
  if (code === "larikencangbanget" && !G.cheatsUsed.speed) { G.cheatsUsed.speed = true; G.speed *= 2; G.runSpeed *= 2; G.staminaMax = 500; G.stamina = 500; flash("⚡ Speed 2x + Stamina 500!", 4000); return true; }
  if (code === "bloodymary404" && !G.cheatsUsed.blood) { G.cheatsUsed.blood = true; setBlood(true); flash("🩸 Darah mengalir...", 4000); pushPhoneMessage("Anonim", "Kamu menyukai darah? Menarik...", true); return true; }
  if (code === "kabutmisterius" && !G.cheatsUsed.fog) { G.cheatsUsed.fog = true; scene.fog.near = 5; scene.fog.far = 40; flash("🌫️ Kabut tebal...", 4000); pushPhoneMessage("Cuaca", "Peringatan: Kabut ekstrem di wilayahmu."); return true; }
  if (code === "kembalikeawal" && !G.cheatsUsed.reset) { G.cheatsUsed.reset = true; G.godMode = false; G.xrayMode = false; G.speed = 3.2; G.runSpeed = 6.4; G.staminaMax = 100; G.stamina = 100; setBlood(false); scene.fog.near = 80; scene.fog.far = 200; flash("🔄 Reset normal.", 3000); return true; }
  return false;
}

/* ============ SECRET IDLE CUTSCENE ============ */
G.idleSecretDone = false; G.idleTime = 0; G.lastPosSnapshot = { x: 0, z: 0 };
function updateIdleTimer(dt) {
  if (G.gameOver || G.phase === "cutscene" || G.phase === "ended") return;
  if (G.idleSecretDone) return;
  const dx = camera.position.x - G.lastPosSnapshot.x;
  const dz = camera.position.z - G.lastPosSnapshot.z;
  const moved = Math.hypot(dx, dz);
  if (moved > 0.1 || isMovingInput()) {
    G.idleTime = 0;
    G.lastPosSnapshot.x = camera.position.x;
    G.lastPosSnapshot.z = camera.position.z;
  } else {
    G.idleTime += dt;
    if (G.idleTime >= 300 && !G.idleSecretDone) {
      G.idleSecretDone = true;
      unlockAchievement("idle_secret");
      csStart(G.day, [
        { text: "Aku berdiri diam... tanpa sadar...", auto: 2000 },
        { text: "Dunia di sekitarku terasa... aneh.", auto: 2500 },
        { text: "Tiba-tiba...", auto: 1500 },
        { text: "SEBUAH SUARA BERBISIK DI TELINGAKU:\n\n\"KAMU SENDIRIAN, YA?\"", red: true, blood: true, scream: true, auto: 3500 },
        { text: "Aku menoleh...\n\nTidak ada siapa-siapa.\n\nTapi kenapa bulu kudukku berdiri?", auto: 3500 },
        { text: "Mungkin... aku sudah terlalu lama di dunia ini.", auto: 3000 }
      ]);
    }
  }
}

/* ============ WEATHER BY HOUR ============ */
let weatherHourTimer = 0;
function updateWeatherByHour(dt) {
  weatherHourTimer -= dt;
  if (weatherHourTimer > 0) return;
  weatherHourTimer = 30;
  const hour = getInGameHour();
  let newW = "clear";
  if (hour >= 5 && hour < 10) newW = Math.random() < 0.3 ? "rain" : "clear";
  else if (hour >= 10 && hour < 15) newW = "clear";
  else if (hour >= 15 && hour < 18) newW = Math.random() < 0.4 ? "rain" : "clear";
  else if (hour >= 18 && hour < 22) newW = Math.random() < 0.5 ? "storm" : "rain";
  else newW = Math.random() < 0.7 ? "storm" : "rain";
  if (newW !== G.weather) { setWeather(newW, false); Sound.updateForWeather(newW, hour); }
}

/* ============ LOAD EVERYTHING ============ */
async function loadEverything() {
  const fillEl = $("loadingFill"), txt = $("loadingText");
  const glbTypes = new Set(["rumah","house404","buildings","security","supermarket","workshop"]);
  const glbTasks = [], primTasks = [];
  WORLD_DATA.forEach(([name, type, p, r, s]) => { if (glbTypes.has(type)) glbTasks.push({ name, type, p, r, s }); else primTasks.push({ name, type, p, r, s }); });
  const total = glbTasks.length + primTasks.length + 2;
  let done = 0;
  function prog(l) { done++; const pct = Math.round((done / total) * 100); if (fillEl) fillEl.style.width = pct + "%"; if (txt) txt.textContent = l + " · " + pct + "%"; }
  for (const t of primTasks) { makePrimitive(t.type, t.name, t.p, t.r, t.s); prog("Membuat " + t.name); await new Promise(r => setTimeout(r, 0)); }
  await Promise.all(glbTasks.map(async t => { try { await placeGLB(MODELS[t.type], t.p, t.r, t.s, t.name); } catch(e) { console.warn("Gagal:", t.name, e); } prog("Memuat " + t.name); }));
  const g = new THREE.Mesh(new THREE.PlaneGeometry(300,300), new THREE.MeshStandardMaterial({ color: 0x2a2f35, roughness: 1 }));
  g.rotation.x = -Math.PI/2; g.position.y = -0.05; world.add(g);
  prog("Menyiapkan tanah");
  for (const [x, z] of [[-12,-15],[12,-15],[-12,-55],[12,-55],[-20,-78.7],[29.2,-78.9]]) registerLamp(x, 4, z);
  buildHouseInterior();
  prog("Membangun interior rumah");
}

/* ============ BOOT ============ */
async function boot() {
  try {
    setupTouch();
    ensureStaminaUI(); ensureHealthUI(); ensureSanityUI(); ensureCoordOverlay(); ensureOwnerPanel(); ensurePhoneOS();
    setInvUI(); setTimerUI(false); setInteract(false);
    updateHealthUI(); setWalletUI(); setCartUI(); updateSanityUI();
    applyGraphicsSettings(); initLampPool();
    await loadEverything();
    spawnShopMarkers();
    spawnVehicle(makeLoopMain(), 9, 0xa03030, 0.00);
    spawnVehicle(makeLoopMain(), 10, 0x3050a0, 0.33);
    spawnVehicle(makeLoopMain(), 8, 0x30a050, 0.66);
    spawnVehicle(makeLoopRoadCopy(), 8, 0xd0a020, 0.00);
    spawnVehicle(makeLoopRoadCopy(), 9, 0x8020c0, 0.50);
    spawnVehicle(makeLoopSupermarket(), 8, 0x20b0c0, 0.00);
    spawnVehicle(makeLoopSupermarket(), 9, 0xc04040, 0.33);
    spawnVehicle(makeLoopSupermarket(), 7, 0x4040c0, 0.66);
    spawnVehicle(makeLoopStoryRoad(), 8, 0xcc40cc, 0.00);
    spawnVehicle(makeLoopStoryRoad(), 9, 0x40cccc, 0.50);
    spawnAllZebra(); spawnTreesAndParks();
    const satpamNPC = createNPC("SATPAM", new THREE.Vector3(-66.084, 0, -102.025), 0x18243a, 0x0b1220);
    registerNPCRoutine(satpamNPC, [new THREE.Vector3(-66.084, 0, -102.025), new THREE.Vector3(-66.084, 0, -105.5), new THREE.Vector3(-62.5, 0, -102.025), new THREE.Vector3(-66.084, 0, -98.5)]);
    const bossNPC = createNPC("NPC BOS", new THREE.Vector3(POS.boss.x, 0, POS.boss.z), 0x252525, 0x111111);
    registerNPCRoutine(bossNPC, [new THREE.Vector3(POS.boss.x, 0, POS.boss.z), new THREE.Vector3(POS.boss.x + 2, 0, POS.boss.z + 2), new THREE.Vector3(POS.boss.x, 0, POS.boss.z + 4), new THREE.Vector3(POS.boss.x - 2, 0, POS.boss.z + 2)]);
    createDoor(-137.5, 65, Math.PI / 2, { color: 0x4a3a2a, label: "Pintu Kantor" });
    createDoor(-142, -137.5, 0, { color: 0x3a5a3a, label: "Pintu Indomaret" });
    createCat(); createATM(); createKurir(); createPhoneItem(); createMotor(); createDiary();
    const ls = $("loadingScreen"); if (ls) ls.classList.add("hidden");
    G.gameOver = false; G.hasKey = false; G.flashlight = false;
    G.timeLeft = 60 * 60; G.stamina = G.staminaMax; G.running = false;
    G.jumpscarePlayed = false;
    G.py = 0; G.vy = 0; G.onGround = true; G.fallStartY = 0;
    G.health = G.maxHealth; updateHealthUI();
    G.sanity = G.sanityMax; updateSanityUI();
    G.money = 200000; setWalletUI();
    G.vehicleKnockbackVX = 0; G.vehicleKnockbackVZ = 0;
    G.kidnapActive = false; G.kidnapDone = false;
    G.inInterior = false; G.chatOpenWith = null; G.captureActive = false;
    G.hasPhoneKidnapper = false; G.policeHanded = false;
    G.catFed = false; G.mirrorScareDone = false; G.tvWatched = false;
    G.atmBillPaid = false; G.kurirPackageTaken = false; G.pulsaBought = false;
    G.motorBought = false; G.motorOwned = false; G.motorProgress = 0; G.motorDone = false;
    G.diaryRead = false; G.photoCount = 0; G.photos = [];
    G.catFollowing = false; G.cheatsUsed = {}; G.godMode = false; G.xrayMode = false;
    G.idleTime = 0; G.idleSecretDone = false;
    pushPhoneMessage("Bos", "Selamat datang kerja. Gajian tiap hari kerja.");
    pushPhoneMessage("Ibu", "Nak, jangan lupa makan ya.");
    pushPhoneMessage("Anonim", "Aku mengawasimu...", true);
    setWeather("clear", true);
    spawnPlayer(1);
    flowStart(1);
  } catch(err) {
    console.error("BOOT ERROR:", err);
    const t = $("loadingText"); if (t) t.textContent = "ERROR: " + err.message;
  }
}
boot();

/* ============ LOOP ============ */
let last = performance.now();
let clockTick = 0;
let patchTick = 0;
function loop(now) {
  requestAnimationFrame(loop);
  const dtRaw = (now - last) / 1000;
  last = now;
  if (dtRaw > 0.5) { renderer.render(scene, camera); return; }
  const dt = Math.min(dtRaw, 0.033);
  if (G.phase !== "loading" && !G.phoneOpen) {
    if (G.csAutoRotate && G.phase === "cutscene") G.yaw += G.csRotateDir * 0.35 * dt;
    updateStamina(dt);
    updateMovement(dt);
    updateCamera();
    updatePackVisibility();
    updateLampPool(dt);
    updateDoors(dt);
    updatePhase(dt);
    updateMini(dt);
    updateKidnapScene(dt);
    checkKidnapTrigger();
    if (interiorCooldown > 0) interiorCooldown -= dt;
    checkHouseAutoEnter();
    checkHouseExit();
    updateEnemy(dt);
    updateVehicles(dt);
    updateNPCRoutines(dt);
    updateWeather(dt);
    tickTimer(dt);
    updateCoordOverlay(dt);
    updateSanity(dt);
    updateCatFollow(dt);
    updateIdleTimer(dt);
    updateCatHint();
    // Patch periodic triggers
    patchTick += dt;
    if (patchTick >= 0.15) {
      patchTick = 0;
      // Pulsa trigger (Day 2)
      if (G.day === 2 && !G.pulsaBought && (G.phase === "shopping" || G.phase === "gameplay")) {
        const dCash = Math.hypot(camera.position.x - POS.cashier.x, camera.position.z - POS.cashier.z);
        if (dCash < 2.5 && !pulsaMenu) showPulsaMenu();
      }
      // Motor mogok trigger
      if (G.day === 5 && G.phase === "gameplay" && G.currentPhase === "d5_motor" && !motorPanel && !G.motorBought && !G.motorDone) {
        const dM = Math.hypot(camera.position.x - (-125), camera.position.z - 60);
        if (dM < 3) showMotorPanel();
      }
      // Motor shop trigger (kalau motor udah dorong tapi gak beli)
      if (G.day === 5 && G.phase === "gameplay" && G.currentPhase === "d5_motor" && !motorPanel && !$("motorShop") && !G.motorBought) {
        const dM = Math.hypot(camera.position.x - (-125), camera.position.z - 60);
        if (dM < 3 && (G.motorProgress === 0 || G.motorDone)) {
          if (!motorShopShown) { motorShopShown = true; showMotorShop(); }
        }
      }
      // Weather per hour
      updateWeatherByHour(dt);
    }
  }
  clockTick += dt;
  if (clockTick > 1) { clockTick = 0; updatePhoneOSClock(); }
  renderer.render(scene, camera);
}
loop(performance.now());

addEventListener("resize", () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
document.addEventListener("visibilitychange", () => { if (!document.hidden) applyGraphicsSettings(); });
window.addEventListener("storage", (e) => { if (e.key === "graphicQuality" || e.key === "lookSensitivity") applyGraphicsSettings(); });
console.log("✅ [THE HOUSE OF 404] Full game loaded — 12 features + 3 endings");