class Sock{
    constructor(x,y,height,color ){
        this.width = 10;
        this.loc= {x,y};
        this.height = height;
        this.color = color;
        this.queue = [];
        this.particles=[];
        this.segments=[];
        this.blockHeight = 10;

        // socks are made of bock
        this.#createParticles();
             
    }
    #createParticles(){
        const {x,y} = this.loc;
        const left = x - this.width/2;
        const right = x + this.width/2;
        const bottom = y + this.height;
        this.particles.push(
            new Particle(this.loc , true)
        );
       
        let curHeight = this.loc.y;
        do{
            curHeight += this.blockHeight;
            this.particles.push(
                new Particle({x:left,y:curHeight})
            );
            this.particles.push(
                new Particle({x:right,y:curHeight})
            );
        }while(curHeight < this.height + this.loc.y);

          const lastP = this.particles[this.particles.length-1]
          lastP.loc.x -= this.blockHeight*2;
          lastP.loc.y += this.blockHeight*0.1;

          const secondLastP = this.particles[this.particles.length-2]
          secondLastP.loc.x -= this.blockHeight*2;
          secondLastP.loc.y -= this.blockHeight*0.2;
          const secondSecondLastP = this.particles[this.particles.length-3];
          secondSecondLastP.loc.y += this.blockHeight;

        this.segments.push(
            new Segment(this.particles[0],this.particles[1])
        );
        this.segments.push(
            new Segment(this.particles[0],this.particles[2])
        );
        this.segments.push(
            new Segment(this.particles[1],this.particles[2])
        );
        for(let i=3; i<this.particles.length; i+=2){
            this.segments.push(
                new Segment(this.particles[i],this.particles[i-2])
            );
            this.segments.push(
                new Segment(this.particles[i+1],this.particles[i-1])
            );
            this.segments.push(
                new Segment(this.particles[i],this.particles[i+1])
            );
        }
        if(this.particles.length > 3){
            this.segments.push(
                new Segment(lastP,this.particles[this.particles.length-4])
            );
        }
       
    }


    
        moveTo(newLoc ,frameCount = 40){   // going to next frame will take 1 sec
          for(let i=1; i<=frameCount; i++){
             const t = i/frameCount;
             this.queue.push(vLerp(this.loc , newLoc , t));
          }
        }

    draw(ctx){
        let changed = false;
        if(this.queue.length > 0){
            this.loc = this.queue.shift();
            this.particles[0].loc = this.loc;
            changed = true;
        }
        const {x,y} = this.loc;
        const left = x - this.width/2;
        const right = x + this.width/2;
        const bottom = y + this.height;
        
        const ps = this.particles;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.moveTo(ps[0].loc.x , ps[0].loc.y);
        for(let i=2; i<ps.length; i+=2){
            ctx.lineTo(ps[i].loc.x , ps[i].loc.y);
        }
        for(let i=ps.length-2; i>=0; i-=2){
            ctx.lineTo(ps[i].loc.x , ps[i].loc.y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // for(let i=0; i<this.particles.length;i++){
        //     this.particles[i].draw(ctx);
        // }
        
        // for(let i=0; i<this.segments.length;i++){
        //     this.segments[i].draw(ctx);
        // }

        // ctx.strokeStyle = "black";
        // ctx.beginPath();
        // ctx.rect(left,y,this.width,this.height);
        // ctx.stroke(); 
        return changed;
    }
}