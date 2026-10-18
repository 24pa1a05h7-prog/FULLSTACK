(() => {
  "use strict";

  const RIDE_TYPES = {
    bike: { name: "Bike", emoji: "🏍️", base: 18, perKm: 7 },
    auto: { name: "Auto", emoji: "🛺", base: 25, perKm: 11 },
    mini: { name: "Mini", emoji: "🚕", base: 35, perKm: 14 },
    sedan: { name: "Sedan", emoji: "🚘", base: 55, perKm: 18 },
    suv: { name: "SUV", emoji: "🚙", base: 75, perKm: 23 }
  };
  const STORAGE_KEY = "cabgo-demo-bookings-v1";
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const form = $("#bookingForm");
  const pickupInput = $("#pickup");
  const dropoffInput = $("#dropoff");
  const distanceInput = $("#distance");
  const distanceValue = $("#distanceValue");
  const summaryRide = $("#summaryRide");
  const summaryRoute = $("#summaryRoute");
  const selectedFare = $("#selectedFare");
  const historyList = $("#historyList");
  const modal = $("#bookingModal");
  const modalDetails = $("#modalDetails");
  const toast = $("#toast");
  let selectedRide = "mini";
  let toastTimer;

  function money(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency", currency: "INR", maximumFractionDigits: 0
    }).format(amount);
  }

  function fareFor(rideKey) {
    const ride = RIDE_TYPES[rideKey];
    const km = Number(distanceInput.value);
    return Math.round(ride.base + km * ride.perKm);
  }

  function safeText(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function getBookings() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }

  function saveBookings(bookings) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
      return true;
    } catch (error) {
      showToast("Browser storage is unavailable. Booking was not saved.");
      return false;
    }
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2800);
  }

  function updateSummary() {
    const km = Number(distanceInput.value);
    distanceValue.textContent = km;
    Object.keys(RIDE_TYPES).forEach((key) => {
      $("#price-" + key).textContent = money(fareFor(key));
    });
    const ride = RIDE_TYPES[selectedRide];
    selectedFare.textContent = money(fareFor(selectedRide));
    summaryRide.textContent = ride.name + " ride selected";
    const pickup = pickupInput.value.trim();
    const dropoff = dropoffInput.value.trim();
    summaryRoute.textContent = pickup && dropoff
      ? pickup + " → " + dropoff + " · " + km + " km"
      : "Enter your locations to plan your route";
  }

  function chooseRide(key) {
    if (!RIDE_TYPES[key]) return;
    selectedRide = key;
    $$(".ride-option").forEach((button) => {
      const active = button.dataset.ride === key;
      button.classList.toggle("selected", active);
      button.setAttribute("aria-pressed", String(active));
    });
    updateSummary();
  }

  function showModal(booking) {
    const ride = RIDE_TYPES[booking.ride];
    modalDetails.innerHTML = [
      ["Booking ID", booking.id],
      ["Route", booking.pickup + " → " + booking.dropoff],
      ["Vehicle", ride.name],
      ["Distance", booking.distance + " km"],
      ["Estimated fare", money(booking.fare)],
      ["Status", "Demo booking confirmed"]
    ].map(([label, value]) =>
      '<div class="modal-detail-row"><span>' + safeText(label) +
      '</span><strong>' + safeText(value) + "</strong></div>"
    ).join("");
    modal.hidden = false;
    $("#closeModal").focus();
  }

  function closeModal() {
    modal.hidden = true;
    $("#doneButton").focus();
  }

  function renderHistory() {
    const bookings = getBookings().sort((a, b) => b.createdAt - a.createdAt);
    if (!bookings.length) {
      historyList.innerHTML = '<div class="empty-state"><span>↗</span><b>No rides yet</b><p>Your confirmed demo bookings will show up here.</p></div>';
      return;
    }
    historyList.innerHTML = bookings.map((booking) => {
      const ride = RIDE_TYPES[booking.ride] || RIDE_TYPES.mini;
      const date = new Date(booking.createdAt);
      return '<article class="history-item">' +
        '<div class="history-vehicle" aria-hidden="true">' + ride.emoji + '</div>' +
        '<div class="history-route"><b>' + safeText(booking.pickup) + ' → ' + safeText(booking.dropoff) + '</b>' +
        '<span>' + safeText(ride.name) + ' · ' + safeText(booking.distance) + ' km · ' +
        safeText(date.toLocaleString()) + '</span></div>' +
        '<div class="history-price">' + money(booking.fare) + '<small>Estimate</small></div>' +
        '<button class="remove-ride" type="button" data-remove="' + safeText(booking.id) + '" aria-label="Remove booking ' + safeText(booking.id) + '">Remove</button>' +
        '</article>';
    }).join("");
  }

  $$(".ride-option").forEach((button) => {
    button.addEventListener("click", () => chooseRide(button.dataset.ride));
  });
  distanceInput.addEventListener("input", updateSummary);
  pickupInput.addEventListener("input", updateSummary);
  dropoffInput.addEventListener("input", updateSummary);

  $$(".clear-field").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.dataset.clear);
      input.value = "";
      input.focus();
      updateSummary();
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const pickup = pickupInput.value.trim();
    const dropoff = dropoffInput.value.trim();
    if (!pickup || !dropoff) {
      showToast("Please enter both pickup and drop-off locations.");
      (!pickup ? pickupInput : dropoffInput).focus();
      return;
    }
    if (pickup.toLocaleLowerCase() === dropoff.toLocaleLowerCase()) {
      showToast("Pickup and drop-off should be different locations.");
      dropoffInput.focus();
      return;
    }
    const booking = {
      id: "CG-" + Date.now().toString().slice(-8),
      pickup, dropoff, ride: selectedRide,
      distance: Number(distanceInput.value),
      fare: fareFor(selectedRide),
      createdAt: Date.now()
    };
    const bookings = getBookings();
    bookings.push(booking);
    if (!saveBookings(bookings)) return;
    renderHistory();
    showModal(booking);
    $("#history").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  historyList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove]");
    if (!button) return;
    const id = button.dataset.remove;
    saveBookings(getBookings().filter((booking) => booking.id !== id));
    renderHistory();
    showToast("Demo booking removed.");
  });

  $("#clearHistory").addEventListener("click", () => {
    if (!getBookings().length) {
      showToast("There is no booking history to clear.");
      return;
    }
    if (!window.confirm("Clear all saved demo bookings from this browser?")) return;
    saveBookings([]);
    renderHistory();
    showToast("Booking history cleared.");
  });

  $("#closeModal").addEventListener("click", closeModal);
  $("#doneButton").addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });

  updateSummary();
  renderHistory();
})();