document.getElementById('loginForm').addEventListener('submit', function(event) {
  // Prevent the default form submission
  event.preventDefault();

  // Get the values from the form
  var nome = document.getElementById('nome').value;
  var personagem1 = document.getElementById('personagem1').value;
  var personagem2 = document.getElementById('personagem2').value;
  var personagem3 = document.getElementById('personagem3').value;

  // Perform validation (example: check if all fields are filled)
  if (nome && personagem1 && personagem2 && personagem3) {
      // Store the values in localStorage
      localStorage.setItem('nome', nome);
      localStorage.setItem('personagem1', personagem1);
      localStorage.setItem('personagem2', personagem2);
      localStorage.setItem('personagem3', personagem3);

      // Redirect to a new page if the validation is successful
      window.location.href = '/OraculoSorteio/success'; // Replace '/success' with the URL of the page you want to redirect to
  } else {
      // Display an error message or handle incorrect input
      alert('Por favor, preencha todos os campos.');
  }
});