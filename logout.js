const firebaseConfig = {
  apiKey: "AIzaSyC16izOc-SFwMdw-kBtloSbeYj_qFU09qM",
  authDomain: "backyard-d9e83.firebaseapp.com",
  databaseURL: "https://backyard-d9e83-default-rtdb.firebaseio.com",
  projectId: "backyard-d9e83",
  storageBucket: "backyard-d9e83.appspot.com",
  messagingSenderId: "816339018282",
  appId: "1:816339018282:web:274d362bda61f236e49953",
  measurementId: "G-SZD11FNKBP"
};
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged((user)=>{
if(!user){
location.replace("file:///D:/backyard/backyard/login1.html")
}else{
document.getElementById("user").innerHTML = "Hello, "+user.email
}
})


function logout(){
firebase.auth().signOut()
}                                         