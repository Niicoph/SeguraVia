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
            const accidentesJSON = data.Accidentes || [];
            const cortesJSON = data.Cortes || [];
            const mantenimientosJSON = data.Mantenimiento || [];
            const recientes = accidentesJSON.concat(cortesJSON, mantenimientosJSON, accidentesLocalStorage, cortesLocalStorage, mantenimientosLocalStorage);
            const cardsContainer = document.getElementById('recientes-filtrados');
        
            const date = new Date();
            let hora = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
            const fechaActual = new Date().toLocaleDateString('en-GB').split('/').reverse().join('-');
        
            const recientesFiltrados = recientes.filter(reciente => {
                if (!reciente || !reciente.hora || !reciente.fecha) {
                    return false;
                }
                const horaReciente = reciente.hora.split(':')[0];
                const ampmReciente = reciente.hora.split(' ')[1];
                const horaCompleta = horaReciente + ' ' + ampmReciente;
                const fechaReciente = reciente.fecha;
                return fechaReciente === fechaActual && horaCompleta === hora;
            });
        
            const primerosCinco = recientesFiltrados.slice(0, 5);
        
            function createRecienteCard(reciente) {
                // card
                const card = document.createElement('div');
                card.className = 'card';
                card.id = `card-id-${reciente.id}`;
        
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
        
                // card-features
                const cardFeatures = document.createElement('div');
                cardFeatures.className = 'card-features';
        
                // Característica 1: Likes
        
                let likes = parseInt(localStorage.getItem(`numeroLikes${reciente.tipo}${reciente.id}`)) || reciente.likes;
                let userLike = localStorage.getItem(`usuarioLike${reciente.tipo}${reciente.id}`);
        
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
                        let userLike = localStorage.getItem(`usuarioLike${reciente.tipo}${reciente.id}`);
        
                        if (userLike === 'true') {
                            imgLikes.src = '/Images/like_before.png';
                            likesCount.textContent = currentLikes - 1;
                            // deberiamos buscar y actualizar los likes del accidente en el localStorage
                            localStorage.setItem(`usuarioLike${reciente.tipo}${reciente.id}`, 'false');
                            localStorage.setItem(`numeroLikes${reciente.tipo}${reciente.id}`, currentLikes - 1);
                            window.location.reload();
                        } else {
                            imgLikes.src = '/Images/like_after.png';
                            likesCount.textContent = currentLikes + 1;
                            localStorage.setItem(`usuarioLike${reciente.tipo}${reciente.id}`, 'true');
                            localStorage.setItem(`numeroLikes${reciente.tipo}${reciente.id}`, currentLikes + 1);
                            window.location.reload();
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
                const tipo = `${reciente.tipo}`;
                const id = `${reciente.id}`;
        
                const countComentariosJson = reciente.comentario ? reciente.comentario.length : 0;
                const tipoCapitalizado = tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();
                const countComentariosTotales = localStorage.getItem(`comentarios${tipoCapitalizado}${id}Length`);
        
                commentsCount.textContent = countComentariosTotales ? parseInt(countComentariosTotales) : countComentariosJson;
        
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
                moreButton.href = tipo === 'accidente' ? `/sections/accidentes-mas.html` : (tipo === 'corte' ? `/sections/cortes-mas.html` : `/sections/mantenimientos-mas.html`);
        
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
                const reportaAca = document.createElement('a');
                reportaAca.href = '/sections/reportar.html';
                reportaAca.className = 'reporta-aca';
                noReciente.className = 'no-reciente';
                noReciente.style.textAlign = 'center';
                noReciente.innerHTML = 'No hay recientes para mostrar , reportá ';
                reportaAca.innerHTML = 'acá';
                noReciente.appendChild(reportaAca);
                cardsContainer.appendChild(noReciente);
            } else {
                primerosCinco.forEach(reciente => {
                    const card = createRecienteCard(reciente);
                    cardsContainer.appendChild(card);
                });
            }
        }
        
        
        
        
        

    function renderAccidentes() {
        const accidentesJSON = data.Accidentes;
        const accidentes = accidentesJSON.concat(accidentesLocalStorage);
        const cardsContainer = document.getElementById('accidentes-filtrados');
    
        const date = new Date();
        const hora = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
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
    
            // card-features
            const cardFeatures = document.createElement('div');
            cardFeatures.className = 'card-features';
    
            // Característica 1: Likes
            let likes = parseInt(localStorage.getItem(`numeroLikes${accidente.tipo}${accidente.id}`)) || accidente.likes;
            let userLike = localStorage.getItem(`usuarioLike${accidente.tipo}${accidente.id}`);

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
                    let userLike = localStorage.getItem(`usuarioLike${accidente.tipo}${accidente.id}`);
    
                    if (userLike === 'true') {
                        imgLikes.src = '/Images/like_before.png';
                        likesCount.textContent = currentLikes - 1;
                        localStorage.setItem(`usuarioLike${accidente.tipo}${accidente.id}`, 'false');
                        localStorage.setItem(`numeroLikes${accidente.tipo}${accidente.id}`, currentLikes - 1);
                        window.location.reload();
                    } else {
                        imgLikes.src = '/Images/like_after.png';
                        likesCount.textContent = currentLikes + 1;
                        localStorage.setItem(`usuarioLike${accidente.tipo}${accidente.id}`, 'true');
                        localStorage.setItem(`numeroLikes${accidente.tipo}${accidente.id}`, currentLikes + 1);
                        window.location.reload();
                    }
                }
            });

    
            // Característica 2: Comentarios
            const id = `${accidente.id}`;
            const cardFeaturesChild2 = document.createElement('div');
            const imgComments = document.createElement('img');
            imgComments.src = '/Images/comment.png';
            const commentsCount = document.createElement('p');
    
            // Recuperamos la cantidad de comentarios del JSON
            const countComentariosJson = accidente.comentario.length;
            // Recuperamos la cantidad total de comentarios de ese id
            const countComentariosTotales = localStorage.getItem(`comentariosAccidente${id}Length`);
    
            if (!countComentariosTotales) {
                commentsCount.textContent = countComentariosJson > 0 ? countComentariosJson : 0;
            } else {
                commentsCount.textContent = parseInt(countComentariosTotales);
            }
    
            cardFeaturesChild2.appendChild(imgComments);
            cardFeaturesChild2.appendChild(commentsCount);
            cardFeatures.appendChild(cardFeaturesChild2);
    
            cardFeaturesChild2.addEventListener('click', function() {
                localStorage.setItem('accidenteId', id);
                window.location.href = `/sections/accidentes-mas.html#comments`;
            });
    
            // card-more
            const cardMore = document.createElement('div');
            cardMore.className = 'card-more';
            const moreButton = document.createElement('a');
            moreButton.href = `/sections/accidentes-mas.html`;
            moreButton.innerHTML = 'Ver más';
            cardMore.appendChild(moreButton);
            card.appendChild(cardFeatures);
            card.appendChild(cardMore);
    
            moreButton.addEventListener('click', function() {
                localStorage.setItem('accidenteId', id);
            });
    
            return card;
        }
    
        if (primerosCinco.length === 0) {
            const noReciente = document.createElement('p');
            const reportaAca = document.createElement('a');
            reportaAca.href = '/sections/reportar.html';
            reportaAca.className = 'reporta-aca';
            noReciente.className = 'no-reciente';
            noReciente.style.textAlign = 'center';
            noReciente.innerHTML = 'No hay accidentes para mostrar , reportá ';
            reportaAca.innerHTML = 'acá';
            noReciente.appendChild(reportaAca);
            cardsContainer.appendChild(noReciente);
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
            let likes = parseInt(localStorage.getItem(`numeroLikes${cortes.tipo}${cortes.id}`)) || cortes.likes;
            let userLike = localStorage.getItem(`usuarioLike${cortes.tipo}${cortes.id}`);

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
                    let userLike = localStorage.getItem(`usuarioLike${cortes.tipo}${cortes.id}`);

                    if (userLike === 'true') {
                        imgLikes.src = '/Images/like_before.png';
                        likesCount.textContent = currentLikes - 1;
                        localStorage.setItem(`usuarioLike${cortes.tipo}${cortes.id}`, 'false');
                        localStorage.setItem(`numeroLikes${cortes.tipo}${cortes.id}`, currentLikes - 1);
                        window.location.reload();
                    } else {
                        imgLikes.src = '/Images/like_after.png';
                        likesCount.textContent = currentLikes + 1;
                        localStorage.setItem(`usuarioLike${cortes.tipo}${cortes.id}`, 'true');
                        localStorage.setItem(`numeroLikes${cortes.tipo}${cortes.id}`, currentLikes + 1);
                        window.location.reload();
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
                localStorage.setItem('corteId', id);
            });


            moreButton.href = `/sections/cortes-mas.html`
            moreButton.innerHTML = 'Ver más';
            cardMore.appendChild(moreButton);
            card.appendChild(cardFeatures);
            card.appendChild(cardMore);

            moreButton.addEventListener('click', function() {
                localStorage.setItem('corteId', id);
            });

            return card;
        }

        if (primerosCinco.length === 0) {
            const noReciente = document.createElement('p');
            const reportaAca = document.createElement('a');
            reportaAca.href = '/sections/reportar.html';
            reportaAca.className = 'reporta-aca';
            noReciente.className = 'no-reciente';
            noReciente.style.textAlign = 'center';
            noReciente.innerHTML = 'No hay cortes para mostrar , reportá ';
            reportaAca.innerHTML = 'acá';
            noReciente.appendChild(reportaAca);
            cardsContainer.appendChild(noReciente);
        } else {
            primerosCinco.forEach(cortes => {
                const card = createCortesCard(cortes);
                cardsContainer.appendChild(card);
            });
        }

    }

    function renderMantenimientos() {
        const mantenimientosJSON = data.Mantenimiento;
        const mantenimientos = mantenimientosJSON.concat(mantenimientosLocalStorage);
        const cardsContainer = document.getElementById('mantenimientos-filtrados');
    
        const date = new Date();
        const hora = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
        const fechaActual = new Date().toLocaleDateString('en-GB').split('/').reverse().join('-');
    
        const mantenimientosFiltrados = mantenimientos.filter(mantenimiento => {
            if (!mantenimiento || !mantenimiento.hora || !mantenimiento.fecha) {
                return false;
            }
            const horaReciente = mantenimiento.hora.split(':')[0];
            const ampmReciente = mantenimiento.hora.split(' ')[1];
            const horaCompleta = horaReciente + ' ' + ampmReciente;
            const fechaReciente = mantenimiento.fecha;
            return fechaReciente === fechaActual && horaCompleta === hora;
        });
    
        const primerosCinco = mantenimientosFiltrados.slice(0, 5);
    
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
            let likes = parseInt(localStorage.getItem(`numeroLikes${mantenimiento.tipo}${mantenimiento.id}`)) || mantenimiento.likes;
            let userLike = localStorage.getItem(`usuarioLike${mantenimiento.tipo}${mantenimiento.id}`);

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
                    let userLike = localStorage.getItem(`usuarioLike${mantenimiento.tipo}${mantenimiento.id}`);
    
                    if (userLike === 'true') {
                        imgLikes.src = '/Images/like_before.png';
                        likesCount.textContent = currentLikes - 1;
                        localStorage.setItem(`usuarioLike${mantenimiento.tipo}${mantenimiento.id}`, 'false');
                        localStorage.setItem(`numeroLikes${mantenimiento.tipo}${mantenimiento.id}`, currentLikes - 1);
                        window.location.reload();
                    } else {
                        imgLikes.src = '/Images/like_after.png';
                        likesCount.textContent = currentLikes + 1;
                        localStorage.setItem(`usuarioLike${mantenimiento.tipo}${mantenimiento.id}`, 'true');
                        localStorage.setItem(`numeroLikes${mantenimiento.tipo}${mantenimiento.id}`, currentLikes + 1);
                        window.location.reload();
                    }
                } else {
                    alert('Debes iniciar sesión para poder dar like');
                }
            });
    
           
    
            // Característica 2: Comentarios
            const id = `${mantenimiento.id}`;
            const cardFeaturesChild2 = document.createElement('div');
            const imgComments = document.createElement('img');
            imgComments.src = '/Images/comment.png';
            const commentsCount = document.createElement('p');
    
            // Recuperamos la cantidad de comentarios del JSON
            const countComentariosJson = mantenimiento.comentario.length;
            // Recuperamos la cantidad total de comentarios de ese id
            const countComentariosTotales = localStorage.getItem(`comentariosMantenimiento${id}Length`);
    
            if (!countComentariosTotales) {
                commentsCount.textContent = countComentariosJson > 0 ? countComentariosJson : 0;
            } else {
                commentsCount.textContent = parseInt(countComentariosTotales);
            }
    
            cardFeaturesChild2.appendChild(imgComments);
            cardFeaturesChild2.appendChild(commentsCount);
            cardFeatures.appendChild(cardFeaturesChild2);
    
            cardFeaturesChild2.addEventListener('click', function() {
                localStorage.setItem('mantenimientoId', id);
                window.location.href = `/sections/mantenimientos-mas.html#comments`;
            });
    
            // card-more
            const cardMore = document.createElement('div');
            cardMore.className = 'card-more';
            const moreButton = document.createElement('a');
            moreButton.href = `/sections/mantenimientos-mas.html`;
            moreButton.innerHTML = 'Ver más';
            cardMore.appendChild(moreButton);
            card.appendChild(cardFeatures);
            card.appendChild(cardMore);
    
            moreButton.addEventListener('click', function() {
                localStorage.setItem('mantenimientoId', id);
            });
    
            return card;
        }
    
        if (primerosCinco.length === 0) {
            const noReciente = document.createElement('p');
            const reportaAca = document.createElement('a');
            reportaAca.href = '/sections/reportar.html';
            reportaAca.className = 'reporta-aca';
            noReciente.className = 'no-reciente';
            noReciente.style.textAlign = 'center';
            noReciente.innerHTML = 'No hay mantenimientos para mostrar , reportá ';
            reportaAca.innerHTML = 'acá';
            noReciente.appendChild(reportaAca);
            cardsContainer.appendChild(noReciente);
        } else {
            primerosCinco.forEach(mantenimiento => {
                const card = createMantenimientoCard(mantenimiento);
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