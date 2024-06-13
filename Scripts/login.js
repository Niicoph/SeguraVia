document.addEventListener('DOMContentLoaded', function() {
    const formEl = document.getElementById('login-form');
    const emailEl = document.getElementById('username-i');
    const passwordEl = document.getElementById('password-i');

    fetch('/data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(data => {
        const users = data.Usuarios;
        formEl.addEventListener('submit', function(event) {
            // Prevenir el envío del formulario
            event.preventDefault();

            // Recuperamos los datos del usuario ingresados
            const password = passwordEl.value;
            const email = emailEl.value;
            
            let i = 0;
            let userFound = false;
            while (i < users.length && !userFound) {
                if (users[i].email === email && users[i].password === password) {
                    userFound = true;
                }
                i++;
            }

            // Guardamos el usuario en el local storage y lo redirigimos a la página principal
            if (userFound) {
                localStorage.setItem('user', JSON.stringify(users[i-1]));
                window.location.href = '/';
            } else {
                const error = document.getElementById('error');
                error.innerHTML = 'Usuario o contraseña incorrectos';
            }
        });
    });
});
