$('#libraryTab').on('click',()=>{
    document.querySelector('#libraryLists').style.display = 'flex'
    document.querySelector('#uploadLists').style.display = 'none'
    document.querySelector('#libraryTab').classList.add('active')
    document.querySelector('#uploadTab').classList.remove('active')
})
$('#uploadTab').on('click',()=>{
    document.querySelector('#libraryLists').style.display = 'none'
    document.querySelector('#uploadLists').style.display = 'flex'
    document.querySelector('#libraryTab').classList.remove('active')
    document.querySelector('#uploadTab').classList.add('active')
})
