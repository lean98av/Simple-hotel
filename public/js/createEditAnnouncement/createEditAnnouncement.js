(function () {
  const data = window.createEditAnnouncementData || {};
  const title = data.title || '';
  const announcement = data.announcement || null;

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

  // Preview and existing image
  if (announcement) {
    const desc = document.getElementById('announcementDescription');
    const nameInput = document.getElementById('announcementName');
    const startInput = document.getElementById('announcementStartDate');
    const endInput = document.getElementById('announcementEndDate');

    if (nameInput) nameInput.value = announcement.name || '';
    if (desc) desc.value = announcement.description || '';
    if (startInput && announcement.startDate) startInput.value = announcement.startDate.split('T')[0];
    if (endInput && announcement.endDate) endInput.value = announcement.endDate.split('T')[0];

    const imagePreview = document.getElementById('imagePreview');
    const imagePreviewImg = document.getElementById('imagePreviewImg');
    const announcementImage = announcement.images && announcement.images[0];
    if (announcementImage && imagePreviewImg) {
      imagePreviewImg.src = getImageDataUrl(announcementImage.file, announcementImage.name);
      imagePreview.style.display = 'block';
    }

    // Add delete button
    if (imagePreview && imagePreviewImg) {
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'btn btn-sm btn-danger';
      deleteBtn.textContent = 'Eliminar';
      deleteBtn.title = 'Eliminar imagen';

      deleteBtn.addEventListener('click', async function (e) {
        e.preventDefault();
        e.stopPropagation();

        const announcementId = announcement ? announcement.id : null;
        if (!announcementId) {
          alert('No se puede eliminar imagen en modo creación.');
          return;
        }

        try {
          const response = await fetch(`/admin/announcements/${announcementId}/deleteImage`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: 1, id: announcementId }),
          });

          const result = await response.json();
          if (result.success) {
            imagePreviewImg.src = '';
            imagePreview.style.display = 'none';
            const fileInput = document.getElementById('announcementImage');
            if (fileInput) fileInput.value = '';
          } else {
            alert('Error al eliminar la imagen: ' + (result.message || ''));
          }
        } catch (err) {
          console.error('Error al eliminar imagen:', err);
          alert('Ocurrió un error al eliminar la imagen. Revisa la consola para más detalles.');
        }
      });

      imagePreview.appendChild(deleteBtn);
    }
  }

  // Local image input preview
  const imgInput = document.getElementById('announcementImage');
  if (imgInput) {
    imgInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const previewContainer = document.getElementById('imagePreview');
          const previewImg = document.getElementById('imagePreviewImg');
          previewContainer.style.display = 'block';
          previewImg.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  function showSuccessModal(message = 'Anuncio creado o editado exitosamente') {
    const el = document.getElementById('successMessage');
    if (el) el.textContent = message;
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
  }

  document.getElementById('backBtn').addEventListener('click', () => {
    window.location.href = '/admin/announcements';
  });

  document.getElementById('continueBtn').addEventListener('click', () => {
    const modal = bootstrap.Modal.getInstance(document.getElementById('successModal'));
    modal.hide();
    window.location.href = '/admin/announcements/create';
  });

  const form = document.getElementById('announcementForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nameInput = document.getElementById('announcementName');
    const descriptionInput = document.getElementById('announcementDescription');
    const startInput = document.getElementById('announcementStartDate');
    const endInput = document.getElementById('announcementEndDate');

    const name = nameInput ? nameInput.value.trim() : '';
    const description = descriptionInput ? descriptionInput.value.trim() : '';
    const startDate = startInput ? startInput.value : '';
    const endDate = endInput ? endInput.value : '';

    if (!name) {
      if (nameInput) nameInput.classList.add('is-invalid');
      return;
    }

    const isEdit = Boolean(announcement && announcement.id);
    const requestUrl = isEdit ? `/admin/announcements/${announcement.id}` : '/admin/announcements';
    const requestMethod = isEdit ? 'PUT' : 'POST';

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);

      if (imgInput && imgInput.files.length > 0) {
        const file = imgInput.files[0];
        const renamedFile = new File([file], '1', { type: file.type });
        formData.append('images', renamedFile);
      }

      const response = await fetch(requestUrl, {
        method: requestMethod,
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        showSuccessModal(isEdit ? 'Anuncio actualizado exitosamente' : 'Anuncio creado exitosamente');
      } else {
        alert('Error al ' + (isEdit ? 'actualizar' : 'crear') + ' anuncio: ' + (result.message || ''));
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Ocurrió un error al enviar el formulario. Revisa la consola para más detalles.');
    }
  });
})();
