const requestURL = 'https://jsonplaceholder.typicode.com/users';

const modalBg = document.querySelector('.modal-bg');
const modal2Bg = document.querySelector('.modal2-bg');

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

const modalName = document.querySelector('#modal-name');
const modalFamilyName = document.querySelector('#modal-family-name');
const modalEmail = document.querySelector('#modal-email');
const modalCity = document.querySelector('#modal-city');
const modalStreet = document.querySelector('#modal-street');
const modalSuite = document.querySelector('#modal-suite');
const modalCompany = document.querySelector('#modal-company');
const modalZipcode = document.querySelector('#modal-zipcode');



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
        <tr id="row-${user.id}">
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
    

    const userRow = document.getElementById(`row-${user.id}`);
    
    userRow.addEventListener('click', function(){
        modal2Bg.classList.add('bg-active');
        modalName.innerHTML = `${user.name}`;
        modalFamilyName.innerHTML = `${user.username}`;
        modalEmail.innerHTML = `${user.email}`;
        modalCity.innerHTML = `${user.address.city}`;
        modalStreet.innerHTML = `${user.address.street}`;
        modalSuite.innerHTML = `${user.address.suite}`;
        modalCompany.innerHTML = `${user.company.name}`;
        modalZipcode.innerHTML = `${user.address.zipcode}`;
    })

    const modal2CloseButton = document.querySelector('.modal2-close-button');

    modal2CloseButton.addEventListener('click', function(){
        modal2Bg.classList.remove('bg-active');
    })


    const editBtn = document.getElementById(`edit-btn-${user.id}`);
    const deleteBtn = document.getElementById(`delete-btn-${user.id}`);
   

    deleteBtn.addEventListener('click', function(e){
        e.stopPropagation();
        const userId = deleteBtn.id.slice(11);
        usersMaster = usersMaster.filter(item => item.id != userId);
        renderTable();
        console.log(usersMaster);
    })
    
    editBtn.addEventListener('click', function(e){
        e.stopPropagation();
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
    for (let user of usersMaster) {
        newUser.id = user.id + 1;
    };
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
    renderTable();
})

let sortDirection = false;

function sortColumn(columnName) {
    const dataType = typeof usersMaster[0][columnName];
    sortDirection = !sortDirection;

    if (columnName === 'city') {
        usersMaster = usersMaster.sort((u1, u2) => {
            return sortDirection 
                ? u1.address.city.localeCompare(u2.address.city) 
                : u2.address.city.localeCompare(u1.address.city);
        });
    }

    if (columnName === 'zipcode') {
        usersMaster = usersMaster.sort((u1, u2) => {
            return sortDirection 
                ? u1.address.zipcode.localeCompare(u2.address.zipcode) 
                : u2.address.zipcode.localeCompare(u1.address.zipcode);
        });
    }

    if (columnName === 'company') {
        usersMaster = usersMaster.sort((u1, u2) => {
            return sortDirection 
                ? u1.company.name.localeCompare(u2.company.name) 
                : u2.company.name.localeCompare(u1.company.name);
        });
    }
    
    switch(dataType){
        case 'number' :
        sortNumberColumn(sortDirection, columnName);
        break;
        case 'string' :
        sortStringColumn(sortDirection, columnName);
        break;
    };
    renderTable();
}

function sortNumberColumn(sort, columnName){
    usersMaster = usersMaster.sort((u1, u2) => {
        return sort 
        ? u1[columnName] - u2[columnName] 
        : u2[columnName] - u1[columnName];
    });
}

function sortStringColumn(sort, columnName){
    usersMaster = usersMaster.sort((u1, u2) => {
        return sort 
            ? u1[columnName].localeCompare(u2[columnName]) 
            : u2[columnName].localeCompare(u1[columnName]);
    });
    
}


