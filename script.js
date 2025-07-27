const gradePoints = {
    'A+': 4.00, 'A': 3.75, 'A-': 3.50,
    'B+': 3.25, 'B': 3.00, 'B-': 2.75,
    'C+': 2.50, 'C': 2.25, 'D': 2.00, 'F': 0.00
};

let semesterCount = 0;


const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const toggleBtn = document.getElementById('togglePageBtn');

toggleBtn.addEventListener('click', () => {
    if (page1.style.display !== 'none') {

        page1.style.display = 'none';
        page2.style.display = 'block';
        toggleBtn.textContent = 'Back to Semester View';
    } else {

        page1.style.display = 'block';
        page2.style.display = 'none';
        toggleBtn.textContent = 'Go to Quick CGPA Update';
    }
});

function addSemester() {
    semesterCount++;
    const semesterDiv = document.createElement('div');
    semesterDiv.classList.add('semester');
    semesterDiv.id = `semester-${semesterCount}`;
    semesterDiv.innerHTML = `
    <h2>Semester ${semesterCount}</h2>
    <table>
      <thead>
        <tr>
          <th>Subject Name</th>
          <th>Grade</th>
          <th>Credits</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    <button class="add-btn" onclick="addSubject(${semesterCount})">Add Subject</button>
    <p><strong>Semester ${semesterCount} GPA:</strong> <span id="gpa-${semesterCount}">0.00</span></p>
  `;
    document.getElementById('semesters').appendChild(semesterDiv);
    addSubject(semesterCount);
}

function addSubject(semesterId) {
    const tbody = document.querySelector(`#semester-${semesterId} tbody`);
    const row = document.createElement('tr');
    row.innerHTML = `
    <td><input type="text" placeholder="Subject Name"></td>
    <td>
      <select onchange="updateGPA(${semesterId})">
        ${Object.keys(gradePoints).map(grade => `<option value="${grade}">${grade}</option>`).join('')}
      </select>
    </td>
    <td><input type="number" min="0" step="0.5" onchange="updateGPA(${semesterId})"></td>
    <td><button class="remove-btn" onclick="removeRow(this, ${semesterId})">X</button></td>
  `;
    tbody.appendChild(row);
    updateGPA(semesterId);
}

function removeRow(btn, semesterId) {
    btn.closest('tr').remove();
    updateGPA(semesterId);
}

function updateGPA(semesterId) {
    const rows = document.querySelectorAll(`#semester-${semesterId} tbody tr`);
    let totalPoints = 0;
    let totalCredits = 0;

    rows.forEach(row => {
        const grade = row.children[1].children[0].value;
        const credits = parseFloat(row.children[2].children[0].value);
        if (!isNaN(credits)) {
            totalPoints += gradePoints[grade] * credits;
            totalCredits += credits;
        }
    });

    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
    document.getElementById(`gpa-${semesterId}`).textContent = gpa;
    updateCGPA();
}

function updateCGPA() {
    let totalPoints = 0;
    let totalCredits = 0;
    for (let i = 1; i <= semesterCount; i++) {
        const gpa = parseFloat(document.getElementById(`gpa-${i}`).textContent);
        const rows = document.querySelectorAll(`#semester-${i} tbody tr`);
        rows.forEach(row => {
            const credits = parseFloat(row.children[2].children[0].value);
            if (!isNaN(credits)) {
                totalPoints += gpa * credits;
                totalCredits += credits;
            }
        });
    }
    const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
    document.getElementById('cgpa').textContent = cgpa;
}

function addQuickSubject() {
    const tbody = document.querySelector('#quick-subjects-table tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
    <td><input type="text" placeholder="Subject Name"></td>
    <td>
      <select>
        ${Object.keys(gradePoints).map(grade => `<option value="${grade}">${grade}</option>`).join('')}
      </select>
    </td>
    <td><input type="number" min="0" step="0.5"></td>
    <td><button class="remove-btn" onclick="removeQuickRow(this)">X</button></td>
  `;
    tbody.appendChild(row);
}

function removeQuickRow(btn) {
    btn.closest('tr').remove();
}

function quickCgpaCalc() {
    const prevCgpa = parseFloat(document.getElementById("prevCgpa").value);
    const prevCredits = parseFloat(document.getElementById("prevCredits").value);

    if (isNaN(prevCgpa) || isNaN(prevCredits) || prevCredits < 0) {
        alert("Please enter valid previous CGPA and credits.");
        return;
    }

    const rows = document.querySelectorAll('#quick-subjects-table tbody tr');

    let totalPointsCurr = 0;
    let totalCreditsCurr = 0;

    for (const row of rows) {
        const grade = row.children[1].children[0].value;
        const credits = parseFloat(row.children[2].children[0].value);

        if (!gradePoints.hasOwnProperty(grade) || isNaN(credits) || credits <= 0) {
            alert('Please enter valid grades and credits for all current semester subjects.');
            return;
        }

        totalPointsCurr += gradePoints[grade] * credits;
        totalCreditsCurr += credits;
    }

    if (totalCreditsCurr === 0) {
        alert('Please add at least one subject with credits > 0.');
        return;
    }

    const currGpa = totalPointsCurr / totalCreditsCurr;

    const updatedCgpa = ((prevCgpa * prevCredits) + (currGpa * totalCreditsCurr)) / (prevCredits + totalCreditsCurr);

    document.getElementById("quickCgpa").textContent = updatedCgpa.toFixed(2);
}

const darkModeSwitch = document.getElementById('darkModeSwitch');

if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    darkModeSwitch.checked = true;
}

darkModeSwitch.addEventListener('change', () => {
    if (darkModeSwitch.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    }
});

addSemester();
