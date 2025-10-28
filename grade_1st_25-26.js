// grade_1st_25-26.js
document.getElementById("gradeForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const studentID = document.getElementById("studentID").value.trim();
  const surname = document.getElementById("surname").value.trim().toLowerCase();
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "Searching...";

  fetch("grades_1st_25-26.csv")
    .then((response) => response.text())
    .then((data) => {
      const rows = data.split("\n").map((row) => row.split(","));
      const headers = rows[0];
      const results = rows.slice(1);

      const student = results.find((r) => {
        return (
          r[0].trim() === studentID &&
          r[1].trim().toLowerCase() === surname
        );
      });

      if (student) {
        let output = `<h3>Result for ${student[1]}, ${student[2]}</h3>`;
        output += `<table border="1" cellpadding="6" style="border-collapse:collapse;">`;
        headers.forEach((h, i) => {
          output += `<tr><td><strong>${h}</strong></td><td>${student[i] || ""}</td></tr>`;
        });
        output += "</table>";
        resultDiv.innerHTML = output;
      } else {
        resultDiv.innerHTML = "❌ Student not found. Please check your inputs.";
      }
    })
    .catch((error) => {
      resultDiv.innerHTML = "Error loading grade data.";
      console.error(error);
    });
});
