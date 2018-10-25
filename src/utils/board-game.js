var Cell = require("../model/cell");
var TitleCell = require("../model/title-cell");
var TaxCell = require("../model/tax-cell");

var startCell = new Cell("départ recevez 20000", 0);
var hillValleyCell = new TitleCell("gare de hill valley", 1);
var caisseCommunauteOne = new Cell("caisse de communauté", 2);
var wellsFargoCell = new TitleCell("wells fargo & co", 3);
var donHorloge = new TaxCell("faite un don pour sauver l'horloge", 4, 20000);
var palaisJustice1885Cell = new TitleCell("palais de justice 1885", 5);
var bureauMarshalCell = new TitleCell("bureau du marshal", 6);
var chanceOne = new Cell("chance", 7);
var marechalFerrantCell = new TitleCell("marechal-ferrant", 8);
var palaceSaloonCell = new TitleCell("palace saloon", 9);
var simpleVisiteCell = new Cell("simple visite", 10);
var roysCell = new TitleCell("roy's records", 11);
var plutoniumCell = new TitleCell("plutonium indistries", 12);
var cineEssexCell = new TitleCell("cinema essex", 13);
var texacoCell = new TitleCell("texaco", 14);
var palaisJustice1955Cell = new TitleCell("palais de justice 1955", 15);
var twinPinesCell = new TitleCell("twin pines ranch", 16);
var caisseCommunauteTwo = new Cell("caisse de communauté", 17);
var louCafeCell = new TitleCell("lou's cafe", 18);
var manoirBrownCell = new TitleCell("le manoir des brown", 19);
var overBoardFreeCell = new Cell("overboard gratuit", 20);
var toyotaCell = new TitleCell("statler toyota", 21);
var chanceTwo = new Cell("chance", 22);
var louAerobicCell = new TitleCell("lou's aerobic fitness center", 23);
var texacoRedCell = new TitleCell("texaco", 24);
var palaisJustice1985Cell = new TitleCell("palais de justice 1985", 25);
var hillValleySchoolCell = new TitleCell("hill valley high school", 26);
var twinPinesMallCell = new TitleCell("twin pines mall", 27);
var fusionCell = new TitleCell("fusion indistries", 28);
var lyonEstatesCell = new TitleCell("lyon estates", 29);
var prisonCell = new Cell("allez en retenue", 30);
var pizzaHutCell = new TitleCell("pizza hut", 31);
var holomaxCell = new TitleCell("holomax", 32);
var caisseCommunauteThree = new Cell("caisse de communauté", 33);
var hillDaleCell = new TitleCell("hill dale", 34);
var palaisJustice2015Cell = new TitleCell("palais de justice 2015", 35);
var chanceThree = new Cell("chance", 36);
var blastFromPastCell = new TitleCell("blast from the past", 37);
var bijouJen = new TaxCell("Une bague de fiancailles pour jennifer", 38, 10000);
var cafe80Cell = new TitleCell("cafe 80's", 39);

var boardGame = [
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
  plutoniumCell,
  cineEssexCell,
  texacoCell,
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
  cafe80Cell
];

module.exports = boardGame;
