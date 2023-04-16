import {DecisionTree} from "./libraries/decisiontree.js"

const eatbtn = document.querySelector("#consume");
eatbtn.addEventListener("click", () => loadSavedModel());

function loadSavedModel() {
    fetch("./model/model.json")
        .then((response) => response.json())
        .then((model) => modelLoaded(model))
}

function modelLoaded(model) {
    let decisionTree = new DecisionTree(model)

    let odor= document.getElementById('odor').value;
    let capColor= document.getElementById('cap-color').value;

    let mushroom = {odor: odor, capColor : capColor}
    let prediction = decisionTree.predict(mushroom)
    console.log("Predicted: " + prediction)

    if (prediction === "p") {
        let element = document.getElementById("mushroom")
        element.innerText = `You have consumed a poisonous mushroom`
    } else {
        let element = document.getElementById("mushroom")
        element.innerText = `You have consumed an edible mushroom`
    }

}