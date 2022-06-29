const Cell = require("../model/cell");
const TitleCell = require("../model/title-cell");
const TaxCell = require("../model/tax-cell");

const startCell = new Cell("départ recevez 20000", 0);
const hillValleyCell = new TitleCell("gare de hill valley", 1, 6000);
const caisseCommunauteOne = new Cell("caisse de communauté", 2);
const wellsFargoCell = new TitleCell("wells fargo & co", 3, 6000);
const donHorloge = new TaxCell("faite un don pour sauver l'horloge", 4, 20000);
const palaisJustice1885Cell = new TitleCell("palais de justice 1885", 5, 20000);
const bureauMarshalCell = new TitleCell("bureau du marshal", 6, 10000);
const chanceOne = new Cell("chance", 7);
const marechalFerrantCell = new TitleCell("marechal-ferrant", 8, 10000);
const palaceSaloonCell = new TitleCell("palace saloon", 9, 12000);
const simpleVisiteCell = new Cell("simple visite", 10);
const roysCell = new TitleCell("roy's records", 11, 14000);
const plutoniumCell = new TitleCell("plutonium industries", 13, 15000);
const cineEssexCell = new TitleCell("cinema essex", 14, 14000);
const texacoCell = new TitleCell("texaco", 12, 16000);
const palaisJustice1955Cell = new TitleCell(
  "palais de justice 1955",
  15,
  20000
);
const twinPinesCell = new TitleCell("twin pines ranch", 16, 18000);
const caisseCommunauteTwo = new Cell("caisse de communauté", 17);
const louCafeCell = new TitleCell("lou's cafe", 18, 18000);
const manoirBrownCell = new TitleCell("le manoir des brown", 19, 20000);
const overBoardFreeCell = new Cell("overboard gratuit", 20);
const toyotaCell = new TitleCell("statler toyota", 21, 22000);
const chanceTwo = new Cell("chance", 22);
const louAerobicCell = new TitleCell("lou's aerobic fitness center", 23, 22000);
const texacoRedCell = new TitleCell("texaco", 24, 24000);
const palaisJustice1985Cell = new TitleCell(
  "palais de justice 1985",
  25,
  20000
);
const hillValleySchoolCell = new TitleCell(
  "hill valley high school",
  26,
  26000
);
const twinPinesMallCell = new TitleCell("twin pines mall", 27, 26000);
const fusionCell = new TitleCell("fusion indistries", 28, 15000);
const lyonEstatesCell = new TitleCell("lyon estates", 29, 28000);
const prisonCell = new Cell("allez en retenue", 30);
const pizzaHutCell = new TitleCell("pizza hut", 31, 30000);
const holomaxCell = new TitleCell("holomax", 32, 30000);
const caisseCommunauteThree = new Cell("caisse de communauté", 33);
const hillDaleCell = new TitleCell("hilldale", 34, 32000);
const palaisJustice2015Cell = new TitleCell(
  "palais de justice 2015",
  35,
  20000
);
const chanceThree = new Cell("chance", 36);
const blastFromPastCell = new TitleCell("blast from the past", 37, 35000);
const bijouJen = new TaxCell(
  "Une bague de fiancailles pour jennifer",
  38,
  10000
);
const cafe80Cell = new TitleCell("cafe 80's", 39, 40000);

const boardGame = [
  startCell,
  hillValleyCell,
  caisseCommunauteOne,
  wellsFargoCell,
  donHorloge,
  palaisJustice1885Cell,
  bureauMarshalCell,
  chanceOne,
  marechalFerrantCell,
  palaceSaloonCell,
  simpleVisiteCell,
  roysCell,
  texacoCell,
  plutoniumCell,
  cineEssexCell,
  palaisJustice1955Cell,
  twinPinesCell,
  caisseCommunauteTwo,
  louCafeCell,
  manoirBrownCell,
  overBoardFreeCell,
  toyotaCell,
  chanceTwo,
  louAerobicCell,
  texacoRedCell,
  palaisJustice1985Cell,
  hillValleySchoolCell,
  twinPinesMallCell,
  fusionCell,
  lyonEstatesCell,
  prisonCell,
  pizzaHutCell,
  holomaxCell,
  caisseCommunauteThree,
  hillDaleCell,
  palaisJustice2015Cell,
  chanceThree,
  blastFromPastCell,
  bijouJen,
  cafe80Cell,
];

module.exports = boardGame;
