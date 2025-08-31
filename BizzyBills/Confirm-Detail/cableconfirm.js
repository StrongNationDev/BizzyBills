// cableconfirm.js
import { supabase, getCurrentUser } from './user.js';

// DOM elements
const amountToCharge = document.getElementById("AmountToCharge");
const productType = document.querySelector(".product-type");
const iucNumber = document.getElementById("DataPeriod");
const amountBody = document.getElementById("Amount");
const cablePlan = document.getElementById("CablePlan");
const pageTitle = document.querySelector(".page-title");

// Load details on page load
document.addEventListener("DOMContentLoaded", async () => {
  const user = await getCurrentUser();
  if (!user) {
    alert("No user logged in");
    return;
  }

  // Get the latest saved selections for this user
  const { data, error } = await supabase
    .from("cable_selections")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3); // fetch last few actions (provider, plan, iuc)

  if (error) {
    console.error("Error fetching cable selections:", error);
    alert("Could not load payment details.");
    return;
  }

  if (!data || data.length === 0) {
    alert("No saved cable details found.");
    return;
  }

  // Parse selections
  let provider = data.find(d => d.type === "provider")?.data;
  let plan = data.find(d => d.type === "plan")?.data;
  let iuc = data.find(d => d.type === "iuc")?.data;

  // Fill UI
  if (provider) {
    pageTitle.textContent = `${provider.name} Confirmation`;
    document.querySelector(".detail span img").src = `icons/${provider.name.toLowerCase()}.png`; 
    document.querySelector(".detail span img").alt = provider.name;
    document.querySelector(".detail span:last-child").childNodes[1].textContent = provider.name;
  }

  if (plan) {
    cablePlan.textContent = plan.name;
    productType.textContent = provider?.name || "Cable TV";
    amountToCharge.textContent = `₦${plan.amount.toLocaleString()}`;
    amountBody.textContent = `₦${plan.amount.toLocaleString()}`;
  }

  if (iuc) {
    iucNumber.textContent = iuc.iuc;
  }
});

// Example pay button handler
document.getElementById("paynow").addEventListener("click", () => {
  alert("Payment confirmed! (Integrate payment API here)");
});
