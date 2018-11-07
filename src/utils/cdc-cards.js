var caisseCommunauteCards = [
  { id: 1, name: "gain casino", actions: ["RECEIVE"], amount: 10000 },
  {
    id: 2,
    name: "oncle joey prison",
    actions: ["PAY"],
    amount: 5000
  },
  {
    id: 3,
    name: "groupe de rock",
    actions: ["RECEIVE"],
    amount: 1000
  },
  // { id: 4, name: "fiancailles", actions: ["RECEIVE_P"] },
  {
    id: 5,
    name: "Erreur de la banque",
    actions: ["RECEIVE"],
    amount: 20000
  },
  {
    id: 6,
    name: "feerie dansante",
    actions: ["RECEIVE"],
    amount: 2000
  },
  { id: 7, name: "sortie disque", actions: ["RECEIVE"], amount: 10000 },
  { id: 8, name: "arrestation bufford", actions: ["RECEIVE"], amount: 5000 },
  {
    id: 9,
    name: "case depart",
    actions: ["MOVE"],
    moveTo: 0
  },
  { id: 10, name: "aeroglisseur", actions: ["PAY"], amount: 10000 },
  {
    id: 11,
    name: "actions texaco rapportent",
    actions: ["RECEIVE"],
    amount: 2500
  },
  { id: 12, name: "retour gare hill valley", actions: ["MOVE"], moveTo: 1 },
  { id: 13, name: "cure jeunesse", actions: ["PAY"], amount: 5000 },
  // { id: 14, name: "libere prison", actions: ["KEEP"] },
  {
    id: 14,
    name: "aller en prison",
    actions: ["MOVE", "PAY"],
    amount: 500,
    moveTo: 10
  }
  // { id: 15, name: "biff", actions: ["CHANCE"], amount: 1000 }
];

module.exports = caisseCommunauteCards;
