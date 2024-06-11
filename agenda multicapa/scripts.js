function limpiarCampos() {
    document.getElementById('nombreInput').value = '';
    document.getElementById('apellidoInput').value = '';
    document.getElementById('numeroInput').value = '';
}

const addbtn = document.getElementById('agregarBtn');
const Name = document.getElementById('nombreInput');
const lastName = document.getElementById('apellidoInput');
const contactNumber = document.getElementById('numeroInput');
const recordContainer = document.querySelector('.record_container');

let url = 'https://cors-anywhere.herokuapp.com/http://www.raydelto.org/agenda.php';

fetch(url)
    .then(response => response.json())
    .then(data => mostrarData(data))
    .catch(error => console.log(error));

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma tradicional
    if (checkInputfields([Name, lastName, contactNumber])) {
        fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'nombre': Name.value,
                    'apellido': lastName.value,
                    'telefono': contactNumber.value,
                })
            })
            .then(response => response.json())
            .then(data => {
                setMessage('success', "Contacto agregado");
                mostrarData([data]); // Actualizar la lista con el nuevo contacto
            })
            .catch(error => {
                console.error(error);
                setMessage('error', "Error al agregar contacto");
            });

        clearInputFields();
    } else {
        setMessage('error', "Campos vacíos o número de teléfono inválido");
    }
});

const mostrarData = (data) => {
    recordContainer.innerHTML = ''; // Limpiar contenido previo
    data.forEach(contacto => {
        const newRecordDiv = document.createElement('div');
        newRecordDiv.classList.add('record_item');
        newRecordDiv.innerHTML = `
            <div class="record_el">
                <span id="labelling">Nombre: </span>
                <span id="Contact_id_content">${contacto.nombre}</span>
            </div>
            <div class="record_el">
                <span id="labelling">Apellido: </span>
                <span id="Contact_id_content">${contacto.apellido}</span>
            </div>
            <div class="record_el">
                <span id="labelling">Teléfono: </span>
                <span id="Contact_id_content">${contacto.telefono}</span>
            </div>
        `;
        recordContainer.appendChild(newRecordDiv);
    });
};

function setMessage(status, message) {
    let messageBox = document.querySelector('.message');
    if (!messageBox) {
        messageBox = document.createElement('div');
        messageBox.classList.add('message');
        document.body.appendChild(messageBox);
    }
    messageBox.innerHTML = message;
    messageBox.classList.add(status);
    removeMessage(status, messageBox);
}

function clearInputFields() {
    Name.value = "";
    lastName.value = "";
    contactNumber.value = "";
}

function removeMessage(status, messageBox) {
    setTimeout(function() {
        messageBox.classList.remove(status);
    }, 2000);
}

function checkInputfields(inputArr) {
    return inputArr.every(input => input.value.trim() !== "") && phoneNumCheck(inputArr[2].value);
}

function phoneNumCheck(inputtxt) {
    const phoneNo = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
    return phoneNo.test(inputtxt);
}