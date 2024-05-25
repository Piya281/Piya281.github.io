// Initialize Firebase (ADD YOUR OWN DATA)
var firebaseConfig = {
  apiKey: "AIzaSyC16izOc-SFwMdw-kBtloSbeYj_qFU09qM",
  authDomain: "backyard-d9e83.firebaseapp.com",
  databaseURL: "https://backyard-d9e83-default-rtdb.firebaseio.com",
  projectId: "backyard-d9e83",
  storageBucket: "backyard-d9e83.appspot.com",
  messagingSenderId: "816339018282",
  appId: "1:816339018282:web:dce4264a94937190e49953",
  measurementId: "G-N8YK1GR8FB"
};
firebase.initializeApp(firebaseConfig);

// Reference orders collection in the Firebase database
const ordersRef = firebase.database().ref('orders');

document.addEventListener("DOMContentLoaded", function() {
  const addButton = document.querySelectorAll(".dish-add-btn");
  const selectedItemsList = document.getElementById("selected-items-list");
  const totalPriceElement = document.getElementById("total-price");
  const placeOrderButton = document.getElementById("place-order-button");
  const checkoutForm = document.getElementById("checkout-form");
  
  // Function to get query parameter from URL
  function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Extract table number from the URL
const tableNumber = getParameterByName('tableNumber');


  // Function to update the total price
  function updateTotalPrice() {
    let total = 0;
    const items = selectedItemsList.querySelectorAll("tr");
    items.forEach(item => {
      const quantity = parseInt(item.querySelector(".quantity").textContent);
      const price = parseFloat(item.querySelector(".price").textContent.replace("Rs. ", ""));
      total += quantity * price;
    });
    totalPriceElement.textContent = isNaN(total) ? "0.00" : total.toFixed(2);
  }

  // Add event listener for "Place Order" button
  placeOrderButton.addEventListener("click", function() {
    processOrder();
  });

  addButton.forEach(button => {
    button.addEventListener("click", function() {
      const dishBox = this.closest(".dish-box-wp");
      const dishTitle = dishBox.querySelector(".h3-title").textContent;
      const dishPrice = parseFloat(dishBox.querySelector(".dist-bottom-row b").textContent.replace("Rs. ", ""));

      // Create a new table row for the selected dish
      const tableRow = document.createElement("tr");
      tableRow.innerHTML = `
        <td>${dishTitle}</td>
        <td>
          <button class="quantity-btn minus">-</button>
          <span class="quantity">1</span>
          <button class="quantity-btn plus">+</button>
        </td>
        <td class="price">Rs. ${dishPrice.toFixed(2)}</td>
        <td><button class="delete-btn"><i class="fa fa-trash"></i></button></td>
      `;
      selectedItemsList.appendChild(tableRow);

      // Add event listeners for plus and minus buttons to update quantity and total price
      const quantitySpan = tableRow.querySelector(".quantity");
      const plusButton = tableRow.querySelector(".plus");
      const minusButton = tableRow.querySelector(".minus");
      const deleteButton = tableRow.querySelector(".delete-btn");

      plusButton.addEventListener("click", function() {
        quantitySpan.textContent = parseInt(quantitySpan.textContent) + 1;
        updateTotalPrice();
      });

      minusButton.addEventListener("click", function() {
        if (parseInt(quantitySpan.textContent) > 1) {
          quantitySpan.textContent = parseInt(quantitySpan.textContent) - 1;
          updateTotalPrice();
        }
      });

      deleteButton.addEventListener("click", function() {
        tableRow.remove();
        updateTotalPrice();
      });

      // Update total price initially
      updateTotalPrice();
    });
  });
// Add event listener to the place order button
placeOrderButton.addEventListener("click", function() {
// Disable the place order button
document.getElementById('place-order-button').style.display = 'none';
  // Show the checkout form
  checkoutForm.style.display = "block";
});
// Get reference to the confirm order button
const confirmOrderButton = document.getElementById("confirm-order-button");
// Get reference to the confirm order button
const confirmCashOrderButton = document.getElementById("confirm-cash-order-button");

// Add event listener to the confirm order button
confirmOrderButton.addEventListener("click", function() {
  // Call the processOrder function
  processOrder();
});

// Add event listener to the confirm order button
confirmCashOrderButton.addEventListener("click", function() {
// Call the processOrder function
processCashOrder();
});

  // Function to process order
  function processOrder() {
    // Get customer's name and contact
    const customerName = document.getElementById("customer-name").value;
    const customerContact = document.getElementById("customer-contact").value;

    // Check if customer's name and contact are provided
    if (customerName.trim() === '' || customerContact.trim() === '') {
      alert("Please provide your name and contact before placing the order.");
      return; // Exit the function if name or contact is not provided
    }

    // Check if any items are selected
    if (selectedItemsList.querySelectorAll("tr").length === 0) {
      alert("Please select items before placing the order.");
      return; // Exit the function if no items are selected
    }

    // Initialize an array to store selected items
    const selectedItems = [];

    // Initialize total price
    let totalPrice = 0;

    // Get current date and time
    const currentDate = new Date().toLocaleString();

    // Iterate over each selected item and add it to the array
    selectedItemsList.querySelectorAll("tr").forEach(item => {
      const itemName = item.querySelector("td:first-child").textContent;
      const quantity = parseInt(item.querySelector(".quantity").textContent);
      const price = parseFloat(item.querySelector(".price").textContent.replace("Rs. ", ""));
      const totalPriceForItem = quantity * price;

      // Add item details to selectedItems array
      selectedItems.push({
        itemName: itemName,
        quantity: quantity,
        totalPriceForItem: totalPriceForItem
      });

      // Update total price
      totalPrice += totalPriceForItem;
    });

    // Validate customer details
    if (customerName && customerContact) {
      // Initialize Razorpay options
      var options = {
        key: 'rzp_test_ocyMfnPXfmXjOa', // Replace with your actual Razorpay API key
        amount: totalPrice * 100, // Amount in paise
        currency: 'INR',
        name: 'Backyard Cafe',
        description: 'Payment for Selected Items',
        image: 'images/logo.jpeg',
        handler: function(response) {
          // Payment successful handler
          alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);

          // Push order details to Firebase
          ordersRef.push({
            customerName: customerName,
            customerContact: customerContact,
            selectedItems: selectedItems,
            totalPrice: totalPrice,
            paymentMethod: 'Online',
            paymentId: response.razorpay_payment_id,
            tableNumber: tableNumber,
            orderDate: currentDate
          });

          // Show thank you message
          alert("Thank you for your order!");

          // Clear the selected items list
          selectedItemsList.innerHTML = "";
          // Update total price to 0.00
          totalPriceElement.textContent = "0.00";

          // Clear customer name and contact fields
          document.getElementById("customer-name").value = "";
          document.getElementById("customer-contact").value = "";

          // Hide the checkout form
          checkoutForm.style.display = "none";
        },
        prefill: {
          name: customerName,
          email: '',
          contact: customerContact
        },
        notes: {},
        theme: {
          color: '#528FF0'
        }
      };

      var rzp1 = new Razorpay(options);
      rzp1.open();
    } else {
      alert('Please fill in all the fields.');
    }
  }

  // Add event listener for new orders
  ordersRef.on('child_added', function(snapshot) {
    const order = snapshot.val();
    const orderId = snapshot.key;
    
    // Notify admin about the new order
    notifyAdmin("New order received", orderId, order);
});

// Add event listener for order updates (for example, order acceptance/rejection)
ordersRef.on('child_changed', function(snapshot) {
    const order = snapshot.val();
    const orderId = snapshot.key;
    
    // Check if the order status has been updated
    if (order.status !== 'pending') {
        // Notify admin about the order status update
        notifyAdmin("Order status updated", orderId, order);
    }
});

// Function to process cash order
function processCashOrder() {
// Get customer's name and contact
const customerName = document.getElementById("customer-name").value;
const customerContact = document.getElementById("customer-contact").value;

// Check if customer's name and contact are provided
if (customerName.trim() === '' || customerContact.trim() === '') {
    alert("Please provide your name and contact before placing the order.");
    return; // Exit the function if name or contact is not provided
}

// Check if any items are selected
if (selectedItemsList.querySelectorAll("tr").length === 0) {
    alert("Please select items before placing the order.");
    return; // Exit the function if no items are selected
}

// Initialize an array to store selected items
const selectedItems = [];

// Initialize total price
let totalPrice = 0;

// Get current date and time
const currentDate = new Date().toLocaleString();

// Iterate over each selected item and add it to the array
selectedItemsList.querySelectorAll("tr").forEach(item => {
    const itemName = item.querySelector("td:first-child").textContent;
    const quantity = parseInt(item.querySelector(".quantity").textContent);
    const price = parseFloat(item.querySelector(".price").textContent.replace("Rs. ", ""));
    const totalPriceForItem = quantity * price;

    // Add item details to selectedItems array
    selectedItems.push({
        itemName: itemName,
        quantity: quantity,
        totalPriceForItem: totalPriceForItem
    });

    // Update total price
    totalPrice += totalPriceForItem;
});

// Push order details to Firebase
ordersRef.push({
    customerName: customerName,
    customerContact: customerContact,
    selectedItems: selectedItems,
    totalPrice: totalPrice,
    paymentMethod: 'Cash', // Add cash payment method
    tableNumber: tableNumber,
    orderDate: currentDate
});

// Show thank you message
alert("Thank you for your order! Total amount: Rs. " + totalPrice.toFixed(2));

// Clear the selected items list
selectedItemsList.innerHTML = "";
// Update total price to 0.00
totalPriceElement.textContent = "0.00";

// Clear customer name and contact fields
document.getElementById("customer-name").value = "";
document.getElementById("customer-contact").value = "";

// Hide the checkout form
checkoutForm.style.display = "none";
}

// Add event listener for new orders
ordersRef.on('child_added', function(snapshot) {
  const order = snapshot.val();
  const orderId = snapshot.key;
  
  // Notify admin about the new order
  notifyAdmin("New order received", orderId, order);
});

// Add event listener for order updates (for example, order acceptance/rejection)
ordersRef.on('child_changed', function(snapshot) {
  const order = snapshot.val();
  const orderId = snapshot.key;
  
  // Check if the order status has been updated
  if (order.status !== 'pending') {
      // Notify admin about the order status update
      notifyAdmin("Order status updated", orderId, order);
  }
});

// Function to notify admin about the new order or order status update
function notifyAdmin(notificationType, orderId, order) {
    // Get the admin notifications container
    const adminNotificationsContainer = document.getElementById('admin-notifications');
    
    // Create a new notification element
    const notificationElement = document.createElement('div');
    notificationElement.classList.add('notification');
    notificationElement.innerHTML = `
        <p>${notificationType} for Order ID: ${orderId}</p>
        <p>Table Number: ${order.tableNumber}</p>
        <p>Customer: ${order.customerName}</p>
        <p>Contact: ${order.customerContact}</p>
        <p>Total Price: ${order.totalPrice}</p>
        <p>Status: ${order.status}</p>
    `;
    
    // Append the notification to the container
    adminNotificationsContainer.appendChild(notificationElement);
}

});
