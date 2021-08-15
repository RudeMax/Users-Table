const requestURL = 'https://jsonplaceholder.typicode.com/users';

const modalBg = document.querySelector('.modal-bg');

const addUserBtn = document.querySelector('.modal-button');
const modalSaveBtn = document.querySelector('.modal-save-button');
const modalSaveEditBtn = document.querySelector('.modal-save-button-edit');
const modalCancelBtn = document.querySelector('.modal-cancel-button');

const idInput = document.querySelector('.id-input');
const nameInput = document.querySelector('.name-input');
const familyNameInput = document.querySelector('.family-name-input');
const emailInput = document.querySelector('.email-input');
const cityInput = document.querySelector('.city-input');
const streetInput = document.querySelector('.street-input');
const suiteInput = document.querySelector('.suite-input');
const companyInput = document.querySelector('.company-name-input');
const zipcodeInput = document.querySelector('.zipcode-input');

const table = document.querySelector('#table-body');

let lastUser;
let currentEditableUser;

function renderTable () {
    table.innerHTML = '';
    for (const user of usersMaster) {
       
        addRow(user);
        
    }
    
}

function addRow(user) {
    const row = `
        <tr>
            <td>${user.id}</td>
            <td>${user.name} ${user.username}</td>
            <td>${user.email}</td>
            <td>${user.address.city}, ${user.address.street}, ${user.address.suite}</td>
            <td>${user.company.name}</td>
            <td>${user.address.zipcode}</td>
            <td><button id="edit-btn-${user.id}" class="edit-btn btn btn-outline-success">Edit</button>
            <button id="delete-btn-${user.id}" class="delete-btn btn btn-outline-danger">Delete</button></td>
        </tr>
    `;

    document.querySelector('#table-body').insertAdjacentHTML('beforeend', row);
    
    const editBtn = document.getElementById(`edit-btn-${user.id}`);
    const deleteBtn = document.getElementById(`delete-btn-${user.id}`);
   
    deleteBtn.addEventListener('click', function(){
        const userId = deleteBtn.id.slice(11);
        usersMaster = usersMaster.filter(item => item.id != userId);
        renderTable();
        console.log(usersMaster);
    })
    
    editBtn.addEventListener('click', function(){
        modalBg.classList.add('bg-active');

        idInput.value = user.id;
        nameInput.value = user.name;
        familyNameInput.value = user.username;
        emailInput.value = user.email;
        cityInput.value = user.address.city;
        streetInput.value = user.address.street;
        suiteInput.value = user.address.suite;
        companyInput.value = user.company.name;
        zipcodeInput.value = user.address.zipcode;

        modalSaveBtn.style.display = 'none';
        modalSaveEditBtn.style.display = 'inline-block';
    });

}

modalSaveEditBtn.addEventListener('click', function(){
    currentEditableUser = usersMaster.find(item => item.id == idInput.value);

    currentEditableUser.name = nameInput.value;
    currentEditableUser.username = familyNameInput.value;
    currentEditableUser.email = emailInput.value;
    currentEditableUser.address = {
        city: cityInput.value,
        street: streetInput.value,
        suite: suiteInput.value,
        zipcode: zipcodeInput.value
    };
    currentEditableUser.company = {
        name: companyInput.value
    };

    let refreshedUsers = [];

    for (let user of usersMaster) {
        if (user.id == currentEditableUser.id) {
            refreshedUsers.push(currentEditableUser);
        } else {
            refreshedUsers.push(user);
        } 
    }

    usersMaster = refreshedUsers;
    renderTable();

    modalBg.classList.remove('bg-active');
    clearInput();
})

let usersMaster = [];


function fetchData() {
    
    fetch(requestURL)
        .then(res => {
            if (!res.ok) {
                throw Error('ERROR');
            }
            return res.json();
        })
        .then(data => {
            usersMaster = data;

            for (const user of data) {
                addRow(user);
            }

        })
        .catch(error => {
            console.log(error);
        });
}

fetchData();



addUserBtn.addEventListener('click', function(){
    modalBg.classList.add('bg-active');

    modalSaveBtn.style.display = 'inline-block';
    modalSaveEditBtn.style.display = 'none';
});

const clearInput = () => {
    nameInput.value = '';
    familyNameInput.value = '';
    emailInput.value = '';
    cityInput.value = '';
    streetInput.value = '';
    suiteInput.value = '';
    companyInput.value = '';
    zipcodeInput.value = '';
}

modalCancelBtn.addEventListener('click', function(){
    modalBg.classList.remove('bg-active');
    clearInput();
})

modalSaveBtn.addEventListener('click', function(){
    let newUser = {};
    lastUser = usersMaster.length;
    newUser.id = lastUser + 1;
    newUser.name = nameInput.value;
    newUser.username = familyNameInput.value;
    newUser.email = emailInput.value;
    newUser.address = {
        city: cityInput.value,
        street: streetInput.value,
        suite: suiteInput.value,
        zipcode: zipcodeInput.value
    };
    newUser.company = {
        name: companyInput.value
    };

    modalBg.classList.remove('bg-active');
    addRow(newUser);
    clearInput();
    usersMaster.push(newUser);
})
// PUSHED
