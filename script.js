/* Product Crads */

document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".card");

  cards.forEach(function (card) {
    const expandButton = card.querySelector(".card__expand");
    const constrictButton = card.querySelector(".card__constrict");

    expandButton.addEventListener("click", function () {
      closeAllCardsExcept(card);

      if (!card.classList.contains("is-expanded")) {
        card.classList.add("is-expanded");
        expandButton.style.display = "none";
        constrictButton.style.display = "block";
      }
    });

    constrictButton.addEventListener("click", function () {
      card.classList.remove("is-expanded");
      constrictButton.style.display = "none";
      expandButton.style.display = "block";

      cards.forEach(function (otherCard) {
        otherCard.style.display = "block";
        setTimeout(function () {
          otherCard.style.opacity = "1";
        }, 175);
      });
    });
  });
});

function closeAllCardsExcept(exceptCard) {
  const cards = document.querySelectorAll(".card"); // Select all cards again

  cards.forEach(function (card) {
    if (card !== exceptCard && !card.classList.contains("is-expanded")) {
      card.style.opacity = "0";
      card.style.display = "none";
    }
  });
}

/* Price selecting system */

$(document).ready(function () {
  var slider = $("#slider-range");
  var containerPrice = $("#container-price");

  // Function to handle filtering
  function performPrice() {
    var min_price = parseFloat(
      $("#min_price").val().replace(",", "").replace("€", "").trim()
    );
    var max_price = parseFloat(
      $("#max_price").val().replace(",", "").replace("€", "").trim()
    );
    var searchResults = $("#searchResults");

    // Loop through all cards with the class "card"
    $(".card").each(function () {
      var card = $(this);
      var cardPrice = parseFloat(
        card.attr("class").split(" ")[2].replace(",", ".") // Assuming price is the third class
      );

      if (!isNaN(min_price) && !isNaN(max_price)) {
        if (cardPrice >= min_price && cardPrice <= max_price) {
          card.show(); // Show cards within the price range
        } else {
          card.hide(); // Hide cards outside the price range
        }
      }
    });

    // Update the submit button state
    updateSubmitButtonState();

    // Check if at least one card is visible and the submit button is active
    if (
      $(".card:visible").length > 0 &&
      $(".sf-field-submit").hasClass("submitactive")
    ) {
      // Update the result message
      searchResults.text(
        "Les produits affichés coûtent entre " +
          min_price.toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR",
          }) +
          " et " +
          max_price.toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR",
          }) +
          "."
      );
      searchResults.show(); // Show the result message
    } else {
      searchResults.hide(); // Hide the result message
    }
  }

  // Function to update the filter button state
  function updateSubmitButtonState() {
    var min_price = parseInt($("#min_price").val());
    var max_price = parseInt($("#max_price").val());
    var searchInput = $("#search-input").val().trim();

    var shouldActivateButton =
      searchInput.length > 0 || (!isNaN(min_price) && !isNaN(max_price));
    var filterButton = $(".sf-field-submit");

    if (shouldActivateButton) {
      filterButton.addClass("submitactive");
    } else {
      filterButton.removeClass("submitactive");
    }

    // Update the slider values if input values are valid
    if (!isNaN(min_price) && !isNaN(max_price)) {
      slider.slider("values", [min_price, max_price]);
    }
  }

  // Initialize slider with values from price inputs
  slider.slider({
    range: true,
    orientation: "horizontal",
    min: 0,
    max: 5000,
    step: 50,
    values: [0, 5000],
    slide: function (event, ui) {
      $("#min_price").val(ui.values[0]);
      $("#max_price").val(ui.values[1]);
      updateSubmitButtonState();
    },
  });

  // Initialize slider values on page load
  var min_price_init = parseInt($("#min_price").val());
  var max_price_init = parseInt($("#max_price").val());
  if (!isNaN(min_price_init) && !isNaN(max_price_init)) {
    slider.slider("values", [min_price_init, max_price_init]);
  }

  /* Search Logic */

  function performSearch() {
    var searchQuery = $("#search-input").val().toLowerCase();

    // Loop through all cards and perform the search
    $(".card").each(function () {
      var card = $(this);
      var title = card.find(".card__title").text().toLowerCase();
      var description = card.find(".card__intro").text().toLowerCase();
      var specs = card.find("#intro").text().toLowerCase(); // Assuming specs are inside an element with id "intro"

      // Check if the search query is found in the title, description, or specs
      if (
        title.includes(searchQuery) ||
        description.includes(searchQuery) ||
        specs.includes(searchQuery)
      ) {
        card.show(); // Show cards that match the search query
      } else {
        card.hide(); // Hide cards that do not match the search query
      }
    });

    // Update the submit button state
    updateSubmitButtonState();
  }

  /* Sorting radio buttons */

  // Function to bind event listeners for the sorting radio buttons
  function setupSortingEventListeners() {
    $("#sf-input-sort-asc").on("change", function () {
      if (this.checked) {
        $("#sf-input-sort-desc").prop("checked", false);
        sortCardsByPrice("asc");
        updateCardPrices();
      }
    });

    $("#sf-input-sort-desc").on("change", function () {
      if (this.checked) {
        $("#sf-input-sort-asc").prop("checked", false);
        sortCardsByPrice("desc");
        updateCardPrices();
      }
    });
  }

  // Function to sort cards by price (ascending or descending)
  function sortCardsByPrice(order) {
    var cardContainer = $(".container");
    var cards = $(".card:visible").toArray();

    // Sort the cards based on price
    cards.sort(function (a, b) {
      var priceA = parseFloat($(a).data("price"));
      var priceB = parseFloat($(b).data("price"));

      if (order === "asc") {
        return priceA - priceB;
      } else if (order === "desc") {
        return priceB - priceA;
      }
    });

    // Append the sorted cards to the container
    cardContainer.empty();
    cards.forEach(function (card) {
      cardContainer.append(card);
    });
  }

  // Function to update the cards' data-price attribute
  function updateCardPrices() {
    $(".card").each(function () {
      var card = $(this);
      var price = parseFloat(
        card.attr("class").split(" ")[2].replace(",", ".")
      );
      card.data("price", price);
    });
  }

  // Call the setupSortingEventListeners and updateCardPrices functions initially
  setupSortingEventListeners();
  updateCardPrices();

  /* Filter System */

  // Function to handle filtering
  function performFilter() {
    // Get all the checked checkbox IDs
    var checkedFilters = $(".sf-input-checkbox:checked")
      .map(function () {
        return this.value;
      })
      .get();

    if (checkedFilters.length > 0) {
      // Show cards with matching IDs and hide others
      $(".card").each(function () {
        var cardId = $(this).attr("id");
        if (checkedFilters.includes(cardId)) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    } else {
      $(".card").show();
    }
  }

  /* Filter Menu */

  var checkvar = false;

  // Check
  function check() {
    if ($(".sf-input-checkbox").is(":checked")) {
      checkvar = true;
    } else {
      checkvar = false;
    }
  }

  $(document).on("click", "#filter > form > ul > li", function (e) {
    var $this = $(this);

    // Check if the clicked element is a checkbox or radio button
    if ($(e.target).is(".sf-input-checkbox, .sf-input-radio")) {
      return;
    }

    // Toggle the "active" class
    if ($this.hasClass("active")) {
      if ($(e.target).is(".sf-input-checkbox")) {
        // Handle checkbox clicks within the li
        check();

        if (checkvar == true) {
          $(".sf-field-submit").addClass("submitactive");
        } else {
          $(".sf-field-submit").removeClass("submitactive");
        }

        var parent = $(e.target).closest(
          "li.sf-field-taxonomy-geschlecht,li.sf-field-taxonomy-anlass"
        );
        if ($(e.target).prop("checked")) {
          parent.addClass("filter-selected");
        } else {
          parent.removeClass("filter-selected");
        }

        if (parent.find(".sf-input-checkbox").is(":checked")) {
          parent.addClass("hasfilter");
        } else {
          parent.removeClass("hasfilter");
        }
      } else {
        // Remove "active" class for non-checkbox clicks
        $this.removeClass("active");
      }
    } else {
      // Add "active" class for non-active items
      $("#filter > form > ul > li").not($this).removeClass("active");
      $this.addClass("active");
    }
  });

  $(document).on("change", ".sf-input-checkbox", function () {
    check();

    // Check if any checkbox is checked
    if ($(".sf-input-checkbox:checked").length > 0) {
      $(".sf-field-submit").addClass("submitactive");
    } else {
      $(".sf-field-submit").removeClass("submitactive");
    }

    // Add or remove a class to style the selected filters
    var $parentLi = $(this).closest(
      "li.sf-field-taxonomy-geschlecht,li.sf-field-taxonomy-anlass"
    );
    if ($(this).prop("checked")) {
      $parentLi.addClass("filter-selected");
    } else {
      $parentLi.removeClass("filter-selected");
    }

    if ($parentLi.find(".sf-input-checkbox").is(":checked")) {
      $parentLi.addClass("hasfilter");
    } else {
      $parentLi.removeClass("hasfilter");
    }
  });

  $(document).on("click", ".sf-input-radio", function () {
    $(".sf-input-radio").closest("li").removeClass("active");
    $(this).closest("li").addClass("active");
  });

  $(document).ready(function () {
    // Your existing code for opening the menu on a trigger click
    $("#menu-trigger").click(function () {
      $("#filter").addClass("active");
    });

    // Close the menu when the close button is clicked
    $("#close-button").click(function () {
      // Reduce the opacity of the wrapper to 0
      $("#wrapper").css("opacity", 0);
      setupSortingEventListeners();
      updateCardPrices();
      performFilter();

      // After a brief delay, hide the wrapper and deactivate the button
      setTimeout(function () {
        $("#wrapper").css("display", "none");
      }, 100); // Adjust the delay as needed

      $("body *:not(#wrapper, #wrapper *)").css("filter", "none");
      $("#tab-bar .tab:eq(1)").removeClass("active");
    });

    // Close the menu when a click occurs outside the menu
    $(document).on("click", function (e) {
      if (!$(e.target).closest("#filter, #menu-trigger").length) {
        $("#close-button").click();
      }
    });
  });

  /* Event listeners */

  $("#search-input").on("input", function () {
    updateSubmitButtonState();
  });

  $("#min_price, #max_price").on("input", function () {
    updateSubmitButtonState();
  });

  $(document).on("click", ".sf-input-checkbox, .sf-input-radio", function () {
    containerPrice.toggleClass(
      "filter-opened",
      $(this)
        .closest(".sf-field-taxonomy-geschlecht, .sf-field-taxonomy-anlass")
        .hasClass("active")
    );
  });

  $("#min_price, #max_price").on("change", function () {
    updateSubmitButtonState();
  });

  $("#min_price, #max_price").on("paste keyup", function () {
    updateSubmitButtonState();
  });

  // Event listener for checkbox clicks
  $(".sf-input-checkbox").on("change", function () {
    // Update the selectedFilters array when a checkbox is changed
    selectedFilters = $(".sf-input-checkbox:checked")
      .map(function () {
        return $(this).val();
      })
      .get();
  });

  // Event listener for the filter submit button
  $(".sf-field-submit input").on("click", function (e) {
    e.preventDefault();
    performFilter();
    performPrice();
    performSearch();
    setupSortingEventListeners();
    updateCardPrices();
    $("#close-button").click();
  });
});

/* Top menu */

var phase = 0;
$("#tab-bar .tab")
  .mousedown(function () {
    if (!$(this).is(".active") && phase == 0) {
      phase = 1;
      $(".tab.active div").animate(
        {
          top: 0,
        },
        250,
        function () {
          $(".tab div").removeAttr("style");
          $(".tab.active").removeClass("active");
        }
      );
    }
  })
  .mouseup(function () {
    $this = $(this);
    if (!$(this).is(".active") && phase == 1) {
      phase = 2;
      $(this)
        .find("div")
        .animate(
          {
            top: 0,
          },
          250,
          function () {
            $this.find("div").removeAttr("style");
            $this.addClass("active");
            phase = 0;

            // Check if it's the first button (house) and navigate to the link
            if ($this.index() === 0) {
              window.open("https://enigmatech.site", "_blank");
            } else if ($this.index() === 1) {
              // Show the #wrapper and mark it as active
              $("#wrapper")
                .addClass("active")
                .css("opacity", 1)
                .css("display", "block"); // Display the wrapper with opacity 1 immediately
              $("#tab-bar .tab:eq(2)").removeClass("active");

              // Apply blur to everything except the #wrapper and its children
              $("body *:not(#wrapper, #wrapper *)").css("filter", "blur(5px)");
            } else if ($this.index() === 2) {
              location.reload();
            }
          }
        );
    }
  });
