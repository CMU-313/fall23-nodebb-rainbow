


document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-bar'); 
    const postList = document.querySelectorAll('.content'); 

    searchInput.addEventListener('keyup', function() {
        const query = searchInput.value.toLowerCase();

        postList.forEach(post => {
            if (post.textContent.toLowerCase().includes(query)) {
                post.style.display = '';
            } else {
                post.style.display = 'none';
            }
        });
    });
});
