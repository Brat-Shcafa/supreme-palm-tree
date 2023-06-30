import { response } from "express";
import Navigation from "./modules/navigation";
import Load from "./modules/script";

Navigation.init();
Load.loadMore();

async function getData(offset = 0, data =[]){
    let response = await fetch('http://192.168.0.118:3000/items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            offset: offset,
        })
    });

    let items = await response.json();

    if (items.length == 0){
        return data;
    };
    items.forEach(item => {
        data.push(item);
    });

    return getData(offset+2, data);
};

getData().then((items) => {
    console.log(items);
});