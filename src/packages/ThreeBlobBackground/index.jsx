import './bg.css'
import { useEffect, useRef } from 'react';
import * as THREE from "three"
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';



const ThreeBlobBackground = () => {
    const containerRef = useRef(null);
    useEffect(() => {
        // Vertex Shader
        const vertexShader = `
      varying vec2 vUv;
      void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `;

        // Fragment Shader
        const fragmentShader = `
      uniform sampler2D baseTexture;
      uniform sampler2D bloomTexture;
      varying vec2 vUv;
      void main() {
          gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
      }
    `;

        const BLOOM_SCENE = 1;
        const bloomLayer = new THREE.Layers();
        bloomLayer.set(BLOOM_SCENE);

        const params = {
            bloomStrength: 0.5,
            bloomThreshold: 0,
            bloomRadius: 0.2
        };

        const darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' });
        const materials = {};

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.ReinhardToneMapping;

        containerRef.current.appendChild(renderer.domElement); // Append to the container


        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.y = 5;
        camera.position.z = 15;
        camera.position.x = -25
        camera.lookAt(-25, -15, -10);

        const numPoints = 12;
        const minRadius = 4;
        const maxRadius = 6;

        // Initialize radii arrays and directions for each tower
        const towers = [
            {
                xOffset: 0, yOffset: 5, zOffset: -8, blobs: [], color: 0xff0000,
                randomRadii: Array(numPoints).fill().map(() => getRndFloat(minRadius, maxRadius)),
                directions: Array(numPoints).fill().map((_, i) => (i % 2 === 0 ? 1 : -1))
            },
            {
                xOffset: -6, yOffset: 0, zOffset: 0, blobs: [], color: 0xbf05f7,
                randomRadii: Array(numPoints).fill().map(() => getRndFloat(minRadius, maxRadius)),
                directions: Array(numPoints).fill().map((_, i) => (i % 2 === 0 ? 1 : -1))
            },
            {
                xOffset: 6, yOffset: -5, zOffset: 0, blobs: [], color: 0x0000ff,
                randomRadii: Array(numPoints).fill().map(() => getRndFloat(minRadius, maxRadius)),
                directions: Array(numPoints).fill().map((_, i) => (i % 2 === 0 ? 1 : -1))
            }
        ];

        function getRndFloat(min, max) {
            return Math.random() * (max - min) + min;
        }

        // Function to update radii values for bulging effect
        function updateValues(tower) {
            if (!tower.randomRadii || !tower.directions) {
                console.error("randomRadii or directions is undefined for tower:", tower);
                return; // Stop if undefined
            }

            for (let i = 0; i < tower.randomRadii.length; i++) {
                tower.randomRadii[i] += tower.directions[i] * 0.15;
                if (tower.randomRadii[i] >= maxRadius) {
                    tower.randomRadii[i] = maxRadius;
                    tower.directions[i] = -1;
                } else if (tower.randomRadii[i] <= minRadius) {
                    tower.randomRadii[i] = minRadius;
                    tower.directions[i] = 1;
                }
            }
        }

        // Create blob for a specific tower
        function createBlob(yPosition, tower) {
            updateValues(tower);
            const points = [];
            for (let i = 0; i < numPoints; i++) {
                const angle = (i / numPoints) * Math.PI * 2;
                const x = Math.cos(angle) * tower.randomRadii[i];
                const z = Math.sin(angle) * tower.randomRadii[i];
                points.push(new THREE.Vector3(x, 0, z));
            }

            const curve = new THREE.CatmullRomCurve3(points, true);
            const splinePoints = curve.getPoints(100);
            const shapePoints = splinePoints.map((point) => new THREE.Vector2(point.x, point.z));
            const blobShape = new THREE.Shape(shapePoints);

            const geometry = new THREE.ShapeGeometry(blobShape);
            const edges = new THREE.EdgesGeometry(geometry);
            const lineMaterial = new THREE.LineBasicMaterial({ color: tower.color });
            const line = new THREE.LineSegments(edges, lineMaterial);

            line.rotation.x = -Math.PI / 2;
            line.position.set(tower.xOffset, yPosition + tower.yOffset, tower.zOffset);
            scene.add(line);
            tower.blobs.push(line);
        }

        // Create initial blobs for each tower
        towers.forEach(tower => {
            for (let i = -79; i < 1; i++) {
                createBlob(i, tower);
            }
        });

        const renderScene = new RenderPass(scene, camera);
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), params.bloomStrength, params.bloomRadius, params.bloomThreshold);

        const bloomComposer = new EffectComposer(renderer);
        bloomComposer.renderToScreen = false;
        bloomComposer.addPass(renderScene);
        bloomComposer.addPass(bloomPass);

        const finalPass = new ShaderPass(
            new THREE.ShaderMaterial({
                uniforms: {
                    baseTexture: { value: null },
                    bloomTexture: { value: bloomComposer.renderTarget2.texture }
                },
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                defines: {}
            }), 'baseTexture'
        );
        finalPass.needsSwap = true;

        const finalComposer = new EffectComposer(renderer);
        finalComposer.addPass(renderScene);
        finalComposer.addPass(finalPass);
        finalComposer.addPass(new OutputPass());

        function animate() {
            requestAnimationFrame(animate);
            towers.forEach(tower => {
                tower.blobs.forEach(blob => blob.position.y -= 0.1);
                if (tower.blobs[0] && tower.blobs[0].position.y < -80 + tower.yOffset) {
                    const removedBlob = tower.blobs.shift();
                    scene.remove(removedBlob);
                    createBlob(0, tower);
                }
            });
            render();
        }

        function render() {
            scene.traverse(darkenNonBloomed);
            bloomComposer.render();
            scene.traverse(restoreMaterial);
            finalComposer.render();
        }

        function darkenNonBloomed(obj) {
            if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
                materials[obj.uuid] = obj.material;
                obj.material = darkMaterial;
            }
        }

        function restoreMaterial(obj) {
            if (materials[obj.uuid]) {
                obj.material = materials[obj.uuid];
            }
        }

        window.addEventListener('resize', onWindowResize, false);

        function onWindowResize() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            bloomComposer.setSize(width, height);
            finalComposer.setSize(width, height);
        }

        animate();

        return () => {
            renderer.dispose(); // Cleanup when component unmounts
        };
    }, []);

    useEffect(() => {
        if (containerRef.current.children.length === 0) {
            containerRef.current.appendChild(renderer.domElement);
        }
    }, []);

    return <div ref={containerRef} id="three-container"></div>;
};

export default ThreeBlobBackground;
