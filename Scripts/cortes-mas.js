document.addEventListener('DOMContentLoaded', function() {
    const id = parseInt(localStorage.getItem('corteId'));
    fetch('/data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(data => {
        // recuperamos el usuario activo
        const userLocalStorage = JSON.parse(localStorage.getItem('user'));
        const cortes = data.Cortes
        let cortesLocalstorage = localStorage.getItem('cortes');
        if (!cortesLocalstorage) {
            cortesLocalstorage = [];
        } else {
            cortesLocalstorage = JSON.parse(cortesLocalstorage);
        }
        let cortesTotales = cortes.concat(cortesLocalstorage);
        const corteId = cortesTotales.find(corte => corte.id === id);
        let corteJson = false;
        cortes.forEach(corte => {
            if (corte === corteId) {
                corteJson = true;
            }
        });
        let comentariosCortesJson = [];
        if (corteJson) {
            comentariosCortesJson = cortes.find(corte => corte.id === id).comentario;
        }
        let comentariosCortesLocalStorage = localStorage.getItem(`comentariosCorte${id}`);
        if (!comentariosCortesLocalStorage) {
            comentariosCortesLocalStorage = [];
        } else {
            comentariosCortesLocalStorage = JSON.parse(comentariosCortesLocalStorage);
        }
        let comentariosTotales = comentariosCortesLocalStorage;
        if (corteJson) {
            comentariosTotales = comentariosCortesJson.concat(comentariosCortesLocalStorage);
        }
        // recuperamos el contenedor que tendra los comentarios
        const commentSection = document.getElementById('comments')
        
        function createMantenimientosCard(comentario) {
            // card
            const card = document.createElement('div');
            card.className = 'card-c';
            // card header
            const cardHeader = document.createElement('div');
            cardHeader.className = 'card-header';
            card.appendChild(cardHeader);
            // title (nombre usuario)
            const user = document.createElement('h1');
            user.className = 'card-title';
            user.innerHTML = comentario.usuario;
            // body
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';
            cardBody.innerHTML = comentario.comentario;
            card.appendChild(cardBody);

            cardHeader.appendChild(user);
            return card;
        }
        // deberiamos crear la card de info que dependera del accidente

        function createInformation(corte) {
            const title = document.getElementById('title');
            const description = document.getElementById('description');
            const date = document.getElementById('date');
            const time = document.getElementById('time');
            title.textContent = corte.titulo;
            description.textContent = corte.descripcion;
            date.textContent = corte.fecha;
            time.textContent = corte.hora;
        }

        createInformation(corteId)

        
        // recorremos los comentarios y los agregamos al contenedor
        comentariosTotales.forEach(comentario => {
            const card = createMantenimientosCard(comentario);
            commentSection.appendChild(card);
        });

        // formulario de comentarios
        const form = document.getElementById('comment-form');        
        // evento de submit del formulario
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const comentario = document.getElementById('comment-input').value;
            const lengthJson = comentariosCortesJson ? comentariosCortesJson.length : 0;
            const lengthLocalStorage = comentariosCortesLocalStorage ? comentariosCortesLocalStorage.length : 0;
            const lengthTotal = lengthJson + lengthLocalStorage

            const newComment = {
                id: lengthTotal + 1,
                usuario: userLocalStorage.nombre + ' ' + userLocalStorage.apellido,
                comentario: comentario
            };
            // agregamos el comentario al local storage
            comentariosCortesLocalStorage.push(newComment);
            localStorage.setItem(`comentariosCorte${id}`, JSON.stringify(comentariosCortesLocalStorage));
            // creamos un nuevo item en el local storage que contenga la cantidad total de comentarios
            localStorage.setItem(`comentariosCorte${id}Length`, lengthTotal + 1);


            // mostramos el comentario en la interfaz
            const card = createMantenimientosCard(newComment);
            commentSection.appendChild(card);
            // limpiamos el input
            document.getElementById('comment-input').value = '';
        });
    
    
    })
});