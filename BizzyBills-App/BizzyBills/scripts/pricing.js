// pricing.js

function renderPlans(providerId, containerId) {
  const container = document.querySelector(`#${containerId} .plan-list`);
  container.innerHTML = '';

  const providerPlans = dataPlans[providerId];
  if (!providerPlans) return;

  // Loop through each plan group
  Object.values(providerPlans).forEach(planGroup => {
    planGroup.forEach(plan => {
      const match = plan.label.match(/([\d.]+ ?[GM]B).*₦(\d+)/i);
      if (match) {
        const size = match[1].trim();
        const price = `₦${Number(match[2]).toLocaleString()}`;
        const p = document.createElement('p');
        p.innerHTML = `${size} <span>${price}</span>`;
        container.appendChild(p);
      }
    });
  });
}

// Populate when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  renderPlans(1, 'mtnPlans');    // MTN
  renderPlans(2, 'gloPlans');    // GLO
  renderPlans(4, 'airtelPlans'); // Airtel
});
