(function () {
  const data = window.createEditProductData || {};
  const title = data.title || '';
  const categories = data.categories || [];
  const product = data.product || null;

  const categorySelect = document.getElementById('productCategoryId');
  if (categorySelect) {
    categories.forEach(cat => {
      categorySelect.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
    });
  }

  function getImageMimeType(filename) {
    const ext = filename?.split('.').pop()?.toLowerCase();
    const types = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
    };
    return types[ext] || 'image/jpeg';
  }

  function getImageDataUrl(base64Data, filename) {
    return `data:${getImageMimeType(filename)};base64,${base64Data}`;
  }

  if (product) {
    document.getElementById('productName').value = product.name || '';
    document.getElementById('productPrice').value = product.price ?? '';
    document.getElementById('productCategoryId').value = product.categoryId ?? '';
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('showToClients').checked = Boolean(product.showToClients);
    document.getElementById('outStock').checked = Boolean(product.outStock);
    document.getElementById('topProduct').checked = Boolean(product.topProduct);

    // Set existing images with their order numbers
    for (let i = 1; i <= 4; i++) {
      const imgInput = document.getElementById(`image${i}`);
      const previewContainer = document.getElementById(`imagePreview${i}`);
      const previewImg = document.getElementById(`imagePreviewImg${i}`);
      const imageName = `${i}`;

      if (imgInput && product.images) {
        // Buscar la imagen que tiene el mismo nombre que el input
        const matchingImage = product.images.find(img => img.name === imageName);
        
        if (matchingImage && matchingImage.file) {
          imgInput.value = ''; // Clear the file input
          previewImg.src = getImageDataUrl(matchingImage.file, matchingImage.name);
          previewContainer.style.display = 'block';
        } else {
          previewContainer.style.display = 'none';
        }
      } else {
        previewContainer.style.display = 'none';
      }
    }
  }

  // Add event listeners for all 4 image inputs
  for (let i = 1; i <= 4; i++) {
    const imgInput = document.getElementById(`image${i}`);
    if (imgInput) {
      imgInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (event) {
            const previewContainer = document.getElementById(`imagePreview${i}`);
            const previewImg = document.getElementById(`imagePreviewImg${i}`);
            previewContainer.style.display = 'block';
            previewImg.src = event.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  // Add delete buttons for each image
  for (let i = 1; i <= 4; i++) {
    const previewContainer = document.getElementById(`imagePreview${i}`);
    const previewImg = document.getElementById(`imagePreviewImg${i}`);
    if (previewContainer && previewImg) {
      // Create delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'btn btn-sm btn-danger';
      deleteBtn.textContent = 'Eliminar';
      deleteBtn.title = `Eliminar imagen ${i}`;
      
      deleteBtn.addEventListener('click', async function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        const productId = product ? product.id : null;
        if (!productId) {
          alert('No se puede eliminar imagen en modo creación.');
          return;
        }
        
        try {
          const response = await fetch(`/admin/products/${productId}/deleteImage`, {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ order: i, id: productId }),
          });
          
          const result = await response.json();
          
          if (result.success) {
            // Update preview
            previewImg.src = '';
            previewContainer.style.display = 'none';
            // Clear the file input
            document.getElementById(`image${i}`).value = '';
          } else {
            alert('Error al eliminar la imagen: ' + (result.message || ''));
          }
        } catch (err) {
          console.error('Error al eliminar imagen:', err);
          alert('Ocurrió un error al eliminar la imagen. Revisa la consola para más detalles.');
        }
      });
      
      // Append button to preview container
      previewContainer.appendChild(deleteBtn);
    }
  }

   const form = document.getElementById('productForm');
  if (!form) {
    return;
  }


    // Función para mostrar el modal con un mensaje dinámico
  function showSuccessModal(message = "Producto creado o editado exitosamente") {
    document.getElementById("successMessage").textContent = message;

    const modal = new bootstrap.Modal(document.getElementById("successModal"));
    modal.show();
  }

  // Acción del botón "Ir a productos"
  document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "/admin/products";
  });

  // Acción del botón "Crear otro producto"
 // Acción del botón "Crear otro producto"
document.getElementById("continueBtn").addEventListener("click", () => {
  const modal = bootstrap.Modal.getInstance(document.getElementById("successModal"));
  modal.hide();

  window.location.href = '/admin/products/create';
});


  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nameInput = document.getElementById('productName');
    const priceInput = document.getElementById('productPrice');
    const categoryInput = document.getElementById('productCategoryId');
    const descriptionInput = document.getElementById('productDescription');
    const showToClientsInput = document.getElementById('showToClients');
    const outStockInput = document.getElementById('outStock');
    const topProductInput = document.getElementById('topProduct');
    const deleteImagesInput = document.getElementById('deleteImages');

    const name = nameInput.value.trim();
    const price = priceInput.value;
    const categoryId = categoryInput.value;
    const description = descriptionInput.value.trim();
    const showToClients = showToClientsInput.checked;
    const outStock = outStockInput.checked;
    const topProduct = topProductInput.checked;

    nameInput.classList.remove('is-invalid');
    priceInput.classList.remove('is-invalid');
    categoryInput.classList.remove('is-invalid');
    descriptionInput.classList.remove('is-invalid');

    if (!name) {
      nameInput.classList.add('is-invalid');
      return;
    }

    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      priceInput.classList.add('is-invalid');
      return;
    }

    if (!categoryId) {
      categoryInput.classList.add('is-invalid');
      return;
    }

    if (!description) {
      descriptionInput.classList.add('is-invalid');
      return;
    }

    const isEdit = Boolean(product && product.id);
    const requestUrl = isEdit ? `/admin/products/${product.id}` : '/admin/products';
    const requestMethod = isEdit ? 'PUT' : 'POST';

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('categoryId', categoryId);
      formData.append('description', description);
      formData.append('showToClients', String(showToClients));
      formData.append('outStock', String(outStock));
      formData.append('topProduct', String(topProduct));

      // Imagen 1
    // Imagen 1
      const img1 = document.getElementById('image1');
      if (img1 && img1.files.length > 0) {
        const file = img1.files[0];
        const renamedFile = new File([file], "1", { type: file.type });
        formData.append('images', renamedFile);
      }

      // Imagen 2
      const img2 = document.getElementById('image2');
      if (img2 && img2.files.length > 0) {
        const file = img2.files[0];
        const renamedFile = new File([file], "2", { type: file.type });
        formData.append('images', renamedFile);
      }

      // Imagen 3
      const img3 = document.getElementById('image3');
      if (img3 && img3.files.length > 0) {
        const file = img3.files[0];
        const renamedFile = new File([file], "3", { type: file.type });
        formData.append('images', renamedFile);
      }

      // Imagen 4
      const img4 = document.getElementById('image4');
      if (img4 && img4.files.length > 0) {
        const file = img4.files[0];
        const renamedFile = new File([file], "4", { type: file.type });
        formData.append('images', renamedFile);
      }
      // No legacy 'pass' field: authentication uses cookie (adminToken)

      const response = await fetch(requestUrl, {
        method: requestMethod,
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        showSuccessModal();
        // const pass = localStorage.getItem('adminAuth');
        // window.location.href = '/admin/products?pass=' + encodeURIComponent(pass);
      } else {
        alert('Error al ' + (title.includes('Create') ? 'crear' : 'actualizar') + ' producto: ' + (result.message || ''));
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Ocurrió un error al enviar el formulario. Revisa la consola para más detalles.');
    }
  });
})();
