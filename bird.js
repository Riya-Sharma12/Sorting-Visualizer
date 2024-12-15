class Bird{
    constructor(lFoot,rFoot,headY){
        this.lFoot = lFoot;
        this.rFoot = rFoot;
        this.headY = headY;
        this.head = null;
        this.lKnee = null;
        this.rKnee = null;
        this.queue = [];
        this.#update();
        this.legLength = distance(this.lFoot , this.head)*1.15;
        this.#update();
    }

    moveTo(lFoot,rFoot ,frameCount = 40){   // going to next frame will take 1 sec
        for(let i=1; i<=frameCount; i++){
           const t = i/frameCount;
           this.queue.push({
           lFoot: vLerp(this.lFoot , lFoot , t),
           rFoot: vLerp(this.rFoot , rFoot , t)
           }); 
        }
      }

      #update(){
        let changed=false;
        if(this.queue.length>0){
            const info=this.queue.shift();
            this.lFoot=info.lFoot;
            this.rFoot=info.rFoot;
           // this.head=info.head;
            changed=true;
        }
         this.head = average(this.lFoot,this.rFoot);
         this.head.y = this.headY;
       if(this.legLength){
            this.lKnee = this.#getKnee(this.head,this.lFoot);
            this.rKnee = this.#getKnee(this.head,this.rFoot, );

        }else{
            this.lKnee=average(this.lFoot,this.head);
            this.rKnee=average(this.rFoot,this.head);
        }
        return changed;
    }

    #getKnee(head,foot){
        const center = average(foot,head);
        const angle = Math.atan2(
            foot.y-head.y,
            foot.x-head.x,

        );
        const base = distance(foot,head);
        const offSetAngle = angle+Math.PI/2;
        const height = Math.sqrt(
            (this.legLength/2)**2 - 
            (this.lDist/2)**2
        );
        return{
                x:center.x + Math.cos(offSetAngle)*height,
                y:center.x + Math.sin(offSetAngle)*height
        }
    }

    draw(ctx){
       
        const changed =  this.#update();
         ctx.beginPath();
         ctx.fillStyle = "black";
         const radius = 10;
         ctx.arc(this.head.x , this.head.y , radius , 0, Math.PI *2);
         ctx.fill();
         ctx.beginPath();
         ctx.moveTo(this.head.x , this.head.y);
         ctx.lineTo(this.lKnee.x , this.lKnee.y);
         ctx.lineTo(this.lFoot.x , this.lFoot.y);
         ctx.stroke();
         ctx.beginPath();
         ctx.moveTo(this.head.x , this.head.y);
         ctx.lineTo(this.rKnee.x , this.rKnee.y);
         ctx.lineTo(this.rFoot.x , this.rFoot.y);
         ctx.stroke();

         return changed;
    }
}