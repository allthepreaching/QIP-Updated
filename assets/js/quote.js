$(window).on("load", function () {
  $.getJSON("/fetch_cat_tree.php", function (treeData) {
    const buildTree = (data, parentId = null) => {
      const children = data
        .filter((item) => item.Parent_ID === parentId)
        .map((item) => {
          return {
            title: item.Title,
            key: item.Key,
            folder: item.Folder === "TRUE",
            lazy: item.Lazy === "TRUE",
            children: buildTree(data, item.ID),
          };
        });
      return children;
    };

    const hierarchicalData = buildTree(treeData);

    $("#cat-tree").fancytree({
      source: hierarchicalData,
      activeVisible: true,
      aria: true,
      autoActivate: true,
      autoCollapse: true,
      autoScroll: false,
      clickFolderMode: 3,
      checkbox: false,
      checkboxAutoHide: undefined,
      click: function (event, data) {
        let node = data.node;
        if (!node.folder) {
          let key = node.key;
          $.getJSON("/fetch_table_data.php?table=" + key, function (data) {
            let tbody = $("#item-table tbody");
            tbody.empty();
            data.forEach(function (item) {
              let row =
                "<tr>" +
                "<td>" +
                item["Item_Code"] +
                "</td>" +
                "<td>" +
                item["Description"] +
                "</td>" +
                "<td>" +
                "<button class='button qty-btn' style='margin-left: .25em;'>" +
                item["Case"] +
                "</button>" +
                "</td>" +
                "<td>" +
                "<button class='button qty-btn' style='margin-left: .25em;'>" +
                item["Box"] +
                "</button>" +
                "</td>" +
                "<td>" +
                "<input type='number' class='piece-input' data-piece='" +
                item["Piece"] +
                "' min='0' />" +
                "<button class='button add-btn' style='margin-left: .25em;'>+</button>" +
                "</td>" +
                "<td>" +
                parseFloat(item["Lbs_per_Ea"]).toFixed(5) +
                "</td>" +
                "</tr>";
              tbody.append(row);
            });
          });
        }
      },
      debugLevel: 4,
      disabled: false,
      focusOnSelect: true,
      escapeTitles: true,
      generateIds: true,
      idPrefix: "ft_",
      icon: true,
      keyboard: true,
      keyPathSeparator: "/",
      minExpandLevel: 1,
      quicksearch: true,
      rtl: false,
      selectMode: 2,
      tabindex: "0",
      titlesTabbable: true,
      tooltip: true,
      init: function (event, data) {
        if (data.tree.getRootNode().children.length > 0) {
          data.tree.getRootNode().children[0].setExpanded(true);
        }
      },
    });
  }).fail(function (jqxhr, textStatus, error) {
    console.error("Request Failed: " + textStatus + ", " + error);
  });
});

function updateQuoteTotals() {
  let totalQty = 0;
  let totalWeight = 0;
  let totalItems = 0;
  $("#quote-table tbody tr").each(function () {
    let qty = parseFloat($(this).find("td:eq(3)").text());
    let weight = parseFloat($(this).find("td:eq(4)").text());
    totalQty += isNaN(qty) ? 0 : qty;
    totalWeight += isNaN(weight) ? 0 : weight;
    totalItems++;
  });
  $("#totalQty").text(totalQty);
  $("#totalWeight").text(totalWeight.toFixed(2));
  $("#totalItems").text(totalItems);
}

$(document).on("click", "#item-table tbody td .qty-btn", function () {
  let $td = $(this);
  let $tr = $td.closest("tr");
  let itemCode = $tr.find("td:eq(0)").text();
  let description = $tr.find("td:eq(1)").text();
  let qty = $td.text();
  let lbsPerea = parseFloat($tr.find("td:eq(5)").text()).toFixed(5);
  let weight = lbsPerea * qty;
  let lineNumber = $("#quote-table tbody tr").length + 1;
  let quoteRow =
    "<tr>" +
    "<td>" +
    lineNumber +
    "</td>" +
    "<td>" +
    itemCode +
    "</td>" +
    "<td>" +
    description +
    "</td>" +
    "<td>" +
    qty +
    "</td>" +
    "<td>" +
    weight.toFixed(2) +
    "</td>" +
    "<td>" +
    "<button class='remove-btn'> X </button>" +
    "</td>" +
    "</tr>";
  $("#quote-table tbody").append(quoteRow);
  updateQuoteTotals();
});

$(document).on("click", "#quote-table tbody tr", function () {
  $(this).remove();
  updateQuoteTotals();
});

$(document).on("click", "#clearQuoteTable", function () {
  $("#quote-table tbody").empty();
  updateQuoteTotals();
  $("#company").val("");
  $("#name").val("");
  $("#email").val("");
  $("#phone").val("");
  $("#notes").val("");
  $(".piece-input").val("");
});

document.addEventListener("DOMContentLoaded", function () {
  const viewQuoteList = document.getElementById("viewQuoteList");
  const closeQuoteList = document.getElementById("closeQuoteList");
  const quoteListSection = document.getElementById("quoteListSection");
  viewQuoteList.addEventListener("click", function () {
    viewQuoteList.style.display = "none";
    closeQuoteList.style.display = "inline-block";
    closeQuoteList.style.marginLeft = "0";
    quoteListSection.style.display = "flex";
    quoteListSection.style.flexDirection = "column";
    quoteListSection.style.justifyContent = "center";
    quoteListSection.style.alignItems = "center";
  });
  closeQuoteList.addEventListener("click", function () {
    viewQuoteList.style.display = "inline-block";
    closeQuoteList.style.display = "none";
    quoteListSection.style.display = "none";
  });
});

$(document).on("input", ".piece-input", function () {
  if (this.value < 0) {
    this.value = 0;
  }
});

$(document).on("click", ".add-btn", function () {
  let $button = $(this);
  let $tr = $button.closest("tr");
  let itemCode = $tr.find("td:eq(0)").text();
  let description = $tr.find("td:eq(1)").text();
  let qty = $tr.find(".piece-input").val();
  let lbsPerea = parseFloat($tr.find("td:eq(5)").text()).toFixed(5);
  if (qty < 1) {
    alert("Quantity must be at least 1.");
    return;
  }
  let weight = lbsPerea * qty;
  let lineNumber = $("#quote-table tbody tr").length + 1;
  let quoteRow =
    "<tr>" +
    "<td>" +
    lineNumber +
    "</td>" +
    "<td>" +
    itemCode +
    "</td>" +
    "<td>" +
    description +
    "</td>" +
    "<td>" +
    qty +
    "</td>" +
    "<td>" +
    weight.toFixed(2) +
    "</td>" +
    "<td>" +
    "<button class='remove-btn'> X </button>" +
    "</td>" +
    "</tr>";
  $("#quote-table tbody").append(quoteRow);
  updateQuoteTotals();
});
