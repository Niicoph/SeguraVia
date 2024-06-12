document.addEventListener("DOMContentLoaded", function() {
    
    // recuperamos los accidentes del local storage
    let accidentesLocalStorage = localStorage.getItem('accidente');
    if (!accidentesLocalStorage) {
        accidentesLocalStorage = [];
    } else {
        accidentesLocalStorage = JSON.parse(accidentesLocalStorage);
    }
    
    fetch('/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(data => {
            const accidentesJSON = data.Accidentes;
            const accidentes = accidentesJSON.concat(accidentesLocalStorage);
            const cardsContainer = document.querySelector('.cards-container');

            // Función para crear tarjetas de accidentes
            function createAccidenteCard(accidente) {
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

                cardHeaderTitle.textContent = `${accidente.titulo}`;
                cardHeaderDirection.textContent = `${accidente.direccion}`;
                cardHeaderHour.textContent = `${accidente.hora} ${accidente.fecha}`;

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
                likesCount.textContent = `${accidente.likes}`;
                cardFeaturesChild1.appendChild(imgLikes);
                cardFeaturesChild1.appendChild(likesCount);
                cardFeatures.appendChild(cardFeaturesChild1);

                // Característica 2: Comentarios
                const cardFeaturesChild2 = document.createElement('div');
                const imgComments = document.createElement('img');
                imgComments.src = '/Images/comment.png';
                const commentsCount = document.createElement('p');
                commentsCount.textContent = `${accidente.comentarios}`;
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

            // Función para limpiar las tarjetas existentes
            function clearCards() {
                while (cardsContainer.firstChild) {
                    cardsContainer.removeChild(cardsContainer.firstChild);
                }
            }

            // EventListener para el cambio en el select
            document.querySelector('#filter').addEventListener('change', function(event) {
                let filterValue = event.target.value;
                let filteredAccidentes;

                // Filtrar según la opción seleccionada
                switch (filterValue) {
                    case '1':
                        let fechaActual = new Date();
                        let hora = fechaActual.toLocaleTimeString('en-US', {hour: 'numeric', hour12: true});
                        filteredAccidentes = accidentes.filter( accidente => {
                            let horaAccidente = accidente.hora.split(":")[0];
                            let ampmAccidente = accidente.hora.split(" ")[1];
                            let horaCompleta = horaAccidente + " " + ampmAccidente;
                            return horaCompleta === hora;
                        })
                        break;
                    case '2':
                        // logico ultima semana
                        break;
                    case '3':
                        let date = new Date();
                        let mes = date.getMonth() + 1 ; 
                        filteredAccidentes = accidentes.filter( accidente => {
                            let fechaAccidente = Number(accidente.fecha.split("-")[1]);
                            return fechaAccidente === mes; // dado que mes es un número, lo convertimos a string para comparar
                        })
                        break;
                    case '4':
                        filteredAccidentes = accidentes.sort((a, b) => b.likes - a.likes);
                        break;
                    case '5':
                        filteredAccidentes = accidentes.sort((a, b) => b.comentarios - a.comentarios);
                        break;
                    default:
                        filteredAccidentes = accidentes; // Mostrar todos por defecto
                        break;
                }

                // Limpiar las tarjetas actuales
                clearCards();

                // Crear y mostrar las tarjetas filtradas
                filteredAccidentes.forEach(accidente => {
                    const card = createAccidenteCard(accidente);
                    cardsContainer.appendChild(card);
                });
            });

            // Mostrar todas las tarjetas por defecto al cargar la página
            accidentes.forEach(accidente => {
                const card = createAccidenteCard(accidente);
                cardsContainer.appendChild(card);
            });

        })
        .catch(function() {
            console.log("Error al obtener el archivo data.json.");
        });
});
