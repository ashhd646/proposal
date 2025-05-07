document.addEventListener('DOMContentLoaded', () => {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const celebration = document.getElementById('celebration');
    const fireworks = document.querySelector('.fireworks');

    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    const container = document.getElementById('scene-container');
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Create lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 5);
    scene.add(directionalLight);

    // Create ground
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8B4513,  // Saddle brown color for ground
        roughness: 0.9,
        metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    scene.add(ground);

    // Create boy and girl (simplified as cylinders for now)
    const boyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
    const girlGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
    
    const boyMaterial = new THREE.MeshStandardMaterial({ color: 0x4B0082 }); // Indigo color
    const girlMaterial = new THREE.MeshStandardMaterial({ color: 0xFF69B4 }); // Hot pink color
    
    const boy = new THREE.Mesh(boyGeometry, boyMaterial);
    const girl = new THREE.Mesh(girlGeometry, girlMaterial);
    
    boy.position.set(-2, 0, 0);
    girl.position.set(2, 0, 0);
    
    scene.add(boy);
    scene.add(girl);

    // Position camera
    camera.position.z = 10;
    camera.position.y = 2;

    // Animation variables
    let isProposing = false;
    let proposalProgress = 0;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        if (isProposing) {
            proposalProgress += 0.01;
            
            // Boy kneels down
            boy.position.y = -1 + Math.sin(proposalProgress * Math.PI) * 1.5;
            boy.rotation.x = Math.sin(proposalProgress * Math.PI) * 0.5;
            
            // Girl's reaction
            girl.position.y = Math.sin(proposalProgress * Math.PI * 2) * 0.2;
            
            // Camera movement
            camera.position.x = Math.sin(proposalProgress * Math.PI) * 2;
            camera.lookAt(0, 0, 0);
        }

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Function to handle step transitions
    window.nextStep = function(currentStep) {
        document.getElementById(`step${currentStep}`).style.display = 'none';
        document.getElementById(`step${currentStep + 1}`).style.display = 'block';
        
        if (currentStep === 1) {
            playGuitarSound();
        } else if (currentStep === 2) {
            isProposing = true;
        }
    }

    // Make the "No" button run away
    noBtn.addEventListener('mouseover', () => {
        const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
        const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);
        noBtn.style.position = 'fixed';
        noBtn.style.left = `${x}px`;
        noBtn.style.top = `${y}px`;
    });

    // Handle "Yes" button click
    yesBtn.addEventListener('click', () => {
        celebration.style.display = 'flex';
        createFireworks();
        playCelebrationSound();
        playLoveSong();
        
        // Add celebration animation to 3D scene
        const celebrationGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const celebrationMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFD700,  // Gold color
            emissive: 0xFFD700,
            emissiveIntensity: 0.7
        });
        
        for (let i = 0; i < 50; i++) {
            const particle = new THREE.Mesh(celebrationGeometry, celebrationMaterial);
            particle.position.set(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            );
            scene.add(particle);
            
            // Animate particles
            gsap.to(particle.position, {
                y: particle.position.y + 5,
                duration: 2,
                ease: "power2.out",
                onComplete: () => {
                    scene.remove(particle);
                }
            });
        }
    });

    // Create fireworks animation
    function createFireworks() {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.className = 'firework';
                
                const startX = Math.random() * window.innerWidth;
                const startY = Math.random() * window.innerHeight;
                
                const colors = ['#FFD700', '#FF69B4', '#4B0082', '#FF4500', '#FF1493']; // Updated firework colors
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                const angle = Math.random() * Math.PI * 2;
                const distance = 100 + Math.random() * 200;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                
                firework.style.left = `${startX}px`;
                firework.style.top = `${startY}px`;
                firework.style.backgroundColor = color;
                firework.style.setProperty('--x', `${x}px`);
                firework.style.setProperty('--y', `${y}px`);
                
                fireworks.appendChild(firework);
                
                setTimeout(() => {
                    firework.remove();
                }, 1000);
            }, i * 100);
        }
    }   

    // Play Tere Liye song
    function playLoveSong() {
        try {
            const audio = new Audio();
            audio.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'; // Temporary song for testing
            audio.loop = true;
            audio.volume = 0.7;
            
            // Add event listeners for better error handling
            audio.addEventListener('canplaythrough', () => {
                audio.play().catch(error => {
                    console.error('Playback failed:', error);
                    // Try to play again with user interaction
                    document.addEventListener('click', () => {
                        audio.play().catch(e => console.error('Second attempt failed:', e));
                    }, { once: true });
                });
            });

            audio.addEventListener('error', (e) => {
                console.error('Audio loading error:', e);
                // Fallback to a different audio source if needed
            });

            // Load the audio
            audio.load();
        } catch (error) {
            console.error('Error setting up audio:', error);
        }
    }
}); 