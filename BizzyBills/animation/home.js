document.querySelectorAll('.add-money, .contact-us, .service-card').forEach(el => {
    el.addEventListener('click', function (e) {
        e.preventDefault();

        const targetUrl = this.closest('a').getAttribute('data-target');

        // Trigger exit animation
        document.body.classList.add('page-exit');

        // Delay navigation until after animation
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 600);
      });
    });
    

{/* Function for balance blurring */}
const toggleBtn = document.getElementById("toggle-visibility");
const balanceText = document.getElementById("balance-amount");

  let isBlurred = false;

  toggleBtn.addEventListener("click", () => {
    isBlurred = !isBlurred;
    balanceText.classList.toggle("blurred", isBlurred);

    toggleBtn.src = isBlurred ? "icons/eye.png" : "icons/eye.png";
  });