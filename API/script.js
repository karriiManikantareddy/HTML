// fetch("https://reqres.in/api/users/1",{
//     method:'POST',
//     headers : {
// 'Content-type' : 'application/json'
//     },
//     body: JSON.stringify({
//         name:'User 1',
//         age:22,
//         id:2
//     })
// })
//   .then((res) => res.json())
//   .then((data) => console.log(data));

  fetch("https://reqres.in/api/users/1",{
    method:'PUT',
    headers : {
'Content-type' : 'application/json'
    },
    body: JSON.stringify({
        name:'User 2',
        age:22,
        id:2
    })
})
  .then((res) => res.json())
  .then((data) => console.log(data));


//   fetch("https://reqres.in/api/users/1",{
//     method:'DELET',
// })
//   .then((res) => res.json())
//   .then((data) => console.log(data));
