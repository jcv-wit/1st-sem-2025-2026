document.getElementById("gradeForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("studentID").value.trim();
  const surname = document.getElementById("surname").value.trim().toLowerCase();
  const resultDiv = document.getElementById("result");

  resultDiv.innerHTML = "Loading...";

  fetch("grades_1st_25-26.csv")
    .then((response) => {
      if (!response.ok) throw new Error("CSV file not found");
      return response.text();
    })
    .then((csvText) => {
      // Clean and split CSV
      const cleaned = csvText.replace(/\r/g, "").trim();
      const rows = cleaned.split("\n").filter((r) => r.trim() !== "");

      const headers = rows[0].split(",").map((h) => h.trim());
      const data = rows.slice(1);

      console.log("Headers:", headers);
      console.log("First row sample:", data[0]);
      console.log("Searching for:", surname, id);

      let matchRecord = null;

      // Search for student
      for (const row of data) {
        const cols = row.split(",");
        const record = {};
        headers.forEach((h, i) => {
          const cell = cols[i] ? cols[i].trim() : "";
          record[h] = cell;
        });

        if (
          (record["StudentID"] || "").trim() === id &&
          (record["Surname"] || "").trim().toLowerCase() === surname
        ) {
          matchRecord = record;
          break;
        }
      }

      // ✅ Display results
      if (matchRecord) {
        resultDiv.innerHTML = `
          <h3>${matchRecord["GivenName"]} ${matchRecord["MiddleInitial"]}. ${matchRecord["Surname"]}</h3>
        `;

        // Show all grade fields dynamically
        const fieldsToShow = [
          "Q1", "Q2", "Q3", "Midterm",
          "Q4", "Q5", "Q6", "Prefinals",
          "Tentative Grade", "Exempted", "TargetFinal"
        ];

        fieldsToShow.forEach(field => {
          if (matchRecord[field] !== undefined && matchRecord[field] !== "") {
            resultDiv.innerHTML += `
              <div class="grade-item">
                <span>${field}:</span>
                <span>${matchRecord[field]}</span>
              </div>
            `;
          }
        });
      } else {
        resultDiv.innerHTML = `<p style="color:red;">❌ Student not found. Please check your inputs.</p>`;
      }
    })
    .catch((err) => {
      console.error(err);
      resultDiv.innerHTML = `<p style="color:red;">Error loading grade data.</p>`;
    });
});
