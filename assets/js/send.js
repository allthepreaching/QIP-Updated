$(document).ready(function () {
  $("#send").on("click", function (event) {
    event.preventDefault(); // Prevent default form submission
    console.log("Send button clicked");

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
            row.push(cellText);
          }
        });
      tableData.push(row);
    });

    const totalItems = $("#totalItems").text().trim();
    const totalQty = $("#totalQty").text().trim();
    const totalWeight = $("#totalWeight").text().trim();

    console.log("Sending AJAX request");
    $.ajax({
      url: "process_form.php",
      type: "POST",
      data: {
        company: company,
        name: name,
        email: email,
        phone: phone,
        notes: notes,
        totalItems: totalItems,
        totalQty: totalQty,
        totalWeight: totalWeight,
        tableData: tableData,
      },
      success: function (response) {
        console.log("AJAX request successful");
        alert(response);
      },
      error: function (xhr, status, error) {
        console.error("AJAX Error: ", status, error);
        alert("An error occurred while submitting the form.");
      },
    });
  });
});
