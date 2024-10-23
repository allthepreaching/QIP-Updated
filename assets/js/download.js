$(document).ready(function () {
  $("#download").on("click", function () {
    const company = $("#quote-header #company").val();
    const name = $(".cust-data #name").val();
    const email = $(".cust-data #email").val();
    const phone = $("#quote-header #phone").val();
    const notes = $(".cust-data #notes").val();
    if ($("#quote-table tbody tr").length === 0) {
      alert("There must be at least one item on the quote.");
      return;
    }
    if (!name || !email) {
      alert("Name and Email are required.");
      return;
    }
    const tableData = [];
    $("#quote-table tbody tr").each(function () {
      const row = [];
      $(this)
        .find("td")
        .each(function (index, element) {
          if (index < $(this).siblings().length) {
            let cellText = $(this).text().trim();
            cellText = cellText.replace(/"/g, '""');
            row.push(`"${cellText}"`);
          }
        });
      tableData.push(row);
    });
    const totalItems = $("#totalItems").text().trim();
    const totalQty = $("#totalQty").text().trim();
    const totalWeight = $("#totalWeight").text().trim();
    let csvContent = "";
    csvContent += "Quality Industrial Products Group Inc\n";
    csvContent += "dba Quality Fastener Products\n";
    csvContent += "276 Boston Turnpike\n";
    csvContent += "Shrewsbury MA 01545\n";
    csvContent += "508-845-2935\n";
    csvContent += "sales@qualityindustrialproducts.com\n\n";
    csvContent += `"Company","${company}","Total Items","${totalItems} items"\n`;
    csvContent += `"Name","${name}","Total Quantity","${totalQty} pcs"\n`;
    csvContent += `"Email","${email}","Total Weight","${totalWeight} lbs"\n`;
    csvContent += `"Phone","${phone}"\n`;
    csvContent += `"Notes","${notes}"\n\n`;
    csvContent += "Line,Item-Code,Description,Quantity,Weight\n";
    tableData.forEach(function (rowArray, index) {
      let row = rowArray.map((cell) => `${cell}`).join(",");
      csvContent += row + "\n";
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    const formattedDate = `${day}-${month}-${year}`;
    const companyOrName = company || name;
    const filename = `Quote_${formattedDate}_${companyOrName}.csv`;
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.click();
    URL.revokeObjectURL(url);
  });
});
