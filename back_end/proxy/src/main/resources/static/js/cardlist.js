
const load_cards = async () => {
    const response = await fetch(fetchUrl);
    const cardList = await response.json(); //extract JSON from the http response
    let template = document.querySelector("#row");

    for(const card of cardList){
        let clone = document.importNode(template.content, true);

        newContent= clone.firstElementChild.innerHTML
                    .replace(/{{family_src}}/g, card.family_src)
                    .replace(/{{family_name}}/g, card.family_name)
                    .replace(/{{img_src}}/g, card.img_src)
                    .replace(/{{name}}/g, card.name)
                    .replace(/{{description}}/g, card.description)
                    .replace(/{{hp}}/g, card.hp)
                    .replace(/{{energy}}/g, card.energy)
                    .replace(/{{attack}}/g, card.attack)
                    .replace(/{{defense}}/g, card.defense)
                    .replace(/{{price}}/g, card.price)
                    .replace(/{{id_card}}/g, card.id)
                    .replace(/{{id}}/g, card.id);
        clone.firstElementChild.innerHTML= newContent;

        let cardContainer= document.querySelector("#tableContent");
        cardContainer.appendChild(clone);
    }
}

const fill_card = async (card_id) => {
    const response = await fetch('/card/get/'+card_id+'/'+authId);
    const card = await response.json(); //extract JSON from the http response
    let template = document.querySelector("#card");
 
 	 let clone = document.importNode(template.content, true);
     clone.firstElementChild.innerHTML
                    .replace(/{{family_src}}/g, card.family_src)
                    .replace(/{{family_name}}/g, card.family_name)
                    .replace(/{{img_src}}/g, card.img_src)
                    .replace(/{{name}}/g, card.name)
                    .replace(/{{description}}/g, card.description)
                    .replace(/{{hp}}/g, card.hp)
                    .replace(/{{energy}}/g, card.energy)
                    .replace(/{{attack}}/g, card.attack)
                    .replace(/{{defense}}/g, card.defense)
                    .replace(/{{price}}/g, card.price)
                    .replace(/{{id}}/g, card.id);
        
        let cardContainer= document.querySelector("#cardContent");
        cardContainer.appendChild(clone);
}


load_cards();






