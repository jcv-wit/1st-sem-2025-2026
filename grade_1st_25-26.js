async function showGrade() {
  const surnameInput = document.getElementById("surname").value.trim().toLowerCase();
  const idInput = document.getElementById("studentID").value.trim();
  const output = document.getElementById("output");

  if (!surnameInput || !idInput) {
    output.innerHTML = "<p>Please enter both surname and student number.</p>";
    return;
  }

  try {
    const response = await fetch("grades.csv");
    const csvText = await response.text();

    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true
    });

    const data = parsed.data;

    const student = data.find(
      s =>
        s.StudentID.trim() === idInput &&
        s.Surname.trim().toLowerCase().replace(/\s+/g, '') === surnameInput.replace(/\s+/g, '')
    );

    if (student) {
      output.innerHTML = `
        <div class="grade-row"><span class="grade-label">Name:</span> ${student.GivenName} ${student.Surname}</div>
        <div class="grade-row"><span class="grade-label">Midterm:</span> ${student.Midterm || "-"}</div>
        <div class="grade-row"><span class="grade-label">Pre-Finals:</span> ${student.PreFinals || "-"}</div>
        <div class="grade-row"><span class="grade-label">Tentative Grade:</span> ${student["Tentative Grade"] || "-"}</div>
        <div class="grade-row"><span class="grade-label">Exempted:</span> ${student.Exempted || "-"}</div>
        <div class="grade-row"><span class="grade-label">Target Final:</span> ${student.TargetFinal || "-"}</div>
      `;
    } else {
      output.innerHTML = "<p>No record found. Please check your input.</p>";
    }
  } catch (error) {
    console.error("Error loading CSV:", error);
    output.innerHTML = "<p>There was a problem loading the grade data.</p>";
  }
}
