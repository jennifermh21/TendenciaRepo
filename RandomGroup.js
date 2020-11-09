fs = require('fs')
const { group } = require('console');
const readline = require('readline');

function read(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve => rl.question(question, ans => {
        rl.close();
        resolve(ans);
    }))
}
var topicList,studentList;
var groups = [];

async function createGroups(){
    let groupsNumber = 1,groupsSize; 
    const topicRoute = await read('Indicate topics path: ');   
    topicList = fs.readFileSync(topicRoute, 'utf8').toString().split(/[\n\r]/);
    topicList = topicList.filter(function(el) { return el!=''; });
  
    const studentRoute = await read('Indicate Student path: ')
    studentList = fs.readFileSync(studentRoute, "utf8").toString().split(/[\n\r]/);
    studentList = studentList.filter(function(el) { return el!=''; }); 
    
    console.log(studentList)

    groupsNumber = await read('Indicate size of groups: ');

    groupsSize = Math.floor((studentList.length/groupsNumber));
    while(groupsNumber > 0){
        let group = []
        while(group.length < groupsSize){
            randomNumber = Math.floor(Math.random()*studentList.length)          
            group.push(studentList[randomNumber]);
            studentList.splice(randomNumber,1)
        }
        groups.push([group]);
        groupsNumber--;
    }
    while(studentList.length>0){
        randomGroup = Math.floor(Math.random()*groups.length)
        randomStudent = Math.floor(Math.random()*studentList.length)
        groups[randomGroup][0].push(studentList[randomStudent])
        studentList.splice(randomStudent,1)        
    }
    asignTopics();
}

async function asignTopics(){
    let amount = Math.floor(topicList.length/groups.length);
    tmp = [...topicList]

    groups.forEach(g =>{
        let topics = []
        iterations = 0;
        
        do{
            if(topicList.length==0){
                topicList = [...tmp];
            }
            randomTopic = Math.floor(Math.random()*topicList.length)
            topics.push(topicList[randomTopic]);
            topicList.splice(randomTopic,1);                
        }while(topics.length<amount)
        
        g.push(topics);
    })
    while(topicList.length>0 && amount!=0){
        randomGroup = Math.floor(Math.random()*groups.length)
        randomTopic = Math.floor(Math.random()*topicList.length)
        groups[randomGroup][1].push(topicList[randomTopic])
        topicList.splice(randomTopic,1)     
    }
    printGroup();
}

async function printGroup(){
    for(let i=0;i<groups.length;i++){
        console.log(`Groups ${i+1} (Student: ${groups[i][0].length}, Topics: ${groups[i][1].length}) `)
        console.log('\Student:')
        let number = 1;
        groups[i][0].forEach(student=>{
            console.log(`\t\t${number}. ${student}`)
            number++;
        })
        console.log('\Topics:')
        number = 1;
        groups[i][1].forEach(topic=>{
            console.log(`\t\t${number}. ${topic}`)
            number++;
        })
        console.log('\n')
    }
    
} 

createGroups();

