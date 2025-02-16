document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
        document.querySelector(".popup").classList.add("active");
    }, 500);
});

document.querySelector(".popup .close-btn").addEventListener("click", function() {
    document.querySelector(".popup").classList.remove("active");
});
