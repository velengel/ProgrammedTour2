
var alpha = 0, beta = 0, gamma = 0;             // ジャイロの値を入れる変数を3個用意
var canvas = document.getElementById("canvas"); // ★canvas要素を取得 
var context = canvas.getContext("2d");
var phase = 0;

function deviceMotionRequest() {
    if (DeviceMotionEvent.requestPermission) {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener("deviceorientation", (dat) => {
                        alpha = -dat.alpha;  // z軸（表裏）まわりの回転の角度（反時計回りがプラス）
                        beta = dat.beta;   // x軸（左右）まわりの回転の角度（引き起こすとプラス）
                        gamma = dat.gamma;  // y軸（上下）まわりの回転の角度（右に傾けるとプラス）
                    });
                }
            })
            .catch(console.error);
    } else {
        alert('DeviceMotionEvent.requestPermission is not found')
    }
    phase = 1;
}

function Speak() {
    const btn = document.getElementById("btn");
    btn.addEventListener("click", () => {
        const synth = new SpeechSynthesisUtterance();
        var txt = document.getElementById("instruction");// テキストボックスを取得
        synth.text = txt.innerHTML; // 話す内容
        if (phase == 0) synth.text = "命令：ジャイロセンサ許可　を押してスタート";
        synth.lang = "ja-JP";   // 言語
        synth.rate = 1.2;       // 速さ
        synth.pitch = 1.0;       // 高さ
        synth.volume = 1.0;       // 音量
        window.speechSynthesis.speak(synth);
    });

}
Speak();


// 指定時間ごとに繰り返し実行される setInterval(実行する内容, 間隔[ms]) タイマーを設定
var timer = window.setInterval(() => {
    displayInstruction();
    drawOrientation();    // displayData 関数を実行
    displayData();
}, 33); // 33msごとに（1秒間に約30回）

var count = 0;
var countup = function () {
    if (phase == 2) count++;
}
var id = setInterval(function () {
    countup();
    if (count > 11) {
        var programText = `あなたにプログラムされていた内容:
1:[ int time=10;                        ]
2:[ while(time>0){                     ]
3:[     time--;                            ]
4:[     LookAt(SmartPhone);   ]
5:[     Stretch();                       ]
6:[ }                                           ]
`;
        alert(programText);
        phase = 3;
        clearInterval(id);

    }
}, 3000);

var timer2 = window.setInterval(() => {
    countup();
}, 1000);

// データを表示する displayData 関数
function displayData() {
    //var txt = document.getElementById("txt3");   // データを表示するdiv要素の取得

    var radianAlpha = alpha * Math.PI / 180;
    //txt.innerHTML = radianAlpha;
    if (phase == 1 && Math.abs(radianAlpha + 3) <= 0.3) {
        var programText = `あなたにプログラムされていた内容:
1:[ LookAt(SmartPhone);                    ]
2:[ Turn(Math.PI);                                ]`;
        alert(programText);
        phase++;

    }
    if (phase == 3 && Math.abs(radianAlpha + 3) <= 0.3) {
        var programText = `あなたにプログラムされていた内容:
1:[LookAt(SmartPhone);                    ]
2:[Turn(Math.PI);                                ]`;
        alert(programText);
        phase++;

    }

    var phaseBar = document.getElementById("progress");
    phaseBar.value = phase;
}

function drawOrientation() {
    var centerX = canvas.width / 2;            // canvasの中心のX座標
    var centerY = canvas.height / 2;	        // canvasの中心のY座標
    var radius = 40;                          // 枠円の半径および針の長さ
    var radianAlpha = alpha * Math.PI / 180;    // 角度をラジアンに変換
    if (navigator.userAgent.indexOf('Android') > 0) {
        radianAlpha *= -1;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);   // canvasの内容を消す clearRect(x, y, w, h)
    context.beginPath();                        // 描画開始
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);  // 枠円を描く
    context.strokeStyle = "rgb(0, 0, 0)";       // 枠円の線の色
    context.lineWidth = 2;                      // 線の太さ
    context.stroke();                           // 線を描画
    context.beginPath();                        // 描画開始
    context.moveTo(centerX, centerY);           // 中心に移動
    // 線を引く（cosでx座標、sinでy座標が得られる。長さradiusを掛ける。-90度すると真上に向く。）
    context.lineTo(centerX + Math.cos(radianAlpha - Math.PI / 2) * radius,
        centerY + Math.sin(radianAlpha - Math.PI / 2) * radius);
    context.strokeStyle = "rgb(120, 0, 255)";     // 針の線の色
    context.lineWidth = 5;                      // 線の太さ
    context.stroke();                           // 線を描画
}

function displayInstruction() {
    var inst = document.getElementById("instruction");
    var txt = document.getElementById("txt")
    var image = document.getElementById("image");
    switch (phase) {
        case 0:
            inst.innerHTML = "命令：ジャイロセンサ許可👌を押してスタート";
            break;
        case 1:
            inst.innerHTML = "命令：後ろを向いてください。";
            txt.innerHTML = "";
            image.innerHTML = '<img src="./img/backman.png" width = 40% />';
            break;
        case 2:
            inst.innerHTML = "命令：10秒間伸びをしてください。";
            image.innerHTML = '<img src="./img/nobi.png" width = 40% />';
            break;
        case 3:
            inst.innerHTML = "命令：元の向きに戻ってください。";
            image.innerHTML = '<img src="./img/normal.png" width = 40% />';
            break;
        case 4:
            inst.innerHTML = "おつかれさまでした。";
            var all = document.getElementById("all");
            all.style.display = "none";
            var program = document.getElementById("program");
            var programText = `
Thank you. You were programmed as below:<br>

<pre><code>
def Move(){
    LookAt(SmartPhone);
    Turn(Math.PI);
    int time=10;
    while(time>0){
        time--;
        LookAt(SmartPhone);
        Stretch();
    }
    LookAt(SmartPhone);
    Turn(Math.PI);
}</code></pre>
`;
            program.innerHTML = programText;

            break;



    }
}
