function toggle(selector) {
    let e = document.querySelector(selector);
    e.classList.toggle("hide");
}

function validateEmail(email) {
    const exp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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

if (localStorage.getItem('students') === null) {
    localStorage.setItem('students', '{}');
}

function initAddStudent() {
    const lvl_menu = document.querySelector("#level-dropdown");
    const dep_menu = document.querySelector("#department-dropdown");
    lvl_menu.addEventListener("change", (event) => {
        dep_menu.disabled = lvl_menu.selectedIndex < 2;
    });

    const students = JSON.parse(localStorage.getItem('students'));
    const form = document.querySelector("#add-student-form");
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        const obj = {};

        for (const [key, value] of formData.entries()) {
            obj[key] = value;
        }

        if (obj['level'] <= 2) {
            obj['department'] = 'general';
        }

        const cont = document.querySelector("#message-modal-container");

        // validation
        if (!validateID(obj['id'])) {
            console.log(obj['id']);
            cont.classList.remove("hide");
            cont.classList.remove("success-msg");
            cont.classList.add("error-msg");
            cont.querySelector("#message-modal-text").innerHTML = "Error:\n\t Invalid Student ID.";
        } else if (obj['id'] in students) {
            cont.classList.remove("hide");
            cont.classList.remove("success-msg");
            cont.classList.add("error-msg");
            cont.querySelector("#message-modal-text").innerHTML = "Error:\n\t Student with same ID already exists.";
        } else if (!validateEmail(obj['email'])) {
            cont.classList.remove("hide");
            cont.classList.remove("success-msg");
            cont.classList.add("error-msg");
            cont.querySelector("#message-modal-text").innerHTML = "Error:\n\t Invalid Email Address.";
        } else if (!validatePhoneNumber(obj['phone'])) {
            cont.classList.remove("hide");
            cont.classList.remove("success-msg");
            cont.classList.add("error-msg");
            cont.querySelector("#message-modal-text").innerHTML = "Error:\n\t Invalid Phone number.";
        } else {
            students[obj['id']] = obj;
            localStorage.setItem('students', JSON.stringify(students));

            cont.classList.remove("hide");
            cont.classList.remove("error-msg");
            cont.classList.add("success-msg");
            cont.querySelector("#message-modal-text").innerHTML = "Student " + obj['name'] + " added successfully!";
        }
        form.reset();
    });
}

function initEditStudent() {
    const form = document.querySelector("#edit-student-form");

    const queryString = window.location.search;
    const searchParams = new URLSearchParams(queryString);

    const students = JSON.parse(localStorage.getItem('students'));
    for (const [key, value] of Object.entries(students[searchParams.get('id')])) {
        form.elements[key].value = value;
    }

    const lvl_menu = document.querySelector("#level-dropdown");
    const dep_menu = document.querySelector("#department-dropdown");
    lvl_menu.addEventListener("change", (event) => {
        dep_menu.disabled = lvl_menu.selectedIndex < 2;
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        const obj = {};
        for (const [key, value] of formData.entries()) {
            obj[key] = value;
        }

        if (obj['level'] <= 2) {
            obj['department'] = 'general';
        }

        const cont = document.querySelector("#message-modal-container");

        // validation
        if (!validateID(obj['id'])) {
            cont.classList.remove("hide");
            cont.classList.remove("success-msg");
            cont.classList.add("error-msg");
            cont.querySelector("#message-modal-text").innerHTML = "Error:\n\t Invalid Student ID.";
        } else if (!validateEmail(obj['email'])) {
            cont.classList.remove("hide");
            cont.classList.remove("success-msg");
            cont.classList.add("error-msg");
            cont.querySelector("#message-modal-text").innerHTML = "Error:\n\t Invalid Email Address.";
        } else if (!validatePhoneNumber(obj['phone'])) {
            cont.classList.remove("hide");
            cont.classList.remove("success-msg");
            cont.classList.add("error-msg");
            cont.querySelector("#message-modal-text").innerHTML = "Error:\n\t Invalid Phone number.";
        } else {
            students[obj['id']] = obj;
            localStorage.setItem('students', JSON.stringify(students));

            cont.classList.remove("hide");
            cont.classList.remove("error-msg");
            cont.classList.add("success-msg");
            cont.querySelector("#message-modal-text").innerHTML = "Edits Saved";
        }

    });
}

function initSearchStudent() {
    const parametersToShow = ['name', 'id', 'level', 'department', 'gpa', 'status'];
    let e = document.querySelector("#show-filters");
    e.addEventListener("click", () => {
        toggle("#filters");
        e.classList.toggle("active-btn");
    });

    const table = document.querySelector("#students-table");

    let count = 1;
    const students = JSON.parse(localStorage.getItem('students'));
    for (const [key, student] of Object.entries(students)) {

        const row = document.createElement('tr');
        let cell = document.createElement('td');
        cell.innerHTML = count++;

        row.appendChild(cell);
        for (const key in parametersToShow) {
            cell = document.createElement('td');


            let value = student[parametersToShow[key]];
            if (typeof (value) === "string") {
                value = value.charAt(0).toUpperCase() + value.slice(1);
            }
            cell.innerHTML = value;
            row.appendChild(cell);
        }

        cell = document.createElement('td');

        let anchor = document.createElement('a');
        anchor.href = 'edit.html?id=' + student['id'];
        anchor.innerText = "Edit";
        cell.appendChild(anchor);
        row.appendChild(cell);

        cell = document.createElement('td');
        anchor = document.createElement('a');
        anchor.href = 'department.html?id=' + student['id'];
        anchor.innerText = "Change Department";
        if (student['level'] <= 2) {
            anchor.style.pointerEvents = 'none';
            anchor.style.cursor='default';
            anchor.style.color='grey';
        }
        cell.appendChild(anchor);
        row.appendChild(cell);

        cell = document.createElement('td');
        anchor = document.createElement('a');
        anchor.href = '#';
        anchor.innerText = "Delete";
        cell.appendChild(anchor);
        row.appendChild(cell);

        table.tBodies[0].appendChild(row);
    }
}

function initChangeDepartment() {

    const queryString = window.location.search;
    const searchParams = new URLSearchParams(queryString);

    const students = JSON.parse(localStorage.getItem('students'));
    const stud = students[searchParams.get('id')];

    document.getElementById('stud-name').innerHTML = stud['name'];
    document.getElementById('stud-id').innerHTML = stud['id'];
    document.getElementById('stud-level').innerHTML = stud['level'];
    if (stud['level'] <= 2)
        document.getElementById('department-dropdown').disabled = true;
    else {
        document.getElementById('department-dropdown').value = stud['department'];
        const form = document.getElementById('change-department-form');

        const cont = document.querySelector("#message-modal-container");
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            stud['department'] = document.getElementById('department-dropdown').value;
            students[stud['id']] = stud;
            localStorage.setItem('students', JSON.stringify(students));
            cont.classList.remove("hide");
            cont.classList.remove("error-msg");
            cont.classList.add("success-msg");
            cont.querySelector("#message-modal-text").innerHTML = "Student " + obj['name'] + " added successfully!";
        });
    }
}