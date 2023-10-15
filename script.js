/* Product Crads */
document.addEventListener("DOMContentLoaded", function() {
  const cards = document.querySelectorAll(".card");

  cards.forEach(function(card) {
      const expandButton = card.querySelector(".card__expand");
      const constrictButton = card.querySelector(".card__constrict");

      expandButton.addEventListener("click", function() {
          closeAllCardsExcept(card);

          if (!card.classList.contains("is-expanded")) {
              card.classList.add("is-expanded");
              expandButton.style.display = "none";
              constrictButton.style.display = "block";
          }
      });

      constrictButton.addEventListener("click", function() {
          card.classList.remove("is-expanded");
          constrictButton.style.display = "none";
          expandButton.style.display = "block";

          cards.forEach(function(otherCard) {
              otherCard.style.display = "block";
              setTimeout(function() {
                  otherCard.style.opacity = "1";
              }, 175);
          });
      });
  });
});

function closeAllCardsExcept(exceptCard) {
  const cards = document.querySelectorAll(".card"); // Select all cards again

  cards.forEach(function(card) {
      if (card !== exceptCard && !card.classList.contains("is-expanded")) {
          card.style.opacity = "0";
          card.style.display = "none";
      }
  });
}

let hiddenCards = $();
let appliedFilters = [];


/* Price selecting system */

$(document).ready(function() {
  var slider = $("#slider-range");
  var containerPrice = $("#container-price");

  // Function to handle filtering
  function performPrice() {
      // Get min and max values
      const minPrice = parseFloat($('#min_price').val().replace(/,/g, '.'));
      const maxPrice = parseFloat($('#max_price').val().replace(/,/g, '.'));
      const visibleCards = $('.card').not(hiddenCards);

      // Apply the price filter
      $(visibleCards).each(function() {
          const card = $(this);
          const cardPrice = parseFloat(card.data('price'));

          // Check if the card is hidden due to category filter
          if (!appliedFilters.includes(card.attr("id"))) {
              return;
          }

          // Show/hide based on both category and price range
          if (cardPrice >= minPrice && cardPrice <= maxPrice) {
              card.removeClass('is-hidden');
          } else {
              card.addClass('is-hidden');
          }
      });

      hiddenCards = hiddenCards.add(newlyHiddenCards);
  }

  // Function to update the filter button state
  function updateSubmitButtonState() {
      var min_price = parseInt($("#min_price").val());
      var max_price = parseInt($("#max_price").val());
      var searchInput = $("#search-input").val().trim();
      var allUnchecked = $(".sf-input-checkbox:checked").length === 0;

      var shouldActivateButton =
          searchInput.length > 0 || (!isNaN(min_price) && !isNaN(max_price)) || allUnchecked;
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
      slide: function(event, ui) {
          $("#min_price").val(ui.values[0]);
          $("#max_price").val(ui.values[1]);
      }
  });

  // Initialize slider values on page load
  var min_price_init = parseInt($("#min_price").val());
  var max_price_init = parseInt($("#max_price").val());
  if (!isNaN(min_price_init) && !isNaN(max_price_init)) {
      slider.slider("values", [min_price_init, max_price_init]);
  }

  /* Search Logic */

  function performSearch() {
      const searchQuery = $("#search-input").val().toLowerCase();
      const visibleCards = $('.card').not(hiddenCards);

      // Apply the search filter
      $(visibleCards).each(function() {
          const card = $(this);
          const title = card.find(".card__title").text().toLowerCase();
          const description = card.find(".card__intro").text().toLowerCase();
          const specs = card.find("#intro").text().toLowerCase();

          // Check if the card is hidden due to category and/or price filter
          if (!appliedFilters.includes(card.attr("id")) || card.hasClass("is-hidden")) {
              return;
          }

          // Check if the search query is found in the title, description, or specs
          if (title.includes(searchQuery) || description.includes(searchQuery) || specs.includes(searchQuery)) {
              card.removeClass('is-hidden');
          } else {
              card.addClass('is-hidden');
          }
      });

      hiddenCards = hiddenCards.add(newlyHiddenCards);
  }

  /* Sorting radio buttons */

  // Function to update the cards' data-price attribute
  function updateCardPrices() {
      $(".card").each(function(index) {
          var card = $(this);
          var classList = card.attr("class").split(" ");

          // Find the class that contains the price information with non-breaking space as separator
          var priceClass = classList.find(function(className) {
              return /^[\d ]+,\d{2}$/.test(className); // Check for a pattern like "1 331,66"
          });

          var price;
          if (priceClass) {
              var priceString = priceClass.replace(/[^\d ,]/g, ''); // Extract digits, non-breaking spaces, and commas
              price = parseFloat(priceString.replace(" ", "").replace(",", ".")); // Replace non-breaking space with a regular space and comma with a dot for parsing
          } else {
              price = 0; // Default price for cards without a valid price
          }

          card.data("price", price);
      });
  }


  // Function to sort cards by price (ascending or descending)
  function sortCardsByPrice(order) {
      var cards = $(".card").toArray(); // Select all cards

      // Sort the cards based on price
      cards.sort(function(a, b) {
          var priceA = parseFloat($(a).data("price")) * 100;
          var priceB = parseFloat($(b).data("price")) * 100;

          if (order === "asc") {
              return priceA - priceB;
          } else if (order === "desc") {
              return priceB - priceA;
          }
      });


      // Append the sorted cards back to the container
      $(".container").empty();
      cards.forEach(function(card, index) {
          $(".container").append(card);
      });

  }



  // Function to set up sorting event listeners
  function setupSortingEventListeners() {
      // Add event listeners to your radio buttons or sorting controls
      // For example, if you have radio buttons with IDs 'asc' and 'desc'
      $('#asc').on('click', function() {
          sortCardsByPrice('asc');
      });

      $('#desc').on('click', function() {
          sortCardsByPrice('desc');
      });
  }

  // Call the setupSortingEventListeners and updateCardPrices functions initially
  setupSortingEventListeners();
  updateCardPrices();


  /* Filter System */

  // Function to handle filtering
  function performFilter() {
      // Get all the checked checkbox IDs
      const visibleCards = $('.card').not(hiddenCards);
      const checkedFilters = $(".sf-input-checkbox:checked")
          .map(function() {
              return this.value;
          })
          .get();

      // Update the applied filters and keep track of them
      appliedFilters = checkedFilters;

      // Apply the category filter
      if (checkedFilters.length > 0) {
          $(visibleCards).each(function() {
              const cardId = $(this).attr("id");
              if (checkedFilters.includes(cardId)) {
                  $(this).removeClass('is-hidden');
              } else {
                  $(this).addClass('is-hidden');
              }
          });
      } else {
          $(visibleCards).removeClass('is-hidden');
      }

      hiddenCards = hiddenCards.add(newlyHiddenCards);
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

  $(document).on("click", "#filter > form > ul > li", function(e) {
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

  $(document).on("change", ".sf-input-checkbox", function() {
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

  $(document).on("click", ".sf-input-radio", function() {
      $(".sf-input-radio").closest("li").removeClass("active");
      $(this).closest("li").addClass("active");
  });

  $(document).ready(function() {
      // Your existing code for opening the menu on a trigger click
      $("#menu-trigger").click(function() {
          $("#filter").addClass("active");
      });

      // Close the menu when the close button is clicked
      $("#close-button").click(function() {
          // Reduce the opacity of the wrapper to 0
          $("#wrapper").css("opacity", 0);

          // After a brief delay, hide the wrapper and deactivate the button
          setTimeout(function() {
              $("#wrapper").css("display", "none");
          }, 100); // Adjust the delay as needed

          $("body *:not(#wrapper, #wrapper *)").css("filter", "none");
          $("#tab-bar .tab:eq(1)").removeClass("active");
      });

      // Close the menu when a click occurs outside the menu
      $(document).on("click", function(e) {
          if (!$(e.target).closest("#filter, #menu-trigger").length) {
              $("#close-button").click();
          }
      });
  });

  /* Event listeners */

  $("#search-input").on("input", function() {
      updateSubmitButtonState();
      performSearch();
  });

  $("#min_price, #max_price").on("input", function() {
      updateSubmitButtonState();
      performPrice();
  });

  $(document).on("click", ".sf-input-checkbox", function() {
      containerPrice.toggleClass(
          "filter-opened",
          $(this)
          .closest(".sf-field-taxonomy-geschlecht, .sf-field-taxonomy-anlass")
          .hasClass("active")
      );
      performFilter();
  });

  $(".sf-input-checkbox").on("change", function() {
      // Check if all checkboxes are unchecked
      if ($(".sf-input-checkbox:checked").length === 0) {
          performFilter();
      } else {
          performFilter();
      }
  });

  $("#min_price, #max_price").on("change", function() {
      updateSubmitButtonState();
      performPrice();
  });

  $("#min_price, #max_price").on("paste keyup", function() {
      updateSubmitButtonState();
      performPrice();
  });

  // Event listener for checkbox clicks
  $(".sf-input-checkbox").on("change", function() {
      // Update the selectedFilters array when a checkbox is changed
      selectedFilters = $(".sf-input-checkbox:checked")
          .map(function() {
              return $(this).val();
          })
          .get();
  });

  $(".sf-input-checkbox").on("change", function() {
      performFilter();
      performPrice();
      performSearch();
  });

  // Function to bind event listeners for the sorting radio buttons
  function setupSortingEventListeners() {
      $("#sf-input-sort-asc").on("change", function() {
          if (this.checked) {
              $("#sf-input-sort-desc").prop("checked", false);
              sortCardsByPrice("asc");
              updateCardPrices();
          }
      });

      $("#sf-input-sort-desc").on("change", function() {
          if (this.checked) {
              $("#sf-input-sort-asc").prop("checked", false);
              sortCardsByPrice("desc");
              updateCardPrices();
          }
      });
  }

  // Event listener for the filter submit button
  $(".sf-field-submit input").on("click", function(e) {
      e.preventDefault();
      $("#close-button").click();
  });
});

/* Top menu */

var phase = 0;
$("#tab-bar .tab")
  .mousedown(function() {
      if (!$(this).is(".active") && phase == 0) {
          phase = 1;
          $(".tab.active div").animate({
                  top: 0,
              },
              250,
              function() {
                  $(".tab div").removeAttr("style");
                  $(".tab.active").removeClass("active");
              }
          );
      }
  })
  .mouseup(function() {
      $this = $(this);
      if (!$(this).is(".active") && phase == 1) {
          phase = 2;
          $(this)
              .find("div")
              .animate({
                      top: 0,
                  },
                  250,
                  function() {
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