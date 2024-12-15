myCanvas.width = 500;
myCanvas.height = 500;

const n = 20;
const array = []
const stringHeight = myCanvas.height * 0.40;

let audioCtx = null;

function playNote(freq) {
    if (audioCtx == null) {
        audioCtx = new (
            AudioContext ||
            webkitAudioContext ||
            window.AudioContext
        )();
    }
    const dur = 0.2;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.frequency.value = freq;
    osc.type = 'sine';

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + dur);
}



const socks = [];
const margin = 30;
const availableWidth =  myCanvas.width - 2*margin;
const spacing = availableWidth/n;

const colors = ['#D35400', '#2471A3', '#F39C12',
    '#B2BABB', '#138D75', '#52BE80',
    '#BB8FCE', '#555555', '#bcf60c',
    '#fabebe', '#9a6324', '#54A1D3',
    '#aaffc3', '#808000', '#333333'];


const sockColors =[];
 const ctx = myCanvas.getContext("2d");

 // putting random elements into the array 
 
for(let i=0; i<n/2; i++){
    const t =   i/(n/2-1);
    sockColors.push(colors[i]);
    sockColors.push(colors[i]);
    array.push( lerp(0.2 , 1,t));
    array.push( lerp(0.2 , 1,t));
}

for(let i=0; i<array.length; i++){
    const j = Math.floor(Math.random()*array.length);
    [array[i],array[j]] = [array[j],array[i]];
    [sockColors[i],sockColors[j]] = [sockColors[j],sockColors[i]];
}

for(let i = 0; i<array.length; i++){
    const x = i * spacing + spacing/2 + margin;
    const y = stringHeight;
    const height = myCanvas.height * 0.4 * array[i];

    socks[i] = new Sock(x,y,height,sockColors[i]);
    socks[i].draw(ctx);
}


const bird = new Bird(socks[0].loc,socks[1].loc,myCanvas.height*0.15);

const moves = BubbleSort(array);
moves.shift();

function BubbleSort(array){
    const moves=[];
    let n=array.length;
    let left=1;
    do{
        var swapped=false;
        if((n-left)%2==1){
            for(let i=left;i<n;i++){
                moves.push({
                    indices:[i-1,i],
                    type:"comparison"
                });
                if(array[i-1]>array[i]){
                    swapped=true;
                    [array[i-1],array[i]]=[array[i],array[i-1]];
                    moves.push({
                        indices:[i-1,i],
                        type:"swap"
                    });
                }
            }
            n--;
        }else{
            for(let i=n-1;i>=left;i--){
                moves.push({
                    indices:[i-1,i],
                    type:"comparison"
                });
                if(array[i-1]>array[i]){
                    swapped=true;
                    [array[i-1],array[i]]=[array[i],array[i-1]];
                    moves.push({
                        indices:[i-1,i],
                        type:"swap"
                    });
                }
            }
            left++;
        }
    }while(swapped);
    return moves;
}


animate();


//drawing the string just above the socks
function animate(){

    ctx.clearRect(0,0,myCanvas.width, myCanvas.height);
    ctx.strokeStyle="black";
    ctx.beginPath();
    ctx.moveTo(0,stringHeight);
    ctx.lineTo(myCanvas.width,stringHeight);
    ctx.stroke();
    
    let changed = false;
    for(let i=0; i<socks.length; i++){
     changed =  socks[i].draw(ctx)  || changed;
     Physics.update(socks[i].particles , socks[i].segments);
    }

   changed =  bird.draw(ctx) || changed;


    if( ! changed && moves.length > 0){
        const nextMove = moves.shift();
        const [i,j] = nextMove.indices;
        if(nextMove.type == "swap"){ 
            socks[i].moveTo(socks[j].loc);
            socks[j].moveTo(socks[i].loc);
            bird.moveTo(socks[j].loc , socks[i].loc);
            [socks[i],socks[j]] = [socks[j],socks[i]];
            playNote(200 + array[j] * 800);
        }
        else { // bird is moving
             bird.moveTo(socks[i].loc , socks[j].loc);
        }

        if (moves.length === 0) {
            ctx.font = "30px Arial";
            ctx.fillStyle = "green";
            ctx.fillText("Sorting complete!", 150, myCanvas.height / 2);  // Adjust the position if needed
        }
       
    }
 requestAnimationFrame(animate);
}

document.getElementById("resetButton").addEventListener("click", () => {
    // Reload the page when the reset button is clicked
    location.reload();
});


















