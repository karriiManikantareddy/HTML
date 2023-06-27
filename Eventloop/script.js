console.log('this will excute first')//1

setTimeout(()=>{
console.log('this will excute after 2 sec')//3
},2000)

console.log('this will excute second')//2

setTimeout(()=>{
    console.log('this will excute after 8 sec')//4
},8000)

setTimeout(()=>{
    let obj =['mani','reddy'];
    for(x of obj){
        console.log(x)
    }
},0)
