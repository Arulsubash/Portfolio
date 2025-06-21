
// Portfolio JavaScript - All interactions and animations

class PortfolioApp {
  constructor() {
    this.currentSection = 0;
    this.sections = document.querySelectorAll('.section');
    this.scrollDots = document.querySelectorAll('.scroll-dot');
    this.isScrolling = false;
    
    this.init();
  }

  init() {
    this.setupCustomCursor();
    this.setupParticles();
    this.setup3DSkills();
    this.setupScrollEffects();
    this.setupNavigation();
    this.setupAnimations();
    this.setupFormHandler();
    this.setupIntersectionObserver();
  }

  // Custom Cursor
  setupCustomCursor() {
    if (window.innerWidth <= 768) return;
    
    const cursor = document.querySelector('.cursor');
    const cursorTrail = document.querySelector('.cursor-trail');
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      cursor.style.left = mouseX - 10 + 'px';
      cursor.style.top = mouseY - 10 + 'px';
    });

    // Smooth trail animation
    const animateTrail = () => {
      trailX += (mouseX - trailX) * 0.1;
      trailY += (mouseY - trailY) * 0.1;
      
      cursorTrail.style.left = trailX - 3 + 'px';
      cursorTrail.style.top = trailY - 3 + 'px';
      
      requestAnimationFrame(animateTrail);
    };
    animateTrail();

    // Cursor interactions
    document.querySelectorAll('a, button, .project-card, .skill-item').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursor.style.background = 'radial-gradient(circle, #00bcd4, #64ffda)';
      });
      
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.background = 'radial-gradient(circle, #64ffda, #00bcd4)';
      });
    });
  }

  // Particle Background
  setupParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = window.innerWidth > 768 ? 100 : 50;
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 255, 218, ${this.opacity})`;
        ctx.fill();
      }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      // Draw connections
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
          const distance = Math.sqrt(
            Math.pow(particle.x - otherParticle.x, 2) + 
            Math.pow(particle.y - otherParticle.y, 2)
          );
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(100, 255, 218, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
    
    // Mouse interaction
    canvas.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      particles.forEach(particle => {
        const distance = Math.sqrt(
          Math.pow(particle.x - mouseX, 2) + 
          Math.pow(particle.y - mouseY, 2)
        );
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          particle.vx += (particle.x - mouseX) * force * 0.001;
          particle.vy += (particle.y - mouseY) * force * 0.001;
        }
      });
    });
  }

  // 3D Skills Animation
  setup3DSkills() {
    if (window.innerWidth <= 768) return;
    
    const container = document.getElementById('skills3d');
    if (!container) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Create skill icons as 3D objects
    const skills = [
      { name: 'React', position: [2, 1, 0], color: 0x61dafb },
      { name: 'Node.js', position: [-2, 1, 0], color: 0x339933 },
      { name: 'Python', position: [0, 2, 1], color: 0x3776ab },
      { name: 'MongoDB', position: [1, -1, 1], color: 0x47a248 },
      { name: 'JavaScript', position: [-1, -1, 1], color: 0xf7df1e },
      { name: 'TypeScript', position: [0, 0, -2], color: 0x007acc }
    ];
    
    const skillMeshes = [];
    
    skills.forEach(skill => {
      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const material = new THREE.MeshPhongMaterial({ 
        color: skill.color,
        transparent: true,
        opacity: 0.8
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...skill.position);
      mesh.userData = { name: skill.name };
      
      scene.add(mesh);
      skillMeshes.push(mesh);
    });
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x64ffda, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    camera.position.z = 5;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      skillMeshes.forEach((mesh, index) => {
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
        
        // Floating animation
        mesh.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    container.addEventListener('mousemove', (event) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(skillMeshes);
      
      skillMeshes.forEach(mesh => {
        mesh.scale.setScalar(1);
        mesh.material.opacity = 0.8;
      });
      
      if (intersects.length > 0) {
        const intersected = intersects[0].object;
        intersected.scale.setScalar(1.2);
        intersected.material.opacity = 1;
      }
    });
  }

  // Scroll Effects and Section Management
  setupScrollEffects() {
    let ticking = false;
    
    const updateScrollIndicator = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      
      this.sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollTop >= sectionTop - windowHeight / 2 && 
            scrollTop < sectionTop + sectionHeight - windowHeight / 2) {
          this.currentSection = index;
          
          this.scrollDots.forEach((dot, dotIndex) => {
            dot.classList.toggle('active', dotIndex === index);
          });
        }
      });
    };
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollIndicator();
          this.handleNavbarBackground();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Scroll dot navigation
    this.scrollDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        const targetSection = this.sections[index];
        targetSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      });
    });
  }

  // Navigation
  setupNavigation() {
    const nav = document.querySelector('.nav');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  handleNavbarBackground() {
    const nav = document.querySelector('.nav');
    const scrollTop = window.pageYOffset;
    
    if (scrollTop > 100) {
      nav.style.background = 'rgba(10, 10, 10, 0.95)';
      nav.style.backdropFilter = 'blur(10px)';
    } else {
      nav.style.background = 'transparent';
      nav.style.backdropFilter = 'none';
    }
  }

  // Intersection Observer for Animations
  setupIntersectionObserver() {
    const animateElements = document.querySelectorAll('.project-card, .skill-item, .profile-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationDelay = Math.random() * 0.5 + 's';
          entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(el => observer.observe(el));
  }

  // General Animations
  setupAnimations() {
    // Typing animation for hero text
    this.typeWriter();
    
    // Parallax effects
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.float');
      
      parallaxElements.forEach(el => {
        const speed = 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
      });
    });
    
    // Hover effects for project cards
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
      });
    });
  }

  typeWriter() {
    const texts = [
      'Full Stack Developer',
      'UI/UX Enthusiast', 
      'Problem Solver',
      'Tech Innovator'
    ];
    
    const heroTitle = document.querySelector('.hero h1');
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const type = () => {
      const currentText = texts[textIndex];
      
      if (isDeleting) {
        heroTitle.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        heroTitle.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
      }
      
      let typeSpeed = isDeleting ? 50 : 100;
      
      if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500;
      }
      
      setTimeout(type, typeSpeed);
    };
    
    // Start typing animation after page load
    setTimeout(type, 1000);
  }

  // Form Handler
  setupFormHandler() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const name = formData.get('name');
      const email = formData.get('email');
      const message = formData.get('message');
      
      // Create mailto link
      const subject = `Portfolio Contact from ${name}`;
      const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
      const mailtoLink = `mailto:contact@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Open mail client
      window.location.href = mailtoLink;
      
      // Show success message
      this.showNotification('Message prepared! Your email client should open.', 'success');
      
      // Reset form
      form.reset();
    });
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: ${type === 'success' ? '#64ffda' : '#ff6b6b'};
      color: #0a0a0a;
      padding: 1rem 2rem;
      border-radius: 10px;
      font-weight: 600;
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});

// Loading animation
window.addEventListener('load', () => {
  const loader = document.createElement('div');
  loader.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #0a0a0a;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      transition: opacity 0.5s ease;
    ">
      <div style="
        width: 50px;
        height: 50px;
        border: 3px solid rgba(100, 255, 218, 0.3);
        border-top: 3px solid #64ffda;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      "></div>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
  
  document.body.appendChild(loader);
  
  setTimeout(() => {
    loader.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(loader);
    }, 500);
  }, 1500);
});

// Performance optimization
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    // Preload critical resources
    const criticalImages = document.querySelectorAll('img[data-src]');
    criticalImages.forEach(img => {
      img.src = img.dataset.src;
    });
  });
}

// Service Worker registration for PWA features
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
