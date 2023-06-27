const obj = new Promise((resolve, reject) => {
  setTimeout(() => {
    let roll_no = [1, 2, 3, 4, 5];
    resolve(roll_no);
  }, 5000);
});

const getBioData = (dataInserted) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let bioData = {
        name: "mani",
        age: 22,
      };
      resolve(`my rollno is ${dataInserted} . my name is ${bioData.name} `);
    }, 0);
  });
};

// obj
//   .then((rollno) => {
//     // console.log(rollno);
//     getBioData(rollno[0]).then((showData)=>{
//         console.log(showData)
//     })
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

//async await

async function getData() {
  try{
    const rollNoData = await obj; //function will wait till the obj data loaded in the variable store .
    console.log(rollNoData);
    const bioDatas = await getBioData;
    console.log(getBioData(rollNoData[8]))
    console.log(getBioData(rollNoDataa[8]))
  }catch(error) {
    console.log(`The error: ${error}`);
  }
}

getData();
