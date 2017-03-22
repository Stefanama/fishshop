
//import fish array from a different module
import {fishCollection} from './allFish';


    //Fish interface
    interface IFish {
        species: string;
    }

    //implement Fish class following the IFish interface
    class Fish implements IFish{
        species: string;
        fishElm=document.createElement('div');
        
        constructor(public fishSpecies, public onClick){
            this.species=fishSpecies;
            var img = document.createElement('img');
            var fishName = document.createElement('span');
            img.src='img/fish-icon.png';
            fishName.innerHTML=fishSpecies;
            
            this.fishElm.className='fish';
            this.fishElm.appendChild(img)
            this.fishElm.appendChild(fishName)
            this.fishElm.onclick=onClick;
            
            
            
        };
        //getter for the fish species
        getSpecies(){
            return this.species;
        };
        
        //add itself to the specified container
        addFishToAquarium(container){
            container.appendChild(this.fishElm);
        };
        
       
    }


    //define an aquarium class
    class Aquarium {
        fishArray: Array<string>;
        cartAquariumElm: HTMLElement;
        constructor(){
            this.fishArray=[]
            this.cartAquariumElm=document.getElementById('fish-cart-aquarium');
        };
        
        //verify if the fish is valid add and request the server if the fish can live together
        //if they can then nothing happens, if they cannot the cart aquarium becomes red and the Buy button gets disabled
        addFish(fish){
            if(fish!=''){

            if(this.fishArray.indexOf(fish)==-1){
                this.fishArray.push(fish)
                var canLiveReq = canLiveTogether(this.fishArray);
                var fishCanLiveTogether;
                var buyButton = <HTMLInputElement> document.getElementById('buy-button');
                canLiveReq.onload = function() {
                    if (canLiveReq.status === 200) {
                        fishCanLiveTogether=JSON.parse(canLiveReq.response).canLiveTogether;
                        
                        if(fishCanLiveTogether){
                            buyButton.disabled=false;
                             document.getElementById('fish-cart-aquarium').className='';
                        }else{
                            buyButton.disabled=true;
                            document.getElementById('fish-cart-aquarium').className='invalid';
                        }
                    }
                    else if (canLiveReq.status !== 200) {
                        document.getElementById('fish-cart-aquarium').className='invalid'
                        buyButton.disabled=true;
                        alert(JSON.parse(canLiveReq.response).errorMessage);
                    }
            };
                this.render();
            }else{
                alert('Fish already added!')
            }
            }
        }
        //remove a fish if it exists
        removeFish(fish){
            var idx=this.fishArray.indexOf(fish);
            if(idx!=-1){
                this.fishArray.splice(idx, 1);
                var canLiveReq = canLiveTogether(this.fishArray);
                var fishCanLiveTogether;
                var buyButton = <HTMLInputElement> document.getElementById('buy-button');
                canLiveReq.onload = function() {
                    if (canLiveReq.status === 200) {
                        fishCanLiveTogether=JSON.parse(canLiveReq.response).canLiveTogether;
                        
                        if(fishCanLiveTogether){
                            buyButton.disabled=false;
                             document.getElementById('fish-cart-aquarium').className='';
                        }else{
                            buyButton.disabled=true;
                            document.getElementById('fish-cart-aquarium').className='invalid';
                        }
                    }
                    else if (canLiveReq.status !== 200) {
                        buyButton.disabled=true;
                        alert(JSON.parse(canLiveReq.response).errorMessage);
                    }
            };
                this.render();
            }else{
                alert('Fish not in cart!')
            }
        }
        
        
        //render the fish in the aquarium
        render(){
            
            this.cartAquariumElm.innerHTML='';
            
            for(let fishItem of this.fishArray){
                var fish = new Fish(fishItem, removeFishFromAquariumCart);
                fish.addFishToAquarium(this.cartAquariumElm);
            }
        }
    }

    //define a cartAquarium object
    var cartAquarium=new Aquarium();
    //the store tank container
    var cont=document.getElementById('fish-store-aquarium');
    
    //onclick function assigned to each fish inserted in the aquarium cart
    var addFishToAquariumCart=function(ev){
        cartAquarium.addFish(ev.target.textContent);
    }
    var removeFishFromAquariumCart=function(ev){
        cartAquarium.removeFish(ev.target.textContent);
    }

    //test if the fish can live together, returns the xhr request object
    var canLiveTogether=function(fishArray){
        //define new XMLHTTP Request
        var xhr = new XMLHttpRequest();

        xhr.open('POST', 'https://fishshop.attest.tech/compatibility');
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        //Send request
        xhr.send(JSON.stringify({fish:fishArray})); 
        
        //Return the request object so that the calling function can decide what to do on response
        return xhr;
    }

    //insert fish into the store tank
    for(let fishItem of fishCollection){
        var fish = new Fish(fishItem, addFishToAquariumCart);
        fish.addFishToAquarium(cont);
    }

    

    