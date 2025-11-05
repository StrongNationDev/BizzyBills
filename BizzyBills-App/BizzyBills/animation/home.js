document.querySelectorAll('.add-money, .contact-us, .service-card').forEach(el => {
    el.addEventListener('click', function (e) {
        e.preventDefault();

        const targetUrl = this.closest('a').getAttribute('data-target');

        document.body.classList.add('page-exit');

        setTimeout(() => {
          window.location.href = targetUrl;
        }, 600);
      });
    });
    

// balance-blur.js
document.addEventListener("DOMContentLoaded", function () {
  const balanceElement = document.getElementById("balance-amount");

  // Get saved state from localStorage
  let isBlurred = localStorage.getItem("balanceBlurred");

  // If no saved state, default to blurred
  if (isBlurred === null) {
    isBlurred = "true";
    localStorage.setItem("balanceBlurred", "true");
  }

  // Apply initial blur state
  updateBlurState(isBlurred === "true");

  // Click to toggle
  balanceElement.addEventListener("click", function () {
    isBlurred = (isBlurred === "true") ? "false" : "true";
    localStorage.setItem("balanceBlurred", isBlurred);
    updateBlurState(isBlurred === "true");
  });

  function updateBlurState(blur) {
    if (blur) {
      balanceElement.classList.add("blurred");
      balanceElement.classList.remove("unblurred");
    } else {
      balanceElement.classList.remove("blurred");
      balanceElement.classList.add("unblurred");
    }
  }
});


