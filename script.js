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

let hiddenCards = [];
let appliedFilters = [];
let invisibleCards = [];

/* Product Cards */
document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".card");
  cards.forEach(function (card) {
    const expandButton = card.querySelector(".card__expand");
    const constrictButton = card.querySelector(".card__constrict");
    const closeButton = card.querySelector(".card__close");
    const hero = card.querySelector(".card__hero");

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
      showOnlyInvisibleCards();
    });

    closeButton.addEventListener("click", function () {
      card.classList.remove("is-expanded");
      constrictButton.style.display = "none";
      expandButton.style.display = "block";
      showOnlyInvisibleCards();
      performFilter();
    });

    hero.addEventListener("click", function () {
      // Add this event listener
      closeAllCardsExcept(card);
      if (!card.classList.contains("is-expanded")) {
        card.classList.add("is-expanded");
        expandButton.style.display = "none";
        constrictButton.style.display = "block";
      }
    });

    function closeAllCardsExcept(exceptCard) {
      cards.forEach(function (currentCard) {
        if (
          currentCard !== exceptCard &&
          !currentCard.classList.contains("is-expanded")
        ) {
          if (!currentCard.classList.contains("is-hidden")) {
            currentCard.style.opacity = "0";
            currentCard.style.height = "0";
            currentCard.classList.add("is-hidden");
            invisibleCards.push(currentCard);
          }
        }
      });
    }

    function showOnlyInvisibleCards() {
      invisibleCards.forEach(function (invisibleCard) {
        if (invisibleCard.classList.contains("is-hidden")) {
          invisibleCard.style.opacity = "1";
          invisibleCard.style.height = "auto";
          invisibleCard.classList.remove("is-hidden");
        }
      });
      invisibleCards = [];
    }
  });
});

/* FILTERS */

$(document).ready(function () {
  var slider = $("#slider-range");
  var containerPrice = $("#container-price");

  /* Price selecting system with the slider */
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
      performFilter(); // Trigger the filter function when slider values change
    },
  });

  // Initialize slider values on page load
  var min_price_init = parseInt($("#min_price").val());
  var max_price_init = parseInt($("#max_price").val());
  if (!isNaN(min_price_init) && !isNaN(max_price_init)) {
    slider.slider("values", [min_price_init, max_price_init]);
  }

  /* Price sorting radio buttons */

  // Function to update the cards' data-price attribute
  function updateCardPrices() {
    $(".card").each(function (index) {
      var card = $(this);
      var classList = card.attr("class").split(" ");

      // Find the class that contains the price information with non-breaking space as separator
      var priceClass = classList.find(function (className) {
        return /^[\d ]+,\d{2}$/.test(className); // Check for a pattern like "1 331,66"
      });

      var price;
      if (priceClass) {
        var priceString = priceClass.replace(/[^\d ,]/g, ""); // Extract digits, non-breaking spaces, and commas
        price = parseFloat(priceString.replace(" ", "").replace(",", ".")); // Replace non-breaking space with a regular space and comma with a dot for parsing
      } else {
        price = 0; // Default price for cards without a valid price
      }

      card.data("price", price);
    });
  }

  // Function to sort cards by price (ascending or descending)
  function sortCardsByPrice(order) {
    var cards = $(".card").toArray();

    // Sort the cards based on price
    cards.sort(function (a, b) {
      var priceA = parseFloat($(a).data("price")) * 100;
      var priceB = parseFloat($(b).data("price")) * 100;

      if (order === "asc") {
        return priceA - priceB;
      } else if (order === "desc") {
        return priceB - priceA;
      }
    });

    $(".container").empty();
    cards.forEach(function (card, index) {
      $(".container").append(card);
    });
  }

  // Function to set up sorting event listeners
  function setupSortingEventListeners() {
    $("#asc").on("click", function () {
      sortCardsByPrice("asc");
    });

    $("#desc").on("click", function () {
      sortCardsByPrice("desc");
    });
  }

  // Call the setupSortingEventListeners and updateCardPrices functions initially
  setupSortingEventListeners();
  updateCardPrices();

  /* Filter System */

  // Function to handle filtering based on card ID, price, and search
  function performFilter() {
    const checkedFilters = $(".sf-input-checkbox:checked")
      .map(function () {
        return this.value;
      })
      .get();

    const minPrice = parseFloat($("#min_price").val().replace(/,/g, ".")) || 0;
    const maxPrice =
      parseFloat($("#max_price").val().replace(/,/g, ".")) || Infinity;
    const searchQuery = $("#search-input").val().toLowerCase();

    const hiddenCards = [];
    let hiddenCardCount = 0; // New variable to count hidden cards

    $(".card").each(function () {
      const card = $(this);
      const cardId = card.attr("id");
      const cardPrice = parseFloat(card.data("price")) || 0;
      const title = card.find(".card__title").text().toLowerCase();
      const description = card.find(".card__intro").text().toLowerCase();
      const specs = card.find("#intro").text().toLowerCase();

      if (
        (checkedFilters.length === 0 || checkedFilters.includes(cardId)) &&
        cardPrice >= minPrice &&
        cardPrice <= maxPrice &&
        (searchQuery === "" ||
          title.includes(searchQuery) ||
          description.includes(searchQuery) ||
          specs.includes(searchQuery))
      ) {
        card.removeClass("is-hidden");
      } else {
        card.addClass("is-hidden");
        hiddenCards.push(this);
        hiddenCardCount++; // Increment hidden card count
      }
    });

    // Hide all videos
    $("iframe").css("display", "none");

    if (checkedFilters.length === 0) {
      // No checkboxes are checked, show the "default" video
      $("iframe.Default").css("display", "block");
    } else {
      // Show videos for the selected filters
      checkedFilters.forEach((filter) => {
        const classSelector = `iframe.${filter}`;
        $(classSelector).css("display", "block");
      });
    }

    // Check if all cards are hidden and show the ".no" div if so
    if (hiddenCardCount === $(".card").length) {
      $(".no").show();
    } else {
      $(".no").hide();
    }

    console.log(
      `Hidden cards:`,
      hiddenCards.map((card) => card.id)
    );
  }

  // Array to store the checked checkboxes
  var checkedCheckboxes = [];

  // Function to update the filter button state
  function updateSubmitButtonState() {
    var min_price = parseInt($("#min_price").val());
    var max_price = parseInt($("#max_price").val());
    var searchInput = $("#search-input").val().trim();
    var allUnchecked = $(".sf-input-checkbox:checked").length === 0;

    var shouldActivateButton =
      searchInput.length > 0 ||
      (!isNaN(min_price) && !isNaN(max_price)) ||
      allUnchecked ||
      checkedCheckboxes.length > 0;

    var filterButton = $(".sf-field-submit");

    if (shouldActivateButton) {
      filterButton.addClass("submitactive");
    } else {
      filterButton.removeClass("submitactive");
    }

    // Update the slider values if input values are valid
    if (!isNaN(min_price) && !isNaN(max_price)) {
      filterButton.addClass("submitactive");
      slider.slider("values", [min_price, max_price]);
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
    performFilter();
  });

  // Event listener for slider changes
  slider.on("slide", function (event, ui) {
    updateSubmitButtonState();
  });

  $("#min_price, #max_price").on("input", function () {
    updateSubmitButtonState();
    performFilter();
  });

  $(document).on("click", ".sf-input-checkbox", function () {
    containerPrice.toggleClass(
      "filter-opened",
      $(this)
        .closest(".sf-field-taxonomy-geschlecht, .sf-field-taxonomy-anlass")
        .hasClass("active")
    );
    performFilter();
  });

  $(".sf-input-checkbox").on("change", function () {
    updateSubmitButtonState();
    if (this.checked) {
      checkedCheckboxes.push(this.value);
    } else {
      checkedCheckboxes = checkedCheckboxes.filter(
        (item) => item !== this.value
      );
    }

    if ($(".sf-input-checkbox:checked").length === 0) {
      hiddenCards = [];
      $(".sf-field-submit").removeClass("submitactive");
    }

    performFilter();
  });

  // Event listener for checkbox clicks
  $(".sf-input-checkbox").on("change", function () {
    // Update the selectedFilters array when a checkbox is changed
    selectedFilters = $(".sf-input-checkbox:checked")
      .map(function () {
        return $(this).val();
      })
      .get();
    performFilter();
  });

  $("#min_price, #max_price").on("change", function () {
    updateSubmitButtonState();
    performFilter();
  });

  $("#min_price, #max_price").on("paste keyup", function () {
    updateSubmitButtonState();
    performFilter();
  });

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

  // Event listener for the filter submit button
  $(".sf-field-submit input").on("click", function (e) {
    e.preventDefault();
    $("#close-button").click();
    // If the button is clicked, disable it for good
    $(".sf-field-submit").removeClass("submitactive");
    checkedCheckboxes = []; // Clear the checked checkboxes array
  });
});

$(document).ready(function () {
  // Hide all iframes except those with class "Default"
  $("iframe:not(.Default)").css("display", "none");
});
