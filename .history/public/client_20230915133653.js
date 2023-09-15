async function fetchFilterData() {
  try {
    const response = await axios.get("/api/filters"); // API endpoint for fetching filter data
    const filterData = response.data;

    let filterTemplate = document.querySelector("#filterTemplate");
    let filterTemplateInstance = Handlebars.compile(filterTemplate.innerHTML);
    let filterArea = document.getElementById("filterArea");

    if (filterArea) {
      let generatedHTML = filterTemplateInstance(filterData);
      filterArea.innerHTML = generatedHTML;

      attachFilterBoxEventListeners();
    }
  } catch (error) {
    console.error("API Error:", error);
  }
}
function toggleFilterOptions1(element) {
  const optionsList = element.querySelector(".filter-options");
  if (optionsList) {
    optionsList.classList.toggle("hidden");

    if (!optionsList.classList.contains("hidden")) {
      document.body.appendChild(optionsList);
    } else {
      element.appendChild(optionsList);
    }
  }
}

// JavaScript to change position via CSS
function toggleFilterOptions2(element) {
  const optionsList = element.querySelector(".filter-options");
  if (optionsList) {
    optionsList.classList.toggle("hidden");
    optionsList.classList.toggle("show-outside");
  }
}

function attachFilterBoxEventListeners() {
  const filterBoxes = document.querySelectorAll(".filter-box h3");
  filterBoxes.forEach((box) => {
    box.addEventListener("click", function () {
      // Hide all other filter options first
      document.querySelectorAll(".filter-options").forEach((el) => {
        el.classList.add("hidden");
        el.classList.remove("show-outside");
      });

      // Then toggle the clicked filter options
      toggleFilterOptions2(this.parentElement); // Change this to toggleFilterOptions1 for the other method
    });
  });
}

let shoeListTemplateInstance;
let shoesElem;

document.addEventListener("DOMContentLoaded", function () {
  // Compile Handlebars template
  let shoeListTemplate = document.querySelector("#shoeListTemplate");
  if (shoeListTemplate) {
    // Continue with existing logic
    shoeListTemplateInstance = Handlebars.compile(shoeListTemplate.innerHTML);
    shoesElem = document.querySelector(".shoes");
    if (shoesElem) {
      function fetchShoes() {
        axios
          .get("/api/shoes")
          .then(function (response) {
            let shoeList = response.data.data;
            let generatedHTML = shoeListTemplateInstance({
              shoeList: shoeList,
            });
            shoesElem.innerHTML = generatedHTML;
          })
          .catch(function (error) {
            console.error("API Error:", error);
          });
      }
      fetchShoes();
    }
  } else {
    console.error("Handlebars template not found");
  }

  fetchFilterData();

  let currentFilters = {};

  // Function to handle filter button clicks
  // Function to handle filter button clicks
  function handleFilterButtonClick(event) {
    const filterType = event.target.getAttribute("data-filter");
    const filterValue = event.target.getAttribute("data-value");

    if (filterType && filterValue) {
      // Toggle currentFilters object
      if (currentFilters[filterType] === filterValue) {
        delete currentFilters[filterType]; // Remove filter if it's already selected
        event.target.classList.remove("active-filter"); // Remove active state
      } else {
        currentFilters[filterType] = filterValue; // Add filter otherwise
        event.target.classList.add("active-filter"); // Add active state
      }

      // Construct API endpoint based on all active filters
      let apiEndpoint = "/api/shoes/filtered";
      let queryParameters = new URLSearchParams(currentFilters).toString();
      if (queryParameters) {
        apiEndpoint += `?${queryParameters}`;
      }

      // Fetch filtered shoes
      fetchFilteredShoes(apiEndpoint);
    }
  }

  function fetchFilteredShoes(apiEndpoint) {
    axios
      .get(apiEndpoint)
      .then(function (response) {
        let shoeList = response.data.data;
        let generatedHTML = shoeListTemplateInstance({ shoeList: shoeList });
        shoesElem.innerHTML = generatedHTML;
      })
      .catch(function (error) {
        console.error("API Error:", error);
      });
  }

  // Attach event listeners to filter buttons
  const filterArea = document.getElementById("filterArea");
  if (filterArea) {
    filterArea.addEventListener("click", (event) => {
      if (event.target.classList.contains("filter-button")) {
        handleFilterButtonClick(event);
      }
    });
  }

  // signup
  const signupButton = document.querySelector("#signupButton");
  if (signupButton) {
    signupButton.addEventListener("click", () => {
      window.location.href = "/signup";
    });
  }

  // logout
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      window.location.href = "/logout";
    });
  }
  // login
  const loginButton = document.querySelector("#loginButton");
  if (loginButton) {
    loginButton.addEventListener("click", () => {
      window.location.href = "/login";
    });
  }

  let cart = {};

  async function fetchCartItems() {
    const userId = "yourUserIdHere"; // Replace with actual user ID
    const response = await fetch(`/api/cart/${userId}`);
    const cartItems = await response.json();
  
    cart = cartItems.reduce((acc, item) => {
      acc[item.shoe_id] = {
        id: item.shoe_id,
        name: item.name,
        size: item.size,
        quantity: item.quantity
      };
      return acc;
    }, {});
  }
  
  function updateCartUI() {
    let cartItems = Object.values(cart);
  
    let cartTemplate = document.querySelector("#cartTemplate");
    if (cartTemplate) {
      let cartTemplateInstance = Handlebars.compile(cartTemplate.innerHTML);
      let generatedHTML = cartTemplateInstance({ cartItems: cartItems });
  
      let cartItemsContainer = document.querySelector(".cart_items");
      if (cartItemsContainer) {
        cartItemsContainer.innerHTML = generatedHTML;
      }
    }
  }
  
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("add_shoe_button")) {
      const shoeId = event.target.getAttribute("data-id");
      if (cart[shoeId]) {
        cart[shoeId].quantity += 1;
      } else {
        // Fetch details for the new shoe from the server, then add to cart
        fetch(`/api/shoes/${shoeId}`)
          .then(response => response.json())
          .then(shoe => {
            cart[shoeId] = {
              id: shoe.id,
              name: shoe.name,
              size: shoe.size,
              quantity: 1
            };
            updateCartUI();
          });
      }
      updateCartUI();
    }
  });

  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("checkout_button")) {
      // Make API call to perform checkout
      cart = {}; // Clear the cart
      updateCartUI();
    }
  });

  // Get the cart modal and cart button elements
  const cartModal = document.getElementById("cartModal");
  const cartButton = document.querySelector(".cart_button");

  // Toggle the cart modal
  cartButton.addEventListener("click", function () {
    cartModal.classList.toggle("show");
  });

  updateCartUI();
});
