// Data Unsur Kimia (Element Database)
const elementsData = {
    H: {
        name: "Hidrogen",
        badge: "H",
        category: "Nonlogam Reaktif",
        number: 1,
        mass: 1.008,
        desc: "Hidrogen adalah unsur kimia teringan dan paling melimpah di alam semesta. Sekitar 75% dari massa unsur alam semesta terdiri dari hidrogen. Di Bumi, hidrogen umumnya ditemukan berikatan dengan oksigen dalam bentuk air.",
        protons: 1,
        neutrons: 0,
        shells: [1]
    },
    He: {
        name: "Helium",
        badge: "He",
        category: "Gas Mulia",
        number: 2,
        mass: 4.0026,
        desc: "Helium adalah unsur kimia gas mulia yang tidak berwarna, tidak berbau, tidak berasa, dan tidak beracun. Merupakan unsur paling melimpah kedua di alam semesta, dibentuk melalui fusi nuklir bintang.",
        protons: 2,
        neutrons: 2,
        shells: [2]
    },
    Li: {
        name: "Litium",
        badge: "Li",
        category: "Logam Alkali",
        number: 3,
        mass: 6.94,
        desc: "Litium adalah logam alkali yang sangat ringan dan lunak dengan warna perak keabu-abuan. Sangat reaktif terhadap air dan udara, sehingga harus disimpan dalam minyak. Banyak digunakan dalam baterai isi ulang modern.",
        protons: 3,
        neutrons: 4,
        shells: [2, 1]
    },
    Be: {
        name: "Berilium",
        badge: "Be",
        category: "Logam Alkali Tanah",
        number: 4,
        mass: 9.0122,
        desc: "Berilium adalah logam alkali tanah berwarna abu-abu baja, kuat, ringan, dan rapuh. Memiliki titik leleh yang tinggi dan konduktivitas termal yang sangat baik. Digunakan dalam teknologi dirgantara dan militer.",
        protons: 4,
        neutrons: 5,
        shells: [2, 2]
    },
    B: {
        name: "Boron",
        badge: "B",
        category: "Metaloid",
        number: 5,
        mass: 10.81,
        desc: "Boron adalah unsur metaloid yang memiliki sifat perantara antara logam dan nonlogam. Digunakan secara luas dalam industri serat kaca, keramik, produk pertanian, dan bahan kimia rumah tangga.",
        protons: 5,
        neutrons: 6,
        shells: [2, 3]
    },
    C: {
        name: "Karbon",
        badge: "C",
        category: "Nonlogam Reaktif",
        number: 6,
        mass: 12.011,
        desc: "Karbon adalah dasar dari seluruh kehidupan organik di Bumi. Karbon dapat membentuk ikatan kovalen yang stabil dengan empat atom lain (tetravalen), menghasilkan keanekaragaman senyawa kimia tak terbatas.",
        protons: 6,
        neutrons: 6,
        shells: [2, 4]
    },
    N: {
        name: "Nitrogen",
        badge: "N",
        category: "Nonlogam Reaktif",
        number: 7,
        mass: 14.007,
        desc: "Nitrogen adalah gas diatomik yang tidak berwarna dan tidak berbau yang membentuk sekitar 78% atmosfer Bumi. Nitrogen sangat penting bagi kehidupan karena menyusun protein dan asam nukleat (DNA/RNA).",
        protons: 7,
        neutrons: 7,
        shells: [2, 5]
    },
    O: {
        name: "Oksigen",
        badge: "O",
        category: "Nonlogam Reaktif",
        number: 8,
        mass: 15.999,
        desc: "Oksigen adalah unsur gas yang sangat reaktif dan merupakan zat pengoksidasi kuat. Sangat penting bagi respirasi sebagian besar makhluk hidup di Bumi serta pembentukan ozon (O3) pelindung atmosfer.",
        protons: 8,
        neutrons: 8,
        shells: [2, 6]
    },
    F: {
        name: "Fluor",
        badge: "F",
        category: "Halogen",
        number: 9,
        mass: 18.998,
        desc: "Fluor adalah unsur halogen berupa gas kuning pucat yang sangat beracun dan merupakan unsur paling reaktif serta elektronegatif dari semua unsur kimia. Fluor dapat bereaksi dengan hampir semua zat lainnya.",
        protons: 9,
        neutrons: 10,
        shells: [2, 7]
    },
    Ne: {
        name: "Neon",
        badge: "Ne",
        category: "Gas Mulia",
        number: 10,
        mass: 20.180,
        desc: "Neon adalah gas mulia yang memancarkan pendaran oranye kemerahan terang yang khas jika dialiri arus listrik bertegangan tinggi di dalam tabung pembuangan gas (lampu neon). Sangat tidak reaktif.",
        protons: 10,
        neutrons: 10,
        shells: [2, 8]
    },
    Na: {
        name: "Natrium",
        badge: "Na",
        category: "Logam Alkali",
        number: 11,
        mass: 22.990,
        desc: "Natrium adalah logam alkali lunak, berwarna putih keperakan, dan sangat reaktif. Logam murni natrium dapat terbakar secara spontan jika kontak dengan air, melepaskan gas hidrogen dan panas tinggi.",
        protons: 11,
        neutrons: 12,
        shells: [2, 8, 1]
    }
};

// Global App State Variables
let scene, camera, renderer, controls;
let atomGroup, nucleusGroup, electronsGroup;
let starfield;

let currentElement = 'C';
let animationSpeed = 1.0;
let atomScale = 1.0;
let nucleusDensity = 1.0;

let showOrbits = true;
let showGlow = true;
let vibrateNucleus = true;

const nucleons = []; // Menyimpan objek proton & neutron mesh beserta data posisinya
const electrons = []; // Menyimpan objek elektron mesh beserta parameter orbitnya

// Constants untuk Visualisasi
const PROTON_COLOR = 0xf43f5e;
const NEUTRON_COLOR = 0x06b6d4;
const ELECTRON_COLOR = 0xfbbf24;
const GLOW_COLOR_HEX = '#fbbf24';

const SHELL_RADII = [2.2, 3.8, 5.4]; // Jari-jari kulit elektron ke-1, 2, dan 3

// Helper function untuk konversi hex ke RGB string
function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '251, 191, 36';
}

// Inisialisasi Aplikasi
function init() {
    const container = document.getElementById('canvas-container');

    // 1. Create Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080b11, 0.015);

    // 2. Create Camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(8, 6, 12);

    // 3. Create Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x080b11, 1);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 4. Create OrbitControls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 4;
    controls.maxDistance = 25;
    controls.autoRotate = false;

    // 5. Setup Lighting
    setupLighting();

    // 6. Create Atom Group
    atomGroup = new THREE.Group();
    scene.add(atomGroup);

    nucleusGroup = new THREE.Group();
    electronsGroup = new THREE.Group();
    atomGroup.add(nucleusGroup);
    atomGroup.add(electronsGroup);

    // 7. Add Background Stars
    createStarfield();

    // 8. Bind UI Elements
    bindUIEvents();

    // 9. Render Selected Element
    buildAtom(currentElement);

    // 10. Start Animation Loop
    animate();

    // Handle Window Resize
    window.addEventListener('resize', onWindowResize);
}

// Pengaturan Pencahayaan Dramatis
function setupLighting() {
    // Ambient Light (Pencahayaan lingkungan lembut)
    const ambientLight = new THREE.AmbientLight(0x1a233a, 2.0);
    scene.add(ambientLight);

    // Point Light di Tengah Inti Atom (Cahaya memancar dari pusat)
    const centerLight = new THREE.PointLight(0xffffff, 2.5, 12, 0.8);
    centerLight.position.set(0, 0, 0);
    scene.add(centerLight);

    // Directional Light Utama (Menciptakan bayangan dan highlight)
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(10, 15, 10);
    scene.add(dirLight1);

    // Directional Light Rim (Biru/Indigo dari sudut berlawanan untuk kedalaman 3D)
    const dirLight2 = new THREE.DirectionalLight(0x6366f1, 2.0);
    dirLight2.position.set(-10, -10, -10);
    scene.add(dirLight2);
}

// Menghasilkan Efek Glow Elektron Menggunakan Canvas Texture
function createGlowTexture(colorHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.2, colorHex);
    gradient.addColorStop(0.5, `rgba(${hexToRgb(colorHex)}, 0.4)`);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    
    return new THREE.CanvasTexture(canvas);
}

// Membuat Latar Belakang Bintang Bergerak Lambat
function createStarfield() {
    const starsCount = 400;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    for (let i = 0; i < starsCount; i++) {
        // Generate bintang dalam cangkang bola di luar model atom
        const r = 25 + Math.random() * 35;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        positions.push(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        );

        // Sedikit gradasi warna bintang (putih, biru muda, kekuningan)
        const rand = Math.random();
        if (rand > 0.8) {
            colors.push(0.7, 0.8, 1.0); // Biru muda
        } else if (rand > 0.6) {
            colors.push(1.0, 0.9, 0.7); // Kuning redup
        } else {
            colors.push(0.9, 0.9, 0.9); // Putih abu
        }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // Material partikel bintang kecil dan lembut
    const material = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    starfield = new THREE.Points(geometry, material);
    scene.add(starfield);
}

// Algoritma Kemasan Bola (Sphere Packing) untuk Nukleus
function generateNucleusPositions(count) {
    const positions = [];
    const nucleonRadius = 0.36; // Jari-jari bola proton/neutron
    const baseExpansion = 0.45;

    // Untuk 1 nukleon, posisi tepat di tengah
    if (count === 1) {
        positions.push(new THREE.Vector3(0, 0, 0));
        return positions;
    }

    for (let i = 0; i < count; i++) {
        let pos;
        let attempts = 0;
        
        // Coba tempatkan bola secara acak kemudian periksa tumpang tindih
        while (attempts < 300) {
            // Skala sebaran membesar seiring banyaknya nukleon
            const maxRadius = baseExpansion * Math.pow(count, 1/3) * nucleusDensity;
            const r = Math.random() * maxRadius;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            
            pos = new THREE.Vector3(
                r * Math.sin(phi) * Math.cos(theta),
                r * Math.sin(phi) * Math.sin(theta),
                r * Math.cos(phi)
            );
            
            // Periksa jarak dengan semua posisi yang telah diterima
            let overlap = false;
            for (let j = 0; j < positions.length; j++) {
                // Jarak minimum antar pusat bola = diameter bola nucleon
                if (pos.distanceTo(positions[j]) < nucleonRadius * 1.5) {
                    overlap = true;
                    break;
                }
            }
            
            if (!overlap || attempts > 250) {
                break;
            }
            attempts++;
        }
        positions.push(pos);
    }
    return positions;
}

// Membangun Model Atom 3D Berdasarkan Unsur yang Dipilih
function buildAtom(elKey) {
    const data = elementsData[elKey];
    if (!data) return;

    // 1. Bersihkan model lama
    clearAtom();

    // 2. Set Up Nukleus (Proton & Neutron)
    const numProtons = data.protons;
    const numNeutrons = data.neutrons;
    const totalNucleons = numProtons + numNeutrons;

    // Dapatkan posisi hasil pengepakan bola
    const nucleonPositions = generateNucleusPositions(totalNucleons);

    // Geometri bola nukleon yang halus
    const nucleonGeo = new THREE.SphereGeometry(0.36, 32, 32);

    // Material Proton (Mengkilap & Berpendar Pink/Red)
    const protonMat = new THREE.MeshPhongMaterial({
        color: PROTON_COLOR,
        emissive: PROTON_COLOR,
        emissiveIntensity: 0.15,
        shininess: 90,
        specular: 0xffffff
    });

    // Material Neutron (Mengkilap & Berpendar Cyan)
    const neutronMat = new THREE.MeshPhongMaterial({
        color: NEUTRON_COLOR,
        emissive: NEUTRON_COLOR,
        emissiveIntensity: 0.15,
        shininess: 90,
        specular: 0xffffff
    });

    // Masukkan proton dan neutron ke posisi secara berseling agar tercampur merata
    let protonsPlaced = 0;
    let neutronsPlaced = 0;

    for (let i = 0; i < totalNucleons; i++) {
        let isProton = true;
        
        if (protonsPlaced >= numProtons) {
            isProton = false;
        } else if (neutronsPlaced >= numNeutrons) {
            isProton = true;
        } else {
            // Campurkan proton dan neutron secara acak-berseling
            isProton = Math.random() > 0.5;
        }

        if (isProton) {
            protonsPlaced++;
        } else {
            neutronsPlaced++;
        }

        const mesh = new THREE.Mesh(nucleonGeo, isProton ? protonMat : neutronMat);
        mesh.position.copy(nucleonPositions[i]);
        nucleusGroup.add(mesh);

        nucleons.push({
            mesh: mesh,
            basePos: nucleonPositions[i].clone(),
            id: i
        });
    }

    // 3. Set Up Elektron dan Lintasan Orbit
    const shellsConfig = data.shells;
    const glowTex = createGlowTexture(GLOW_COLOR_HEX);

    // Geometri Elektron
    const electronGeo = new THREE.SphereGeometry(0.14, 24, 24);
    const electronMat = new THREE.MeshBasicMaterial({ color: ELECTRON_COLOR });

    let electronIndex = 0;

    // Iterasi melalui setiap kulit elektron
    shellsConfig.forEach((electronCount, shellIdx) => {
        const radius = SHELL_RADII[shellIdx];

        // Buat lintasan orbit dan elektronnya
        for (let e = 0; e < electronCount; e++) {
            // Untuk visualisasi atom yang ikonik, kita buat satu group untuk setiap elektron
            // yang memiringkan sumbu lintasan orbitnya secara unik
            const orbitPlaneGroup = new THREE.Group();
            
            // Inklinasi/Kemiringan 3D yang unik berdasarkan indeks elektron agar tersebar rata
            const angleX = (electronIndex * (Math.PI / 2.5)) + (shellIdx * 0.4);
            const angleY = (electronIndex * (Math.PI / 4.0));
            const angleZ = (electronIndex * (Math.PI / 6.0));
            orbitPlaneGroup.rotation.set(angleX, angleY, angleZ);
            
            electronsGroup.add(orbitPlaneGroup);

            // Buat Garis Orbit Melingkar
            const points = [];
            const segments = 120;
            for (let i = 0; i <= segments; i++) {
                const theta = (i / segments) * Math.PI * 2;
                points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
            }
            
            const orbitGeo = new THREE.BufferGeometry().setFromPoints(points);
            const orbitMat = new THREE.LineBasicMaterial({
                color: 0x4f46e5,
                transparent: true,
                opacity: 0.18,
                blending: THREE.AdditiveBlending
            });
            const orbitLine = new THREE.Line(orbitGeo, orbitMat);
            orbitLine.visible = showOrbits;
            orbitPlaneGroup.add(orbitLine);

            // Buat Mesh Elektron
            const electronMesh = new THREE.Mesh(electronGeo, electronMat);
            
            // Buat Efek Glow Sprite
            const spriteMat = new THREE.SpriteMaterial({
                map: glowTex,
                color: 0xffffff,
                transparent: true,
                opacity: 0.85,
                blending: THREE.AdditiveBlending
            });
            const glowSprite = new THREE.Sprite(spriteMat);
            glowSprite.scale.set(0.65, 0.65, 1);
            glowSprite.visible = showGlow;
            electronMesh.add(glowSprite);

            // Letakkan elektron awal pada orbitnya
            const initialAngle = (e / electronCount) * Math.PI * 2;
            electronMesh.position.set(
                Math.cos(initialAngle) * radius,
                0,
                Math.sin(initialAngle) * radius
            );
            orbitPlaneGroup.add(electronMesh);

            // Simpan referensi elektron untuk proses animasi
            electrons.push({
                mesh: electronMesh,
                orbitGroup: orbitPlaneGroup,
                radius: radius,
                angle: initialAngle,
                // Variasikan arah & kecepatan rotasi sedikit per kulit
                speed: (1.5 - (shellIdx * 0.35)) * (electronIndex % 2 === 0 ? 1 : -1)
            });

            electronIndex++;
        }
    });

    // 4. Update UI Panel Informasi
    updateInfoUI(data);

    // 5. Apply Skala Atom saat ini
    atomGroup.scale.setScalar(atomScale);
}

// Menghapus Objek Atom yang Ada di Scene
function clearAtom() {
    // Bersihkan Proton/Neutron
    nucleons.forEach(n => {
        n.mesh.geometry.dispose();
        if (Array.isArray(n.mesh.material)) {
            n.mesh.material.forEach(m => m.dispose());
        } else {
            n.mesh.material.dispose();
        }
        nucleusGroup.remove(n.mesh);
    });
    nucleons.length = 0;

    // Bersihkan Elektron & Orbit
    electrons.forEach(el => {
        // Hapus glow sprite
        const sprite = el.mesh.children[0];
        if (sprite) {
            sprite.material.dispose();
            el.mesh.remove(sprite);
        }
        
        el.mesh.geometry.dispose();
        el.mesh.material.dispose();
        
        // Hapus lintasan garis orbit
        const orbitLine = el.orbitGroup.children[0];
        if (orbitLine) {
            orbitLine.geometry.dispose();
            orbitLine.material.dispose();
            el.orbitGroup.remove(orbitLine);
        }

        el.orbitGroup.remove(el.mesh);
        electronsGroup.remove(el.orbitGroup);
    });
    electrons.length = 0;

    // Hapus sisa group anak dari group utama
    while (electronsGroup.children.length > 0) {
        electronsGroup.remove(electronsGroup.children[0]);
    }
}

// Memperbarui Konten UI Informasi Atom
function updateInfoUI(data) {
    document.getElementById('info-badge').textContent = data.badge;
    document.getElementById('info-name').textContent = data.name;
    document.getElementById('info-category').textContent = data.category;
    document.getElementById('info-number').textContent = data.number;
    document.getElementById('info-mass').textContent = data.mass.toFixed(4);
    document.getElementById('info-desc').textContent = data.desc;
    document.getElementById('info-protons').textContent = data.protons;
    document.getElementById('info-neutrons').textContent = data.neutrons;
    document.getElementById('info-electrons').textContent = data.protons; // Elektron = Proton (Atom Netral)
    document.getElementById('info-config').textContent = data.shells.join(', ');
}

// Animasi Loop Utama
function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    // 1. Putar Elektron di Orbit Masing-masing
    // Kecepatan diatur berdasarkan deltaTime dan nilai slider kecepatan
    const dt = 0.015 * animationSpeed;
    electrons.forEach(el => {
        el.angle += el.speed * dt;
        el.mesh.position.set(
            Math.cos(el.angle) * el.radius,
            0,
            Math.sin(el.angle) * el.radius
        );
    });

    // 2. Simulasi Getaran Inti Atom (Vibrasi Mekanika Kuantum)
    if (vibrateNucleus && nucleons.length > 0) {
        nucleons.forEach(n => {
            const freq = 22 + (n.id % 5); // Variasi frekuensi getar per nucleon
            const amp = 0.018 * nucleusDensity; // Amplitudo getaran
            n.mesh.position.set(
                n.basePos.x + Math.sin(time * freq + n.id) * amp,
                n.basePos.y + Math.cos(time * (freq + 2) + n.id) * amp,
                n.basePos.z + Math.sin(time * (freq - 1) + n.id) * amp
            );
        });
    }

    // 3. Rotasi Lambat Seluruh Atom dan Latar Belakang Bintang
    // Memberikan kesan ruang 3D yang aktif meski tidak disentuh
    if (starfield) {
        starfield.rotation.y = time * 0.008;
    }
    
    // Rotasi atom group sangat pelan untuk menunjukkan visualisasi 3D
    atomGroup.rotation.y = time * 0.04;
    atomGroup.rotation.x = Math.sin(time * 0.02) * 0.1;

    // 4. Update OrbitControls
    controls.update();

    // 5. Render Scene
    renderer.render(scene, camera);
}

// Menghubungkan Kontrol Panel dengan Logika Three.js
function bindUIEvents() {
    // 1. Selector Unsur
    const select = document.getElementById('element-select');
    select.addEventListener('change', (e) => {
        currentElement = e.target.value;
        buildAtom(currentElement);
        updateQuickButtonsActive(currentElement);
    });

    // 2. Tombol Cepat Pilihan Unsur
    const quickBtns = document.querySelectorAll('.quick-btn');
    quickBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentElement = e.target.getAttribute('data-val');
            select.value = currentElement;
            buildAtom(currentElement);
            updateQuickButtonsActive(currentElement);
        });
    });

    // Helper untuk sinkronisasi tombol aktif
    function updateQuickButtonsActive(val) {
        quickBtns.forEach(btn => {
            if (btn.getAttribute('data-val') === val) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // 3. Slider Kecepatan
    const speedSlider = document.getElementById('speed-slider');
    const speedVal = document.getElementById('speed-val');
    speedSlider.addEventListener('input', (e) => {
        animationSpeed = parseFloat(e.target.value);
        speedVal.textContent = `${animationSpeed.toFixed(1)}x`;
    });

    // 4. Slider Skala Atom
    const scaleSlider = document.getElementById('scale-slider');
    const scaleVal = document.getElementById('scale-val');
    scaleSlider.addEventListener('input', (e) => {
        atomScale = parseFloat(e.target.value);
        scaleVal.textContent = `${atomScale.toFixed(1)}x`;
        atomGroup.scale.setScalar(atomScale);
    });

    // 5. Slider Kepadatan Inti
    const densitySlider = document.getElementById('nucleus-density');
    const densityVal = document.getElementById('density-val');
    densitySlider.addEventListener('input', (e) => {
        nucleusDensity = parseFloat(e.target.value);
        densityVal.textContent = `${nucleusDensity.toFixed(1)}x`;
        // Bangun kembali nukleus dengan kepadatan baru
        buildAtom(currentElement);
    });

    // 6. Toggle Orbit
    const toggleOrbitsCheckbox = document.getElementById('toggle-orbits');
    toggleOrbitsCheckbox.addEventListener('change', (e) => {
        showOrbits = e.target.checked;
        electrons.forEach(el => {
            const orbitLine = el.orbitGroup.children[0];
            if (orbitLine) orbitLine.visible = showOrbits;
        });
    });

    // 7. Toggle Glow
    const toggleGlowCheckbox = document.getElementById('toggle-glow');
    toggleGlowCheckbox.addEventListener('change', (e) => {
        showGlow = e.target.checked;
        electrons.forEach(el => {
            const glowSprite = el.mesh.children[0];
            if (glowSprite) glowSprite.visible = showGlow;
        });
    });

    // 8. Toggle Getaran Inti
    const toggleVibrateCheckbox = document.getElementById('toggle-vibrate');
    toggleVibrateCheckbox.addEventListener('change', (e) => {
        vibrateNucleus = e.target.checked;
    });

    // 9. Tombol Reset Sudut Pandang
    const resetBtn = document.getElementById('reset-btn');
    resetBtn.addEventListener('click', () => {
        // Kembalikan posisi kamera dan target kontrol
        camera.position.set(8, 6, 12);
        controls.target.set(0, 0, 0);
        controls.update();
        
        // Reset rotasi group ke 0 agar stabil
        atomGroup.rotation.set(0, 0, 0);
    });

    // 10. Toggle Sembunyikan/Tampilkan UI (Floating Button & Keyboard 'H')
    const uiToggleBtn = document.getElementById('ui-toggle-btn');
    const uiWrapper = document.querySelector('.ui-wrapper');
    const tooltip = document.querySelector('.instructions-tooltip');
    
    function toggleUI() {
        const isHidden = uiWrapper.classList.toggle('ui-hidden');
        if (tooltip) tooltip.classList.toggle('ui-hidden');
        
        // Ubah ikon tombol
        const icon = uiToggleBtn.querySelector('i');
        if (isHidden) {
            icon.className = 'fa-solid fa-eye';
            uiToggleBtn.setAttribute('title', "Tampilkan UI (Tekan 'H')");
        } else {
            icon.className = 'fa-solid fa-eye-slash';
            uiToggleBtn.setAttribute('title', "Sembunyikan UI (Tekan 'H')");
        }
    }
    
    if (uiToggleBtn && uiWrapper) {
        uiToggleBtn.addEventListener('click', toggleUI);
        
        // Bind tombol keyboard H
        window.addEventListener('keydown', (e) => {
            // Hindari memicu shortcut saat mengetik di input jika ada
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') {
                return;
            }
            if (e.key.toLowerCase() === 'h') {
                toggleUI();
            }
        });
    }
}

// Menyesuaikan Kamera dan Renderer saat Layar Berubah Ukuran
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Mulai aplikasi saat DOM selesai dimuat
window.addEventListener('DOMContentLoaded', init);
