var chanceCards = [
  { id: 1, name: "disque chez roy", actions: ["MOVE"], moveTo: 11 },
  {
    id: 2,
    name: "plein chez texaco",
    actions: ["MOVE"],
    moveTo: 24
  },
  {
    id: 3,
    name: "allez en retenue",
    actions: ["MOVE", "PAY"],
    amount: 500,
    moveTo: 10
  },
  {
    id: 4,
    name: "avancez case depart",
    actions: ["MOVE", "PAY"],
    amount: 20000,
    moveTo: 0
  },
  {
    id: 5,
    name: "allez a justice 1955",
    actions: ["MOVE"],
    moveTo: 15
  },
  {
    id: 6,
    name: "amende pour conduite etat ivresse",
    actions: ["PAY"],
    amount: 1500
  },
  { id: 7, name: "banque verse 5000", actions: ["RECEIVE"], amount: 5000 },
  { id: 8, name: "gain courses", actions: ["RECEIVE"], amount: 10000 },
  { id: 9, name: "rdv cafe 80", actions: ["MOVE"], moveTo: 39 },
  { id: 10, name: "reculez 3 cases", actions: ["MOVE"], moveTo: -3 },
  {
    id: 11,
    name: "amende skate voie publique",
    actions: ["PAY"],
    amount: 2000
  },
  { id: 12, name: "frais scolarité", actions: ["PAY"], amount: 15000 },
  { id: 13, name: "invess firmcop", actions: ["RECEIVE"], amount: 15000 }
];

module.exports = chanceCards;
