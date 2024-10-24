$(document).ready(function () {
  $("#send").on("click", function (event) {
    event.preventDefault(); // Prevent default form submission

    const company = $("#quote-header #company").val();
    const name = $(".cust-data #name").val();
    const email = $(".cust-data #email").val();
    const phone = $("#quote-header #phone").val();
    const notes = $(".cust-data #notes").val();
    const viewQuoteList = document.getElementById("viewQuoteList");
    const closeQuoteList = document.getElementById("closeQuoteList");
    const quoteListSection = document.getElementById("quoteListSection");

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

    // Show spinner/message
    $("#spinner").show();
    $("#spinner").css("display", "flex");

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
        $("#spinner").hide();
        alert(response);
        $("#cust-form")[0].reset();
        $("#quote-table tbody").empty();
        viewQuoteList.style.display = "inline-block";
        closeQuoteList.style.display = "none";
        quoteListSection.style.display = "none";
      },
      error: function (xhr, status, error) {
        $("#spinner").hide();
        alert("An error occurred while submitting the form.");
      },
    });
  });
});
