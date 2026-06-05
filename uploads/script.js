// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  // 1. Navbar Glassmorphism on Scroll
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // 2. Hero Section Entrance Animation
  gsap.to(".hero .fade-up", {
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.15,
    ease: "power3.out",
    delay: 0.1
  });

  // 3. Glass Dashboard Parallax & Float
  gsap.fromTo(".glass-dashboard", 
    { y: 40, opacity: 0, rotateX: 10 },
    { 
      y: 0, 
      opacity: 1, 
      rotateX: 0, 
      duration: 1.2, 
      ease: "power3.out",
      delay: 0.6 
    }
  );

  // Subtle floating effect for the dashboard
  gsap.to(".glass-dashboard", {
    y: "-15px",
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: 1.8
  });

  // 4. Bento Box Reveal Animations
  const bentoCards = gsap.utils.toArray(".bento-card");
  
  bentoCards.forEach((card, i) => {
    gsap.fromTo(card, 
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%", // Triggers when top of card is 85% down viewport
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // 5. Generic Fade-Up for all other elements on scroll
  const fadeElements = gsap.utils.toArray("body > main > section:not(.hero) .fade-up, section.logo-cloud .fade-up");
  
  // also get root level fade-ups
  const allFadeUps = gsap.utils.toArray(".fade-up:not(.hero .fade-up)");

  allFadeUps.forEach((elem) => {
    gsap.fromTo(elem,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: elem,
          start: "top 85%", // Triggers when top of element is 85% down viewport
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // 6. CTA Box Parallax
  gsap.fromTo(".cta-box",
    { scale: 0.95, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".cta-section",
        start: "top 75%",
        toggleActions: "play none none reverse"
      }
    }
  );
});
