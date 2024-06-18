document.addEventListener('DOMContentLoaded', function() {
    const id = localStorage.getItem('accidenteId');
    const currentURL = window.location.href;
    const newUrl = currentURL + `?id=${id}`;
    window.history.replaceState( {} , 'Accidente', newUrl);

    






});