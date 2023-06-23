function init(){
    const btnToggle = document.getElementById('navToggle');
    const nav = document.querySelector('#nav');

    btnToggle.addEventListener('click', () => {
        nav.classList.toggle('hidden')
    })
}

export default { init }