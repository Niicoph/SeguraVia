document.addEventListener('DOMContentLoaded', function() {
    const formEl = document.getElementById('login-form');
    const emailEl = document.getElementById('username-i');
    const nameEl = document.getElementById('name-i');
    const surnameEl = document.getElementById('lastname-i');
    const passwordEl = document.getElementById('password-i');
    const passwordConfirm = document.getElementById('password-i-confirmation');

    formEl.addEventListener('submit', function(event) {
        event.preventDefault();

        // Recuperamos los datos del usuario ingresados
        const password = passwordEl.value;
        const passwordC = passwordConfirm.value;
        const email = emailEl.value;
        const nombre = nameEl.value;
        let apellido = surnameEl.value

        fetch('/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(data => {
            const users = data.Usuarios
            let i = 0;
            let userFound = false;

            while (i < users.length && !userFound) {
                if (users[i].email === email) {
                    userFound = true;
                }
                i++;
            }
            if (userFound) {
                const error = document.getElementById('error');
                error.innerHTML = 'Ese email ya se encuentra en uso';
            } else {
                if (password === passwordC) {
                    if (surname === '') { // dado que el apellido es opcional se le asigna un valor por defecto
                        const newUser = {
                            email: email,
                            name: nombre,
                            surname: '',
                            password: password
                        }
                        alert('Usuario creado con éxito');
                        localStorage.setItem('user', JSON.stringify(newUser));
                        window.location.href = '/';
                    } else {
                        const newUser = {
                            email: email,
                            name: nombre,
                            surname: apellido,
                            password: password
                        }
                        alert('Usuario creado con éxito');
                        localStorage.setItem('user', JSON.stringify(newUser));
                        window.location.href = '/';
                    }
                }
            }
        }) 
    });














});