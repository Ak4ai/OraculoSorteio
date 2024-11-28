document.addEventListener('DOMContentLoaded', function() {
    const dynamicText = document.getElementById('dynamic-text');
    const drawButton = document.getElementById('draw-button');
    const apiKey = '$2a$10$7SQ85bKrzfMW7tg8U1km/OevFO.nVsSj8Hfd0KqyDRYuJyYINqZjG'; // Sua chave de API do JSONBin.io
    const binId1 = '67479cd5ad19ca34f8d19ce2'; // Seu ID do primeiro bin no JSONBin.io
    const binId2 = '6747a2a9e41b4d34e45be47c'; // Substitua pelo ID do seu segundo bin no JSONBin.io

    console.log('API Key:', apiKey);
    console.log('Bin ID 1:', binId1);
    console.log('Bin ID 2:', binId2);

    // Function to load names from JSONBin.io
    function loadNames(binId) {
        const url = `https://api.jsonbin.io/v3/b/${binId}/latest`;
        console.log('Fetching URL:', url);
        return fetch(url, {
            headers: {
                'X-Master-Key': apiKey
            }
        })
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received from JSONBin.io:', data);
            if (data.record && data.record.names) {
                const names = data.record.names;
                console.log('Names loaded:', names);
                return names;
            } else {
                console.error('No names found in the data received from JSONBin.io');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    // Function to update names in JSONBin.io
    function updateNames(binId, names) {
        const url = `https://api.jsonbin.io/v3/b/${binId}`;
        console.log('Updating URL:', url);
        return fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': apiKey
            },
            body: JSON.stringify({ names: names })
        })
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data updated in JSONBin.io:', data);
        })
        .catch(error => {
            console.error('There was a problem with the update operation:', error);
        });
    }

    // Function to draw a name and remove it from the list
    function drawName(binId) {
        return loadNames(binId).then(names => {
            if (names && names.length > 0) {
                const userName = localStorage.getItem('nome');
                const personagem1 = localStorage.getItem('personagem1');
                const personagem2 = localStorage.getItem('personagem2');
                const personagem3 = localStorage.getItem('personagem3');

                const excludedNames = [userName, personagem1, personagem2, personagem3];
                console.log('Excluded names:', excludedNames);

                let validNames = names.filter(name => !excludedNames.includes(name));
                console.log('Valid names before draw:', validNames);

                if (validNames.length === 0) {
                    console.error('No valid names available to draw');
                    return null;
                }

                const randomIndex = Math.floor(Math.random() * validNames.length);
                const drawnName = validNames.splice(randomIndex, 1)[0];
                console.log('Drawn name:', drawnName);

                // Remove the drawn name from the original names list
                const originalIndex = names.indexOf(drawnName);
                if (originalIndex > -1) {
                    names.splice(originalIndex, 1);
                }

                updateNames(binId, names);
                return drawnName;
            } else {
                console.error('No names available to draw');
                return null;
            }
        });
    }

    document.getElementById('draw-button').addEventListener('click', (event) => {
        event.preventDefault(); // Previne o comportamento padrão do botão
        console.log('Button clicked');
        // Call drawName to draw names from both bins and set the dynamic text
        Promise.all([drawName(binId1), drawName(binId2)]).then(drawnNames => {
            console.log('Drawn names:', drawnNames);
            const [name1, name2] = drawnNames;
            if (name1 && name2) {
                dynamicText.textContent = `${name1}, ${name2}`;
                alert('O nome já foi sorteado. Para evitar sorteá-lo novamente, é melhor sair depois verificar seus nomes sorteados.');
            } else {
                console.error('Failed to draw names from both bins');
            }
        }).catch(error => {
            console.error('Error drawing names:', error);
        });
    });
});
