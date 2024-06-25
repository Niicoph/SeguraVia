document.addEventListener('DOMContentLoaded', function() {
    const id = parseInt(localStorage.getItem('mantenimientoId'));
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
        const mantenimientos = data.Mantenimiento // mantenimientos del json
        let mantenimientosLocalstorage = localStorage.getItem('mantenimientos');
        if (!mantenimientosLocalstorage) {
            mantenimientosLocalstorage = [];
        } else {
            mantenimientosLocalstorage = JSON.parse(mantenimientosLocalstorage);
        }

        let mantenimientosTotales = mantenimientos.concat(mantenimientosLocalstorage);
        const mantenimientoId = mantenimientosTotales.find(mantenimiento => mantenimiento.id === id);
        let mantenimientoJson = false;
        mantenimientos.forEach(mantenimiento => {
            if (mantenimiento === mantenimientoId) {
                mantenimientoJson = true;
            }
        });
        let comentariosMantenimientoJson = [];
        if (mantenimientoJson) {
             comentariosMantenimientoJson = mantenimientos.find(mantenimiento => mantenimiento.id === id).comentario;
        }
        let comentariosMantenimientoLocalStorage = localStorage.getItem(`comentariosMantenimiento${id}`);
        if (!comentariosMantenimientoLocalStorage) {
            comentariosMantenimientoLocalStorage = [];
        } else {
            comentariosMantenimientoLocalStorage = JSON.parse(comentariosMantenimientoLocalStorage);
        }
        let comentariosTotales = comentariosMantenimientoLocalStorage;
        if (mantenimientoJson) {
            comentariosTotales = comentariosMantenimientoJson.concat(comentariosMantenimientoLocalStorage);
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

        function createInformation(mantenimiento) {
            const title = document.getElementById('title');
            const description = document.getElementById('description');
            const date = document.getElementById('date');
            const time = document.getElementById('time');
            title.textContent = mantenimiento.titulo;
            description.textContent = mantenimiento.descripcion;
            date.textContent = mantenimiento.fecha;
            time.textContent = mantenimiento.hora;
        }

        createInformation(mantenimientoId)

        
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
            
            const lengthJson = comentariosMantenimientoJson ? comentariosMantenimientoJson.length : 0;
            const lengthLocalStorage = comentariosMantenimientoLocalStorage ? comentariosMantenimientoLocalStorage.length : 0;
            const lengthTotal = lengthJson + lengthLocalStorage;

            const newComment = {
                id: lengthTotal + 1,
                usuario: userLocalStorage.nombre + ' ' + userLocalStorage.apellido,
                comentario: comentario
            };
            // agregamos el comentario al local storage
            comentariosMantenimientoLocalStorage.push(newComment);
            localStorage.setItem(`comentariosMantenimiento${id}`, JSON.stringify(comentariosMantenimientoLocalStorage));
            // creamos un nuevo item en el local storage que contenga la cantidad total de comentarios
            localStorage.setItem(`comentariosMantenimiento${id}Length`, lengthTotal + 1);


            // mostramos el comentario en la interfaz
            const card = createMantenimientosCard(newComment);
            commentSection.appendChild(card);
            // limpiamos el input
            document.getElementById('comment-input').value = '';
        });
    
    
    })






});