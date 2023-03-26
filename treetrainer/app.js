import {DecisionTree} from "./libraries/decisiontree.js"
import {VegaTree} from "./libraries/vegatree.js"

//
// DATA
//
const csvFile = "./data/mushrooms.csv"
const trainingLabel = "class"
const ignored = ["class", "bruises","gill-attachment","gill-spacing",
    "gill-size","gill-color","stalk-shape","stalk-root","stalk-surface-above-ring","stalk-surface-below-ring","stalk-color-above-ring",
    "stalk-color-below-ring","veil-type","veil-color","ring-number","ring-type","spore-print-color","population","habitat"]

//
// laad csv data als json
//
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => trainModel(results.data)   // gebruik deze data om te trainen
    })
}

//
// MACHINE LEARNING - Decision Tree
//
function trainModel(data) {
    // todo : splits data in traindata en testdata
    data.sort(() => (Math.random() - 0.5));
    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)

    // maak het algoritme aan
    let decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: data,
        categoryAttr: trainingLabel
    })

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let visual = new VegaTree('#view', 800, 400, decisionTree.toJSON())


    // todo : maak een prediction met een sample uit de testdata

    let yumMush = testData[12]

    let eatMush = decisionTree.predict(yumMush)

    if (eatMush === "e") {
        console.log(`You lived, there was no poison in the mushroom`)
    } else {
        console.log('You died, the mushroom was poisonous')
    }

    // todo : bereken de accuracy met behulp van alle test data

    let amountCorrect = 0;

    let ediblePoison = 0;
    let poisonEdible = 0;
    let poisonPoison = 0;
    let edibleEdible = 0;

    for (const row of data) {

        if (row.class === decisionTree.predict(row)) {

            amountCorrect++

        }
        if (row.class === "e" && decisionTree.predict(row) === "p") {

            ediblePoison++

        }
        if (row.class === "p" && decisionTree.predict(row) === "e") {

            poisonEdible++

        }
        if (row.class === "p" && decisionTree.predict(row) === "p") {

            poisonPoison++

        }
        if (row.class === "e" && decisionTree.predict(row) === "e") {

            edibleEdible++

        }
    }

    //Calculate accuracy

    let accuracy = amountCorrect / data.length
    console.log(accuracy)

    let element = document.getElementById("accuracy")
    element.innerText = `Accuracy: ${accuracy}`;

    // Confusion Matrix

    let goodMush = document.getElementById("edibleEdible")
    goodMush.innerHTML = edibleEdible.toString();

    let badMush = document.getElementById("poisonEdible")
    badMush.innerHTML = poisonEdible.toString();

    let goodPoison = document.getElementById("ediblePoison")
    goodPoison.innerHTML = ediblePoison.toString();

    let badPoison = document.getElementById("poisonPoison")
    badPoison.innerHTML = poisonPoison.toString();

    // Create model

    let jsonmodel = decisionTree.stringify()
    console.log(`JSON: ${jsonmodel}`)

}


loadData()
