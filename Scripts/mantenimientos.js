document.addEventListener("DOMContentLoaded", function() {
    // recuperamos los mantenimientos del local storage
    let mantenimientosLocalStorage = localStorage.getItem('mantenimientos');
    if (!mantenimientosLocalStorage) {
        mantenimientosLocalStorage = [];
    } else {
        mantenimientosLocalStorage = JSON.parse(mantenimientosLocalStorage);
    }

    fetch('/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(data => {
            const mantenimientosJSON = data.Mantenimiento;
            const mantenimientos = mantenimientosJSON.concat(mantenimientosLocalStorage);
            const cardsContainer = document.querySelector('.cards-container');

            // Función para crear tarjetas de mantenimientos
            function createMantenimientoCard(mantenimiento) {
                // card
                const card = document.createElement('div');
                card.className = 'card';
                card.id = `card-id`;
                // card-header
                const cardHeader = document.createElement('div');
                cardHeader.className = 'card-header';
                const leftSide = document.createElement('div');
                const rightSide = document.createElement('div');
                leftSide.className = 'left-side';
                rightSide.className = 'right-side';

                const cardHeaderTitle = document.createElement('h2');
                const cardHeaderDirection = document.createElement('p');
                const cardHeaderHour = document.createElement('h3');
                cardHeaderTitle.textContent = `${mantenimiento.titulo}`;
                cardHeaderDirection.textContent = `${mantenimiento.direccion}`;
                cardHeaderHour.textContent = `${mantenimiento.hora} ${mantenimiento.fecha}`;

                leftSide.appendChild(cardHeaderTitle);
                leftSide.appendChild(cardHeaderDirection);
                rightSide.appendChild(cardHeaderHour);

                cardHeader.appendChild(leftSide);
                cardHeader.appendChild(rightSide);
                card.appendChild(cardHeader);
                // card-features
                const cardFeatures = document.createElement('div');
                cardFeatures.className = 'card-features';
                // Característica 1: Likes
                const cardFeaturesChild1 = document.createElement('div');
                const imgLikes = document.createElement('img');
                imgLikes.src = '/Images/like:before.png';
                const likesCount = document.createElement('p');
                likesCount.textContent = `${mantenimiento.likes}`;
                cardFeaturesChild1.appendChild(imgLikes);
                cardFeaturesChild1.appendChild(likesCount);
                cardFeatures.appendChild(cardFeaturesChild1);
                // Característica 2: Comentarios
                const cardFeaturesChild2 = document.createElement('div');
                const imgComments = document.createElement('img');
                imgComments.src = '/Images/comment.png';
                const commentsCount = document.createElement('p');
                commentsCount.textContent = `${mantenimiento.comentarios}`;
                cardFeaturesChild2.appendChild(imgComments);
                cardFeaturesChild2.appendChild(commentsCount);
                cardFeatures.appendChild(cardFeaturesChild2);
                // card-more
                const cardMore = document.createElement('div');
                cardMore.className = 'card-more';
                const moreButton = document.createElement('a');
                moreButton.innerHTML = 'Ver más';
                cardMore.appendChild(moreButton);
                card.appendChild(cardFeatures);
                card.appendChild(cardMore);

                return card;
            }
            // funcion para limpiar las tarjetas existentes
            function clearCards() {
                while (cardsContainer.firstChild) {
                    cardsContainer.removeChild(cardsContainer.firstChild);
                }
            }
            // EventListener para el cambio en el select
            document.querySelector('#filter').addEventListener('change' , function(event) {
                let filterValue = event.target.value;
                let filteredMantenimientos;
                
                // filtrar mantenimientos segun el valor del select

                switch(filterValue) {
                    case '1':
                        let fechaActual = new Date();
                        let hora = fechaActual.toLocaleTimeString('en-US', {hour: 'numeric', hour12: true});
                        filteredMantenimientos = mantenimientos.filter( mantenimiento => {
                            let horaMantenimiento = mantenimiento.hora.split(':')[0];
                            let ampmMantenimiento = mantenimiento.hora.split(' ')[1];
                            let horaCompleta = horaMantenimiento + ' ' + ampmMantenimiento;
                            return horaCompleta === hora;
                        });
                        break;
                    case '2':
                        let fecha = new Date();
                        let dia = fecha.getDate();
                        filteredMantenimientos = mantenimientos.filter( mantenimientos => {
                            let diaMantenimiento = mantenimientos.fecha.split('-')[2];
                            return diaMantenimiento === dia.toString();
                        })
                        break;
                    case '3':
                        let date = new Date();
                        let mes = date.getMonth() + 1;
                        console.log(mes)
                        filteredMantenimientos = mantenimientos.filter( mantenimiento => {
                            let mesMantenimiento = Number(mantenimiento.fecha.split('-')[1]);
                            console.log(mesMantenimiento)
                            return mesMantenimiento === mes;
                        });
                        break;
                    case '4':
                        filteredMantenimientos = mantenimientos.sort((a,b) => b.likes - a.likes);
                        break;
                    case '5':
                        filteredMantenimientos = mantenimientos.sort((a,b) => b.comentarios - a.comentarios);
                        break;
                    default:
                        filteredMantenimientos = mantenimientos;
                        break;
                }
                // limpiar las tarjetas existentes
                clearCards();
                // crear y mostrar las tarjetas filtradas
                filteredMantenimientos.forEach(mantenimiento => {
                    const card = createMantenimientoCard(mantenimiento);
                    cardsContainer.appendChild(card);
                });
            })
            // mostrar todas las tarjetas de mantenimientos al cargar la página
            mantenimientos.forEach(mantenimiento => {
                const card = createMantenimientoCard(mantenimiento);
                cardsContainer.appendChild(card);
            });

        })
        .catch(function() {
            console.log("Error al obtener el archivo data.json.");
        });
});
