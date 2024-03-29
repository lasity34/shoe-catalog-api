document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded for ShoeForm.handlebars');

    const form = document.getElementById('addShoeForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: form.name.value,
                brand: form.brand.value,
                size: parseInt(form.size.value),
                color: form.color.value,
                price: parseFloat(form.price.value),
                in_stock: parseInt(form.in_stock.value),
                image_url: form.image_url.value
            };
            
            try {
                const response = await fetch('/api/shoes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
        
                if (response.ok) {
                    alert('Shoe added successfully!');
                    form.reset();
                    window.location.href = '/';
                } else {
                    const data = await response.json();
                    alert('Error: ' + data.error);
                }
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        });
    }
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                const response = await fetch('/auth/logout', {
                    method: 'POST'
                });
                
                if (response.ok) {
                    window.location.href = '/';
                } else {
                    alert('Error logging out');
                }
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        });
    }
});
