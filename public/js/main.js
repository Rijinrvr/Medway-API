  
 document.getElementById("delete-medicine").addEventListener("click", function(event) {
  console.log("calling the onlick");
   event.preventDefault();
   
   const medicineId = event.target.getAttribute('dataid');
   const medicine = event.target.getAttribute('dataname');
   
  const confirmDelete = confirm(`Are you sure you want to delete the medicine ${medicine}?`);
  if (confirmDelete) {
    axios.delete(`http://localhost:3001/medicine/delete/${medicineId}`)
      .then(response => {
        console.log(response);
        window.location = '/';
      })
      .catch(error => console.log(error))
  }
 });


