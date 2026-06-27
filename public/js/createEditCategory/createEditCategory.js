(function () {
  const data = window.createEditCategoryData || {};
  const title = data.title || '';
  const categories = data.categories || [];
  const category = data.category || null;

  const categorySelect = document.getElementById('categoryName');
  if (categorySelect) {
    if (category) {
      categorySelect.value = category.name || '';
    }
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

  // Set showToClients value
  const showToClientsInput = document.getElementById('showToClients');
  if (showToClientsInput && category && category.showToClients !== undefined) {
    showToClientsInput.checked = category.showToClients;
  }

  if (category) {
    document.getElementById('categoryName').value = category.name || '';
    document.getElementById('categoryDescription').value = category.description || '';

    // Set existing image with order number 1
    const imgInput = document.getElementById('categoryImage1');
    const previewContainer = document.getElementById('imagePreview1');
    const previewImg = document.getElementById('imagePreviewImg1');

      const categoryImage = category.images[0];
      if (categoryImage) {
        imgInput.value = '';
        previewImg.src = getImageDataUrl(categoryImage.file, categoryImage.name);
        previewContainer.style.display = 'block';
      } else {
        previewContainer.style.display = 'none';
      }
  }

  // Add event listener for image input
  const imgInput = document.getElementById('categoryImage1');
  if (imgInput) {
    imgInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const previewContainer = document.getElementById('imagePreview1');
          const previewImg = document.getElementById('imagePreviewImg1');
          previewContainer.style.display = 'block';
          previewImg.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Add delete button for the image
  const previewContainer = document.getElementById('imagePreview1');
  const previewImg = document.getElementById('imagePreviewImg1');
  if (previewContainer && previewImg) {
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn btn-sm btn-danger';
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.title = 'Eliminar imagen 1';

    deleteBtn.addEventListener('click', async function (e) {
      e.preventDefault();
      e.stopPropagation();

      const categoryId = category ? category.id : null;
      if (!categoryId) {
        alert('No se puede eliminar imagen en modo creación.');
        return;
      }

      try {
        const response = await fetch(`/admin/categories/${categoryId}/deleteImage`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ order: 1, id: categoryId }),
        });

        const result = await response.json();

        if (result.success) {
          previewImg.src = '';
          previewContainer.style.display = 'none';
          document.getElementById('categoryImage1').value = '';
        } else {
          alert('Error al eliminar la imagen: ' + (result.message || ''));
        }
      } catch (err) {
        console.error('Error al eliminar imagen:', err);
        alert('Ocurrió un error al eliminar la imagen. Revisa la consola para más detalles.');
      }
    });

    previewContainer.appendChild(deleteBtn);
  }

  const form = document.getElementById('categoryForm');
  if (!form) {
    return;
  }

  function showSuccessModal(message = "Categoría creada o editada exitosamente") {
    document.getElementById("successMessage").textContent = message;

    const modal = new bootstrap.Modal(document.getElementById("successModal"));
    modal.show();
  }

  document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "/admin/categories";
  });

  document.getElementById("continueBtn").addEventListener("click", () => {
    const modal = bootstrap.Modal.getInstance(document.getElementById("successModal"));
    modal.hide();
    window.location.href = '/admin/categories/create';
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nameInput = document.getElementById('categoryName');
    const descriptionInput = document.getElementById('categoryDescription');

    const name = nameInput.value.trim();
    const description = descriptionInput.value.trim();

    nameInput.classList.remove('is-invalid');
    descriptionInput.classList.remove('is-invalid');

    if (!name) {
      nameInput.classList.add('is-invalid');
      return;
    }

    const isEdit = Boolean(category && category.id);
    const requestUrl = isEdit ? `/admin/categories/${category.id}` : '/admin/categories';
    const requestMethod = isEdit ? 'PUT' : 'POST';

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('showToClients', showToClientsInput ? showToClientsInput.checked.toString() : 'true');

      const imgInput = document.getElementById('categoryImage1');
      if (imgInput && imgInput.files.length > 0) {
        const file = imgInput.files[0];
        const renamedFile = new File([file], "1", { type: file.type });
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
        window.location.href = '/admin/categories';
      } else {
        alert('Error al ' + (title.includes('Create') ? 'crear' : 'actualizar') + ' categoría: ' + (result.message || ''));
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Ocurrió un error al enviar el formulario. Revisa la consola para más detalles.');
    }
  });
})();
