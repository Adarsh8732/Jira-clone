// const { getQueryHandlerAndSelector } = require("puppeteer");

let modalCont = document.querySelector(".modal-cont");
let addBtn = document.querySelector(".add-btn");
let removeBtn = document.querySelector(".remove-btn");
let mainCont = document.querySelector(".main-cont");
let textareaCont = document.querySelector(".textarea-cont");
let colors = ["lightpink","lightgreen","lightblue","black"];
let modalPriorityColor = colors[colors.length-1];
let allPriorityColors = document.querySelectorAll(".priority-color");
let toolBoxColors = document.querySelectorAll(".color");


let addflag = false;
let removeFlag = false;
let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";
let ticketArr = [];


if(localStorage.getItem("jira-tickets")){
    ticketArr=JSON.parse(localStorage.getItem("jira-tickets"));
    ticketArr.forEach((ticketObj)=>{
        createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketId);
    });
}

for(let i=0;i<toolBoxColors.length;i++){
    toolBoxColors[i].addEventListener("click",(e)=>{
        let currtoolBoxColor = toolBoxColors[i].classList[0];
        let filteredTickets = ticketArr.filter((ticketObj)=>{
            return ticketObj.ticketColor===currtoolBoxColor;
        })
        let allTicketCont = document.querySelectorAll(".ticket-cont");
        allTicketCont.forEach(ticket => {
            ticket.remove();
        });
        filteredTickets.forEach(ticketObj => {
            createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketId);
        });
    })
    toolBoxColors[i].addEventListener("dblclick",(e)=>{
        let allTicketCont = document.querySelectorAll(".ticket-cont");
        allTicketCont.forEach(ticket => {
            ticket.remove();
        });
        ticketArr.forEach(ticketObj => {
            createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketId);
        });
    })
}


addBtn.addEventListener("click",(e)=>{
    addflag = !addflag;
    removeFlag = false;
    if(addflag){
        modalCont.style.display="flex";
    }else{
        modalCont.style.display="none";
    }
})


removeBtn.addEventListener("click",(e)=>{
    removeFlag = !removeFlag;
})



function createTicket(ticketColor,ticketTask,ticketId){
    let id = ticketId || shortid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class","ticket-cont");
    ticketCont.innerHTML=`
    <div class = "ticket-color ${ticketColor}"></div>
    <div class = "ticket-id ">#${id}</div>
    <div class = "task-area ">${ticketTask}</div>
    <div class = "ticket-lock">
    <i class="fas fa-lock"></i>
    </div>
    `;
    if(!ticketId){
        ticketArr.push({ticketColor,ticketTask,ticketId:id});
        localStorage.setItem("jira-tickets",JSON.stringify(ticketArr));
    }

    mainCont.appendChild(ticketCont);
    handleRemoval(ticketCont,id);
    handleLock(ticketCont,id);
    handleColor(ticketCont,id);
}


function handleColor(ticket,id){
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click",(e)=>{
        let currTicketcolor = ticketColor.classList[1];
        // let idx = 0;
        // while(idx<4){
        //     if(currTicketcolor==colors[idx]){
        //         break;
        //     }
        // }
        let ticketIdx = getTicketIdx(id);

        let idx = colors.findIndex((color)=>{
            return color===currTicketcolor;
        });
        console.log(idx);
        idx = (idx+1)%4;
        // console.log(idx);
        let newColor = colors[idx];
        ticketColor.classList.remove(currTicketcolor);
        ticketColor.classList.add(newColor);
        // console.log(ticketArr)
        // console.log(ticketIdx);
        ticketArr[ticketIdx].ticketColor = newColor;
        // console.log(ticketArr);
        localStorage.setItem("jira-tickets",JSON.stringify(ticketArr))
    })
}



function handleLock(ticket,id){
    let ticketLockElem = ticket.querySelector(".ticket-lock");
    let ticketLock = ticketLockElem.children[0];
    let ticketTaskArea = ticket.querySelector(".task-area");

    ticketLock.addEventListener("click",(e)=>{
        let ticketIdx = getTicketIdx(id);
        if(ticketLock.classList.contains(lockClass)){
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            ticketTaskArea.setAttribute("contenteditable","true");
        }else{
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute("contenteditable","false");
        }
        ticketArr[ticketIdx].ticketTask = ticketTaskArea.innerText;
        localStorage.setItem("jira-tickets",JSON.stringify(ticketArr));

    });
}


function getTicketIdx(id){
    let ticketIdx = ticketArr.findIndex(obj=>{
        return obj.ticketId===id;
    })
    return ticketIdx;
}



function handleRemoval(ticket,id){
    ticket.addEventListener("click",(e)=>{
        if(removeFlag){
            let ticketIdx = getTicketIdx(id);
            ticketArr.splice(ticketIdx,1);
            localStorage.setItem("jira-tickets",JSON.stringify(ticketArr));
            ticket.remove();
        }
    })
}


modalCont.addEventListener("keydown",(e)=>{
    let key = e.key;
    if(key==="Shift"){
        // console.log("shift");
        createTicket(modalPriorityColor,textareaCont.value);
        setModalToDefault();
        addflag=false;
        
    }
})


allPriorityColors.forEach((colorElem,idx)=>{
    colorElem.addEventListener("click",(e)=>{
        allPriorityColors.forEach((priorityColorElement,idx)=>{
            priorityColorElement.classList.remove("border");
        })
        colorElem.classList.add("border");
        modalPriorityColor=colorElem.classList[0];
    })
})




function setModalToDefault(){
    modalCont.style.display = "none";
    textareaCont.value="";
    modalPriorityColor=colors[colors.length-1];
    allPriorityColors.forEach((priorityColorElement,idx)=>{
        priorityColorElement.classList.remove("border");
    })
    allPriorityColors[allPriorityColors.length-1].classList.add("border");
}
