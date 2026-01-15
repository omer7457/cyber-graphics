// Run after DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  setCurrentYear();
  enableSmoothScroll();
});

/**
 * Set current year in footer span with id="year"
 */
function setCurrentYear() {
  var yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

/**
 * Enable smooth scrolling for navigation links
 * that point to sections on the same page
 */
function enableSmoothScroll() {
  var navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");

      // Ignore if just "#"
      if (!targetId || targetId === "#") return;

      var targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });
}

/**
 * Form submit handler. Sends enquiry details to WhatsApp.
 * Called from HTML: onsubmit="return sendToWhatsApp(event);"
 */
function sendToWhatsApp(event) {
  if (event) event.preventDefault();

  var nameInput = document.getElementById("name");
  var phoneInput = document.getElementById("phone");
  var serviceInput = document.getElementById("service");
  var messageInput = document.getElementById("message");

  var name = nameInput ? nameInput.value.trim() : "";
  var phone = phoneInput ? phoneInput.value.trim() : "";
  var service = serviceInput ? serviceInput.value.trim() : "";
  var message = messageInput ? messageInput.value.trim() : "";

  if (!name || !phone || !service) {
    alert("Please fill Name, Mobile Number and Service Required.");
    return false;
  }

  // Build WhatsApp text
  var text =
    "New enquiry from website:%0A%0A" +
    "Name: " + encodeURIComponent(name) + "%0A" +
    "Mobile: " + encodeURIComponent(phone) + "%0A" +
    "Service Required: " + encodeURIComponent(service) + "%0A" +
    "Details: " + encodeURIComponent(message || "N/A");

  // Your WhatsApp number (with country code, no +)
  // Example: 918884537740 for +91 88845 37740
  var whatsappNumber = "918884537740";

  var url = "https://wa.me/" + whatsappNumber + "?text=" + text;

  // Open WhatsApp chat in new tab
  window.open(url, "_blank");

  return false;
<script>
  // ---------- YEAR IN FOOTER ----------
  document.getElementById("year").textContent = new Date().getFullYear();

  // ---------- TOAST ----------
  function showToast(message) {
    var toast = document.getElementById("toast");
    if (!toast) return;
    if (message) toast.textContent = message;
    toast.classList.add("show");
    setTimeout(function () {
      toast.classList.remove("show");
    }, 3500);
  }

  // ---------- WHATSAPP FORM SUBMIT (same as before) ----------
  function sendToWhatsApp(event) {
    if (event) event.preventDefault();
    var name = document.getElementById("name").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var service = document.getElementById("service").value.trim();
    var message = document.getElementById("message").value.trim();

    if (!name || !phone || !service) {
      alert("Please fill Name, Mobile Number and Service Required.");
      return false;
    }

    var text =
      "New enquiry from website:%0A%0A" +
      "Name: " + encodeURIComponent(name) + "%0A" +
      "Mobile: " + encodeURIComponent(phone) + "%0A" +
      "Service Required: " + encodeURIComponent(service) + "%0A" +
      "Details: " + encodeURIComponent(message || "N/A");

    var url = "https://wa.me/918884537740?text=" + text;
    window.open(url, "_blank");

    showToast("Enquiry opened in WhatsApp.");
    return false;
  }

  // ---------- NEW: SUBMIT ENQUIRY TO BACKEND + THEN WHATSAPP ----------
  function submitEnquiry(event) {
    event.preventDefault();

    var form = document.getElementById("enquiryForm");
    var formData = new FormData(form);

    // Save to backend
    fetch("save_enquiry.php", {
      method: "POST",
      body: formData
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          // After saving, also send to WhatsApp (for your convenience)
          sendToWhatsApp();
        } else {
          alert("Error saving enquiry: " + (data.error || "Unknown error"));
        }
      })
      .catch(function () {
        alert("Server error. Please check your backend (save_enquiry.php).");
      });

    return false;
  }

  // ---------- NEW: SERVER TOKEN GENERATION ----------
  function requestToken() {
    fetch("get_token.php")
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          var tokenEl = document.getElementById("tokenNumber");
          var msgEl = document.getElementById("tokenMessage");
          if (tokenEl && msgEl) {
            tokenEl.textContent = data.token;
            msgEl.textContent = "Please visit the shop and show this token number at the counter.";
          }
          showToast("Your token number is " + data.token + ".");
        } else {
          alert("Error creating token: " + (data.error || "Unknown error"));
        }
      })
      .catch(function () {
        alert("Server error. Please check your backend (get_token.php).");
      });
  }

  // ---------- SCROLL REVEAL ----------
  (function setupReveal() {
    var revealElements = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      revealElements.forEach(function (el) {
        el.classList.add("visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  })();

  // ---------- ACTIVE NAV LINK ON SCROLL ----------
  (function setupActiveNav() {
    var sections = document.querySelectorAll("main section[id]");
    var navLinks = document.querySelectorAll(".nav-link");

    function setActiveLink() {
      var scrollPos = window.pageYOffset || document.documentElement.scrollTop;
      var currentId = "home";

      sections.forEach(function (section) {
        var rect = section.getBoundingClientRect();
        var offsetTop = rect.top + window.pageYOffset - 120;
        if (scrollPos >= offsetTop) {
          currentId = section.id;
        }
      });

      navLinks.forEach(function (link) {
        if (link.getAttribute("href") === "#" + currentId) {
          link.classList.add("active-link");
        } else if (currentId === "home" && link.getAttribute("href") === "#home") {
          link.classList.add("active-link");
        } else {
          link.classList.remove("active-link");
        }
      });
    }

    window.addEventListener("scroll", setActiveLink);
    setActiveLink();
  })();
</script>




}

