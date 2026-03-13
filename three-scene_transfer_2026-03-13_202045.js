/* ============================================
   MEGA DIGITAL STUDIO - THREE.JS SCENE
   3D Camera Lens Animation
   ============================================ */

class ThreeScene {
    constructor() {
        this.canvas = document.getElementById('hero-canvas');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.lensGroup = null;
        this.targetRotationX = 0;
        this.targetRotationY = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        if (!this.canvas || typeof THREE === 'undefined') {
            console.warn('Three.js or canvas not available');
            return;
        }
        
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createLens();
        this.createLights();
        this.addEventListeners();
        this.animate();
        
        this.isInitialized = true;
    }
    
    createScene() {
        this.scene = new THREE.Scene();
    }
    
    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;
    }
    
    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
    }
    
    createLens() {
        this.lensGroup = new THREE.Group();
        
        // Outer Ring
        const outerGeometry = new THREE.TorusGeometry(1.3, 0.15, 32, 100);
        const outerMaterial = new THREE.MeshStandardMaterial({
            color: 0x111111,
            metalness: 0.95,
            roughness: 0.05,
            emissive: 0xD4AF37,
            emissiveIntensity: 0.08
        });
        const outerRing = new THREE.Mesh(outerGeometry, outerMaterial);
        this.lensGroup.add(outerRing);
        
        // Middle Ring
        const middleGeometry = new THREE.TorusGeometry(1.0, 0.12, 32, 80);
        const middleMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            metalness: 0.9,
            roughness: 0.1
        });
        const middleRing = new THREE.Mesh(middleGeometry, middleMaterial);
        this.lensGroup.add(middleRing);
        
        // Inner Ring
        const innerGeometry = new THREE.TorusGeometry(0.7, 0.08, 32, 60);
        const innerMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a,
            metalness: 0.95,
            roughness: 0.05
        });
        const innerRing = new THREE.Mesh(innerGeometry, innerMaterial);
        this.lensGroup.add(innerRing);
        
        // Lens Body (Cylinder)
        const bodyGeometry = new THREE.CylinderGeometry(0.85, 0.85, 0.3, 64);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a,
            metalness: 0.98,
            roughness: 0.02
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.x = Math.PI / 2;
        this.lensGroup.add(body);
        
        // Glass Lens
        const glassGeometry = new THREE.CircleGeometry(0.65, 64);
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x1a1a2e,
            metalness: 0.1,
            roughness: 0,
            transmission: 0.9,
            thickness: 0.5,
            transparent: true,
            opacity: 0.85,
            reflectivity: 0.9
        });
        const glass = new THREE.Mesh(glassGeometry, glassMaterial);
        glass.position.z = 0.16;
        this.lensGroup.add(glass);
        
        // Back Glass
        const backGlassGeometry = new THREE.CircleGeometry(0.65, 64);
        const backGlass = new THREE.Mesh(backGlassGeometry, glassMaterial);
        backGlass.position.z = -0.16;
        backGlass.rotation.y = Math.PI;
        this.lensGroup.add(backGlass);
        
        // Center Dot (Gold)
        const dotGeometry = new THREE.CircleGeometry(0.12, 32);
        const dotMaterial = new THREE.MeshBasicMaterial({
            color: 0xD4AF37,
            transparent: true,
            opacity: 0.9
        });
        const dot = new THREE.Mesh(dotGeometry, dotMaterial);
        dot.position.z = 0.17;
        this.lensGroup.add(dot);
        
        // Aperture Blades (Decorative)
        this.createApertureBlades();
        
        // Gold Ring Accent
        const goldRingGeometry = new THREE.TorusGeometry(1.15, 0.02, 16, 100);
        const goldRingMaterial = new THREE.MeshStandardMaterial({
            color: 0xD4AF37,
            metalness: 1,
            roughness: 0.2,
            emissive: 0xD4AF37,
            emissiveIntensity: 0.3
        });
        const goldRing = new THREE.Mesh(goldRingGeometry, goldRingMaterial);
        this.lensGroup.add(goldRing);
        
        this.scene.add(this.lensGroup);
    }
    
    createApertureBlades() {
        const bladeCount = 8;
        const bladeGroup = new THREE.Group();
        
        for (let i = 0; i < bladeCount; i++) {
            const angle = (i / bladeCount) * Math.PI * 2;
            
            const bladeGeometry = new THREE.PlaneGeometry(0.3, 0.08);
            const bladeMaterial = new THREE.MeshBasicMaterial({
                color: 0x1a1a1a,
                side: THREE.DoubleSide
            });
            const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
            
            blade.position.x = Math.cos(angle) * 0.4;
            blade.position.y = Math.sin(angle) * 0.4;
            blade.position.z = 0.14;
            blade.rotation.z = angle;
            
            bladeGroup.add(blade);
        }
        
        this.lensGroup.add(bladeGroup);
    }
    
    createLights() {
        // Ambient Light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        
        // Gold Point Light (Main)
        const pointLight1 = new THREE.PointLight(0xD4AF37, 1.5, 100);
        pointLight1.position.set(5, 5, 5);
        this.scene.add(pointLight1);
        
        // White Point Light (Fill)
        const pointLight2 = new THREE.PointLight(0xffffff, 0.8, 100);
        pointLight2.position.set(-5, -5, 5);
        this.scene.add(pointLight2);
        
        // Gold Rim Light
        const pointLight3 = new THREE.PointLight(0xD4AF37, 0.5, 100);
        pointLight3.position.set(0, 5, -5);
        this.scene.add(pointLight3);
        
        // Bottom Fill
        const pointLight4 = new THREE.PointLight(0xffffff, 0.3, 100);
        pointLight4.position.set(0, -5, 3);
        this.scene.add(pointLight4);
    }
    
    addEventListeners() {
        // Mouse Move
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            this.targetRotationY = (e.clientX - window.innerWidth / 2) * 0.0008;
            this.targetRotationX = (e.clientY - window.innerHeight / 2) * 0.0008;
        });
        
        // Resize
        window.addEventListener('resize', () => this.onResize());
        
        // Touch Move for Mobile
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.targetRotationY = (e.touches[0].clientX - window.innerWidth / 2) * 0.0008;
                this.targetRotationX = (e.touches[0].clientY - window.innerHeight / 2) * 0.0008;
            }
        }, { passive: true });
    }
    
    onResize() {
        if (!this.camera || !this.renderer) return;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        if (!this.isInitialized) return;
        
        requestAnimationFrame(() => this.animate());
        
        if (this.lensGroup) {
            // Smooth rotation following mouse
            this.lensGroup.rotation.x += (this.targetRotationX - this.lensGroup.rotation.x) * 0.05;
            this.lensGroup.rotation.y += (this.targetRotationY - this.lensGroup.rotation.y) * 0.05;
            
            // Continuous slow rotation
            this.lensGroup.rotation.z += 0.002;
            
            // Subtle floating animation
            this.lensGroup.position.y = Math.sin(Date.now() * 0.001) * 0.1;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    // Public method to update lens position based on scroll
    updateOnScroll(scrollProgress) {
        if (!this.lensGroup) return;
        
        // Move lens back as user scrolls
        this.lensGroup.position.z = -scrollProgress * 5;
        this.lensGroup.rotation.x = scrollProgress * 0.5;
    }
    
    // Destroy method for cleanup
    destroy() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        this.isInitialized = false;
    }
}

// Initialize Three.js Scene
let threeScene = null;

function initThreeScene() {
    threeScene = new ThreeScene();
}

// Export for use in main.js
window.initThreeScene = initThreeScene;
window.threeScene = threeScene;