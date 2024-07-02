document.addEventListener("DOMContentLoaded", function() {
    // recuperamos los corte del local storage
    let cortesLocalStorage = localStorage.getItem('cortes');
    if (!cortesLocalStorage) {
        cortesLocalStorage = [];
    } else {
        cortesLocalStorage = JSON.parse(cortesLocalStorage);
    }



    fetch('/data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(data => {
        const cortesJSON = data.Cortes
        const corte = cortesJSON.concat(cortesLocalStorage);
        const cardsContainer = document.querySelector('.cards-container');

        // Función para crear tarjetas de corte
        function createCorteCard(corte) {
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
            cardHeaderTitle.textContent = `${corte.titulo}`;
            cardHeaderDirection.textContent = `${corte.direccion}`;
            cardHeaderHour.textContent = `${corte.hora} ${corte.fecha}`;

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

            let likes = parseInt(localStorage.getItem(`numeroLikes${corte.tipo}${corte.id}`)) || corte.likes;
            let userLike = localStorage.getItem(`usuarioLike${corte.tipo}${corte.id}`);

            const cardFeaturesChild1 = document.createElement('div');
            const imgLikes = document.createElement('img');
            const likesCount = document.createElement('p');
            imgLikes.src = userLike === 'true' ? '/Images/like_after.png' : '/Images/like_before.png';
            likesCount.textContent = likes;

            cardFeaturesChild1.appendChild(imgLikes);
            cardFeaturesChild1.appendChild(likesCount);
            cardFeatures.appendChild(cardFeaturesChild1);

            cardFeaturesChild1.addEventListener('click', function() {
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    let currentLikes = parseInt(likesCount.textContent);
                    let userLike = localStorage.getItem(`usuarioLike${corte.tipo}${corte.id}`);

                    if (userLike === 'true') {
                        imgLikes.src = '/Images/like_before.png';
                        likesCount.textContent = currentLikes - 1;
                        localStorage.setItem(`usuarioLike${corte.tipo}${corte.id}`, 'false');
                        localStorage.setItem(`numeroLikes${corte.tipo}${corte.id}`, currentLikes - 1);
                        window.location.reload();
                    } else {
                        imgLikes.src = '/Images/like_after.png';
                        likesCount.textContent = currentLikes + 1;
                        localStorage.setItem(`usuarioLike${corte.tipo}${corte.id}`, 'true');
                        localStorage.setItem(`numeroLikes${corte.tipo}${corte.id}`, currentLikes + 1);
                        window.location.reload();
                    }
                } else {
                    alert('Debes iniciar sesión para poder dar like');
                }
            });



            // Característica 2: Comentarios
            const id = corte.id;
            const cardFeaturesChild2 = document.createElement('div');
            const imgComments = document.createElement('img');
            imgComments.src = '/Images/comment.png';
            const commentsCount = document.createElement('p');
            
            const countComentariosJson = corte.comentario.length
            const countComentariosTotales = localStorage.getItem(`comentariosCorte${corte.id}Length`);
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
            // card-more
            const cardMore = document.createElement('div');
            cardMore.className = 'card-more';
            const moreButton = document.createElement('a');
            moreButton.href = `/sections/cortes-mas.html`
            moreButton.innerHTML = 'Ver más';

            cardFeaturesChild2.addEventListener('click', function() {
                localStorage.setItem('corteId', id);
                window.location.href = '/sections/cortes-mas.html#comments';
            });

            moreButton.addEventListener('click', function() {
                localStorage.setItem('corteId', id);
            });

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
        document.querySelector('#filter').addEventListener('change', function(event) {
            let filterValue = event.target.value;
            let filteredCortes;

            // filtrar segun la opcion seleccionada
            switch(filterValue) {
                case '1':
                    let fechaActual = new Date();
                    let hora = fechaActual.toLocaleTimeString('en-US', {hour: 'numeric', hour12: true});
                    const actualDate = new Date().toLocaleDateString('en-GB').split('/').reverse().join('-');
                    filteredCortes = corte.filter( corte => {
                        let horaCorte = corte.hora.split(':')[0];
                        let ampmCorte = corte.hora.split(' ')[1];
                        let horaCompleta = horaCorte + ' ' + ampmCorte;
                        return horaCompleta === hora && corte.fecha === actualDate;
                    })
                    break;
                case '2':
                    const dia = new Date().toLocaleDateString('en-GB').split('/').reverse().join('-');
                    filteredCortes = corte.filter( corte => {
                        let diaCorte = corte.fecha
                        return dia === diaCorte;
                    })
                    break;
                case '3':
                    let date = new Date();
                    let mes = date.getMonth() + 1 ;
                    filteredCortes = corte.filter(corte => {
                        let fechaCorte = corte.fecha.split('-');
                        let mesCorte = Number(fechaCorte[1]);
                        return mesCorte === mes;
                    })
                    break;
                case '4':
                    filteredCortes = corte.sort((a, b) => b.likes - a.likes)
                    break;
                case '5':
                    let commentsNumber = [];
                    corte.forEach(corte => {
                        let comment = localStorage.getItem(`comentariosCorte${corte.id}Length`);
                        if (!comment) {
                            commentsNumber.push({ corte: corte, cantidadComentarios: corte.comentario.length });
                        } else {
                            commentsNumber.push({ corte: corte, cantidadComentarios: parseInt(comment) });
                        }
                    })
                    commentsNumber.sort((a, b) => b.cantidadComentarios - a.cantidadComentarios);
                    filteredCortes = commentsNumber.map(corte => corte.corte);
                    break;
                default:
                    filteredCortes = corte
                    break;
            }

            // limpiar las tarjetas actuales
            clearCards();

            // crear y mostrar tarjetas filtradas
            filteredCortes.forEach(corte => {
                const card = createCorteCard(corte);
                cardsContainer.appendChild(card);
            });
        });

        const inputSearch = document.getElementById('text-filter')
        inputSearch.addEventListener('input', function(event) {
            let searchValue = event.target.value.toLowerCase();
            let filteredCortes = corte.filter(corte => corte.titulo.toLowerCase().includes(searchValue));
            clearCards();
            filteredCortes.forEach(corte => {
                const card = createCorteCard(corte);
                cardsContainer.appendChild(card);
            });
        });

        // mostrar todas las tarjetas por defecto
        corte.forEach(corte => {
            const card = createCorteCard(corte);
            cardsContainer.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Error al obtener los datos:', error);
    });
});
