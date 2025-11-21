// messages.js
(function() {
  // Load HTML for modal
  fetch('messages.html')
    .then(res => res.text())
    .then(html => {
      document.body.insertAdjacentHTML('beforeend', html);

      // Load CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'messages.css';
      document.head.appendChild(link);

      // Override alert
      const originalAlert = window.alert;
      window.alert = function(message) {
        showMessageModal(message);
      };

      // Modal functions
      function showMessageModal(message) {
        const modal = document.getElementById('custom-message-modal');
        const text = document.getElementById('message-text');
        const sound = document.getElementById('message-sound');

        if (text) text.textContent = message;
        if (modal) modal.style.display = 'flex';
        if (sound) {
          sound.currentTime = 0;
          sound.play().catch(() => {});
        }
      }

      // Close button
      document.addEventListener('click', function(e) {
        if (e.target.id === 'message-close' || e.target.id === 'custom-message-modal') {
          document.getElementById('custom-message-modal').style.display = 'none';
        }
      });
    });
})();

