document.addEventListener("DOMContentLoaded", () => {
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const eventCards = document.querySelectorAll(".event-card");
  const selectedEventNotice = document.getElementById("selectedEventNotice");
  const selectedEventInput = document.getElementById("selectedEventInput");

  const regForm = document.getElementById("registrationForm");
  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const studentGroupInput = document.getElementById("studentGroup");
  const agreementCheckbox = document.getElementById("agreement");
  const nameCountDisplay = document.getElementById("nameCount");

  const fullNameError = document.getElementById("fullNameError");
  const emailError = document.getElementById("emailError");
  const studentGroupError = document.getElementById("studentGroupError");
  const agreementError = document.getElementById("agreementError");
  const eventSelectError = document.getElementById("eventSelectError");

  const confirmationBanner = document.getElementById("confirmationBanner");
  const registrationList = document.getElementById("registrationList");

  const loadGuestsBtn = document.getElementById("loadGuestsBtn");
  const apiStatus = document.getElementById("apiStatus");
  const guestDirectory = document.getElementById("guestDirectory");

  const registrationsData = [];

  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");
    themeToggleBtn.textContent = isDark
      ? "🖤 Dark Glam Mode"
      : "💖 Pink Princess Mode";
  });

  eventCards.forEach((card) => {
    const selectBtn = card.querySelector(".select-event-btn");
    selectBtn.addEventListener("click", () => {

      eventCards.forEach((c) => c.classList.remove("selected-event"));

      card.classList.add("selected-event");

      const eventTitle = card.getAttribute("data-event-title");
      selectedEventInput.value = eventTitle;
      selectedEventNotice.textContent = `Выбрано: ${eventTitle} 💕`;

      eventSelectError.textContent = "";
    });
  });

  fullNameInput.addEventListener("input", () => {
    nameCountDisplay.textContent = fullNameInput.value.length;
    validateName(fullNameInput.value);
  });

  emailInput.addEventListener("input", () => validateEmail(emailInput.value));
  studentGroupInput.addEventListener("input", () => validateGroup(studentGroupInput.value));
  agreementCheckbox.addEventListener("change", () => validateAgreement(agreementCheckbox.checked));

  function validateName(value) {
    if (value.trim().length < 3) {
      showError(fullNameInput, fullNameError, "Имя должно содержать не менее 3 символов!");
      return false;
    }
    clearError(fullNameInput, fullNameError);
    return true;
  }

  function validateEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      showError(emailInput, emailError, "Введите корректный email адрес!");
      return false;
    }
    clearError(emailInput, emailError);
    return true;
  }

  function validateGroup(value) {
    if (value.trim() === "") {
      showError(studentGroupInput, studentGroupError, "Пожалуйста, укажите группу!");
      return false;
    }
    clearError(studentGroupInput, studentGroupError);
    return true;
  }

  function validateAgreement(isChecked) {
    if (!isChecked) {
      agreementError.textContent = "Необходимо согласиться с правилами!";
      return false;
    }
    agreementError.textContent = "";
    return true;
  }

  function validateEventSelection(value) {
    if (!value) {
      eventSelectError.textContent = "Пожалуйста, выберите хотя бы одно мероприятие выше! 🌸";
      return false;
    }
    eventSelectError.textContent = "";
    return true;
  }

  function showError(inputEl, errorEl, message) {
    inputEl.classList.add("input-error");
    errorEl.textContent = message;
  }

  function clearError(inputEl, errorEl) {
    inputEl.classList.remove("input-error");
    errorEl.textContent = "";
  }

  regForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const isNameValid = validateName(fullNameInput.value);
    const isEmailValid = validateEmail(emailInput.value);
    const isGroupValid = validateGroup(studentGroupInput.value);
    const isAgreeValid = validateAgreement(agreementCheckbox.checked);
    const isEventValid = validateEventSelection(selectedEventInput.value);

    if (isNameValid && isEmailValid && isGroupValid && isAgreeValid && isEventValid) {

      const newRegistration = {
        name: fullNameInput.value.trim(),
        email: emailInput.value.trim(),
        group: studentGroupInput.value.trim(),
        event: selectedEventInput.value
      };

      registrationsData.push(newRegistration);

      const listItem = document.createElement("li");
      listItem.className = "registration-item";

      const infoSpan = document.createElement("span");
      infoSpan.textContent = `👑 ${newRegistration.name} (${newRegistration.group}) — ${newRegistration.event}`;

      listItem.appendChild(infoSpan);
      registrationList.appendChild(listItem);

      confirmationBanner.textContent = `Ура, ${newRegistration.name}! Вы успешно зарегистрированы на ${newRegistration.event}! 🎉💖`;
      confirmationBanner.classList.remove("hidden");

      regForm.reset();
      nameCountDisplay.textContent = "0";
      selectedEventNotice.textContent = "Мероприятие ещё не выбрано! 🥺";
      eventCards.forEach((c) => c.classList.remove("selected-event"));
    }
  });

  async function loadGuests() {
    apiStatus.textContent = "Loading guests... ✨💖";
    apiStatus.style.color = "var(--primary-pink)";
    guestDirectory.innerHTML = "";

    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/users");

      if (!response.ok) {
        throw new Error(`Server status: ${response.status}`);
      }

      const guests = await response.json();
      apiStatus.textContent = "";

      const firstFive = guests.slice(0, 5);
      firstFive.forEach((guest) => {
        const guestCard = document.createElement("div");
        guestCard.className = "guest-card";

        const nameHeading = document.createElement("h4");
        nameHeading.textContent = guest.name;

        const emailP = document.createElement("p");
        emailP.textContent = `✉️ ${guest.email}`;

        const websiteP = document.createElement("p");
        websiteP.textContent = `🌐 ${guest.website}`;

        guestCard.appendChild(nameHeading);
        guestCard.appendChild(emailP);
        guestCard.appendChild(websiteP);

        guestDirectory.appendChild(guestCard);
      });

    } catch (error) {
      apiStatus.textContent = `Ошибка загрузки гостей: ${error.message} 😿`;
      apiStatus.style.color = "var(--error-color)";
    }
  }

  loadGuestsBtn.addEventListener("click", loadGuests);
});
