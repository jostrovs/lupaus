
const API_HAE_TUOMARIT = 1;
const API_HAE_RAPORTIT = 2;
const API_HAE_RIVIT = 3;
const API_HAE_AIHEET = 4;

class Referee {
      constructor(torneoReferee){
          this.id = torneoReferee.referee_id;
          this.name = torneoReferee.last_name + " " + torneoReferee.first_name;
          this.torneoReferee = torneoReferee;
          this.displayed = true;
          this.showWorkLoad = true;
          this.showDouble = true;
          this.href="https://lentopallo.torneopal.fi/taso/ottelulista.php?tuomari=" + torneoReferee.referee_id; 
    }  
}

class Tuomari {
    constructor(data_item){
        this.id = data_item.id;
        this.etunimi = data_item.etunimi;
        this.sukunimi = data_item.sukunimi;
    }
}

class Aihe {
    constructor(data_item){
        this.id = data_item.id;
        this.nimi = data_item.nimi;
        this.no = data_item.no;
    }
}

class Rivi {
    constructor(data_item){
        this.id = data_item.id;
        this.aihe_id = data_item.aihe_id;
        this.arvosana = data_item.arvosana;
        this.huom = data_item.huom;
        this.raportti_id = data_item.raportti_id;
    }
}

class Raportti {
    constructor(data_item){
        this.id = data_item.id;
        this.koti = data_item.koti;
        this.vieras = data_item.vieras;
        this.paikka = data_item.paikka;
        this.pvm = data_item.pvm;
        this.pt_id = data_item.pt_id;
        this.vt_id = data_item.vt_id;
        this.tark_id = data_item.tark_id;
    }
}

var getData = function(cmd, callback) {
    $.ajax({
        dataType: 'json',
        url: './../api/getData.php',
        data: {cmd:cmd}
    }).done(function(data){
        if(callback != undefined){
            callback(data);
        }
    });

}

$(document).ready(function () {
    var app = new Vue({
        el: '#app',
        data: {
            dummy: [1, 2, 3, 4, 5],
            tuomarit: [],
            aiheet: [],
            rivit: [],
            raportit: [],
        },
        
        created: function () {
            this.loadTuomarit();
            this.loadAiheet();
            this.loadRivit();
            this.loadRaportit();
        },
        computed: {
        },
        methods: {
            loadTuomarit: function(){
                let self=this;
                getData(API_HAE_TUOMARIT, function(data){
                    self.tuomarit = [];
                    for(let tuomari of data.data){
                        self.tuomarit.push(new Tuomari(tuomari));
                    }
                })
            },

            loadAiheet: function(){
                let self=this;
                getData(API_HAE_AIHEET, function(data){
                    self.aiheet = [];
                    for(let aihe of data.data){
                        self.aiheet.push(new Aihe(aihe));
                    }
                })
            },

            loadRaportit: function(){
                let self=this;
                getData(API_HAE_RAPORTIT, function(data){
                    self.raportit = [];
                    for(let raportti of data.data){
                        self.raportit.push(new Raportti(raportti));
                    }
                })
            },

            loadRivit: function(){
                let self=this;
                getData(API_HAE_RIVIT, function(data){
                    self.rivit = [];
                    for(let rivi of data.data){
                        self.rivit.push(new Rivi(rivi));
                    }
                })
            },
        }
    });
});
