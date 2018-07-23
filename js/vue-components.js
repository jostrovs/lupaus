Vue.component('vue-pelaaja',{
    template: `
            <div style="margin-top: 20px;">
                <input type="text" v-model="pelaaja.nimi">
                <button class="btn btn-sm" @click="clear"><img src="clear.png" width=20></button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <button class="btn btn-sm" @click="up"><img src="up.png" width=20></button>
                <button class="btn btn-sm" @click="down"><img src="down.png" width=20></button>
            </div>
    `,
    props: ['pelaaja'],
    data: function () {
        return {
            randomId: this._uid,
            initialPelaaja: this.pelaaja,
        }
    },
    methods: {
        up(){
            bus.emit("player_up", this.pelaaja.id);
        },
        down(){
            bus.emit("player_down", this.pelaaja.id);
        },
        clear(){
            bus.emit("player_clear", this.pelaaja.id);
        }
    }
    
});

Vue.component('vue-ruutu',{
    template: `
        <div style="width: 99%;">
            
            <div  :id="id" class="ruutu" v-bind:style="styleObject">    
            
                <div style="display: inline-block;">

                    {{ruutu.pelaaja.nimi}} <div v-for="osuma in ruutu.pelaaja.osumat" style="display: inline-block; height: 6px; width: 6px; background-color: yellow; border: 1px solid red"> </div><br>
                    <div v-if="ruutu.pelattu">
                        <span v-if="ruutu.osui">{{pinnat(ruutu)}}</span>
                        <span v-if="!ruutu.osui">##</span>
                    </div>
                    <div v-if="!ruutu.pelattu" style="font-size: 20px;">
                        <input style="margin: 10px; margin-right: 30px;" type="checkbox" v-model="ruutu.osui">
                        <template v-if="ruutu.osui">{{pinnat(ruutu)}}</template>
                        <template v-if="!ruutu.osui">{{ruutu.lupaus}}</template>
                        <button v-if="!ruutu.osui" class="btn btn-lg" @click="minus" style="margin-left: 30px;" >-</button>
                        <button v-if="!ruutu.osui" class="btn btn-lg" @click="plus">+</button>
                    </div>
                </div>

                <div v-if="opts.showTotal" style="font-size: 20px; margin-top: 20px; text-align: center; display: inline-block; float: right; background: yellow; color: black; border-radius: 4px; padding: 2px; border: 1px solid brown; min-width: 60px;">
                    <span style="font-size: 10px; vertical-align: absmiddle;">Yht:</span>
                    {{ruutu.pelaaja.pisteet}}
                </div>
                <div v-if="opts.showJaljessa && ruutu.pelaaja.jaljessa >= 0" style="font-size: 20px; margin-top: 20px; text-align: center; display: inline-block; float: right; background: greenyellow; color: black; border-radius: 4px; padding: 2px; border: 1px solid brown; min-width: 60px;">
                    {{ruutu.pelaaja.jaljessa}}
                </div>
                <div v-if="opts.showJaljessa && ruutu.pelaaja.jaljessa < 0" style="font-size: 20px; margin-top: 20px; text-align: center; display: inline-block; float: right; background: pink; color: black; border-radius: 4px; padding: 2px; border: 1px solid brown; min-width: 60px;">
                    {{ruutu.pelaaja.jaljessa}}
                </div>
            </div>
            <div v-if="ruutu.jakaja" style="display: inline-block; width: 10px; background: white; margin-top: 15px; height: 50px; border-radius: 4px">&nbsp;</div>
        </div>
    `,
    props: ['ruutu', 'rivi', 'options'],
    data: function () {
        return {
            opts: this.options,
            randomId: this._uid,
            initialRuutu: this.ruutu,
            id: "ruutu" + this.ruutu.no,
        }
    },
    computed: {
        styleObject: function(){
            if(this.ruutu.jakaja){
                return {
                    // 'border-width': '10px'
                };
            }

            return{
                // 'margin-left': '8px'
            }
        }
    },
    methods: {
        minus: function(){
            if(this.ruutu.lupaus > 0) this.ruutu.lupaus--;
        },
        plus: function(){
            if(this.ruutu.lupaus < this.rivi.jakomäärä) this.ruutu.lupaus++;
        },
        pinnat: function(ruutu){
            return ruutuPisteet(ruutu);
        }
    }
});


Vue.component('vue-rivi',{
    template: `
        <div v-if="kierros==rivi.kierros">
            <div>
                <div style="display: inline-block; margin-top: 10px; font-size: 18px">
                    Jaetaan: <span style="font-weight: bold; color: yellow; font-size: 22px;">{{rivi.jakomäärä}}</span> korttia
                </div>            
                <div style="display: inline-block; float: right;">
                    Kierros pelattu
                    <input style="margin: 15px;" @change="riviTsekattu()" type="checkbox" v-model="rivi.pelattu">
                </div>            
            </div>
            <div>
                <div v-for="ruutu of rivi.ruudut">
                    <vue-ruutu :ruutu="ruutu" :rivi="rivi" :options="opts"></vue-ruutu>
                </div>
            </div>

            <div style="background: red; border: 2px solid pink; color: white; font-size: 20px; padding: 12px; margin-top: 20px;" v-if="!summaKunnossa">Lupausten summa ei kelpaa!</div>
            
            <div style="background: orange; border: 2px solid brown; color: white; font-size: 20px; padding: 12px; margin-top: 20px;" v-if="eiSaaLuvata >= 0">Ei saa luvata: {{eiSaaLuvata}}</div>
            <div style="background: green; border: 2px solid white; color: white; font-size: 20px; padding: 12px; margin-top: 20px;" v-if="eiSaaLuvata < 0">Saa luvata mitä vain</div>


        </div>
    `,
    props: ['rivi', 'kierros', 'options'],
    data: function () {
        return {
            opts: this.options,
            randomId: this._uid,
            initialRuutu: this.ruutu,
        }
    },
    methods: {
        riviTsekattu: function(){
            for(ruutu of this.rivi.ruudut) ruutu.pelattu = this.rivi.pelattu;
            this.$emit('rivi_tsek', event.target.value);
        },

    },
    computed: {
        
        summaKunnossa: function(){
            let sum = 0;
            for(let ruutu of this.rivi.ruudut){
                sum += ruutu.lupaus;
            }
            return sum != this.rivi.jakomäärä;
        },

        eiSaaLuvata: function(){
            let sum = 0;
            for(let ruutu of this.rivi.ruudut){
                if(ruutu.jakaja) continue;
                sum += ruutu.lupaus;
            }

            if(sum > this.rivi.jakomäärä) return -1;
            return this.rivi.jakomäärä-sum;
        }

    }

});

