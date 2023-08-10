
const formContainer = document.querySelector('.form-container');
let meta = {}
let props = {}
const result = document.querySelector('.result')

document.addEventListener("DOMContentLoaded", () => {
    fetchJSONData();
});

function fetchJSONData() {
    fetch('./example.json') 
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Process the fetched JSON data
            handleJSONData(data);
        })
        .catch(error => {
            console.error('Error fetching JSON data:', error);
        });
}

function handleJSONData(data) {
    
    meta = {...data.meta}
    props = {...data.props}

    renderForm();
}

function renderForm(){
    formContainer.innerHTML = ''

    for(const key in meta){
        const control = meta[key];
        const value = control.defaultValue;

        let elementContainer = document.createElement('div')
        elementContainer.classList.add("container")
        let inputElement;

        switch(control.type){
            case 'dropdown':
                inputElement = document.createElement('select');
                inputElement.classList.add("dropdown")
                for (const option of control.values) {
                    const optionElement = document.createElement('option');
                    optionElement.value = option[Object.keys(option)[0]];
                    optionElement.textContent = Object.values(option)[0];
                    inputElement.appendChild(optionElement);
                }
                break;
            case 'checkbox':
                inputElement = document.createElement('input');
                inputElement.classList.add("checkbox")
                inputElement.type = 'checkbox';
                inputElement.checked = value === 'true';
                break;
            case 'radio':
                inputElement = document.createElement('div');
                for (const option of control.values) {
                    const radioInput = document.createElement('input');
                    radioInput.classList.add("radioBtn")
                    radioInput.type = 'radio';
                    radioInput.name = key;
                    radioInput.value = option[Object.keys(option)[0]];
                    radioInput.checked = value === radioInput.value;
                    
                    const label = document.createElement('label');
                    label.textContent = Object.values(option)[0];
                    label.appendChild(radioInput);
                    
                    inputElement.appendChild(label);
                }
                break;
            case 'input':
                inputElement = document.createElement('input');
                inputElement.classList.add("text-input")
                inputElement.type = 'text';
                inputElement.value = value;
                break;
        }

        // Add label and description
        const labelElement = document.createElement('label');
        labelElement.textContent = control.label;
        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = control.description;

        formContainer.appendChild(elementContainer);
        elementContainer.appendChild(labelElement);
        elementContainer.appendChild(inputElement);
        elementContainer.appendChild(descriptionElement);
    }
    
}

function setDefaults() {
    renderForm();
}

function resetForm() {
    const dropdown = document.querySelector(".dropdown")
    const checkbox = document.querySelector(".checkbox")
    const radioBtn = document.querySelectorAll(".radioBtn")
    const textInput = document.querySelector(".text-input")

    fetch('./example.json') 
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const props = {...data.props}
        
        dropdown.value = props.styling.toString().charAt(0).toUpperCase() + props.styling.toString().slice(1);
        checkbox.checked = props[0];
        radioBtn.forEach((btn) => {
            if(props.promoCodeDisplay.toLowerCase() === btn.value.toLowerCase()){
                btn.checked = true;
            }
        })
        textInput.value = props.promoCodeSize
    })
    .catch(error => {
        console.error('Error fetching JSON data:', error);
    });
}

function saveForm() {
    fetch('./example.json') 
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        
        const props = {...data.props}
        
        

        const dropdown = document.querySelector(".dropdown")
        const checkbox = document.querySelector(".checkbox")
        const radioBtn = document.querySelectorAll(".radioBtn")
        const textInput = document.querySelector(".text-input")

        console.log(radioBtn.checked)
        props.styling = dropdown.value
        props.openTermsInCustomLightbox = checkbox.checked

        for (const btn of radioBtn) {
            if (btn.checked) {
                props.promoCodeDisplay = btn.value
                break;
            }
        }
        props.promoCodeSize = textInput.value
        
        result.innerHTML = JSON.stringify(props);
    })
    .catch(error => {
        console.error('Error fetching JSON data:', error);
    });

}

renderForm();