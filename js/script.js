
class Pelaaja {
    constructor(nimi){
        this.nimi = nimi;
        this.pisteet = 0;
    }
}

class Ruutu {
    constructor(pelaaja){
        this.nimi = pelaaja.nimi;
        this.lupaus = 0;
        this.osui = false;
        this.pelattu = 0;
    }
}

class Rivi { 
    constructor(pelaajat, jakomäärä){
        this.jakomäärä=jakomäärä;
        this.ruudut = [];
        for(let pelaaja of pelaajat){
            this.rivit.push(new Ruutu(pelaaja))
        }

    }
}


$(document).ready(function () {
    var app = new Vue({
        el: '#app',
        data: {
            pelaajat: [new Pelaaja("Pelaaja #1"),
                       new Pelaaja("Pelaaja #2"),
                       new Pelaaja("Pelaaja #2"),
                       new Pelaaja("Pelaaja #2"),
                       new Pelaaja("Pelaaja #2")],
        },
        
        created: function () {
        },
        computed: {
        },
        methods: {
        }
    });
});



