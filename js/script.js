document.addEventListener('DOMContentLoaded', () => {
  const galleryImages = document.querySelectorAll('.gallery-img');

  galleryImages.forEach((img) => {
    img.setAttribute('data-bs-toggle', 'modal');
    img.setAttribute('data-bs-target', '#galleryModal');
    img.addEventListener('click', () => {
      const modalImage = document.getElementById('modalImage');
      modalImage.src = img.src;
    });
  });
});
