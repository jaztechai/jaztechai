
document.addEventListener("DOMContentLoaded", () => {
   
  // === Page Enter Animation (overlay shrink) ===
  gsap.to("#page-transition", {
    duration: 0.8,
    scaleX: 0,
    transformOrigin: "right",
    ease: "power4.inOut",
    onComplete: () => {
      // Once overlay gone → run section animations
      animateSections();
    }
  });

  // === Page Leave Animation (overlay expand) ===
  document.querySelectorAll("a").forEach(link => {
    if (link.hostname === window.location.hostname) { // only internal links
      link.addEventListener("click", e => {
        e.preventDefault();
        const target = link.getAttribute("href");

        gsap.to("#page-transition", {
          duration: 0.8,
          scaleX: 1,
          transformOrigin: "left",
          ease: "power4.inOut",
          onComplete: () => {
            window.location.href = target;
          }
        });
      });
    }
  });

  // === Section Animations ===
  // === Section Animations ===
function animateSections() {
  // Hero Section (on load)
  
  

  // About Section
  gsap.from(".about-section .about-text", {
    scrollTrigger: {
      trigger: ".about-section",
      start: "top 80%",
      toggleActions: "play reverse play reverse" // ← triggers every scroll
    },
    duration: 1,
    x: -100,
    opacity: 0,
    ease: "power3.out"
  });
  gsap.from(".about-section .about-image", {
    scrollTrigger: {
      trigger: ".about-section",
      start: "top 80%",
      toggleActions: "play reverse play reverse"
    },
    duration: 1,
    x: 100,
    opacity: 0,
    ease: "power3.out"
  });

  // Services
  gsap.from(".service-card", {
    scrollTrigger: {
      trigger: ".services-section",
      start: "top 80%",
      toggleActions: "play reverse play reverse"
    },
    duration: 1,
    y: 10,
    opacity: 0,
    stagger: 0.3,
    ease: "power3.out",
   
  });

    gsap.from(".service-box", {
    scrollTrigger: {
      trigger: ".services-section",
      start: "top 80%",
      toggleActions: "play reverse play reverse"
    },
    duration: 1,
    y: 10,
    opacity: 0,
    stagger: 0.2,
    ease: "power3.out",
   
  });

  // Projects
 
  // Contact
  gsap.from(".contact-section h2, .contact-section p", {
    scrollTrigger: {
      trigger: ".contact-section",
      start: "top 80%",
      toggleActions: "play reverse play reverse"
    },
    duration: 1,
    y: 50,
    opacity: 0,
    stagger: 0.2,
    ease: "power3.out"
  });
  gsap.from(".contact-form, .contact-info-column", {
    scrollTrigger: {
      trigger: ".contact-section",
      start: "top 80%",
      toggleActions: "play reverse play reverse"
    },
    duration: 1,
    x: -100,
    opacity: 0,
    stagger: 0.3,
    ease: "power3.out"
  });
}

});

