let username = document.getElementById("username");
let master_password = document.getElementById("master-password");
let service = document.getElementById("service");
let uppercase = document.getElementById("option1").checked;
let lowercase = document.getElementById("option2").checked;
let numbers = document.getElementById("option3").checked;
let symbols = document.getElementById("option4").checked;
let pwlenght = document.getElementById("pwlenght");
let pwcounter = document.getElementById("pwcounter");
let entropy = "";
let dictionary = "";
let final_password = "";

async function generateEntropy() {
    let salt = String(username.value + service.value + String([uppercase, lowercase, numbers, symbols]) + Number(pwlenght.value).toString(16) + Number(pwcounter.value).toString(16));
    
    entropy = await hashwasm.argon2id({
        password: master_password.value,
        salt: salt,
        iterations: 1,
        parallelism: 1,
        memorySize: 47104,
        hashLength: 64,
    });
}

function generatePassword() {
    let upper_dic = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let lower_dic = "abcdefghijklmnopqrstuvwxyz";
    let num_dic = "0123456789";
    let sym_dic = "!@#$%&/()=?+-_.:,;*^_~<>[]{}|";

    if (uppercase) {
        dictionary += upper_dic
    }
    if (lowercase) {
        dictionary += lower_dic
    }
    if (numbers) {
        dictionary += num_dic
    }
    if (symbols) {
        dictionary += sym_dic
    }

    const rand = new Math.seedrandom(entropy)

    for (let i = 0; i < pwlenght.value; i++) {
        let index = Math.floor(rand() * dictionary.length);
        final_password += dictionary.charAt(index);
    }

    document.getElementById("finalpw").value = String(final_password);
    dictionary = "";
    final_password = "";
}

document.querySelector(".data").addEventListener("input", function() {
    username = document.getElementById("username");
    master_password = document.getElementById("master-password");
    service = document.getElementById("service");
    
    if ((username.value != "") && (master_password.value != "") && (service.value != "")) {
        generateEntropy().then(() => {
            generatePassword();
        });
    }
    else {
        document.getElementById("finalpw").value = "";
    }
})

document.querySelector(".checkboxes").addEventListener("input", function() {
    uppercase = document.getElementById("option1").checked;
    lowercase = document.getElementById("option2").checked;
    numbers = document.getElementById("option3").checked;
    symbols = document.getElementById("option4").checked;
    
    if ((uppercase === false) && (lowercase === false) && (numbers === false) && (symbols === false)) {
        document.getElementById("finalpw").value = "";
    }
    else {
        generateEntropy().then(() => {
            generatePassword();
        });
    }
})

document.querySelector(".number-counts").addEventListener("input", function() {
    pwlenght = document.getElementById("pwlenght");
    pwcounter = document.getElementById("pwcounter");

    generateEntropy().then(() => {
        generatePassword();
    });
})

function addLenght() {
    if (Number(pwlenght.value) < 99) {
        pwlenght.value = Number(pwlenght.value) + 1;
    }

    generateEntropy().then(() => {
        generatePassword();
    });
}

function subLenght() {
    if (Number(pwlenght.value) > 1) {
        pwlenght.value = Number(pwlenght.value) - 1;
    }

    generateEntropy().then(() => {
        generatePassword();
    });
}

function addCounter() {
    if (Number(pwcounter.value) < 99) {
        pwcounter.value = Number(pwcounter.value) + 1;
    }

    generateEntropy().then(() => {
        generatePassword();
    });
}

function subCounter() {
    if (Number(pwcounter.value) > 1) {
        pwcounter.value = Number(pwcounter.value) - 1;
    }

    generateEntropy().then(() => {
        generatePassword();
    });
}

function copyToClipboard() {
    let copiedPw = document.getElementById("finalpw").value;
    
    navigator.clipboard.writeText(copiedPw);

    alert("¡Contraseña copiada al portapapeles!")
}