document.addEventListener('DOMContentLoaded', function() {
    const id = parseInt(localStorage.getItem('accidenteId'));
    fetch('/data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(data => {
        const userLocalStorage = JSON.parse(localStorage.getItem('user'));
        const accidentes = data.Accidentes;
        let accidentesLocalstorage = localStorage.getItem('accidente');
        if (!accidentesLocalstorage) {
            accidentesLocalstorage = [];
        } else {
            accidentesLocalstorage = JSON.parse(accidentesLocalstorage);
        }
        let accidentesTotales = accidentes.concat(accidentesLocalstorage);
        const accidenteId = accidentesTotales.find(accidente => accidente.id === id);
        let accidenteJson = false;
        accidentes.forEach(accidente => {
            if (accidente === accidenteId) {
                accidenteJson = true;
            }
        });
        let comentariosAccidenteJson = [];
        if (accidenteJson) {
            comentariosAccidenteJson = accidentes.find(accidente => accidente.id === id).comentario;
        }
        let comentariosAccidenteLocalStorage = localStorage.getItem(`comentariosAccidente${id}`);
        if (!comentariosAccidenteLocalStorage) {
            comentariosAccidenteLocalStorage = [];
        } else {
            comentariosAccidenteLocalStorage = JSON.parse(comentariosAccidenteLocalStorage);
        }
        let comentariosTotales = comentariosAccidenteLocalStorage;
        if (accidenteJson) {
            comentariosTotales = comentariosAccidenteJson.concat(comentariosAccidenteLocalStorage);
        }


        const commentSection = document.getElementById('comments');

        function createMantenimientosCard(comentario) {
            const card = document.createElement('div');
            card.className = 'card-c';
            const cardHeader = document.createElement('div');
            cardHeader.className = 'card-header';
            card.appendChild(cardHeader);
            const user = document.createElement('h1');
            user.className = 'card-title';
            user.innerHTML = comentario.usuario;
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';
            cardBody.innerHTML = comentario.comentario;
            card.appendChild(cardBody);
            cardHeader.appendChild(user);
            return card;
        }

        function createInformation(accidente) {
            const title = document.getElementById('title');
            const description = document.getElementById('description');
            const date = document.getElementById('date');
            const time = document.getElementById('time');
            title.textContent = accidente.titulo;
            description.textContent = accidente.descripcion;
            date.textContent = accidente.fecha;
            time.textContent = accidente.hora;
        }

        createInformation(accidenteId);

        comentariosTotales.forEach(comentario => {
            const card = createMantenimientosCard(comentario);
            commentSection.appendChild(card);
        });

        const form = document.getElementById('comment-form');        
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const comentario = document.getElementById('comment-input').value;

            const lengthJson = comentariosAccidenteJson ? comentariosAccidenteJson.length : 0;
            const lengthLocalStorage = comentariosAccidenteLocalStorage ? comentariosAccidenteLocalStorage.length : 0;
            const lengthTotal = lengthJson + lengthLocalStorage;

            const newComment = {
                id: lengthTotal + 1,
                usuario: userLocalStorage.nombre + ' ' + userLocalStorage.apellido,
                comentario: comentario
            };

            comentariosAccidenteLocalStorage.push(newComment);
            localStorage.setItem(`comentariosAccidente${id}`, JSON.stringify(comentariosAccidenteLocalStorage));
            localStorage.setItem(`comentariosAccidente${id}Length`, lengthTotal + 1);

            const card = createMantenimientosCard(newComment);
            commentSection.appendChild(card);
            document.getElementById('comment-input').value = '';
        });
    });
});
