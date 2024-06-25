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
                imgLikes.src = '/Images/like_before.png';
                const likesCount = document.createElement('p');
                likesCount.textContent = accidente.likes;
                
                cardFeaturesChild1.addEventListener('click', function() {
                    const user = JSON.parse(localStorage.getItem('user'));
                
                    if (user) {
                        const likeKey = `like${accidente.tipo}${accidente.id}`;
                        let likes = parseInt(localStorage.getItem(likeKey)) 
                        let likesJson = accidente.likes;
    
                        if (!likes) {
                            imgLikes.src = '/Images/like_after.png';
                            likesCount.textContent = likesJson + 1;
                            localStorage.setItem(likeKey, likesJson + 1);
                        } else {
                            imgLikes.src = '/Images/like_before.png';
                            likesCount.textContent = likesJson
                            localStorage.removeItem(likeKey);
                        }
                    } else {
                        alert('Debes iniciar sesión para poder dar like');
                    }
                });
    





                cardFeaturesChild1.appendChild(imgLikes);
                cardFeaturesChild1.appendChild(likesCount);
                cardFeatures.appendChild(cardFeaturesChild1);

                // Característica 2: Comentarios
                const cardFeaturesChild2 = document.createElement('div');
                const imgComments = document.createElement('img');
                imgComments.src = '/Images/comment.png';
                const commentsCount = document.createElement('p');
                const countComentariosJson = accidente.comentario.length
                
                const countComentariosTotales = localStorage.getItem(`comentariosAccidente${accidente.id}Length`);
                if (!countComentariosTotales) {
                    if (countComentariosJson > 0) {
                        commentsCount.textContent = countComentariosJson;
                    } else {
                        commentsCount.textContent = 0;
                    }
                } else {
                    commentsCount.textContent = parseInt(countComentariosTotales);
                }



                cardFeaturesChild2.appendChild(imgComments);
                cardFeaturesChild2.appendChild(commentsCount);
                cardFeatures.appendChild(cardFeaturesChild2);

                cardFeaturesChild2.addEventListener('click', function() {
                    localStorage.setItem('accidenteId', accidente.id);
                    window.location.href = '/sections/accidentes-mas.html#comments';
                });

                // card-more
                const cardMore = document.createElement('div');
                cardMore.className = 'card-more';
                const moreButton = document.createElement('a');
                moreButton.href =  `/sections/accidentes-mas.html`
                moreButton.innerHTML = 'Ver más';

                // recuperamos el id del accidente
                const id = accidente.id;

                moreButton.addEventListener('click', function() {
                    localStorage.setItem('accidenteId', id);
                });

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
                        const actualDate = new Date().toLocaleDateString('en-GB').split('/').reverse().join('-');
                        let hora = fechaActual.toLocaleTimeString('en-US', {hour: 'numeric', hour12: true});
                        filteredAccidentes = accidentes.filter( accidente => {
                            let horaAccidente = accidente.hora.split(":")[0];
                            let ampmAccidente = accidente.hora.split(" ")[1];
                            let horaCompleta = horaAccidente + " " + ampmAccidente;
                            return horaCompleta === hora && accidente.fecha === actualDate;
                        })
                        break;
                    case '2':
                        const dia = new Date().toLocaleDateString('en-GB').split('/').reverse().join('-');
                        filteredAccidentes = accidentes.filter(accidente => {
                            let fechaAccidente = accidente.fecha;
                            return fechaAccidente === dia
                        })
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
                        let commentsNumber = [];
                        accidentes.forEach(accidente => {
                            let comment = localStorage.getItem(`comentariosAccidente${accidente.id}Length`);
                            if (!comment) {
                                commentsNumber.push({ accidente: accidente, cantidadComentarios: accidente.comentario.length });
                            } else {
                                commentsNumber.push({ accidente: accidente, cantidadComentarios: parseInt(comment) });
                            }
                        });
                        commentsNumber.sort((a, b) => b.cantidadComentarios - a.cantidadComentarios);
                        filteredAccidentes = commentsNumber.map(item => item.accidente);
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
