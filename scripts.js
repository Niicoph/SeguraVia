document.addEventListener("DOMContentLoaded", function() {
    // elementos del DOM principales
    const listNav = document.getElementById('list-img');
    const background = document.getElementById('body');
    const headerEl = document.getElementById('header');
    const sliderContainer = document.getElementById('slider');
    const headerSlider = document.getElementById('header-slider');
    const dataContainer = document.getElementById('data-container');
    const safetyAncla = document.getElementById('safety-ancla');

    // elemento del icono usuario
    const userIcon = document.getElementById('user-img');
    // elemento del logo
    const logo = document.getElementById('logo-img');

    listNav.addEventListener('click', function() {
        // estilos
        background.style.overflow = 'hidden'; 
        headerEl.style.opacity = '0.5'; 
        sliderContainer.style.opacity = '0.5';
        headerSlider.style.opacity = '0.5'; 
        dataContainer.style.opacity = '0.5'; 

        // elementos del DOM (creados con JS)
        const sectionContainer = document.createElement('div');
        const sectionContainerRow1 = document.createElement('div');
        const sectionContainerRow2 = document.createElement('div');
        const sectionContainerRow3 = document.createElement('div');
        const sectionContainerRow4 = document.createElement('div');
        const sectionContainerRow5 = document.createElement('div');
        const sectionContainerRow6 = document.createElement('div');
        const sectionContainerRow7 = document.createElement('div');
        const crossEl = document.createElement('p');
        const dataRow1 = document.createElement('p');
        const dataRow2 = document.createElement('p');
        const dataRow3 = document.createElement('p');
        const dataRow4 = document.createElement('p');
        const dataRow5 = document.createElement('p');
        const dataRow6 = document.createElement('p');
        const dataRow7 = document.createElement('p');

        // classes de los elementos (css)
        sectionContainer.className = 'nav-section-container';
        sectionContainerRow1.className = 'nav-section-container-row-1';
        sectionContainerRow2.className = 'nav-section-container-row-2';
        sectionContainerRow3.className = 'nav-section-container-row-3';
        sectionContainerRow4.className = 'nav-section-container-row-4';
        sectionContainerRow5.className = 'nav-section-container-row-5';
        sectionContainerRow6.className = 'nav-section-container-row-6';
        sectionContainerRow7.className = 'nav-section-container-row-7';
        crossEl.className = 'cross-el';
        dataRow1.className = 'data-row-1';
        dataRow2.className = 'data-row-2';
        dataRow3.className = 'data-row-3';
        dataRow4.className = 'data-row-4';
        dataRow5.className = 'data-row-5';
        dataRow6.className = 'data-row-6';
        dataRow7.className = 'data-row-7';

        // appendChild
        background.appendChild(sectionContainer);
        sectionContainer.appendChild(sectionContainerRow1);
        sectionContainer.appendChild(sectionContainerRow2);
        sectionContainer.appendChild(sectionContainerRow3);
        sectionContainer.appendChild(sectionContainerRow4);
        sectionContainer.appendChild(sectionContainerRow5);
        sectionContainer.appendChild(sectionContainerRow6);
        sectionContainer.appendChild(sectionContainerRow7);
        sectionContainerRow1.appendChild(crossEl);
        sectionContainerRow2.appendChild(dataRow1);
        sectionContainerRow3.appendChild(dataRow2);
        sectionContainerRow4.appendChild(dataRow3);
        sectionContainerRow5.appendChild(dataRow4);
        sectionContainerRow6.appendChild(dataRow5);
        sectionContainerRow7.appendChild(dataRow6);

        // contenido de los elementos
        crossEl.innerHTML = "❌";
        dataRow1.innerHTML = "Reportar";
        dataRow2.innerHTML = "Cortes";
        dataRow3.innerHTML = "Mantenimientos";
        dataRow4.innerHTML = "Accidentes";
        dataRow5.innerHTML = "Seguridad Vial";
        dataRow6.innerHTML = "Home";

        // evento al tocar X
        crossEl.addEventListener('click' , function() {
        sectionContainer.style.transform = 'translateX(-100%)';
        setTimeout(() => {
            sectionContainer.remove();
         }, 300); 
        background.style.overflow = 'auto';
        headerEl.style.opacity = '1';
        sliderContainer.style.opacity = '1';
        headerSlider.style.opacity = '1';
        dataContainer.style.opacity = '1';
        });

        // evento al tocar las opciones
        sectionContainerRow2.addEventListener('click', function() {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                window.location.href = "/sections/reportar.html";        
            } else {
                window.location.href = "/sections/login.html";
            }
        });
        sectionContainerRow3.addEventListener('click', function() {
            window.location.href = "/sections/cortes.html";
        });
        sectionContainerRow4.addEventListener('click', function() {
            window.location.href = "/sections/mantenimientos.html";
        });
        sectionContainerRow5.addEventListener('click', function() {
            window.location.href = "/sections/accidentes.html";
        });
        sectionContainerRow6.addEventListener('click', function() {
            safetyAncla.scrollIntoView({behavior: "smooth"});
            removeNav();
        });
        sectionContainerRow7.addEventListener('click', function() {
            window.location.href = "/";
        });

        // funcion para remover el nav
        function removeNav() {
            sectionContainer.remove();
            background.style.overflow = 'auto';
            headerEl.style.opacity = '1';
            sliderContainer.style.opacity = '1';
            headerSlider.style.opacity = '1';
            dataContainer.style.opacity = '1';
        }
        // Animacion al crear el elemento (nav)
        setTimeout( () => {
            sectionContainer.style.transform = 'translateX(0)';
        } , 0);
    })
      // evento al tocar el icono de usuario (evaluar si esta logeado o no)
      userIcon.addEventListener('click', function() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          alert('Usuario logueado');
        } else {
        window.location.href = "/sections/login.html";
        }
    });

    // evento al tocar el logo
    logo.addEventListener('click', function() {
        window.location.href = "/";
    });

});


