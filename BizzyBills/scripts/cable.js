// cable.js
import { supabase, getCurrentUser } from './user.js';

// ---------------- Cable Data ----------------
const providers = [
  { id: 1, name: "GOTV" },
  { id: 2, name: "DSTV" },
  { id: 3, name: "STARTIME" },
];

const cablePlans = {
  GOTV: [
    { id: 52, name: "GoTv Smallie - Yearly", amount: 15100 },
    { id: 51, name: "GoTv Max", amount: 8650 },
    { id: 50, name: "Gotv Joilli", amount: 5800 },
    { id: 49, name: "Gotv Smallie - Quarterly", amount: 5150 },
    { id: 48, name: "Gotv Jinja", amount: 4000 },
    { id: 47, name: "Gotv Smallie Monthly", amount: 2000 },
    { id: 97, name: "Gotv Super- Monthly", amount: 9850 },
  ],
  DSTV: [
    { id: 94, name: "Compact + Extraview", amount: 21000 },
    { id: 93, name: "Padi + Extraview", amount: 8750 },
    { id: 92, name: "Yanga + Extraview", amount: 10300 },
    { id: 91, name: "Confam + Extraview", amount: 14600 },
    { id: 86, name: "Padi", amount: 4500 },
    { id: 85, name: "Confam", amount: 9450 },
    { id: 84, name: "Premium", amount: 37600 },
    { id: 83, name: "Compact plus", amount: 25500 },
    { id: 82, name: "Compact", amount: 16000 },
    { id: 81, name: "Yanga", amount: 5250 },
    { id: 88, name: "Asia", amount: 12700 },
    { id: 89, name: "Premium + Extra view", amount: 42600 },
  ],
  STARTIME: [
    { id: 68, name: "Super Antenna - 30 Days", amount: 8950 },
    { id: 67, name: "Classic Antenna - 30 Days", amount: 5650 },
    { id: 65, name: "Basic Antenna - 30 Days", amount: 3850 },
    { id: 64, name: "Super Antenna - 7 days", amount: 3100 },
    { id: 63, name: "Nova Dish - 30 Days", amount: 2000 },
    { id: 62, name: "Classic Antenna - 7 Days", amount: 2000 },
    { id: 61, name: "Smart Dish - 1 month", amount: 4350 },
    { id: 60, name: "Basic Antenna- 7days", amount: 1350 },
    { id: 59, name: "Nova Dish - 7days", amount: 750 },
    { id: 58, name: "Nova Antenna - 7days", amount: 700 },
  ],
};

// ---------------- DOM Elements ----------------
const providerDropdown = document.getElementById("provider-dropdown");
const selectedProviderSpan = document.getElementById("selected-provider");
const providerListModal = document.getElementById("provider-list-modal");
const providerItems = document.getElementById("provider-items");
const closeProviderListBtn = document.getElementById("close-provider-list");
const providerSearch = document.getElementById("provider-search");

const cablePlanDropdown = document.getElementById("cableplan-dropdown");
const cablePlanSpan = document.getElementById("selected-cableplan");
const planListModal = document.getElementById("plan-list-modal");
const planItems = document.getElementById("plan-items");
const closePlanListBtn = document.getElementById("close-plan-list");
const planSearch = document.getElementById("plan-search");

const verifyBtn = document.getElementById("verify-details-btn");
const iucInput = document.getElementById("amount-input");

let selectedProvider = null;
let selectedPlan = null;

// ---------------- Provider Selection ----------------
providerDropdown.addEventListener("click", () => {
  providerListModal.style.display = "block";
  renderProviders(providers);
});

closeProviderListBtn.addEventListener("click", () => {
  providerListModal.style.display = "none";
});

providerSearch.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  const filtered = providers.filter(p => p.name.toLowerCase().includes(value));
  renderProviders(filtered);
});

function renderProviders(list) {
  providerItems.innerHTML = "";
  list.forEach(provider => {
    const li = document.createElement("li");
    li.textContent = provider.name;
    li.onclick = () => {
      selectedProvider = provider;
      selectedProviderSpan.textContent = provider.name;
      providerListModal.style.display = "none";
      saveSelection("provider", provider);
    };
    providerItems.appendChild(li);
  });
}

// ---------------- Plan Selection ----------------
cablePlanDropdown.addEventListener("click", () => {
  if (!selectedProvider) {
    alert("Please select a provider first");
    return;
  }
  planListModal.style.display = "block";
  renderPlans(cablePlans[selectedProvider.name]);
});

closePlanListBtn.addEventListener("click", () => {
  planListModal.style.display = "none";
});

planSearch.addEventListener("input", (e) => {
  if (!selectedProvider) return;
  const value = e.target.value.toLowerCase();
  const filtered = cablePlans[selectedProvider.name].filter(
    p => p.name.toLowerCase().includes(value)
  );
  renderPlans(filtered);
});

function renderPlans(list) {
  planItems.innerHTML = "";
  list.forEach(plan => {
    const li = document.createElement("li");
    li.textContent = `${plan.name} = ₦${plan.amount}`;
    li.onclick = () => {
      selectedPlan = plan;
      cablePlanSpan.textContent = `${plan.name} = ₦${plan.amount}`;
      planListModal.style.display = "none";
      saveSelection("plan", plan);
    };
    planItems.appendChild(li);
  });
}

// ---------------- Verify Details ----------------
verifyBtn.addEventListener("click", async () => {
  const iuc = iucInput.value.trim();
  if (!selectedProvider || !selectedPlan || !iuc) {
    alert("Please fill in all details");
    return;
  }

  // Show overlay
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0,0,0,0.6)";
  overlay.style.backdropFilter = "blur(5px)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.flexDirection = "column";
  overlay.style.color = "white";
  overlay.style.fontSize = "20px";
  const progress = document.createElement("div");
  overlay.appendChild(progress);
  document.body.appendChild(overlay);

  let percent = 0;
  const interval = setInterval(() => {
    percent += 5;
    progress.textContent = `Verifying... ${percent}%`;
    if (percent >= 100) {
      clearInterval(interval);
      if (iuc.length < 5) {
        progress.textContent = "❌ Incorrect details, please check and try again";
        setTimeout(() => document.body.removeChild(overlay), 2000);
      } else {
        progress.textContent = "✅ Verification successful";
        saveSelection("iuc", { iuc });
        setTimeout(() => {
          document.body.removeChild(overlay);
          window.location.href = "cableconfirm.html";
        //   window.location.href = "./Confirm-Detail";
        }, 1500);
      }
    }
  }, 100);
});

// ---------------- Save Selection ----------------
async function saveSelection(type, data) {
  const user = await getCurrentUser();
  if (!user) return;

  await supabase.from("cable_selections").insert([
    {
      user_id: user.id,
      type,
      data,
      created_at: new Date(),
    },
  ]);
}
