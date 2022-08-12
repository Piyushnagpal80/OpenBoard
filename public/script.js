let canvas = document.querySelector("canvas");  //canvas tag ko select kiya
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// now kuch bhi draw krna hai 2d space mai 
// // so getcontext ko call krna hoga

const tool = canvas.getContext("2d");  //whhy const we know

tool.beginPath();

// //default color black
tool.fillStyle="white"; //ye phle likho tabhi work krega
tool.fillRect(0,0,canvas.width,canvas.height);

// // tool.fillRect(10,10,canvas.width/2,canvas.height/2);

// // now we know ki tool ka by default color black hota hai
// // so change kra
tool.strokeStyle="red";
tool.lineWidth=5;

// tool.strokeRect(10,10,canvas.width/2,canvas.height/2);
// tool.fillRect(10,10,canvas.width/2,canvas.height/2);

// tool.beginPath();
// tool.moveTo(10,10);
// tool.lineTo(110,110);
// tool.stroke();


// // drawing line between points of mouse press and mouse release
// canvas.addEventListener("mousedown",function (e){
//     console.log("mouse down",e.clientX,e.clientY);
//     tool.beginPath();
//     tool.moveTo(e.clientX,e.clientY);
// })

// canvas.addEventListener("mouseup",function (e){
//     console.log("mouse up",e.clientX,e.clientY);
//     tool.lineTo(e.clientX,e.clientY);
//     tool.stroke();
// })

// //coorinate kese milenge search kiya
// // mouseclick ka pta lg gya kese milega
// // ye rha ....      https://stackoverflow.com/questions/23744605/javascript-get-x-and-y-coordinates-on-mouse-click

// // hmen click ka nahi chaiye mousedown and up ka chaiye toh bs event change kra and baaki same

// canvas.addEventListener("mousedown",function(e){
//     console.log( "mouse down at coordinate", e.clientX,e.clientY );
//     tool.beginPath();  //pointer origin pr aa gya
//     tool.moveTo(e.clientX,e.clientY);  //pointer ko clientX,clientY pr move kiya
// })

// canvas.addEventListener("mouseup",function(e){
//     console.log( "mouse up at coordinate", e.clientX,e.clientY );
//     tool.lineTo(e.clientX,e.clientY);  //pointer ko clientX,clientY pr move kiya
//     tool.stroke();
// })
// // since we know above method shortest line draw kr rha tha between coordinates jha mousedown and mouseup hua

// // but hmen chaiye jha jha mouse move kra vha line draw ho

// // so ek event hota hai mousemove

// let isMousedown= false;

// canvas.addEventListener("mousedown",function(e){
//     console.log( "mouse down at coordinate", e.clientX,e.clientY );
//     tool.beginPath();  //pointer origin pr aa gya
//     tool.moveTo(e.clientX,e.clientY);  //pointer ko clientX,clientY pr move kiya
//     isMousedown=true;
// })

// canvas.addEventListener("mousemove",function(e){
//     //mouse down kro chahe mat kro
//     // ye run hoga hmesha.. so directly yha pr stroke call nahi kr skte
//     // so tabhi krenge jab mouseDown true ho
//     console.log(e.clientX,e.clientY  );
//     if(isMousedown){
//         tool.lineTo(e.clientX,e.clientY);
//         tool.stroke();
//     }
// })
// canvas.addEventListener("mouseup",function(e){
//     //jab bhi mouse up kiya
//     // then ab hum chahte hai kuch draw na ho
//     // so isMousedown ko false kr denge
//     console.log(e.clientX,e.clientY  );
//     isMousedown=false;
// })

 // so ab mouse move krenge toh kuch draw nahi hoga
// phle mouse down krna hoga
 // then jab tak mouse up nahi krte tab tak draw hota rhega acc to mouse movement


 // now tool bar add krne ki vajha se origin shift
//  so sahi krenge 
let undoStack =[];
let bounds = canvas.getBoundingClientRect();
function getCoordinates(y){
    return y-bounds.y;
}

let isMousedown= false;

canvas.addEventListener("mousedown",function(e){
    let x = e.clientX , y=getCoordinates(e.clientY);
    tool.beginPath();  //pointer origin pr aa gya
    tool.moveTo(x,y);  //pointer ko clientX,clientY pr move kiya
    isMousedown=true;

    let point= {
        x : x,
        y : y,
        des : "mousedown",
        color: tool.strokeStyle,
        width:tool.lineWidth
    }

    undoStack.push(point);
    socket.emit("mousedown", point);
})

canvas.addEventListener("mousemove",function(e){
    //mouse down kro chahe mat kro
    // ye run hoga hmesha.. so directly yha pr stroke call nahi kr skte
    // so tabhi krenge jab mouseDown true ho
    if(isMousedown){
        let x = e.clientX , y=getCoordinates(e.clientY);
        // tool.lineTo(e.clientX,getCoordinates(e.clientY));
        tool.lineTo(x,y);
        tool.stroke();
        let point= {
            x : x,
            y : y,
            des : "mousemove",
            color: tool.strokeStyle,
            width:tool.lineWidth
        }
        undoStack.push(point);
        socket.emit("mousemove", point);
    }
})
canvas.addEventListener("mouseup",function(e){
    //jab bhi mouse up kiya
    // then ab hum chahte hai kuch draw na ho
    // so isMousedown ko false kr denge
    isMousedown=false;
})


// now ab hum chahte hai
// pencil pr click kre then blue color se draw ho line

// and eraser pr click kre then erase ho jaaaye line 

// so dekho eraser basically white color hoga
// so basically white color ki line draw krenge colored line pr jisse esa lgega ki erase ho gye line

// now mereko saare tools chaiye basically
// then mein btaunga ki agar pencil pr click ho toh kya krna hai
// eraser pr click ho toh kya krna hai
const tools = document.querySelectorAll(".all-tools");

for(var i=0;i<tools.length;i++){
    tools[i].addEventListener("click",function(e){
        let cuTool = e.currentTarget;  // now hmen pta hai ki hum kis tool pr hai

        // iss tool ki image get krenge and uspe click event lgayenge

        let nameOfTool= cuTool.getAttribute("id");

        if( nameOfTool=="pencil" ){
            tool.strokeStyle="blue";
            tool.lineWidth=5;
            // socket.emit("message","pencil is selected");
        }
        else if(nameOfTool=="eraser"){
            tool.strokeStyle="white";
            tool.lineWidth=30;
        }
        else if(nameOfTool=="sticky"){
            createSticky();
        }else if( nameOfTool=="undo" ){
            performUndo();
            socket.emit("undo");
        }else if( nameOfTool=="redo" ){
            performRedo();
            socket.emit("redo");
        }
    })
}


// stickypad ko move krana hai jese jese mouse move krega

// so same jese line draw kri thi vahi hoga

// but abki baar pura stickypad move krana hai

// so dekho stickypad move hota hai agar hum uska top and left change kre

// so hum kya krenge jha jha mouse move kr rha hai uske coordinates ko stickypad ke top and left mai add kr denge
// so stickypad bhi vese hi move krega phir


// let stickypad = document.querySelector(".stickypad");

// // now navbar pr mousedown ho then coordinate chaiye and stickypad bhi tab tak hi move krega jab tak mouseup na krde user
// let navbar = document.querySelector(".nav-bar");

// let IntiialX=null;
// let InitialY=null;
// let isStickypad=false;

// navbar.addEventListener("mousedown",function(e){
//     IntiialX= e.clientX;
//     InitialY= e.clientY;
//     isStickypad=true;
// })

// canvas.addEventListener("mousemove",function(e){
//     if(isStickypad){
//         // now current x,y nikalo

//         let currX = e.clientX;
//         let currY = e.clientY;

//         // now hmare paas previous x,y hai(initial)
//         // curr x,y hai
//         // x,y kitna displace hua nikal lete hai
//         // then top , left mai utna change kr denge ho jayega kaam

//         const dy = currY-InitialY;
//         const dx = currX-IntiialX;

//         // now top,left kese nikale stickypad ka .... bound se origin vesse hi toh nikalte thee

//         let {top,left} = stickypad.getBoundingClientRect();

//         stickypad.style.top =  top + dy+"px";
//         stickypad.style.left = left+dx+"px";

//         IntiialX = currX;
//         IntiialY = currY;
//     }
// })

// window.addEventListener("mouseup",function(e){
//     isStickypad=false;
// })


// //now close and minimize chalane hai

// let close = document.querySelector(".close");
// let minimize = document.querySelector(".minimize");
// let isMinimized=false;
// let textarea = document.querySelector(".text-area");
// minimize.addEventListener("click",function(){
//     if(isMinimized){
//         textarea.style.display = "block";
//     }else{
//         textarea.style.display = "none";
//     }
//     isMinimized =! isMinimized;
// })
// close.addEventListener("click",function(){
//     stickypad.remove();  // hatt jayega stickypad
// })



// jab bhi stickypad pr click kre toh stickypad bn jaaye ek ye chahte hai

function createSticky(){

    //create divs

    let stickypad = document.createElement("div");
    let navbar = document.createElement("div");
    let minimize = document.createElement("div");
    let close = document.createElement("div");
    let textBox = document.createElement("div");
    let textarea = document.createElement("textarea");

    // now add classes to div

    stickypad.setAttribute("class","stickypad");
    navbar.setAttribute("class","nav-bar");
    minimize.setAttribute("class","minimize");
    close.setAttribute("class","close");
    textBox.setAttribute("class","text-area");

    // now create krdo stickypad

    stickypad.appendChild(navbar);
    stickypad.appendChild(textBox);
    navbar.appendChild(minimize);
    navbar.appendChild(close);
    textBox.appendChild(textarea);

    //add stickpad to document

    document.body.appendChild(stickypad);

    //yha se vahi same code
    
    let IntiialX=null;
    let InitialY=null;
    let isStickypad=false;
    
    navbar.addEventListener("mousedown",function(e){
        IntiialX= e.clientX;
        InitialY= e.clientY;
        isStickypad=true;
    })
    
    canvas.addEventListener("mousemove",function(e){
        if(isStickypad){
            // now current x,y nikalo
    
            let currX = e.clientX;
            let currY = e.clientY;
    
            // now hmare paas previous x,y hai(initial)
            // curr x,y hai
            // x,y kitna displace hua nikal lete hai
            // then top , left mai utna change kr denge ho jayega kaam
    
            const dy = currY-InitialY;
            const dx = currX-IntiialX;
    
            // now top,left kese nikale stickypad ka .... bound se origin vesse hi toh nikalte thee
    
            let {top,left} = stickypad.getBoundingClientRect();
    
            stickypad.style.top =  top + dy+"px";
            stickypad.style.left = left+dx+"px";
    
            IntiialX = currX;
            IntiialY = currY;
        }
    })
    
    window.addEventListener("mouseup",function(e){
        isStickypad=false;
    })
    
    
    //now close and minimize chalane hai
    let isMinimized=false;
    minimize.addEventListener("click",function(){
        if(isMinimized){
            textarea.style.display = "block";
        }else{
            textarea.style.display = "none";
        }
        isMinimized =! isMinimized;
    })
    close.addEventListener("click",function(){
        stickypad.remove();  // hatt jayega stickypad
    })
}


// undo,redo

// now we know draw etc kuch nahi hota hai image bnti hai browser mai
// and image ko undo krna usign points is not possible 

// so logic
// points store krenge mousedown and mousemove ke
// then jese hi undo pr click krega user ..board clear kr denge
// and then last element ko pop krke bche hue points se line draw kr denge

let redoStack=[];

function performUndo(){
    //simple boar clear kro
    tool.clearRect(0,0,canvas.width,canvas.height);
    // stack.pop();  //1-1 point remove hoga
    // puri line bhi remove kr skte hai
    // simply jab tak vo point na mil jaaye jha mousedown hua tha tab tak pop krte rho
    while(undoStack.length>0){

        let currEle = undoStack[undoStack.length-1];

        if( currEle.des=="mousedown" ){
            let ele = undoStack.pop();
            redoStack.push(ele);
            break;
        }else if(currEle.des=="mousemove"){
            let ele = undoStack.pop();
            redoStack.push(ele);
        }
    }

    //bche hue point ko draw krdo
    redraw();
}

function redraw(){
    for(let i=0;i<undoStack.length;i++){
        let {x,y,des} = undoStack[i];

        if(des=="mousedown"){
            tool.beginPath();
            tool.moveTo(x,y);
        }else if( des=="mousemove" ){
            tool.lineTo(x,y);
            tool.stroke();
        }
    }
}

// now redo kese krenge
// dekho jo bhi undo kiya usko vaapis laana hai
// means jo bhi points pop kiye usko store krlo
// then draw kr denge unn points ko
// now draw ke saath saath vo undo stack mai bhi dalne chaiye taaki hmamar undo sahi se work krta rhe

// toh ek kaam hi krte hai
// jab bhi redo call ho.. redo ke saarey bnde uthake undo stack mein daaldo
// then board clear krlo
// and redraw call krdo .. redraw undo stack ke saarey points ko draw kr deta thaa na 

function performRedo(){
// board clear
tool.clearRect(0,0,canvas.width,canvas.height);

while(redoStack.length>0){
    let currEle = redoStack[redoStack.length-1];
    if( currEle.des=="mousedown" ){
        let ele = redoStack.pop();
        undoStack.push(ele);
        break;
    }else if(currEle.des=="mousemove"){
        let ele = redoStack.pop();
        undoStack.push(ele);
    }
}
redraw();
}

// socket.on("broadcast",function(data){
//     alert(data);
// })

socket.on("onmousedown", function(point) {
    const { x, y, color, width } = point;
    tool.lineWidth = width;
    tool.strokeStyle = color;
    tool.beginPath();
    tool.moveTo(x, y);
    undoStack.push(point);
  });
  socket.on("onmousemove", function(point) {
    const { x, y, color, width } = point;
    tool.lineWidth = width;
    tool.strokeStyle = color;
    tool.lineTo(x, y);
    tool.stroke();
    undoStack.push(point);
  });
  socket.on("onundo", function() {
    performUndo();
  });
  socket.on("onredo", function() {
    performRedo();
  });