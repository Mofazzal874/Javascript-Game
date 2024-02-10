//this is called  buildIn on load Event , it is called when the page is loaded fully.
//this is the first event to be called when the page is loaded including all the 
//images, css, js and other resources.
window.addEventListener('load', function() {
    //canvas serves as a container for graphics, text, and other visual elements.
    //it is a rectangular area on an HTML page.
    //canvas setup
    const canvas = document.getElementById('canvas1');

    //Drawing context-It is a built in object that contains all the methods and properties 
    // that allows us to draw and animate colours , shapes , and other graphics on HTML canvas.
    const ctx = canvas.getContext('2d'); //we can pass 2d or webGl(3d) as an argument here to work with 2d or 3d graphics is the canvas.WebGL is used for 3d rendering context.
    canvas.width = 500 ; 
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
                console.log(this.game.keys) ; 

            }) ; 
            //now we check if the pressed button is released or not .If released , then we have remove the occurence of that button from that array
            window.addEventListener('keyup' , e=>{

                if(this.game.keys.indexOf(e.key)>-1){
                    this.game.keys.splice(this.game.keys.indexOf(e.key) , 1) ;//we are deleting the key using index and we're deleting starting from that index only one time
                }
                console.log(this.game.keys) ; 
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

        }
        update(){
            this.x += this.speed ; 
            if(this.x>this.game.width*0.8) this.markedForDeletion = true; //this will ensure that laser has a limited range and will be vanished after 80% of the game canvas width .certainly we don't want to destroy enemies offscreen.

        }
        draw(context){
            context.fillStyle = 'yellow' ; 
            context.fillRect(this.x , this.y , this.width , this.height) ; 

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
            this.width = 120 ;  //according to sprite animation 
            this.height = 190 ;  //according to sprite animation
            this.x = 20 ;       //setting the initial x co-ordinate of the player in the canvas
            this.y = 100 ;      //y coordinate 
            this.speedY =0;   
            this.maxSpeed = 2 ; //player can set up speed , but it can never be greater than 2 ;
            this.projectiles = [] ; // Initialize the Projectiles array with correct case
                                  //this will hold all current projectile objects 

        }
        update(){
            if(this.game.keys.includes('ArrowUp')) this.speedY = -this.maxSpeed ; //move the player up
            else if(this.game.keys.includes('ArrowDown')) this.speedY = this.maxSpeed; //move the player down
            else this.speedY = 0 ; 
            this.y +=this.speedY ; 
            //handle projectiles
            this.projectiles.forEach(projectile => {
                projectile.update() ; 
            }) ;
            this.projectiles = this.projectiles.filter(projectile =>!projectile.markedForDeletion) ;//here we're deleting the laser that are out of range /offscreen
        }
        draw(context){  //specify in which context or layer we want to draw the player if the game is multi-layered.
            context.fillStyle = 'black' ;
            context.fillRect(this.x , this.y , this.width , this.height) ; //making a rectangular shape for the player in the x, y  co-ordinates and with the size of player width and height.
            this.projectiles.forEach(projectile => {
                projectile.draw(context) ; 
            }) ;


        }
        shootTop(){ //shoot from the mouth
            if(this.game.ammo>0){
                this.projectiles.push(new Projectile(this.game, this.x+80 , this.y +30)) ; 
                this.game.ammo-- ; //every time we create a new projectile , we decrease the value of that ammo by 1

            }
            
            console.log(this.projectiles) ;
            
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


        }
        update(){
            this.x += this.speedX ; 
            if(this.x +this.width < 0 ) this.markedForDeletion = true ; //the enemey is outside of the box 
        }
        draw(context){
            context.fillStyle = 'red' ; 
            context.fillRect(this.x , this.y , this.width , this.height) ; 
        }

    }


//All the enemy types 
class Angler1 extends Enemy {
    constructor(game){
        //all the properties of Enemy
        super(game) ; //to execute all the features of Enemy constructor class.Otherwise Angler1 constructor will override the Enemy class constructor and Enemy properties will not be executed here 
        //additional properties
        this.width = 228*0.2 ;  //width of this enemy
        this.height = 169*0.2 ; //height of this enemy 
        this.y = Math.random()*(this.game.height*0.9 - this.height) ; 
    }

}
    //individual layers for background, foreground, and seamlessly scrolling multi-layered parallax backgrounds.
    class Layer {

    }
    //background object will pull all the layers to animate the entire gameWorld.
    class Background{

    }
    //timer , score and other UI elements to display to the user
    class UI{

        constructor(game){
            this.game = game ; 
            this.fonSize = 25 ; 
            this.fontfamily = 'Helvatica' ; 
            this.color = 'yellow' ; 
        }
        draw(context){
            //ammo recharging animation bar 
            //one stick for one ammo 
            context.fillStyle = this.color ; 
            for(let i = 0 ; i < this.game.ammo ; i++ ){
                context.fillRect(20+5*i,50, 3 , 20 ) ; 
            }
        }

    }
    //This Game class can be called the Brain of the project
    //all logic will come together in the main game class
    //main game class- will handle the game loop, update the game state, and render the game world.
    class Game{

        constructor(width , height){   //height and width of the canvas as arguments to ensure that the game windows size must match the canvas element
            this.width = width ; 
            this.height = height ; 
            this.player = new Player(this) ;  //we want to create a new player as soon as we start the game , that's why player class is instantiated in Game class....this refers to this Game class
            this.input = new InputHandler(this) ; 
            this.ui = new UI(this) ; 
            this.keys = [] ;  //here , keys is an array which will keep track of the pressed keys 
                                //this array is declared in this game class so that user can control everything everything in the whole game


            this.enemies = []  ;//will hold all currently active enemy objects

            this.enemyTimer = 0 ; //this will count between 0 and enemyInterval
            this.enemyInterval = 1000 ; //add new Angler1 enemy to the game every 1 second

            this.ammo = 20 ; //starting ammo 
            this.maxAmmo = 50 ;  //maximum ammo 
            this.ammoTimer = 0 ; 
            this.ammoInterval = 500 ; //half second..Replenish ammo after every .5 seconds
            this.gameOver = false ; 
             

        }
        update(deltaTime){
            this.player.update() ; //ei Game er er jonne make kora player tar update method the call holo ;
            if(this.ammoTimer> this.ammoInterval){
                if(this.ammo<this.maxAmmo) this.ammo++ ; 
                this.ammoTimer = 0 ; 
            }
            else {
                this.ammoTimer+=deltaTime ; 
            }
            this.enemies.forEach(enemy=>{
                enemy.update() ; 
            });
            this.enemies = this.enemies.filter(enemy=>!enemy.markedForDeletion) ; 
            if(this.enemyTimer>this.enemyInterval && !this.gameOver) {
                this.addEnemy() ; 
                this.enemyTimer = 0 ; 
            }
            else {
                this.enemyTimer+=deltaTime ; 
            }

        }
        draw(context){          //specify in which context or layer we want to draw the player if the game is multi-layered.mane ei game er context tai send kore dibe player er kache  draw korar jonne 
            this.player.draw(context) ; //same as before 
            this.ui.draw(context) ; 
            this.enemies.forEach(enemy =>{
                enemy.draw(context) ; 
            });
        }
        addEnemy(){
            this.enemies.push(new Angler1(this)) ; 
        }
        

    }


    const game = new Game(canvas.width, canvas.height) ; //we 're creating a game object as well as the Player object(inside of Game class)


    //creating timeStamp
    let lastTime = 0 ; 
    //Now we'll a animation loop which will update the update()  and draw() function 60 times in a second for a seamless experience
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime ; //time stamp is found from requestAnimationFrame
        lastTime = timeStamp ; //setting the lastTime from the starting animation timeStamp 
        ctx.clearRect(0, 0, canvas.width , canvas.height) ;
        game.update(deltaTime) ; 
        game.draw(ctx) ;  //Here , we're sending the 2d context that we create in line 12 ; 
        //after every updating and drawing  , we want to trigger the next animation frame .
        //we'll use a method called requestAnimationFrame which is a built-in method of window object
        //this function has two features.01.it will refresh the user's screen at specified rate (for most of us , it is 60FPS) ...02.create a timestamp function
        requestAnimationFrame(animate) ;   //endless loop of update and draw and sending request to the browser to perform animation before the next repaint
    }

    animate(0) ; 

}) ; 