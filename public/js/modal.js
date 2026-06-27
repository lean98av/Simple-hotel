/**
 * Modal Reutilizable
 * 
 * Proporciona funciones para mostrar modales personalizados en lugar de alert().
 * Se puede incluir en cualquier vista que necesite mostrar notificaciones.
 */

// Verificar si Bootstrap está cargado
let bootstrapLoaded = false;

/**
 * Mostrar un modal personalizado en el globalModal
 * @param {string} title - Título del modal
 * @param {string} message - Contenido del modal
 * @param {boolean} showCancel - Si es false, ocultar el botón de cancelar
 */
function showModal(title, message, showCancel = true) {
  // Esperar a que Bootstrap esté cargado
  if (!bootstrapLoaded) {
    const checkBootstrap = setInterval(() => {
      if (typeof bootstrap !== 'undefined') {
        clearInterval(checkBootstrap);
        bootstrapLoaded = true;
        showModalInternal('globalModal', title, message, showCancel);
      }
    }, 100);
    return;
  }
  
  showModalInternal('globalModal', title, message, showCancel);
}

/**
 * Mostrar un modal de confirmación en el confirmModal
 * @param {string} title - Título del modal
 * @param {string} message - Mensaje de confirmación
 * @param {function} confirmAction - Acción a ejecutar al confirmar
 */
function showConfirmModal(title, message, confirmAction) {
  // Esperar a que Bootstrap esté cargado
  if (!bootstrapLoaded) {
    const checkBootstrap = setInterval(() => {
      if (typeof bootstrap !== 'undefined') {
        clearInterval(checkBootstrap);
        bootstrapLoaded = true;
        showConfirmModalInternal(title, message, confirmAction);
      }
    }, 100);
    return;
  }
  
  showConfirmModalInternal(title, message, confirmAction);
}

/**
 * Mostrar un modal personalizado (versión interna)
 * @private
 * @param {string} modalId - ID del modal
 * @param {string} title - Título del modal
 * @param {string} message - Contenido del modal
 * @param {boolean} showCancel - Si es false, ocultar el botón de cancelar
 */
function showModalInternal(modalId, title, message, showCancel) {
  const modalElement = document.getElementById(modalId);
  
  if (!modalElement) {
    console.warn(`Modal ${modalId} no encontrado.`);
    return;
  }
  
  // Actualizar el contenido del modal
  modalElement.querySelector('.modal-title').textContent = title;
  modalElement.querySelector('.modal-body').innerHTML = message;
  modalElement.dataset.showCancel = showCancel;
  
  // Mostrar el modal
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
}

/**
 * Mostrar un modal de confirmación (versión interna)
 * @private
 * @param {string} title - Título del modal
 * @param {string} message - Mensaje de confirmación
 * @param {function} confirmAction - Acción a ejecutar al confirmar
 */
function showConfirmModalInternal(title, message, confirmAction) {
  const modalElement = document.getElementById('confirmModal');
  
  if (!modalElement) {
    console.warn('confirmModal no encontrado.');
    return;
  }
  
  // Actualizar el contenido del modal
  modalElement.querySelector('.modal-title').textContent = title;
  modalElement.querySelector('.modal-body').innerHTML = message;
  modalElement.dataset.confirmed = 'false';
  
  // Configurar el botón de aceptar
  const acceptBtn = modalElement.querySelector('#confirmModal-accept');
  if (acceptBtn) {
    acceptBtn.onclick = () => {
      modalElement.dataset.confirmed = 'true';
      confirmAction();
    };
  }
  
  // Mostrar el modal
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
}
