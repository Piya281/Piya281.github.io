const firebaseConfig = {
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

const dbRef = firebase.database().ref();
const usersRef = dbRef.child('orders');
const userListUI = document.getElementById("userList");

// Function to fetch all orders initially
function fetchAllOrders() {
  usersRef.once("value", snapshot => {
    userListUI.innerHTML = ""; // Clear previous list
    snapshot.forEach(childSnapshot => {
      let user = childSnapshot.val();
      let $li = document.createElement("li");
      $li.innerHTML = user.customerName;
      $li.setAttribute("child-key", childSnapshot.key);
      $li.addEventListener("click", userClicked);
      userListUI.appendChild($li);
    });
  });
}

// Function to fetch orders within the specified date range
function filterOrders() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  
  if (startDate === "" || endDate === "") {
    alert("Please select both start and end dates.");
    return;
  }

  usersRef.once("value", snapshot => {
    userListUI.innerHTML = ""; // Clear previous list
    snapshot.forEach(childSnapshot => {
      let user = childSnapshot.val();
      let orderDate = user.orderDate.split(',')[0].trim(); // Extract date part
      if (isDateInRange(orderDate, startDate, endDate)) {
        let $li = document.createElement("li");
        $li.innerHTML = user.customerName;
        $li.setAttribute("child-key", childSnapshot.key);
        $li.addEventListener("click", userClicked);
        userListUI.appendChild($li);
      }
    });
  });
}

// Function to check if a date is within the specified date range
function isDateInRange(dateString, startDate, endDate) {
  let date = new Date(dateString);
  let start = new Date(startDate);
  let end = new Date(endDate);
  return date >= start && date <= end;
}

// Function to handle user click on order
function userClicked(e) {
  var userID = e.target.getAttribute("child-key");
  const userRef = dbRef.child('orders/' + userID);
  const userDetailUI = document.getElementById("userDetail");
  userDetailUI.innerHTML = "";

  userRef.on("value", snapshot => {
    const user = snapshot.val();
    for (let key in user) {
      if (key === "selectedItems") {
        const selectedItemsObj = user[key];
        let selectedItemsStr = "<ul>";
        Object.keys(selectedItemsObj).forEach(itemKey => {
          selectedItemsStr += "<li>";
          selectedItemsStr += "<ul>";
          Object.keys(selectedItemsObj[itemKey]).forEach(innerKey => {
            selectedItemsStr += `<li>${innerKey}: ${selectedItemsObj[itemKey][innerKey]}</li>`;
          });
          selectedItemsStr += "</ul>";
          selectedItemsStr += "</li>";
        });
        selectedItemsStr += "</ul>";
        userDetailUI.innerHTML += `<p>${key}:</p>${selectedItemsStr}`;
      } else {
        userDetailUI.innerHTML += `<p>${key} - ${user[key]}</p>`;
      }
    }
  });
}

// Call fetchAllOrders when the page loads
window.onload = fetchAllOrders;