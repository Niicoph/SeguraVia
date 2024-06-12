document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('form-reportar');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Recuperamos los elementos del FORM
        const titulo = document.getElementById('titulo');
        const direccion = document.getElementById('direccion');
        const descripcion = document.getElementById('descripcion');
        const fecha = document.getElementById('fecha');
        const hora = document.getElementById('hora');
        // Obtener el id del tipo seleccionado al enviar el formulario
        const tipo = document.querySelector('input[name="tipo"]:checked');
        let tipoValue = null; // Valor por defecto si no se selecciona ningún tipo
        if (tipo) {
            tipoValue = tipo.id;
        }
        // Recuperamos los valores de los inputs al enviar el form
        const tituloValue = titulo.value;
        const direccionValue = direccion.value;
        const descripcionValue = descripcion.value;
        const fechaValue = fecha.value;
        const horaValue = hora.value;

        // Se pueden agregar validaciones aquí (por ejemplo, verificar la dirección en una API de geolocalización)
        // recuperamos los cortes utilizando un fetch para calcular la cantidad y crear un id correcto
        fetch('/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then( data => {
            // Función para obtener el formato de 24 horas
            function obtenerFormato12Horas(horaValue) {
                const horaSeleccionada = horaValue;
                const [hora, minutos] = horaSeleccionada.split(':');
                let ampm = 'AM';
                let hora12 = Number(hora);
        
                if (hora12 >= 12) {
                    ampm = 'PM';
                    if (hora12 > 12) {
                        hora12 -= 12;
                    }
                }
        
                return `${hora12}:${minutos} ${ampm}`;
            }

            if (tipoValue ===  'corte') {
                const cortes = data.Cortes;
                const horaFormato12 = obtenerFormato12Horas(horaValue);

                const corte = {
                    id: cortes.length + 1,
                    titulo: tituloValue,
                    fecha: fechaValue,
                    hora: horaFormato12,
                    direccion: direccionValue,
                    likes: 0,
                    comentarios: 0,
                    descripcion: descripcionValue,              
                    tipo: tipoValue
                };
        
                let cortesGuardados = localStorage.getItem('cortes');
                if (!cortesGuardados) {
                    cortesGuardados = [];
                } else {
                    cortesGuardados = JSON.parse(cortesGuardados);
                }
                cortesGuardados.push(corte);
                localStorage.setItem('cortes', JSON.stringify(cortesGuardados));
            } else if (tipoValue === 'accidente') {
                const accidentes = data.Accidentes;
                const horaFormato12 = obtenerFormato12Horas(horaValue);
                const accidente = {
                    id: accidentes.length + 1,
                    titulo: tituloValue,
                    fecha: fechaValue,
                    hora: horaFormato12,
                    direccion: direccionValue,
                    likes: 0,
                    comentarios: 0,
                    descripcion: descripcionValue,              
                    tipo: tipoValue
                };
        
                let accidentesGuardados = localStorage.getItem('accidente');
                if (!accidentesGuardados) {
                    accidentesGuardados = [];
                } else {
                    accidentesGuardados = JSON.parse(accidentesGuardados);
                }
                accidentesGuardados.push(accidente);
                localStorage.setItem('accidente', JSON.stringify(accidentesGuardados));
            } else {
                const mantenimientos = data.Mantenimiento;
                const horaFormato12 = obtenerFormato12Horas(horaValue);
                const mantenimiento = {
                    id: mantenimientos.length + 1,
                    titulo: tituloValue,
                    fecha: fechaValue,
                    hora: horaFormato12,
                    direccion: direccionValue,
                    likes: 0,
                    comentarios: 0,
                    descripcion: descripcionValue,              
                    tipo: tipoValue
                };
        
                let mantenimientosGuardados = localStorage.getItem('mantenimientos');
                if (!mantenimientosGuardados) {
                    mantenimientosGuardados = [];
                } else {
                    mantenimientosGuardados = JSON.parse(mantenimientosGuardados);
                }
                mantenimientosGuardados.push(mantenimiento);
                localStorage.setItem('mantenimientos', JSON.stringify(mantenimientosGuardados));
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
