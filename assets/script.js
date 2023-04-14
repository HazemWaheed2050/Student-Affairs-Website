if (localStorage.getItem('students') === null) {
    localStorage.setItem('students', '{}');
}

function toggleClass(selector) {
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



function initAddStudent() {
    initDepartmentDropMenu();

    const students = JSON.parse(localStorage.getItem('students'));
    const form = document.querySelector("#add-student-form");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const obj = createObjectOnSubmit(event);
        if (obj['level'] <= 2) {
            obj['department'] = 'general';
        }

        const errors = validateStudent(obj);
        if (errors.length) {
            let error_message = "";
            for (let error of errors)
                error_message += "\n" + error;
            showErrorMessage(error_message);
        } else if (obj['id'] in students) {
            showErrorMessage("Student with same ID already exists.");
        } else {
            form.reset();
            students[obj['id']] = obj;
            localStorage.setItem('students', JSON.stringify(students));
            showSuccessMessage("Student " + obj['name'] + " added")
        }
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

    initDepartmentDropMenu();

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const obj = createObjectOnSubmit(event);
        const errors = validateStudent(obj);
        if (errors) {
            let error_message = "";
            for (let error of errors)
                error_message += "\n" + error;
            showErrorMessage(error_message);
        } else {
            students[obj['id']] = obj;
            localStorage.setItem('students', JSON.stringify(students));
            showSuccessMessage("Edits to " + obj['name'] + "Saved")
        }

    });
}

function initSearchStudent() {
    const parametersToShow = ['name', 'id', 'level', 'department', 'gpa', 'status'];
    let e = document.querySelector("#show-filters");
    e.addEventListener("click", () => {
        toggleClass("#filters");
        e.classList.toggle("active-btn");
    });

    const table = document.querySelector("#students-table");

    let count = 1;
    const students = JSON.parse(localStorage.getItem('students'));
    for (const [, student] of Object.entries(students)) {

        const row = document.createElement('tr');
        let cell = document.createElement('td');
        cell.innerHTML = `${count++}`;

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
            anchor.style.cursor = 'default';
            anchor.style.color = 'grey';
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
    const student = students[searchParams.get('id')];

    document.getElementById('stud-name').innerHTML = student['name'];
    document.getElementById('stud-id').innerHTML = student['id'];
    document.getElementById('stud-level').innerHTML = student['level'];
    if (student['level'] <= 2)
        document.getElementById('department-dropdown').disabled = true;
    else {
        document.getElementById('department-dropdown').value = student['department'];

        const form = document.getElementById('change-department-form');
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            student['department'] = document.getElementById('department-dropdown').value;

            students[student['id']] = student;
            localStorage.setItem('students', JSON.stringify(students));

            showSuccessMessage("Student " + student['name'] + "'s changed successfully!");
        });
    }
}

function showSuccessMessage(message) {
    const cont = document.querySelector("#message-modal-container");

    cont.classList.remove("hide");
    cont.classList.remove("error-msg");
    cont.classList.add("success-msg");
    cont.querySelector("#message-modal-text").innerHTML = message;
}

function initDepartmentDropMenu(){
    const lvl_menu = document.querySelector("#level-dropdown");
    const dep_menu = document.querySelector("#department-dropdown");
    lvl_menu.addEventListener("change", () => {
        dep_menu.disabled = lvl_menu.selectedIndex < 2;
    });
}

function showErrorMessage(message) {
    const cont = document.querySelector("#message-modal-container");

    cont.classList.remove("hide");
    cont.classList.remove("success-msg");
    cont.classList.add("error-msg");
    cont.querySelector("#message-modal-text").innerText = message;
}

function validateStudent(student) {
    let errors = [];
    if (!validateID(student['id'])) {
        errors.push("Invalid student ID!");
    }
    if (!validateEmail(student['email'])) {
        errors.push("Invalid Email!")
    }
    if (!validatePhoneNumber(student['phone'])) {
        errors.push("Invalid phone number!")
    }
    return errors;
}

function createObjectOnSubmit(submitEvent){
    const formData = new FormData(submitEvent.target);
    const obj = {};
    for (const [key, value] of formData.entries()) {
        obj[key] = value;
    }
    return obj;
}
