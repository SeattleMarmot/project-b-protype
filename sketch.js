let bgImg, bgBlur1, bgBlur2;

let sceneStep = 0;
let sceneTimer = 0;
let subtitle = "";

//let audio1, audio2, audio3, audio4, audio5;
//let audioHeartbeat, audioClock;
//let hasPlayedAudio = {};

function preload() {
  bgImg = loadImage('assets/img1.png');
  
  //audio1 = loadSound('assets/audio1.mp3');
  //audio2 = loadSound('assets/audio2.mp3');
  //audio3 = loadSound('assets/audio3.mp3');
  //audio4 = loadSound('assets/audio4.mp3');
  //audio5 = loadSound('assets/audio5.mp3');

  //audioHeartbeat = loadSound('assets/heartbeat.mp3');
  //audioClock = loadSound('assets/clock.mp3');
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("p5-canvas");
  canvas.parent("p5-canvas-container");
  
  bgBlur1 = bgImg.get(); 
  bgBlur1.filter(BLUR, 10);
  bgBlur2 = bgImg.get(); 
  bgBlur2.filter(BLUR, 30);

  pixelDensity(1);
  
  //设置心跳音效为循环模式
  //audioHeartbeat.loop();
  //audioHeartbeat.pause();
  
  //设置时钟音效为循环模式
  //audioClock.loop();
  //audioClock.pause();
}

function draw() {
  background(0);

  let imgAspect = bgImg.width / bgImg.height;
  let availableW = width - 100;
  let availableH = height - 100;
  let canvasAspect = availableW / availableH;
  let drawW, drawH;
  if (imgAspect > canvasAspect) {
    drawW = availableW;
    drawH = availableW / imgAspect;
  } else {
    drawH = availableH;
    drawW = availableH * imgAspect;
  }
  imageMode(CENTER);

  if (sceneStep === 0) {
    //playAudioOnce(audio1, 'scene0');
    image(bgImg, width/2, height/2, drawW, drawH);
    subtitle = "Take a close look.";
    drawSubtitle(subtitle);
    sceneTimer++;
    if (sceneTimer > 180) {
      sceneStep = 1; sceneTimer = 0;
    }
  }
  else if (sceneStep === 1) {
    image(bgImg, width/2, height/2, drawW, drawH);
    subtitle = "";
    drawSubtitle(subtitle);
    sceneTimer++;
    if (sceneTimer > 45) {
      sceneStep = 2; sceneTimer = 0;
    }
  }
  else if (sceneStep === 2) {
    //playAudioOnce(audio2, 'scene2');
    image(bgImg, width/2, height/2, drawW, drawH);
    subtitle = "Coz you can never get back.";
    drawSubtitle(subtitle);
    sceneTimer++;
    if (sceneTimer > 150) {
      sceneStep = 3; sceneTimer = 0;
    }
  }
  else if (sceneStep === 3) {
    image(bgImg, width/2, height/2, drawW, drawH);
    subtitle = "";
    drawSubtitle(subtitle);
    sceneTimer++;
    if (sceneTimer > 75) {
      sceneStep = 4; sceneTimer = 0;
    }
  }
  else if (sceneStep === 4) {
    //blink1
    //开始播放心跳循环音效
    //if (sceneTimer === 0) {
    //  audioHeartbeat.play();
    //}
    blinkTransition(bgImg, bgBlur1, drawW, drawH);
    sceneTimer++;
    if (sceneTimer > 120) {
      sceneStep = 5; sceneTimer = 0;
    }
  }
  else if (sceneStep === 5) {
    //blink2
    blinkTransition(bgBlur1, bgBlur2, drawW, drawH);
    sceneTimer++;
    if (sceneTimer > 120) {
      sceneStep = 6; sceneTimer = 0;
    }
  }
  else if (sceneStep === 6) {
    //blink3
    blinkPixelation(bgBlur2, 18, drawW, drawH);
    sceneTimer++;
    if (sceneTimer > 120) {
      //停止播放心跳音效
      //audioHeartbeat.pause();
      sceneStep = 7; sceneTimer = 0;
    }
  }
  else if (sceneStep === 7) {
    //Try:1.5秒
    //Move your mouse: 4秒
    //Memorize:3秒
    //倒计时:10秒
    let totalFrames = 1170;
    
    let t = sceneTimer / totalFrames;
    if (t > 1) {
      t = 1;
    }
    //blockSize 18-50
    let blockSize = int(18 + (48 - 18) * t);
    let clearBlock = 4;
    let clearDist = 80;
    
    drawPixelationWithMagnifier(blockSize, clearBlock, drawW, drawH, clearDist);
    
    if (sceneTimer < 90) {
      //if (sceneTimer === 0) {
      //  playAudioOnce(audio3, 'try');
      //}
      drawSubtitle("Try.");
    } else if (sceneTimer < 330) {
      //if (sceneTimer === 90) {
      //  playAudioOnce(audio4, 'move');
      //}
      drawSubtitle("Move your mouse.");
    } else if (sceneTimer < 510) {
      //if (sceneTimer === 330) {
      //  playAudioOnce(audio5, 'memorize');
      //}
      drawSubtitle("Memorize.");
    }
    //8.5*60=510
    if (sceneTimer >= 510) {
      let countdownFrames = sceneTimer - 510;
      let remainingFrames = 600 - countdownFrames;
      if (remainingFrames > 0) {
        drawCountdown(ceil(remainingFrames / 60));
      } else {
        drawCountdown(0);
      }
      //the screen begin to fade out in the last 6sec
      if (remainingFrames <= 360) {
        //开始播放时钟循环音效
        //if (remainingFrames === 360) {
        //  audioClock.play();
        //}
        let darknessAlpha = map(remainingFrames, 360, 0, 0, 255);
        push();
        fill(0, darknessAlpha);
        noStroke();
        rect(0, 0, width, height);
        pop();
      }
    }
    sceneTimer++;
    if (sceneTimer > totalFrames) {
      //停止播放时钟音效
      //audioClock.pause();
      sceneStep = 8; sceneTimer = 0;
    }
  }
}

//Get a clear vision with the mouse
function drawPixelationWithMagnifier(blockSize, clearBlock, drawW, drawH, clearDist) {
  bgImg.loadPixels();
  noStroke();

  for (let y = 0; y < bgImg.height; y += blockSize) {
    for (let x = 0; x < bgImg.width; x += blockSize) {
      let idx = 4 * (y * bgImg.width + x);
      let r = bgImg.pixels[idx];
      let g = bgImg.pixels[idx + 1];
      let b = bgImg.pixels[idx + 2];
      let px = map(x, 0, bgImg.width, width/2 - drawW/2, width/2 + drawW/2);
      let py = map(y, 0, bgImg.height, height/2 - drawH/2, height/2 + drawH/2);
      let w = drawW * blockSize / bgImg.width;
      let h = drawH * blockSize / bgImg.height;
      fill(r, g, b);
      rect(px, py, w, h);
    }
  }
  
  let imgMouseX = map(mouseX, width/2 - drawW/2, width/2 + drawW/2, 0, bgImg.width);
  let imgMouseY = map(mouseY, height/2 - drawH/2, height/2 + drawH/2, 0, bgImg.height);
  
  let imgClearRadius = clearDist * (bgImg.width / drawW);
  
  //取整到clearBlock的整数倍以对齐
  let startX = int(imgMouseX - imgClearRadius);
  let startY = int(imgMouseY - imgClearRadius);
  let endX = int(imgMouseX + imgClearRadius);
  let endY = int(imgMouseY + imgClearRadius);
  
  //边界
  startX = max(0, startX);
  startY = max(0, startY);
  endX = min(bgImg.width, endX);
  endY = min(bgImg.height, endY);
  
  //对齐到clearBlock网格
  startX = int(startX / clearBlock) * clearBlock;
  startY = int(startY / clearBlock) * clearBlock;
  
  //draw small blocks around the mouse
  for (let y = startY; y < endY; y += clearBlock) {
    for (let x = startX; x < endX; x += clearBlock) {
      if (x >= 0) {
        if (x < bgImg.width) {
          if (y >= 0) {
            if (y < bgImg.height) {
              let idx = 4 * (y * bgImg.width + x);
              let r = bgImg.pixels[idx];
              let g = bgImg.pixels[idx + 1];
              let b = bgImg.pixels[idx + 2];
              let px = map(x, 0, bgImg.width, width/2 - drawW/2, width/2 + drawW/2);
              let py = map(y, 0, bgImg.height, height/2 - drawH/2, height/2 + drawH/2);
              let w = drawW * clearBlock / bgImg.width;
              let h = drawH * clearBlock / bgImg.height;
              fill(r, g, b);
              rect(px, py, w, h);
            }
          }
        }
      }
    }
  }

  //stroke of 放大镜
  push();

  noFill();
  stroke(255);
  strokeWeight(6);
  let screenRadius = clearDist;
  rectMode(CENTER);
  rect(mouseX, mouseY, screenRadius * 2, screenRadius * 2);

  pop();
}

//blink3过渡
function blinkPixelation(imgA, pixelBlock, drawW, drawH) {
  let phase = sceneTimer;
  let alpha = 0;
  if (phase < 60) {
    alpha = map(phase, 0, 60, 0, 255);
    image(imgA, width/2, height/2, drawW, drawH);
  } else {
    alpha = map(phase, 60, 120, 255, 0);
    drawPixelation(pixelBlock, drawW, drawH);
  }
  push();
  fill(0, alpha);
  noStroke();
  rect(0, 0, width, height);
  pop();
}

//blink12过渡（即渐隐渐显）
function blinkTransition(imgA, imgB, drawW, drawH) {
  let phase = sceneTimer;
  let alpha = 0;
  if (phase < 60) {
    alpha = map(phase, 0, 60, 0, 255);
    image(imgA, width/2, height/2, drawW, drawH);
  }
  else {
    alpha = map(phase, 60, 120, 255, 0);
    image(imgB, width/2, height/2, drawW, drawH);
  }
  push();
  fill(0, alpha);
  noStroke();
  rect(0, 0, width, height);
  pop();
}

//画马赛克
function drawPixelation(blockSize, drawW, drawH) {
  bgImg.loadPixels();
  noStroke();
  for (let y = 0; y < bgImg.height; y += blockSize) {
    for (let x = 0; x < bgImg.width; x += blockSize) {
      let idx = 4 * (y * bgImg.width + x);
      let r = bgImg.pixels[idx];
      let g = bgImg.pixels[idx + 1];
      let b = bgImg.pixels[idx + 2];
      let px = map(x, 0, bgImg.width, width/2 - drawW/2, width/2 + drawW/2);
      let py = map(y, 0, bgImg.height, height/2 - drawH/2, height/2 + drawH/2);
      let w = drawW * blockSize / bgImg.width;
      let h = drawH * blockSize / bgImg.height;
      fill(r, g, b);
      rect(px, py, w, h);
    }
  }
}

//倒计时
function drawCountdown(sec) {
  textAlign(LEFT, TOP);
  textSize(64);
  textStyle(BOLD);
  fill(255,0,0);
  text(sec + "s", 100, 75);
}

//字幕
function drawSubtitle(txt) {
  textAlign(CENTER, CENTER);
  textSize(36);
  textStyle(BOLD);
  fill(255);
  text(txt, width/2, height * 0.8);
}

//读字幕和音效
//function playAudioOnce(audioObject, audioKey) {
//  if (hasPlayedAudio[audioKey] === undefined) {
//    audioObject.play();
//    hasPlayedAudio[audioKey] = true;
//  }
//}
