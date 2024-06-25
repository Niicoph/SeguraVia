document.addEventListener('DOMContentLoaded', function() {
    let accidentesLocalStorage = localStorage.getItem('accidente');
    let cortesLocalStorage = localStorage.getItem('cortes');
    let mantenimientosLocalStorage = localStorage.getItem('mantenimientos');

    if (!accidentesLocalStorage) {
        accidentesLocalStorage = [];
    } else {
        accidentesLocalStorage = JSON.parse(accidentesLocalStorage);
    }
    if (!cortesLocalStorage) {
        cortesLocalStorage = [];
    } else {
        cortesLocalStorage = JSON.parse(cortesLocalStorage);
    }
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
      
        function renderRecientes() {

        const accidentesJSON = data.Accidentes
        const cortesJSON = data.Cortes
        const mantenimientosJSON = data.Mantenimiento
        const recientes = accidentesJSON.concat(cortesJSON , mantenimientosJSON , accidentesLocalStorage , cortesLocalStorage , mantenimientosLocalStorage)
        const cardsContainer = document.getElementById('recientes-filtrados')

        const date = new Date()
        let hora = date.toLocaleTimeString('en-US', {hour: 'numeric', hour12: true});
        const fechaActual = new Date().toLocaleDateString('en-GB').split('/').reverse().join('-');
        
        const recientesFiltrados = recientes.filter(reciente => {
            if (!reciente || !reciente.hora || !reciente.fecha) {
                return false;
            }
            const horaReciente = reciente.hora.split(':')[0];
            const ampmReciente = reciente.hora.split(' ')[1];
            const horaCompleta = horaReciente + ' ' + ampmReciente;
            const fechaReciente = reciente.fecha;
            return  fechaReciente === fechaActual && horaCompleta === hora;
        });

        
        const primerosCinco = recientesFiltrados.slice(0, 5);
        
       

        function createRecienteCard(reciente) {
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
            cardHeaderTitle.textContent = `${reciente.titulo}`;
            cardHeaderDirection.textContent = `${reciente.direccion}`;
            cardHeaderHour.textContent = `${reciente.hora} ${reciente.fecha}`;

            leftSide.appendChild(cardHeaderTitle);
            leftSide.appendChild(cardHeaderDirection);
            rightSide.appendChild(cardHeaderHour);

            cardHeader.appendChild(leftSide);
            cardHeader.appendChild(rightSide);
            card.appendChild(cardHeader);
            //card-features
            const cardFeatures = document.createElement('div');
            cardFeatures.className = 'card-features';
            // Característica 1: Likes
            const cardFeaturesChild1 = document.createElement('div');
            const imgLikes = document.createElement('img');
            imgLikes.src = '/Images/like_before.png';
            const likesCount = document.createElement('p');
            likesCount.textContent = `${reciente.likes}`;
            cardFeaturesChild1.appendChild(imgLikes);
            cardFeaturesChild1.appendChild(likesCount);
            cardFeatures.appendChild(cardFeaturesChild1);
            // Logica de like 
            // 1- verificamos que el usuario este logueado para poder dar like
            // 2- verificamos si el usuario ya dio like, si ya dio like, cambiamos la imagen

            cardFeaturesChild1.addEventListener('click', function() {
                const user = JSON.parse(localStorage.getItem('user'));
            
                if (user) {
                    const likeKey = `like${reciente.tipo}${reciente.id}`;
                    let likes = parseInt(localStorage.getItem(likeKey)) 
                    let likesJson = reciente.likes;

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

            // Característica 2: Comentarios
            const cardFeaturesChild2 = document.createElement('div');
            const imgComments = document.createElement('img');
            imgComments.src = '/Images/comment.png';
            const commentsCount = document.createElement('p');
            // commentsCount.textContent = `${reciente.comentarios}`;
            const tipo = `${reciente.tipo}`;
            const id = `${reciente.id}`;

            // recuperamos la cantidad de comentarios del JSON 
            const countComentariosJson = reciente.comentario.length
            // recuperamos la cantidad total de comentarios de ese id 
            // convertimos tipo a String con la primera letra en mayúscula
            const tipoCapitalizado = tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();

            const countComentariosTotales = localStorage.getItem(`comentarios${tipoCapitalizado}${id}Length`) 

            if (!countComentariosTotales) {
                if (countComentariosJson > 0) {
                    commentsCount.textContent = countComentariosJson
                } else {
                    commentsCount.textContent = 0
                }                
            } else {
                commentsCount.textContent = parseInt(countComentariosTotales)
            }

            cardFeaturesChild2.addEventListener('click', function() {
                if (tipo === 'accidente') {
                    localStorage.setItem('accidenteId', id);
                    window.location.href = '/sections/accidentes-mas.html#comments';
                } else if (tipo === 'corte') {
                    localStorage.setItem('corteId', id);
                    window.location.href = '/sections/cortes-mas.html#comments';
                } else {
                    localStorage.setItem('mantenimientoId', id);
                    window.location.href = '/sections/mantenimientos-mas.html#comments';
                }
            });



            cardFeaturesChild2.appendChild(imgComments);
            cardFeaturesChild2.appendChild(commentsCount);
            cardFeatures.appendChild(cardFeaturesChild2);
            // card-more
            const cardMore = document.createElement('div');
            cardMore.className = 'card-more';
            const moreButton = document.createElement('a');
            (tipo === 'accidente') ? 
            moreButton.href = `/sections/accidentes-mas.html` : (tipo === 'corte') ? 
            moreButton.href = `/sections/cortes-mas.html` : 
            moreButton.href = `/sections/mantenimientos-mas.html`

            moreButton.addEventListener('click', function() {
                if (tipo === 'accidente') {
                    localStorage.setItem('accidenteId', id);
                } else if (tipo === 'corte') {
                    localStorage.setItem('corteId', id);
                } else {
                    localStorage.setItem('mantenimientoId', id);
                }
            });


            moreButton.innerHTML = 'Ver más';
            cardMore.appendChild(moreButton);
            card.appendChild(cardFeatures);
            card.appendChild(cardMore);

            return card;
        }
        if (primerosCinco.length === 0) {
            const noReciente = document.createElement('p');
            noReciente.style.textAlign = 'center';
            noReciente.innerHTML = 'No hay recientes para mostrar';
            cardsContainer.appendChild(noReciente);
        } else {
            primerosCinco.forEach(reciente => {
                const card = createRecienteCard(reciente);
                cardsContainer.appendChild(card);
            });
        }
    }

    function renderAccidentes() {
        const accidentesJSON = data.Accidentes
        const accidentes = accidentesJSON.concat(accidentesLocalStorage)
        const cardsContainer = document.getElementById('accidentes-filtrados')

        const date = new Date()
        const hora = date.toLocaleTimeString('en-US', {hour: 'numeric', hour12: true});
        const fechaActual = new Date().toLocaleDateString('en-GB').split('/').reverse().join('-');

        const accidentesFiltrados = accidentes.filter(accidente => {
            if (!accidente || !accidente.hora || !accidente.fecha) {
                return false;
            }
            const horaReciente = accidente.hora.split(':')[0];
            const ampmReciente = accidente.hora.split(' ')[1];
            const horaCompleta = horaReciente + ' ' + ampmReciente;
            const fechaReciente = accidente.fecha;
            
            return fechaReciente === fechaActual && horaCompleta === hora;
        });
        const primerosCinco = accidentesFiltrados.slice(0, 5);

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
            //card-features
            const cardFeatures = document.createElement('div');
            cardFeatures.className = 'card-features';
            // Característica 1: Likes
            const cardFeaturesChild1 = document.createElement('div');
            const imgLikes = document.createElement('img');
            imgLikes.src = '/Images/like_before.png';
            const likesCount = document.createElement('p');
            likesCount.textContent = `${accidente.likes}`;
            cardFeaturesChild1.appendChild(imgLikes);
            cardFeaturesChild1.appendChild(likesCount);
            cardFeatures.appendChild(cardFeaturesChild1);

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



            // Característica 2: Comentarios
            const id = `${accidente.id}`;

            const cardFeaturesChild2 = document.createElement('div');
            const imgComments = document.createElement('img');
            imgComments.src = '/Images/comment.png';
            const commentsCount = document.createElement('p');
            // commentsCount.textContent = `${accidente.comentarios}`;

            // recuperamos la cantidad de comentarios del JSON
            const countComentariosJson = accidente.comentario.length
            // recuperamos la cantidad total de comentarios de ese id
            const countComentariosTotales = localStorage.getItem(`comentariosAccidente${id}Length`)

            if (!countComentariosTotales) {
                if (countComentariosJson > 0) {
                    commentsCount.textContent = countComentariosJson
                } else {
                    commentsCount.textContent = 0
                }                
            } else {
                commentsCount.textContent = parseInt(countComentariosTotales)
            }


            cardFeaturesChild2.appendChild(imgComments);
            cardFeaturesChild2.appendChild(commentsCount);
            cardFeatures.appendChild(cardFeaturesChild2);

            cardFeaturesChild2.addEventListener('click', function() {
                window.location.href = `/sections/accidentes-mas.html#comments`;
            });
            // card-more
            const cardMore = document.createElement('div');
            cardMore.className = 'card-more';
            const moreButton = document.createElement('a');
            moreButton.href = `/sections/accidentes-mas.html`
            moreButton.innerHTML = 'Ver más';
            cardMore.appendChild(moreButton);
            card.appendChild(cardFeatures);
            card.appendChild(cardMore);

            return card;
        }

        if (primerosCinco.length === 0) {
            const noAccidente = document.createElement('p');
            noAccidente.style.textAlign = 'center';
            noAccidente.innerHTML = 'No hay accidentes para mostrar';
            cardsContainer.appendChild(noAccidente);
        } else {
            primerosCinco.forEach(accidente => {
                const card = createAccidenteCard(accidente);
                cardsContainer.appendChild(card);
            });
        }
    }

    function renderCortes() {
        const cortesJSON = data.Cortes
        const cortes = cortesJSON.concat(cortesLocalStorage)
        const cardsContainer = document.getElementById('cortes-filtrados')

        const date = new Date()
        const hora = date.toLocaleTimeString('en-US', {hour: 'numeric', hour12: true});
        const fechaActual = new Date().toLocaleDateString('en-GB').split('/').reverse().join('-');


        const cortesFiltrados = cortes.filter(cortes => {
            if (!cortes || !cortes.hora || !cortes.fecha) {
                return false;
            }
            const horaReciente = cortes.hora.split(':')[0];
            const ampmReciente = cortes.hora.split(' ')[1];
            const horaCompleta = horaReciente + ' ' + ampmReciente;
            const fechaReciente = cortes.fecha;
            
            return fechaReciente === fechaActual && horaCompleta === hora;
        });

        
        const primerosCinco = cortesFiltrados.slice(0, 5);

        function createCortesCard(cortes) {
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
            cardHeaderTitle.textContent = `${cortes.titulo}`;
            cardHeaderDirection.textContent = `${cortes.direccion}`;
            cardHeaderHour.textContent = `${cortes.hora} ${cortes.fecha}`;

            leftSide.appendChild(cardHeaderTitle);
            leftSide.appendChild(cardHeaderDirection);
            rightSide.appendChild(cardHeaderHour);

            cardHeader.appendChild(leftSide);
            cardHeader.appendChild(rightSide);
            card.appendChild(cardHeader);
            //card-features
            const cardFeatures = document.createElement('div');
            cardFeatures.className = 'card-features';
            // Característica 1: Likes
            const cardFeaturesChild1 = document.createElement('div');
            const imgLikes = document.createElement('img');
            imgLikes.src = '/Images/like_before.png';
            const likesCount = document.createElement('p');
            likesCount.textContent = `${cortes.likes}`;
            cardFeaturesChild1.appendChild(imgLikes);
            cardFeaturesChild1.appendChild(likesCount);
            cardFeatures.appendChild(cardFeaturesChild1);

            cardFeaturesChild1.addEventListener('click', function() {
                const user = JSON.parse(localStorage.getItem('user'));
            
                if (user) {
                    const likeKey = `like${cortes.tipo}${cortes.id}`;
                    let likes = parseInt(localStorage.getItem(likeKey)) 
                    let likesJson = cortes.likes;

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






            // Característica 2: Comentarios
            const id = `${cortes.id}`;
            const cardFeaturesChild2 = document.createElement('div');
            const imgComments = document.createElement('img');
            imgComments.src = '/Images/comment.png';
            const commentsCount = document.createElement('p');
            
            const countComentariosJson = cortes.comentario.length
            const countComentariosTotales = localStorage.getItem(`comentariosCorte${id}Length`)
            if (!countComentariosTotales) {
                if (countComentariosJson > 0) {
                    commentsCount.textContent = countComentariosJson
                } else {
                    commentsCount.textContent = 0
                }                
            } else {
                commentsCount.textContent = parseInt(countComentariosTotales)
            }



            cardFeaturesChild2.appendChild(imgComments);
            cardFeaturesChild2.appendChild(commentsCount);
            cardFeatures.appendChild(cardFeaturesChild2);
            // card-more
            const cardMore = document.createElement('div');
            cardMore.className = 'card-more';
            const moreButton = document.createElement('a');

            cardFeaturesChild2.addEventListener('click', function() {
                window.location.href = `/sections/cortes-mas.html#comments`;
            });
            moreButton.addEventListener('click', function() {
                localStorage.setItem('corteId', id);
            });


            moreButton.href = `/sections/cortes-mas.html`
            moreButton.innerHTML = 'Ver más';
            cardMore.appendChild(moreButton);
            card.appendChild(cardFeatures);
            card.appendChild(cardMore);

            return card;
        }

        if (primerosCinco.length === 0) {
            const noCortes = document.createElement('p');
            noCortes.style.textAlign = 'center';
            noCortes.innerHTML = 'No hay cortes para mostrar';
            cardsContainer.appendChild(noCortes);
        } else {
            primerosCinco.forEach(cortes => {
                const card = createCortesCard(cortes);
                cardsContainer.appendChild(card);
            });
        }

    }

    function renderMantenimientos() {
        const mantenimientosJSON = data.Mantenimiento
        const mantenimientos = mantenimientosJSON.concat(mantenimientosLocalStorage)
        const cardsContainer = document.getElementById('mantenimientos-filtrados')

        const date = new Date()
        const hora = date.toLocaleTimeString('en-US', {hour: 'numeric', hour12: true});
        const fechaActual = new Date().toLocaleDateString('en-GB').split('/').reverse().join('-');

        const mantenimientosFiltrados = mantenimientos.filter(mantenimientos => {
            if (!mantenimientos || !mantenimientos.hora || !mantenimientos.fecha) {
                return false;
            }
            const horaReciente = mantenimientos.hora.split(':')[0];
            const ampmReciente = mantenimientos.hora.split(' ')[1];
            const horaCompleta = horaReciente + ' ' + ampmReciente;
            const fechaReciente = mantenimientos.fecha;
            
            return fechaReciente === fechaActual && horaCompleta === hora;
        });

        
        const primerosCinco = mantenimientosFiltrados.slice(0, 5);

        function createMantenimientosCard(mantenimientos) {
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
            cardHeaderTitle.textContent = `${mantenimientos.titulo}`;
            cardHeaderDirection.textContent = `${mantenimientos.direccion}`;
            cardHeaderHour.textContent = `${mantenimientos.hora} ${mantenimientos.fecha}`;

            leftSide.appendChild(cardHeaderTitle);
            leftSide.appendChild(cardHeaderDirection);
            rightSide.appendChild(cardHeaderHour);

            cardHeader.appendChild(leftSide);
            cardHeader.appendChild(rightSide);
            card.appendChild(cardHeader);
            //card-features
            const cardFeatures = document.createElement('div');
            cardFeatures.className = 'card-features';
            // Característica 1: Likes
            const cardFeaturesChild1 = document.createElement('div');
            const imgLikes = document.createElement('img');
            imgLikes.src = '/Images/like_before.png';
            const likesCount = document.createElement('p');
            likesCount.textContent = `${mantenimientos.likes}`;
            cardFeaturesChild1.appendChild(imgLikes);
            cardFeaturesChild1.appendChild(likesCount);
            cardFeatures.appendChild(cardFeaturesChild1);

            cardFeaturesChild1.addEventListener('click', function() {
                const user = JSON.parse(localStorage.getItem('user'));
            
                if (user) {
                    const likeKey = `like${mantenimientos.tipo}${mantenimientos.id}`;
                    let likes = parseInt(localStorage.getItem(likeKey)) 
                    let likesJson = mantenimientos.likes;

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



            // Característica 2: Comentarios
            const id = `${mantenimientos.id}`;

            const cardFeaturesChild2 = document.createElement('div');
            const imgComments = document.createElement('img');
            imgComments.src = '/Images/comment.png';
            const commentsCount = document.createElement('p');
            // commentsCount.textContent = `${mantenimientos.comentarios}`;

            const countComentariosJson = mantenimientos.comentario.length
            const countComentariosTotales = localStorage.getItem(`comentariosMantenimiento${id}Length`)
            if (!countComentariosTotales) {
                if (countComentariosJson > 0) {
                    commentsCount.textContent = countComentariosJson
                } else {
                    commentsCount.textContent = 0
                }                
            } else {
                commentsCount.textContent = parseInt(countComentariosTotales)
            }


            cardFeaturesChild2.appendChild(imgComments);
            cardFeaturesChild2.appendChild(commentsCount);
            cardFeatures.appendChild(cardFeaturesChild2);
            // card-more
            const cardMore = document.createElement('div');
            cardMore.className = 'card-more';
            const moreButton = document.createElement('a');

            cardFeaturesChild2.addEventListener('click', function() {
                window.location.href = `/sections/mantenimientos-mas.html#comments`;
            });

            moreButton.addEventListener('click', function() {
                localStorage.setItem('mantenimientoId', id);
            });

            moreButton.href = `/sections/mantenimientos-mas.html`
            moreButton.innerHTML = 'Ver más';
            cardMore.appendChild(moreButton);
            card.appendChild(cardFeatures);
            card.appendChild(cardMore);

            return card;
        }

        if (primerosCinco.length === 0) {
            const noMantenimientos = document.createElement('p');
            noMantenimientos.style.textAlign = 'center';
            noMantenimientos.innerHTML = 'No hay mantenimientos para mostrar';
            cardsContainer.appendChild(noMantenimientos);
        } else {
            primerosCinco.forEach(mantenimientos => {
                const card = createMantenimientosCard(mantenimientos);
                cardsContainer.appendChild(card);
            });
        }
    }
    
    renderRecientes();
    renderAccidentes();
    renderCortes();
    renderMantenimientos();


    })
    .catch(error => {
        console.log(error);
    });
});