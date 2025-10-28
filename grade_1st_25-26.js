document.getElementById("gradeForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("studentID").value.trim();
  const surname = document.getElementById("surname").value.trim().toLowerCase();
  const resultDiv = document.getElementById("result");

  // Clear previous result
  resultDiv.innerHTML = "Loading...";

  fetch("grades_1st_25-26.csv")
    .then((response) => {
      if (!response.ok) {
        throw new Error("CSV file not found");
      }
      return response.text();
    })
    .then((csvText) => {
      const rows = csvText.split("\n").map((r) => r.split(","));
      const headers = rows[0].map((h) => h.trim());
      const data = rows.slice(1);

      // Find matching row
      const match = data.find((row) => {
        const record = {};
        headers.forEach((h, i) => (record[h] = row[i] ? row[i].trim() : ""));
        return (
          record["StudentID"] === id &&
          record["Surname"].toLowerCase() === surname
        );
      });

      if (match) {
        const record = {};
        headers.forEach((h, i) => (record[h] = match[i] ? match[i].trim() : ""));

        resultDiv.innerHTML = `
          <h3>${record["GivenName"]} ${record["MiddleInitial"]}. ${record["Surname"]}</h3>
          <div class="grade-item"><span>Tentative Grade:</span> <span>${record["Tentative Grade"]}</span></div>
          <div class="grade-item"><span>Exempted:</span> <span>${record["Exempted"]}</span></div>
          <div class="grade-item"><span>Target Final:</span> <span>${record["TargetFinal"]}</span></div>
        `;
      } else {
        resultDiv.innerHTML = `<p style="color:red;">❌ Student not found. Please check your inputs.</p>`;
      }
    })
    .catch((err) => {
      console.error(err);
      resultDiv.innerHTML = `<p style="color:red;">Error loading grade data.</p>`;
    });
});
