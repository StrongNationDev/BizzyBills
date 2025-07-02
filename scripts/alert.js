export function showAlert(message, type = 'info') {
  const alertBox = document.createElement('div');
  alertBox.className = `custom-alert ${type}`;
  alertBox.textContent = message;

  document.body.appendChild(alertBox);

  setTimeout(() => {
    alertBox.classList.add('fade-out');
    alertBox.addEventListener('transitionend', () => {
      alertBox.remove();
    });
  }, 4000); // auto remove after 4 seconds
}
