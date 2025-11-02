document.getElementById("gradeForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const idInput = document.getElementById("studentID").value.trim();
  const surnameInput = document.getElementById("surname").value.trim().toLowerCase();
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "Loading...";

  fetch("grades_1st_25-26.csv")
    .then(r => {
      if (!r.ok) throw new Error("CSV file not found");
      return r.text();
    })
    .then(csvText => {
      const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: h => h ? h.replace(/(^"|"$)/g, "").trim() : h
      });

      const rows = parsed.data;
      if (!rows || rows.length === 0) {
        resultDiv.innerHTML = "<p style='color:red'>No data found in CSV.</p>";
        return;
      }

      const match = rows.find(r => {
        const sid = (r.StudentID || "").toString().trim();
        const sname = (r.Surname || "").toString().trim().toLowerCase();
        return sid === idInput && sname === surnameInput;
      });

      if (!match) {
        resultDiv.innerHTML = `<p style="color:red;">❌ Student not found. Please check your inputs.</p>`;
        return;
      }

      const get = key => (match[key] !== undefined && match[key] !== null) ? String(match[key]).trim() : "";

      // build remark and color
      const remarksText = get("Remarks");
      const remarkLower = remarksText.toLowerCase();
      let remarkColor = "black";
      if (remarkLower.includes("pass")) remarkColor = "#1b7a2a";
      else if (remarkLower.includes("fail")) remarkColor = "#b32020";

      // Build HTML using group-box containers
      const htmlParts = [];

      htmlParts.push(`<h3>${get("GivenName")} ${get("MiddleInitial") ? get("MiddleInitial") + "." : ""} ${get("Surname")}</h3>`);
      htmlParts.push(`<div class="grade-item"><span>Section:</span><span>${get("Section")}</span></div>`);

      // Midterms box
      htmlParts.push(`<div class="group-box">`);
      htmlParts.push(`<div class="group-header">Midterms</div>`);
      htmlParts.push(`<div class="group-body">`);
      htmlParts.push(`<div class="grade-item"><span>Q1</span><span>${get("Q1")}</span></div>`);
      htmlParts.push(`<div class="grade-item"><span>Q2</span><span>${get("Q2")}</span></div>`);
      htmlParts.push(`<div class="grade-item"><span>Q3</span><span>${get("Q3")}</span></div>`);
      htmlParts.push(`<div class="grade-item"><span>Midterm</span><span>${get("Midterm")}</span></div>`);
      htmlParts.push(`</div></div>`); // close midterms

      // Pre-Finals box
      htmlParts.push(`<div class="group-box">`);
      htmlParts.push(`<div class="group-header">Pre-Finals</div>`);
      htmlParts.push(`<div class="group-body">`);
      htmlParts.push(`<div class="grade-item"><span>Q4</span><span>${get("Q4")}</span></div>`);
      htmlParts.push(`<div class="grade-item"><span>Q5</span><span>${get("Q5")}</span></div>`);
      htmlParts.push(`<div class="grade-item"><span>Q6</span><span>${get("Q6")}</span></div>`);
      htmlParts.push(`<div class="grade-item"><span>PreFinals</span><span>${get("PreFinals")}</span></div>`);
      htmlParts.push(`</div></div>`); // close pre-finals

      // Co-Curricular box
      htmlParts.push(`<div class="group-box">`);
      htmlParts.push(`<div class="group-header">Co-Curricular</div>`);
      htmlParts.push(`<div class="group-body">`);
      htmlParts.push(`<div class="grade-item"><span>Co-Curricular</span><span>${get("Co-Curricular")}</span></div>`);
      htmlParts.push(`</div></div>`);

      // Finals box (Exempted goes here)
      htmlParts.push(`<div class="group-box">`);
      htmlParts.push(`<div class="group-header">Finals</div>`);
      htmlParts.push(`<div class="group-body">`);
      htmlParts.push(`<div class="grade-item"><span>Tentative Score</span><span>${get("Tentative Grade")}</span></div>`);
      htmlParts.push(`<div class="grade-item"><span>Target Score</span><span>${get("Target Score")}</span></div>`);
      htmlParts.push(`<div class="grade-item"><span>Finals Score</span><span>${get("Finals")}</span></div>`);
      htmlParts.push(`<div class="grade-item"><span>Exempted</span><span>${get("Exempted")}</span></div>`);
      htmlParts.push(`</div></div>`);

      // Remarks box (big and centered)
      htmlParts.push(`<div class="group-box">`);
      htmlParts.push(`<div class="group-header">Remarks</div>`);
      htmlParts.push(`<div class="group-body">`);
      htmlParts.push(`<div class="remarks-card" style="color:${remarkColor};">${remarksText}</div>`);
      htmlParts.push(`</div></div>`);

      resultDiv.innerHTML = htmlParts.join("");
    })
    .catch(err => {
      console.error(err);
      resultDiv.innerHTML = `<p style="color:red;">Error loading grade data.</p>`;
    });
});
