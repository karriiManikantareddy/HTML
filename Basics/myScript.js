// window.alert('Alert: hello this script is executed first');
//document.write - it will show bottom of the page after all contents renders.
// windows.print()- used to print the current page


function myFunction() {
  let content=  document.getElementById("paraGraph")
  content.innerHTML = "Paragraph changed.";
  }

  function myFun() {
    let content=  document.getElementById("para")
    content.innerHTML = " ";
    }

    //DataTypes

     let firstName ='mani'; //string
     let lastName='reddy'

     const Number = 2; //number

     let x = true //boolean

     let a = {
      firstName:'mani',
      age:22,
     }; //object

     let b = ['mani',22] //array

     const date = new Date("2022-03-25"); //date

    //  Functions
    function funName(a,b){
return a+b
    }
   console.log(funName(2,2));

   //objects
   const Book = {firstBookName:'book1',
   secondBookName:'book4',
   thirdBookName:'book3'
   }
   //we can access objects in two ways
   console.log(Book.firstBookName) // - 1st way
   console.log(Book['secondBookName'])//- second way

//strings
let text = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let length = text.length; //.length to find the lenght of a string
console.log(length);

// == and === check

let w = 'mani';
let r = new String('mani');
console.log(typeof w+ ' ' +typeof r);
console.log(w==r);//true-only check its value 
console.log(w===r);//false because of its unequal datatypes

//String Methods
let txt = "Apple, Banana,Kiwi";
// let part = txt.slice(1,4); // ppl
let part = txt.slice(1,7); 
console.log(part)

//Replace()
function repFun(){
 const Rep = document.getElementById('rep').innerHTML;
//  document.getElementById('rep').innerHTML=Rep.replace('Mani','Reddy') // replace a single word
document.getElementById('rep').innerHTML=Rep.replace(/mani/g,'Reddy')  // replaces all matching words
document.getElementById('rep').innerHTML=Rep.toUpperCase() // converts to uppercase letter

}

//Concat() method
text = "Hello".concat(" ", "World!");
// test = 'hello'+''+world //same
console.log(text)


let tet = "a,b,c,d,e,f";
let p =tet[4].split(",")
console.log(p)

//locate method
let t = "Please locate where 'locate' occurs!";
y=t.search(/locate/);
console.log(y)

//match method
let g = "The rain in SPAIN stays mainly in the plain";
o=g.match("ain");
console.log(o)

//The includes() method returns true if a string contains a specified value.
let l = "Hello world, welcome to the universe.";
l.includes("world");
console.log(l)

//Template literals allow variables in strings:
let fName = 'Manikanta';
let lName = 'reddy'

let fullName=`Full name is ${fName}${lName}`
console.log(fullName)

//Arrays - declaration
let arr=['mani',22];

//sort and reverse of array

const fruits = ["Banana", "Orange", "Apple", "Mango"];
fruits.sort();
fruits.reverse();

//for each 
const numbers = [45, 4, 9, 16, 25];
numbers.forEach((fun,index,array)=>{
  console.log("value:"+fun , "index:"+index,"array:",array)
})

//map funmction
const numbers1 = [45, 4, 9, 16, 25];
const numbers2 = numbers1.map(myFunction);
function myFunction(value, index, array) {
  return value * 2;
}
console.log(numbers2);


//date formate - new Date(year,month,day,hours,minutes,seconds,ms)

//if-elese

// if (time < 10) {
//   greeting = "Good morning";
// } else if (time < 20) {
//   greeting = "Good day";
// } else {
//   greeting = "Good evening";
// }

// const userInput = parseInt(prompt('enter number between 1 to 3 :'));
// switch(userInput){
//   case 1 :
//     console.log("sunday")
//     break;
//   case 2 :
//     console.log("monday")
//     break;
//   case 3 :
//     console.log('tuesday')
//     break;
  
//   default :
//      console.log("invaild number")
// }

let obj = {
mani:20,
kanta:30,
reddy:40
}
for(let a in obj){
  console.log(a)
  console.log("marks of "+a+" are "+obj[a])
}

let array1 = ['mani',22,'reddy'];
for(let b of array1){
  console.log(b);
}