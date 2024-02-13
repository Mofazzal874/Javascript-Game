//this is called  buildIn on load Event , it is called when the page is loaded fully.
//this is the first event to be called when the page is loaded including all the 
//images, css, js and other resources.
window.addEventListener('load', function() {
    //To play again 
    function reloadGame() {
        window.location.reload();
    }

    //canvas serves as a container for graphics, text, and other visual elements.
    //it is a rectangular area on an HTML page.
    //canvas setup
    const canvas = document.getElementById('canvas1');


    const playAgainButton = document.getElementById('play-again-button');
    
    // Add event listener to play again button
    playAgainButton.addEventListener('click', function() {
        reloadGame(); // Reload the game when play again button is clicked
    });

    //Drawing context-It is a built in object that contains all the methods and properties 
    // that allows us to draw and animate colours , shapes , and other graphics on HTML canvas.
    const ctx = canvas.getContext('2d'); //we can pass 2d or webGl(3d) as an argument here to work with 2d or 3d graphics is the canvas.WebGL is used for 3d rendering context.
    canvas.width = 1000 ; 
    canvas.height = 500 ; 

    //will keep track of user input like arrow keys, mouse clicks, etc.
    class InputHandler{
        constructor(game){
            this.game = game ; 
            // we'll listen for a keydown event
            //keydown means 'if a button is pressed or not , if a button is pressed , that means a key is down 
            window.addEventListener('keydown' , e=>{ //here , we are sending additional information of the event in the object called e(saving the key event in e )
                                                    //Here e => is an arrow function- a special feature of arrow function is that 'this' keyword inside arrow function always represents the object in which the arrow function is defined
                                                    //arrow function will never forget that it was defined in constructor of InputHandler class.so it will always see this.game = game reference 
                if(( (e.key === 'ArrowUp') || 
                     (e.key === 'ArrowDown') )&& this.game.keys.indexOf(e.key) === -1){ //if the currently pressed key is not present in the array , then add it. otherwise no need to add , as it is already added 
                    this.game.keys.push(e.key) ; 
                }
                //spaceBar to shoot
                else if (e.key === ' '){
                    this.game.player.shootTop() ; 
                }
                else if(e.key ==='d'){
                    this.game.debug = !this.game.debug ; 
                }
                 

            }) ; 
            //now we check if the pressed button is released or not .If released , then we have remove the occurence of that button from that array
            window.addEventListener('keyup' , e=>{

                if(this.game.keys.indexOf(e.key)>-1){
                    this.game.keys.splice(this.game.keys.indexOf(e.key) , 1) ;//we are deleting the key using index and we're deleting starting from that index only one time
                }
                
            }) ;
        }

    }
    //for shooting the laser 
    class Projectile{
        constructor(game, x, y ){  //starting x and y co-ordinate of the projectile will depend on the players current position
            this.game = game ; 
            this.x = x ; 
            this.y = y ; 
            this.width = 10  ; 
            this.height = 3 ; 
            this.speed = 3 ; 
            this.markedForDeletion = false ;
            this.image = document.getElementById('projectile') ;  

        }
        update(){
            this.x += this.speed ; 
            if(this.x>this.game.width*0.8) this.markedForDeletion = true; //this will ensure that laser has a limited range and will be vanished after 80% of the game canvas width .certainly we don't want to destroy enemies offscreen.

        }
        draw(context){
           context.drawImage(this.image , this.x , this.y) ;  

        }
         

    }
    //falling screws , cork screws and other objects from damaged ship
    class Particle{

    }
    //Player ship
    //control the main character-animate  the character sprite sheet and so on ..
    class Player{      //player will need to create a game . that is why we're taking the game object as an argument in the constructor and setting it to a property called game.
        constructor(game){
            this.game = game ; 
            this.width = 120 ;  //according to sprite animation player
            this.height = 190 ;  //according to sprite animation player
            this.x = 20 ;       //setting the initial x co-ordinate of the player in the canvas
            this.y = 100 ;      //y coordinate 
            this.frameX = 0 ; //frameX will cycle through the spritesheet horizontally(this means column wise)
            this.frameY = 0;//frameY will determine the row of the spritesheet (in this case there are 2 rows in the spritesheet , 1st row is for general seahorse and 2nd row is for powered up seahorse)
            this.maxFrame = 37 ; //(player spritesheet has 37 seahorse)
            this.speedY =0;   
            this.maxSpeed = 2 ; //player can set up speed , but it can never be greater than 2 ;
            this.projectiles = [] ; // Initialize the Projectiles array with correct case
                                  //this will hold all current projectile objects 

            this.image = document.getElementById('player') ; 
            this.powerUp = false ;
            this.powerUpTimer = 0 ; 
            this.powerUpLimit = 10000; 

        }
        update(deltaTime){
            if(this.game.keys.includes('ArrowUp')) this.speedY = -this.maxSpeed ; //move the player up
            else if(this.game.keys.includes('ArrowDown')) this.speedY = this.maxSpeed; //move the player down
            else this.speedY = 0 ; 
            this.y +=this.speedY ; 
            //handle projectiles

            //vertical boundaries for player so that player can not leave the screen vertically.Though the player can disappear halfway to avoid enemy
            if(this.y + this.height*0.5 > this.game.height ) this.y = this.game.height - this.height*0.5 ;  // this is for going downwards
            else if(this.y < -this.height*0.5) this.y = -this.height*0.5 ; //this is for going upwards
            this.projectiles.forEach(projectile => {
                projectile.update() ; 
            }) ;
            this.projectiles = this.projectiles.filter(projectile =>!projectile.markedForDeletion) ;//here we're deleting the laser that are out of range /offscreen


            //sprite animation
            if(this.frameX < this.maxFrame) {
                this.frameX++ ; 
            }
            else {
                this.frameX = 0 ; 
            }
            //power up logic
            if(this.powerUp){
                if(this.powerUpTimer> this.powerUpLimit){
                    this.powerUpTimer = 0 ; 
                    this.powerUp = false ; 
                    this.frameY = 0 ; 
                
                }
                else {
                    this.powerUpTimer +=deltaTime; 
                    this.frameY = 1 ; 
                    this.game.ammo +=0.1 ; 
                }
            }
        }
        draw(context){  //specify in which context or layer we want to draw the player if the game is multi-layered.
            
            //show the rectangle only if debug mode is on
            if(game.debug)context.strokeRect(this.x , this.y , this.width , this.height) ; //making a rectangular shape for the player in the x, y  co-ordinates and with the size of player width and height.
            this.projectiles.forEach(projectile => {
                projectile.draw(context) ; 
            }) ;
            context.drawImage(this.image ,this.frameX*this.width , this.frameY*this.height , this.width  ,this.height ,  this.x , this.y, this.width , this.height) ;
            //drawImage function takes maximum 9 arguments and minimum 3 arguments
            //this.image = the image that you want to set
            //sx = source image er x coordinate in the picture
            //sy = source image er y 
            //sw = source image er width zototuku nite chai 
            //sh = source image er height zototuku nite chai
            //this.x = destination er x co-ordinate (in this case canvas er x coordinate)
            //this.y = destination er y co-ordinate (in this case canvas er x coordinate)
            //this.width = destination e zototuku width e boshate chai image ta 
            //this.height = destination e zototuku height e boshate chai image ta 

            


        }
        shootTop(){ //shoot from the mouth
            if(this.game.ammo>0){
                this.projectiles.push(new Projectile(this.game, this.x+80 , this.y +30)) ; 
                this.game.ammo-- ; //every time we create a new projectile , we decrease the value of that ammo by 1

            }
            if(this.powerUp) this.shootBottom() ; 
            
            
        }
        shootBottom(){
            if(this.game.ammo>0){
                this.projectiles.push(new Projectile(this.game, this.x+80 , this.y +175)) ; 
                

            }
        }
        enterPowerUp(){
            this.powerUpTimer = 0 ; 
            this.powerUp = true 
            if(this.game.ammo < this.game.maxAmmo) this.game.ammo = this.game.maxAmmo ; 
        }
         
        

    }
    //enemy ships
    //control the enemy ships-animate the enemy ships sprite sheet and handling different enemy ships types..
    //as there are different types of enemies , so this enemy class is just a blueprint that will be shared with all the enemy types..

    class Enemy{
        constructor(game){
            this.game = game ; 
            this.x = this.game.width ; 
            this.speedX = Math.random()*-1.5-0.5 ;
            this.markedForDeletion = false ; 
            this.frameX = 0 ; 
            this.frameY = 0 ; 
            this.maxFrame = 37 ; 

        }
        update(){
            this.x += this.speedX - this.game.speed ; 
            if(this.x +this.width < 0 ) this.markedForDeletion = true ; //the enemey is outside of the box 
            if(this.frameX < this.maxFrame){
                this.frameX++ ; 
            }
            else this.frameX = 0 ; 
        }
        draw(context){
           if(this.game.debug) context.strokeRect(this.x , this.y , this.width , this.height) ;
            context.drawImage(this.image ,this.frameX * this.width , this.frameY * this.height ,this.width , this.height ,   this.x , this.y , this.width , this.height) ; 
            if(this.game.debug){
                context.font = '20 px Helvetica' ; 
                context.fillText(this.lives , this.x , this.y) ; 

            }
             
        }

    }


//All the enemy types 
class Angler1 extends Enemy {
    constructor(game){
        //all the properties of Enemy
        super(game) ; //to execute all the features of Enemy constructor class.Otherwise Angler1 constructor will override the Enemy class constructor and Enemy properties will not be executed here 
        //additional properties
        this.width = 228 ;  //width of this enemy
        this.height = 169 ; //height of this enemy 
        this.y = Math.random()*(this.game.height*0.95 - this.height) ;
        this.image = document.getElementById('angler1') ; 
        this.frameY = Math.floor(Math.random()*3); 
        this.lives = 5 ; //every enemy have 5 lives 
            this.score = this.lives ; //if you kill this enemy you get 'lives' point

    }

}
class Angler2 extends Enemy {
    constructor(game){
        //all the properties of Enemy
        super(game) ; //to execute all the features of Enemy constructor class.Otherwise Angler1 constructor will override the Enemy class constructor and Enemy properties will not be executed here 
        //additional properties
        this.width = 213 ;  //width of this enemy
        this.height = 165 ; //height of this enemy 
        this.y = Math.random()*(this.game.height*0.95 - this.height) ;
        this.image = document.getElementById('angler2') ; 
        this.frameY = Math.floor(Math.random()*2);
        this.lives = 6 ; //every enemy have 5 lives 
            this.score = this.lives ; //if you kill this enemy you get 'lives' point 

    }

}

class luckyFish extends Enemy {
    constructor(game){
        //all the properties of Enemy
        super(game) ; //to execute all the features of Enemy constructor class.Otherwise Angler1 constructor will override the Enemy class constructor and Enemy properties will not be executed here 
        //additional properties
        this.width = 99 ;  //width of this enemy
        this.height = 95 ; //height of this enemy 
        this.y = Math.random()*(this.game.height*0.95 - this.height) ;
        this.image = document.getElementById('lucky') ; 
        this.frameY = Math.floor(Math.random()*2);
        this.lives = 3 ; //every enemy have 5 lives 
        this.score = 15 ; //if you kill this enemy you get 'lives' point 
        this.type = 'lucky';
        this.speedX = Math.random()*-1.2 -0.2 ; 

    }

}
class HiveWhale extends Enemy {
    constructor(game){
        //all the properties of Enemy
        super(game) ; //to execute all the features of Enemy constructor class.Otherwise Angler1 constructor will override the Enemy class constructor and Enemy properties will not be executed here 
        //additional properties
        this.width = 400 ;  //width of this enemy
        this.height = 227 ; //height of this enemy 
        this.y = Math.random()*(this.game.height*0.9 - this.height) ;
        this.image = document.getElementById('hivewhale') ; 
        this.frameY = 0 ;
        this.lives = 20 ; //every enemy have 5 lives 
        this.score = this.lives; //if you kill this enemy you get 'lives' point 
        this.type = 'hive' ;
        this.speedX = Math.random()*-1.2 -0.2 ;  

    }

}

class Drone extends Enemy {
    constructor(game , x , y ){   //x and y are the current position of the Hivewhale 
        //all the properties of Enemy
        super(game) ; //to execute all the features of Enemy constructor class.Otherwise Angler1 constructor will override the Enemy class constructor and Enemy properties will not be executed here 
        //additional properties
        this.width = 115 ;  //width of this enemy
        this.height = 95 ; //height of this enemy 

        this.x = x ; 
        this.y = y ; 
        this.image = document.getElementById('drone') ; 
        this.frameY = Math.floor(Math.random()*2) ; 
        this.lives = 3 ; //every enemy have 5 lives 
        this.score = this.lives; //if you kill this enemy you get 'lives' point 
        this.type = 'drone' ; 
        this.speedX = Math.random()*-4.2 -0.5; 

    }

}
    //individual layers for background, foreground, and seamlessly scrolling multi-layered parallax backgrounds.
class Layer {

        constructor(game , image , speedModifier){
            this.game = game ; 
            this.image = image ; 
            this.speedModifier = speedModifier ; 
            this.width = 1768 ; //same as the main photo 
            this.heigth = 500 ; //same as the main photo 
            this.x = 0 ;  //drawing will be started from x ,y = 0 , 0 
            this.y = 0 ; 
        }
        update(){
            if(this.x <= -this.width) this.x = 0 ;  //this means the background screen has moved to next screen , so we need to set the picture again to 0 
            this.x -=this.game.speed*this.speedModifier; //decrease the x coordinate according to the set game speed 
        }
        draw(context){
            context.drawImage(this.image ,this.x , this.y); 
            context.drawImage(this.image ,this.x + this.width , this.y); 
        }

    }
    //background object will pull all the layers to animate the entire gameWorld.
    class Background{
        constructor(game){
            this.game = game ; 
            this.image1 = document.getElementById('layer1') ; 
            this.image2 = document.getElementById('layer2') ; 
            this.image3 = document.getElementById('layer3') ; 
            this.image4 = document.getElementById('layer4') ; 
            this.layer1 = new Layer(this.game , this.image1 , .3) ;
            this.layer2 = new Layer(this.game , this.image2 , 0.5) ;
            this.layer3 = new Layer(this.game , this.image3 , 1.1) ;
            this.layer4 = new Layer(this.game , this.image4 , 1.6) ;
            this.layers = [this.layer1 , this.layer2 , this.layer3] ;  //we'll hold all layers in an array  
        }
        update(){
            this.layers.forEach(layer => layer.update()) ; 

        }
        draw(context){
            this.layers.forEach(layer => layer.draw(context)) ; 

        }
    }
    //timer , score and other UI elements to display to the user
    class UI {
        constructor(game) {
            this.game = game;
            this.fontSize = 25;
            this.fontFamily = 'Bangers'; // Corrected typo here
            this.color = 'white';
        }
        draw(context) {
            context.save()  ; 
            context.fillStyle = this.color;
            context.shadowOffsetX = 2; 
            context.shadowOffsety = 2; 
            context.shadowColor = 'black'  ; 
            context.font = this.fontSize + 'px ' + this.fontFamily;
            // Score
            context.fillText('Score: ' + this.game.score, 20, 40);

            
            //timer 
            const formattedTime = (this.game.gameTime*0.001).toFixed(1) ; //this will format the time from milliseconds to seconds
                                                                          //and fixed the number after decimal point to 1 digit only
            context.fillText('Timer: ' + formattedTime , 20 , 100)  ;
            context.fillText("Lives Remaining: " + this.game.life ,800 , 40 ) ; 
            //game over message
            if(this.game.gameOver){
                context.textAlign = 'center' ; 
                let message1 ; 
                let message2 ; 
                
                    message1 = 'You frucked up man! very sad!' ; 
                    message2 = 'Anyway....Try again!'
                context.font = '75px ' + this.fontFamily ;
                context.fillText(message1 , this.game.width*0.5 , this.game.height*0.5 - 25) ;//-25 is to move the message1 25point up vertically 
                context.font = '50px '+ this.fontFamily ; 
                context.fillText(message2, this.game.width*0.5 , this.game.height*0.5 + 40) ; //+40 is to move the message2 40points down vertically 
            }
            // Ammo recharging animation bar
            // One stick for one ammo
            if(this.game.player.powerUp) context.fillStyle ='#ffffbd' ; 
            for (let i = 0; i < this.game.ammo; i++) {
                context.fillRect(20 + 5 * i, 50, 3, 20);
            }

            //Lives Remaining Bar 
            context.fillStyle = 'RED' ; 
            for(let i = this.game.life ; i> 0 ; i--){
                context.fillRect(800+10*i , 50 , 10 , 25) ; 
            }
            context.restore() ; 
        }
    }
    
    
    //This Game class can be called the Brain of the project
    //all logic will come together in the main game class
    //main game class- will handle the game loop, update the game state, and render the game world.
    class Game{

        constructor(width , height){   //height and width of the canvas as arguments to ensure that the game windows size must match the canvas element
            this.width = width ; 
            this.height = height ; 
            this.background = new Background(this) ; 
            this.player = new Player(this) ;  //we want to create a new player as soon as we start the game , that's why player class is instantiated in Game class....this refers to this Game class
            this.input = new InputHandler(this) ; 
            this.ui = new UI(this) ; 
            this.keys = [] ;  //here , keys is an array which will keep track of the pressed keys 
                                //this array is declared in this game class so that user can control everything everything in the whole game


            this.enemies = []  ;//will hold all currently active enemy objects

            this.enemyTimer = 0 ; //this will count between 0 and enemyInterval
            this.enemyInterval = 2000 ; //add new Angler1 enemy to the game every 1 second

            this.ammo = 20 ; //starting ammo 
            this.maxAmmo = 50 ;  //maximum ammo 
            this.ammoTimer = 0 ; 
            this.ammoInterval = 350 ; //half second..Replenish ammo after every .5 seconds
            this.gameOver = false ;
            this.score = 0 ;
            this.winningScore = 100 ;
            this.gameTime = 0;  //counting game time 
            this.timeLimit = 30000 ; //game time to set time limit for the game 
            this.speed = 4;      //this is the game speed
            this.debug = false;
            this.life = 9 ;

             

        }
        update(deltaTime){
            if(!this.gameOver) this.gameTime+=deltaTime ; 
            if(this.life<=0) this.gameOver = true; 
            this.background.update() ; 
            this.background.layer4.update() ; 
            this.player.update(deltaTime) ; //ei Game er er jonne make kora player tar update method the call holo ;

            //all about ammo refiling and ammoTimer
            if(this.ammoTimer> this.ammoInterval){
                if(this.ammo < this.maxAmmo) this.ammo++ ; 
                this.ammoTimer = 0 ; 
            }
            else {
                this.ammoTimer += deltaTime ; 
            }

            //all about enemy and their timerInterval
            this.enemies.forEach(enemy=>{
                enemy.update() ;
                //collision between enemy and player ...enemy vanished
                if(this.checkCollison(this.player, enemy)) {  //dekhtechi player er sathe collision hoiteche kina
                                                                //true ashle collision hoiteche and we have to vanish the enemies 
                    enemy.markedForDeletion = true ;        //marking to delete
                    if(enemy.type ==='lucky') this.player.enterPowerUp() ; 
                    else if(!this.gameOver) {this.score-- ;this.life--;}  
                }
                //collision between projectile and enemy ....enemy life decrease by one
                this.player.projectiles.forEach(projectile =>{
                    if(this.checkCollison(projectile , enemy )) {
                        enemy.lives-- ; 
                        projectile.markedForDeletion = true;
                        if(enemy.lives<=0){
                            enemy.markedForDeletion = true ; 
                            if(enemy.type === 'hive'){
                                for(let i = 0 ;i < 5 ;i++){
                                    this.enemies.push(new Drone(this, enemy.x + Math.random()*enemy.width, enemy.y + Math.random()*enemy.height*0.5)) ;

                                }
                                 
                            }
                            if(!this.gameOver) this.score+=enemy.score ; 
                            //if(this.score>this.winningScore)this.gameOver = true; 

                        }
                    }
                })

            });
            this.enemies = this.enemies.filter(enemy=>!enemy.markedForDeletion) ;   //here we are deleting 
            if(this.enemyTimer>this.enemyInterval && !this.gameOver) {
                this.addEnemy() ; 
                this.enemyTimer = 0 ; 
            }
            else {
                this.enemyTimer+=deltaTime ; 
            }

        }
        draw(context){          //specify in which context or layer we want to draw the player if the game is multi-layered.mane ei game er context tai send kore dibe player er kache  draw korar jonne 
            this.background.draw(context) ; //background must be drawn before this.player.draw(context). Otherwise player will be drawn first and on top of it , background will be drawn ,creating problem
            this.player.draw(context) ; //same as before 
            this.ui.draw(context) ; 
            this.enemies.forEach(enemy =>{
                enemy.draw(context) ; 
            });
            this.background.layer4.draw(context) ; 
        }
        
        addEnemy(){
            const randomize = Math.random() ;
            //create 50% time angler1 and other 50% time angler2 
            if(randomize<0.3) this.enemies.push(new Angler1(this)) ;
            else if(randomize<0.6) this.enemies.push(new Angler2(this)) ;
            else if(randomize<0.7) this.enemies.push(new HiveWhale(this)) ;
            else this.enemies.push(new luckyFish(this)) ;
             
        }
        //return true if all of the conditions is true and means collision happens and the function return true 
        //return false if any of the conditions is false and means collision didn't happen
        checkCollison(rect1 , rect2){
            return (
                //conditions for not clashing with each other in 4 possible cases
                (rect1.x<rect2.x+rect2.width) && //enemy1 is forward of enemy2 w.r.t to their vertical line1 height1 and height2
                (rect1.x+rect1.width>rect2.x) &&  //enemy2 is forward of enemy1
                (rect1.y<rect2.y+rect2.height)&&   //enemy1 is above of enemy2 
                (rect1.y + rect2.height > rect1.y)  //enemy2 is above of enemy1
            )
        }
        restartGame() {
            this.gameOver = false; // Reset gameOver to false
            // Reset all other game parameters to their initial values
            // Example:
            this.score = 0;
            this.life = 9;
            this.gameTime = 0;
            // Reset any other parameters as needed
        }
        

    }


    const game = new Game(canvas.width, canvas.height) ; //we 're creating a game object as well as the Player object(inside of Game class)


    //creating timeStamp
    let lastTime = 0 ; 
    //Now we'll a animation loop which will update the update()  and draw() function 60 times in a second for a seamless experience
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime ; //time stamp is found from requestAnimationFrame
        //delta time is the time difference between this animation loop time and it's previous animation loop time 
        lastTime = timeStamp ; //setting the lastTime from the starting animation timeStamp 
        ctx.clearRect(0, 0, canvas.width , canvas.height) ;
        game.update(deltaTime) ; 
        game.draw(ctx) ;  //Here , we're sending the 2d context that we create in line 12 ; 
        //after every updating and drawing  , we want to trigger the next animation frame .
        //we'll use a method called requestAnimationFrame which is a built-in method of window object
        //this function has two features.01.it will refresh the user's screen at specified rate (for most of us , it is 60FPS) ...02.create a timestamp function
        
        //endless loop of update and draw and sending request to the browser to perform animation before the next repaint
        if (game.gameOver) {
            playAgainButton.style.display = 'block'; // Show play again button if game is over
        } else {
            playAgainButton.style.display = 'none'; // Hide play again button if game is not over
            requestAnimationFrame(animate); // Continue the animation loop
        }
        // Check if game is over and show play again button
    }

    animate(0) ; 

}) ; 