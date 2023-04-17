if (localStorage.getItem("students") === null) {
  localStorage.setItem("students", "{}");
}

const departments = {
  general: "General",
  cs: "Computer Science",
  it: "Information Technology",
  is: "Information Systems",
  ai: "Artificial Intelligence",
  ds: "Decision Support",
};

const parametersToShow = ["name", "id", "level", "department", "gpa", "status"];

function toggleClass(selector) {
  let e = document.querySelector(selector);
  e.classList.toggle("hide");
}

function validateEmail(email) {
  const exp = /^[a-zA-Z0-9\._%\+\-]+@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,}$/;
  return exp.test(email);
}

function validatePhoneNumber(phone_number) {
  const exp = /^(?:\+20|0)?1[0125]\d{8}$/;
  return exp.test(phone_number);
}

function validateID(id) {
  const exp = /^[0-9]+$/;
  return exp.test(id);
}

function validateBirthDate(dob) {
  const cur = new Date();
  const date = new Date(dob);
  return date.getTime() <= cur.getTime();
}

function initAddStudent() {
  initDepartmentDropMenu();

  const students = JSON.parse(localStorage.getItem("students"));
  const form = document.querySelector("#add-student-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const obj = createObjectOnSubmit(formData);
    if (obj["level"] <= 2) {
      obj["department"] = "general";
    }
    const errors = validateStudent(obj);
    if (errors.length) {
      let error_message = "";
      for (let error of errors) error_message += "\n" + error;
      showErrorMessage(error_message);
    } else if (obj["id"] in students) {
      showErrorMessage("Student with same ID already exists.");
    } else {
      form.reset();
      students[obj["id"]] = obj;
      localStorage.setItem("students", JSON.stringify(students));
      showSuccessMessage("Student " + obj["name"] + " added");
    }
  });
}

function initEditStudent() {
  const form = document.querySelector("#edit-student-form");

  const queryString = window.location.search;
  const searchParams = new URLSearchParams(queryString);

  const students = JSON.parse(localStorage.getItem("students"));
  for (const [key, value] of Object.entries(students[searchParams.get("id")])) {
    form.elements[key].value = value;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const obj = createObjectOnSubmit(formData);
    const errors = validateStudent(obj);
    if (obj["level"] <= 2 || obj["department"] === undefined) {
      obj["department"] = "general";
    }
    if (errors.length) {
      let error_message = "";
      for (let error of errors) error_message += "\n" + error;
      showErrorMessage(error_message);
    } else {
      students[obj["id"]] = obj;
      localStorage.setItem("students", JSON.stringify(students));
      showSuccessMessage("Edits to " + obj["name"] + " saved");
    }
  });
}

function initSearchStudent() {
  initFiltersToggle();

  const students = JSON.parse(localStorage.getItem("students"));
  populateStudentsTable(students);

  const form = document.querySelector("#search-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    let filtered = filterFromFormData(formData, students);

    populateStudentsTable(filtered);
  });
}

function initActiveStudent() {
  initFiltersToggle();

  const form = document.querySelector("#search-form");
  const formData = new FormData(form);

  const students = JSON.parse(localStorage.getItem("students"));
  populateStudentsTable(filterFromFormData(formData, students));

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    let filtered = filterFromFormData(formData, students);

    populateStudentsTable(filtered);
  });
}

function initChangeDepartment() {
  const queryString = window.location.search;
  const searchParams = new URLSearchParams(queryString);

  const students = JSON.parse(localStorage.getItem("students"));
  const student = students[searchParams.get("id")];

  document.getElementById("stud-name").innerHTML = student["name"];
  document.getElementById("stud-id").innerHTML = student["id"];
  document.getElementById("stud-level").innerHTML = student["level"];
  if (student["level"] <= 2) {
    document.getElementById("department-dropdown").disabled = true;
  } else {
    document.getElementById("department-dropdown").value =
      student["department"];
    const form = document.getElementById("change-department-form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      student["department"] = document.getElementById(
        "department-dropdown"
      ).value;
      students[student["id"]] = student;
      localStorage.setItem("students", JSON.stringify(students));
      showSuccessMessage(
        "Student " + student["name"] + "'s department changed successfully!"
      );
    });
  }
}

function showSuccessMessage(message) {
  const cont = document.querySelector("#notification-container");

  cont.classList.remove("hide");
  cont.classList.remove("error-msg");
  cont.classList.add("success-msg");
  cont.querySelector("#notification-text").innerHTML = message;
}

function initDepartmentDropMenu() {
  const lvl_menu = document.querySelector("#level-dropdown");
  const dep_menu = document.querySelector("#department-dropdown");
  lvl_menu.addEventListener("change", () => {
    dep_menu.disabled = lvl_menu.selectedIndex < 2;
  });
}

function initFiltersToggle() {
  let btn = document.querySelector("#show-filters");
  btn.addEventListener("click", () => {
    toggleClass("#filters");
    btn.classList.toggle("active-btn");
  });
}

function showErrorMessage(message) {
  const cont = document.querySelector("#notification-container");

  cont.classList.remove("hide");
  cont.classList.remove("success-msg");
  cont.classList.add("error-msg");
  cont.querySelector("#notification-text").innerText = message;
}

function validateStudent(student) {
  let errors = [];
  if (!validateID(student["id"])) {
    errors.push("Invalid student ID!");
  }
  if (!validateEmail(student["email"])) {
    errors.push("Invalid Email!");
  }
  if (!validatePhoneNumber(student["phone"])) {
    errors.push("Invalid phone number!");
  }
  if (!validateBirthDate(student["dob"])) {
    errors.push("Invalid birth date!");
  }
  return errors;
}

function createObjectOnSubmit(formData) {
  const obj = {};
  for (const [key, value] of formData.entries()) {
    obj[key] = value;
  }
  return obj;
}

function populateStudentsTable(students) {
  let count = 1;
  const table = document.querySelector("#students-table");

  table.tBodies[0].innerHTML = "";

  for (const [key, student] of Object.entries(students)) {
    const row = document.createElement("tr");
    let cell = document.createElement("td");
    cell.innerHTML = `${count++}`;

    row.appendChild(cell);
    for (const key in parametersToShow) {
      cell = document.createElement("td");

      const param = parametersToShow[key];
      let value = student[param];
      if (param === "department") {
        value = departments[value];
      } else if (param === "status") {
        if (value === "active") {
          value = '<input type="checkbox" checked disabled>';
        } else {
          value = '<input type="checkbox" disabled>';
        }
      }
      cell.innerHTML = value;
      row.appendChild(cell);
    }

    cell = document.createElement("td");

    let anchor = document.createElement("a");
    anchor.href = "edit.html?id=" + student["id"];
    anchor.innerText = "Edit";
    cell.appendChild(anchor);
    row.appendChild(cell);

    cell = document.createElement("td");
    anchor = document.createElement("a");
    anchor.href = "department.html?id=" + student["id"];
    anchor.innerText = "Change Department";
    if (student["level"] <= 2) {
      anchor.setAttribute("disabled", "");
    }
    cell.appendChild(anchor);
    row.appendChild(cell);

    cell = document.createElement("td");
    anchor = document.createElement("a");
    anchor.href = "#";
    anchor.innerText = "Delete";

    anchor.addEventListener("click", () => {
      const confirmation = confirm(
        "Are you sure you want to delete student: " + student["name"] + "?"
      );
      if (confirmation) {
        delete students[key];

        localStorage.setItem('students', JSON.stringify(students));
        table.tBodies[0].removeChild(row);
      }
    });

    cell.appendChild(anchor);
    row.appendChild(cell);

    table.tBodies[0].appendChild(row);
  }
}

function filterFromFormData(formData, students) {
  let filtered = [];

  const name = formData.get("name");
  const id = formData.get("id");
  const lgpa = formData.get("l-gpa");
  const rgpa = formData.get("r-gpa");
  const level = formData.get("level");
  const status = formData.get("status");

  const nameRegex = new RegExp("\\b" + name + "\\b", "i");
  const idRegex = new RegExp("^" + id);

  for (const [, student] of Object.entries(students)) {
    let good = true;

    if (name) {
      good &= nameRegex.test(student["name"]);
    }

    if (id) {
      good &= idRegex.test(student["id"]);
    }

    good &= !level || level == student["level"];
    good &= !status || status == student["status"];

    good &= student["gpa"] >= lgpa && student["gpa"] <= rgpa;

    if (good) {
      filtered.push(student);
    }
  }

  const sort_by = formData.get("sort-by");
  if (sort_by == "name-asc") {
    filtered.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
  } else if (sort_by == "name-desc") {
    filtered.sort((a, b) => (a.name > b.name ? -1 : b.name > a.name ? 1 : 0));
  } else if (sort_by == "id-asc") {
    filtered.sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0));
  } else if (sort_by == "id-desc") {
    filtered.sort((a, b) => (a.id > b.id ? -1 : b.id > a.id ? 1 : 0));
  } else if (sort_by == "gpa-asc") {
    filtered.sort((a, b) => (a.gpa > b.gpa ? 1 : b.gpa > a.gpa ? -1 : 0));
  } else if (sort_by == "gpa-desc") {
    filtered.sort((a, b) => (a.gpa > b.gpa ? -1 : b.gpa > a.gpa ? 1 : 0));
  }

  return filtered;
}
