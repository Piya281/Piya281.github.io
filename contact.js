// Initialize Firebase (ADD YOUR OWN DATA)
var firebaseConfig = {
  apiKey: "AIzaSyC16izOc-SFwMdw-kBtloSbeYj_qFU09qM",
  authDomain: "backyard-d9e83.firebaseapp.com",
  databaseURL: "https://backyard-d9e83-default-rtdb.firebaseio.com",
  projectId: "backyard-d9e83",
  storageBucket: "backyard-d9e83.appspot.com",
  messagingSenderId: "816339018282",
  appId: "1:816339018282:web:f8602643c8452027e49953",
  measurementId: "G-NM4CDY6CTS"
};
firebase.initializeApp(firebaseConfig);


// Reference messages collection
var messagesRef = firebase.database().ref('Enquiry');

// Listen for form submit
document.getElementById('contactForm').addEventListener('submit', submitForm);

// Submit form
function submitForm(e){
  e.preventDefault();

  // Get values
  var name = getInputVal('name');
  var contact = getInputVal('contact');
  var email = getInputVal('email');
  var enquiry = getInputVal('enquiry');
  
  // Save message
  saveMessage(name, contact, email, enquiry);

  // Show alert
  document.querySelector('.alert').style.display = 'block';

  // Hide alert after 3 seconds
  setTimeout(function(){
    document.querySelector('.alert').style.display = 'none';
  },3000);

  // Clear form
  document.getElementById('contactForm').reset();
}

// Function to get get form values
function getInputVal(id){
  return document.getElementById(id).value;
}

// Save message to firebase
function saveMessage(name, contact, email, enquiry){
  var newMessageRef = messagesRef.push();
  newMessageRef.set({
    name: name,
	contact:contact,
    email:email,
    enquiry:enquiry
  });
}