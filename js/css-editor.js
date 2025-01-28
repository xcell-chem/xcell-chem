
function loadOptions() {
    const colors = ['Red', 'Blue', 'Green', 'Yellow'];
    const select = document.getElementById('colorOptions');

    colors.forEach(color => {
        const option = document.createElement('option');
        option.value = color.toLowerCase();
        option.textContent = color;
        option.style.backgroundColor = color.toLowerCase();
        select.appendChild(option);
    });
}

function saveCSS() {
    const cssProperties = document.querySelectorAll('[data-property]');
    let cssContent = '';

    cssProperties.forEach(field => {
        const property = field.dataset.property.split(':');
        const selector = property[0];
        const cssProp = property[1];
        const value = field.value.trim();

        cssContent += `${selector} {
    ${cssProp}: ${value};
}

`;
    });

    const cssBlob = new Blob([cssContent], { type: 'text/css' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(cssBlob);
    link.download = 'styles.css';
    link.click();
}

loadOptions();
