"use strict";

const WHATSAPP_NUMBER = "94786788925";
const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

function openWhatsApp(message) {
  const url = `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function setupNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-navigation");

  if (!toggle || !navigation) return;

  const closeMenu = () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 680) closeMenu();
  });
}

function setupWhatsAppLinks() {
  document.querySelectorAll("[data-whatsapp-message]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openWhatsApp(link.dataset.whatsappMessage);
    });
  });
}

function setupAppointmentForm() {
  const form = document.querySelector("#appointment-form");
  if (!form) return;

  const dateInput = form.querySelector("#preferred-date");
  const serviceSelect = form.querySelector("#service");
  const feedback = form.querySelector("#form-feedback");

  const requestedService = new URLSearchParams(window.location.search).get("service");
  if (requestedService && Array.from(serviceSelect.options).some((option) => option.value === requestedService)) {
    serviceSelect.value = requestedService;
  }

  if (dateInput) {
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    dateInput.min = localDate;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    feedback.classList.remove("is-error");

    if (!form.reportValidity()) {
      feedback.textContent = "Please complete the required fields before continuing.";
      feedback.classList.add("is-error");
      return;
    }

    const formData = new FormData(form);
    const preferredTime = formData.get("time") || "Not specified";
    const additionalMessage = formData.get("message") || "None";
    const message = [
      "Hello! I would like to enquire about an appointment.",
      "",
      `Name: ${formData.get("name")}`,
      `Phone: ${formData.get("phone")}`,
      `Service: ${formData.get("service")}`,
      `Preferred date: ${formData.get("date")}`,
      `Preferred time: ${preferredTime}`,
      `Additional message: ${additionalMessage}`,
      "",
      "Please let me know your availability. Thank you!"
    ].join("\n");

    openWhatsApp(message);
    feedback.textContent = "WhatsApp has opened with your enquiry. Please review it and press Send in WhatsApp to complete your request.";
  });
}

function setCurrentYear() {
  const currentYear = String(new Date().getFullYear());
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = currentYear;
  });
}

setupNavigation();
setupWhatsAppLinks();
setupAppointmentForm();
setCurrentYear();
