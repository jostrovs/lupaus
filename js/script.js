var bus = new Vue({
    methods: {
        on: function(event, callback){
            this.$on(event, callback);
        },
        emit: function(event, payload){
            this.$emit(event, payload);
        }
    }
});

let cnt=0;
class Pelaaja {
    constructor(nimi){
        this.id = cnt++;
        this.nimi = nimi;
        this.pisteet = 0;
        
        this.jaljessa = 0;
        this.osumat=[];
    }
}

var ruutuPisteet = function(ruutu){
    if(ruutu.osui){
        if(ruutu.lupaus == 10) return 100;
        return ruutu.lupaus + 10;
    } else return 0;

};

class Ruutu {
    constructor(pelaaja, onkoJakaja, no){
        this.pelaaja = pelaaja;
        this.lupaus = 0;
        this.osui = false;
        this.pelattu = false;
        this.jakaja=onkoJakaja; 
        this.no = no;
    }
}

class Rivi { 
    constructor(kierros, pelaajat, jakomäärä, jakajaNo){
        this.jakomäärä=jakomäärä;
        this.kierros = kierros;
        this.pelattu=false;
        this.ruudut = [];
        let i=0;
        for(let pelaaja of pelaajat){
            this.ruudut.push(new Ruutu(pelaaja, jakajaNo == i++, i))
        }
    };

}


$(document).ready(function () {
    var app = new Vue({
        el: '#app',
        data: {
            pelaajat: [new Pelaaja("Pelaaja #1"),
                       new Pelaaja("Pelaaja #2"),
                       new Pelaaja("Pelaaja #3"),
                       new Pelaaja("Pelaaja #4"),
                       new Pelaaja("Pelaaja #5")],
            
            peliPelaajat: [],
            rivit: [],
            kierros: 1,

            options: {
                showTotal: true,
                showJaljessa: true,
            }
        },
        
        created: function () {
            bus.on("player_down", this.player_down);
            bus.on("player_up", this.player_up);
            bus.on("player_clear", this.player_clear);

        },

        mounted(){
            this.load();
        },
        computed: {
            toJSON(){
                let ret = {
                    pelaajat: []
                };
                this.pelaajat.map(p=> { ret.pelaajat.push(p) });
             
                localStorage.saveObjs= ret;
                return "d";
            }
        },
        methods: {
            player_clear(id){
                let index=0;
                for(;index<this.pelaajat.length;++index) if(this.pelaajat[index].id == id) break;
                
                this.pelaajat[index].nimi = "";
            },
            player_up(id){
                let index=0;
                for(;index<this.pelaajat.length;++index) if(this.pelaajat[index].id == id) break;
                
                if(index<1) return;

                let pelaaja = this.pelaajat[index];
                this.pelaajat.splice(index,1);

                this.pelaajat.splice(index-1, 0, pelaaja);
            },
            player_down(id){
                let index=0;
                for(;index<this.pelaajat.length;++index) if(this.pelaajat[index].id == id) break;
                
                if(index>= this.pelaajat.length-1) return;

                let pelaaja = this.pelaajat[index];
                this.pelaajat.splice(index,1);

                this.pelaajat.splice(index+1, 0, pelaaja);
            },

            luoUusi: function(){
                // $("#navbar").hide();
                // $("#etusivu").hide();
                // $("#sivu1").show();

                let kierros = 1;
                this.peliPelaajat = [];
                for(pelaaja of this.pelaajat){
                    if(pelaaja.nimi == undefined) pelaaja.nimi = "";
                    if(pelaaja.nimi.trim() != ""){
                        this.peliPelaajat.push(new Pelaaja(pelaaja.nimi));
                    }
                }

                let jakaja = this.peliPelaajat.length-1;

                this.rivit = [];
                for(let i=10;i>0;--i){
                    this.rivit.push(new Rivi(kierros++, this.peliPelaajat, i, jakaja++));
                    if(jakaja > this.peliPelaajat.length-1) jakaja=0;
                }
                for(let i=2;i<11;++i){
                    this.rivit.push(new Rivi(kierros++, this.peliPelaajat, i, jakaja++));
                    if(jakaja > this.peliPelaajat.length-1) jakaja=0;
                }

                this.kierros = 1;
                this.save();
                localStorage.save = false;
                this.vikatabi();
            },
            laskePisteet: function(){
                for(pelaaja of this.peliPelaajat){
                    pelaaja.pisteet=0;
                    pelaaja.osumat = [];
                    for(rivi of this.rivit){
                        for(ruutu of rivi.ruudut){
                            if(ruutu.pelaaja.nimi == pelaaja.nimi){
                                 pelaaja.pisteet += ruutuPisteet(ruutu);

                                 if(ruutu.osui) pelaaja.osumat.push(1);
                            }
                        }
                    }
                }

                // Haetaan maksimi
                let max=0;
                for(pelaaja of this.peliPelaajat){
                    if(pelaaja.pisteet > max) max = pelaaja.pisteet;
                }

                // Merkataan, paljonko on jäljessä                
                for(pelaaja of this.peliPelaajat){
                    if(pelaaja.pisteet == max) pelaaja.jaljessa = max;
                    else pelaaja.jaljessa = pelaaja.pisteet-max;
                }
            }, 
            edellinen: function(){
                if(this.kierros > 1) this.kierros--;
            },
            seuraava: function(){
                this.save();

                if(this.rivit[this.kierros-1].pelattu == false) return;
                if(this.kierros < 19) this.kierros++;
            },

            load(){
                if(localStorage.pelaajat) this.pelaajat = JSON.parse(localStorage.pelaajat);
                if(localStorage.peliPelaajat) this.peliPelaajat = JSON.parse(localStorage.peliPelaajat);
                if(localStorage.rivit) this.rivit = JSON.parse(localStorage.rivit);
                if(localStorage.kierros) this.kierros = JSON.parse(localStorage.kierros);

                if(localStorage.save){
                     this.vikatabi();

                     for(let i=0;i<20;++i) this.seuraava();

                     this.options = JSON.parse(localStorage.options);
                }
            },

            save(){
                localStorage.pelaajat = JSON.stringify(this.pelaajat);
                localStorage.peliPelaajat = JSON.stringify(this.peliPelaajat);
                localStorage.rivit = JSON.stringify(this.rivit);
                localStorage.kierros = JSON.stringify(this.kierros);
                
                localStorage.options = JSON.stringify(this.options);
                
                localStorage.save = true;
            },

            vikatabi(){
                $('#navbar a:last').tab('show');
            }

            
        }
    });
});



