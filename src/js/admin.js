
// //create data base
// var TestObject = AV.Object.extend('Playlist');
// //create a test object
// var testObject = new TestObject();
// //insert a record
// testObject.set({
//     name: 'test',
//     cover: 'test',
//     creatorId: 'test',
//     description:'test',
//     songs:['1','2']
// });
// testObject.save().then(function (testObject) {
//     console.log('保存成功。')
// })
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
