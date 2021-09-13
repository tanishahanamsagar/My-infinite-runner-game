var PLAY = 1;
var END = 0;
var gameState = PLAY;

var boy, boy_running, boy_collided;
var cloudsGroup, cloudImage;
var treesGroup, tree1, tree2, tree3, tree4;
var ground, groundImg;
var score = 0;
var invisibleGround;
var gameOver, restart;




function preload() {

    boy_running = loadAnimation("boy2.png", "boy3.png");
    treeImg = loadImage("tree.png")
    tree1Img = loadImage("tree1.png")
    tree2Img = loadImage("tree2.png")
    groundImg = loadImage("ground.png");
    cloudImage = loadImage("cloud.png");
    gameOverImg = loadImage("gameOver.png");
    restartImg = loadImage("restart.png");
}

function setup() {
    createCanvas(900, 250);
    ground = createSprite(300, 200)
    ground.addImage(groundImg);

    boy = createSprite(130, 145, 20, 50);
    boy.addAnimation("running", boy_running);
    boy.addAnimation("boy1.png")
    boy.scale = 0.2;
    boy.lifetime = 100000

    gameOver = createSprite(500, 90);
    gameOver.addImage(gameOverImg);

    restart = createSprite(500, 150);
    restart.addImage(restartImg);
    restart.scale = 0.4


    gameOver.scale = 0.5;
    restart.scale = 0.2;

    gameOver.visible = false;
    restart.visible = false;

    invisibleGround = createSprite(200, 190, 400, 10);
    invisibleGround.visible = false;

    cloudsGroup = new Group();
    treesGroup = new Group();


    score = 0;
}

function draw() {
    //trex.debug = true;
    background(255);
    text("Grades - " + score, 800, 50);
    text("UP ARROW" + 600, 70)

    if (gameState === PLAY) {
        score = score + Math.round(getFrameRate() / 60);
        ground.velocityX = -(6 + 3 * score / 100);

        if (keyDown("UP_ARROW") && boy.x >= 100) {
            boy.velocityY = -3;
        }

        if (keyDown("DOWN_ARROW") && boy.x >= 100) {
            boy.velocityY = 3;
        }


        if (ground.x < 0) {
            ground.x = ground.width / 2;
        }

        spawnClouds();
        spawnTrees();

        if (treesGroup.isTouching(boy)) {
            gameState = END;
        }
    } else if (gameState === END) {
        gameOver.visible = true;
        restart.visible = true;

        //set velcity of each game object to 0
        ground.velocityX = 0;
        boy.velocityY = 0;
        treesGroup.setVelocityXEach(0);
        cloudsGroup.setVelocityXEach(0);

        boy.changeAnimation("boy2")
            //set lifetime of the game objects so that they are never destroyed
        treesGroup.setLifetimeEach(-1);
        cloudsGroup.setLifetimeEach(-1);

        boy.collide(invisibleGround)

        if (mousePressedOver(restart)) {
            reset();
        }
    }
    boy.changeAnimation("boy_collided", boy_collided);


    drawSprites();
}

function spawnClouds() {
    //write code here to spawn the clouds
    if (frameCount % 60 === 0) {
        var cloud = createSprite(600, 120, 40, 10);
        cloud.y = Math.round(random(80, 120));
        cloud.addImage(cloudImage);
        cloud.scale = 0.5;
        cloud.velocityX = -3;

        //assign lifetime to the variable
        cloud.lifetime = 200;

        //adjust the depth
        cloud.depth = boy.depth;
        boy.depth = boy.depth + 1;

        //add each cloud to the group
        cloudsGroup.add(cloud);
    }

}

function spawnTrees() {
    if (frameCount % 90 === 0) {
        var tree = createSprite(600, 165, 40, 40);
        tree.addImage(treeImg, tree1Img, tree2Img);
        //obstacle.debug = true;
        tree.velocityX = -(6 + 3 * score / 100);

        //generate random obstacles
        var rand = Math.round(random(1, 9));
        switch (rand) {
            case 1:
                tree.addImage(tree);
                break;
            case 2:
                tree.addImage(tree1);
                break;
            case 3:
                tree.addImage(tree2);
                break;

            default:
                break;
        }

        //assign scale and lifetime to the obstacle           
        tree.scale = 0.5;
        tree.lifetime = 300;
        //add each obstacle to the group
        treesGroup.add(tree);
    }
}

function reset() {
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;

    treesGroup.destroyEach();
    cloudsGroup.destroyEach();

    boy.changeAnimation("running", boy_running);

    score = 0;

}