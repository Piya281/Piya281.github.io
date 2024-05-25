// Initialize Firebase (ADD YOUR OWN DATA)
var firebaseConfig = {
  apiKey: "AIzaSyC16izOc-SFwMdw-kBtloSbeYj_qFU09qM",
  authDomain: "backyard-d9e83.firebaseapp.com",
  databaseURL: "https://backyard-d9e83-default-rtdb.firebaseio.com",
  projectId: "backyard-d9e83",
  storageBucket: "backyard-d9e83.appspot.com",
  messagingSenderId: "816339018282",
  appId: "1:816339018282:web:d0053a0ff3b015f5e49953",
  measurementId: "G-ZQ40TGQYQN"
};
firebase.initializeApp(firebaseConfig);


// Reference messages collection
var messagesRef = firebase.database().ref('bookingForm');

// Listen for form submit
document.getElementById('bookingForm').addEventListener('submit', submitForm);

// Submit form
function submitForm(e){
  e.preventDefault();

  // Get values
  var name = getInputVal('name');
  var contact= getInputVal('contact');
  var email = getInputVal('email');
  var packagee = getInputVal('packagee');
  var date = getInputVal('date');
  var time = getInputVal('time');
  
  // Save message
  saveMessage(name, contact, email, packagee, date, time);

  // Show alert
  document.querySelector('.alert').style.display = 'block';

  // Hide alert after 3 seconds
  setTimeout(function(){
    document.querySelector('.alert').style.display = 'none';
  },3000);

  // Clear form
  document.getElementById('bookingForm').reset();
}

// Function to get get form values
function getInputVal(id){
  return document.getElementById(id).value;
}

// Save message to firebase
function saveMessage(name, contact, email, packagee, date, time){
  var newMessageRef = messagesRef.push();
  newMessageRef.set({
    name: name,
	contact:contact,
    email:email,
    packagee:packagee,
	date:date,
	time:time
  });
}