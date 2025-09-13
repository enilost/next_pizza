export const categories = [
  {
    name: "Пиццы",
  },
  {
    name: "Завтрак",
  },
  {
    name: "Закуски",
  },
  {
    name: "Коктейли",
  },
  {
    name: "Напитки",
  },
];
export const ingredients = [
  {
    name: "Сырный бортик",
    price: 179,
    imageUrl:
      // "https://cdn.dodostatic.net/static/Img/Ingredients/99f5cb91225b4875bd06a26d2e842106.png",
      "/ingredient/IngSirniiBortik.png",
  },
  {
    name: "Сливочная моцарелла",
    price: 79,
    imageUrl:
      // "https://cdn.dodostatic.net/static/Img/Ingredients/cdea869ef287426386ed634e6099a5ba.png",
      "/ingredient/IngSlivochnayaMotsarella.png",
  },
  {
    name: "Сыры чеддер и пармезан",
    price: 79,
    imageUrl:
      // "https://cdn.dodostatic.net/static/Img/Ingredients/000D3A22FA54A81411E9AFA69C1FE796",
      "/ingredient/IngSiriChedderIParmezan.png",
  },
  {
    name: "Острый перец халапеньо",
    price: 59,
    imageUrl:
      // "https://cdn.dodostatic.net/static/Img/Ingredients/11ee95b6bfdf98fb88a113db92d7b3df.png",
      "/ingredient/IngOstriiPeretsHalapeniu.png",
  },
  {
    name: "Нежный цыпленок",
    price: 79,
    imageUrl:
      // "https://cdn.dodostatic.net/static/Img/Ingredients/000D3A39D824A82E11E9AFA5B328D35A",
      "/ingredient/IngNezhniiTsiplenok.png",
  },
  {
    name: "Шампиньоны",
    price: 59,
    imageUrl:
      // "https://cdn.dodostatic.net/static/Img/Ingredients/000D3A22FA54A81411E9AFA67259A324",
      "/ingredient/IngShampinioni.png",
  },
  {
    name: "Бекон",
    price: 79,
    imageUrl:
      // "https://cdn.dodostatic.net/static/Img/Ingredients/000D3A39D824A82E11E9AFA637AAB68F",
      "/ingredient/IngBecon.png",
  },
  {
    name: "Ветчина",
    price: 79,
    imageUrl:
      // "https://cdn.dodostatic.net/static/Img/Ingredients/000D3A39D824A82E11E9AFA61B9A8D61",
      "/ingredient/IngVetchina.png",
  },
  {
    name: "Пикантная пепперони",
    price: 79,
    imageUrl:
      // "https://cdn.dodostatic.net/static/Img/Ingredients/000D3A22FA54A81411E9AFA6258199C3",
      "/ingredient/IngPikantnayaPepperoni.png",
  },
  {
    name: "Острая чоризо",
    price: 79,
    imageUrl:
      // "https://cdn.dodostatic.net/static/Img/Ingredients/000D3A22FA54A81411E9AFA62D5D6027",
      "/ingredient/IngOstrayaChorizo.png",
  },
  {
    name: "Маринованные огурчики",
    price: 59,
    imageUrl:
      // "https://cdn.dodostatic.net/static/Img/Ingredients/000D3A21DA51A81211E9EA89958D782B",
      "/ingredient/IngMarinovannieOgurchiki.png",
  },
  {
    name: "Свежие томаты",
    price: 59,
    imageUrl:
      // "https://cdn.dodostatic.net/static/Img/Ingredients/000D3A39D824A82E11E9AFA7AC1A1D67",
      "/ingredient/IngSvezhieTomati.png",
  },
  {
    name: "Красный лук",
    price: 59,
    imageUrl:
      // "https://cdn.dodostatic.net/static/Img/Ingredients/000D3A22FA54A81411E9AFA60AE6464C",
      "/ingredient/IngKrasniiLyk.png",
  },
  {
    name: "Сочные ананасы",
    price: 59,
    imageUrl:
      // "https://cdn.dodostatic.net/static/Img/Ingredients/000D3A21DA51A81211E9AFA6795BA2A0",
      "/ingredient/IngSochnieAnanasi.png",
  },
  {
    name: "Итальянские травы",
    price: 39,
    imageUrl:
      // "https://cdn.dodostatic.net/static/Img/Ingredients/370dac9ed21e4bffaf9bc2618d258734.png",
      "/ingredient/IngItalianskieTravi.png",
  },
  {
    name: "Сладкий перец",
    price: 59,
    imageUrl:
      // "https://cdn.dodostatic.net/static/Img/Ingredients/000D3A22FA54A81411E9AFA63F774C1B",
      "/ingredient/IngSladkiiPerets.png",
  },
  {
    name: "Кубики брынзы",
    price: 79,
    imageUrl:
      // "https://cdn.dodostatic.net/static/Img/Ingredients/000D3A39D824A82E11E9AFA6B0FFC349",
      "/ingredient/IngKybikiBrinzi.png",
  },
  {
    name: "Митболы",
    price: 79,
    imageUrl:
      // "https://cdn.dodostatic.net/static/Img/Ingredients/b2f3a5d5afe44516a93cfc0d2ee60088.png",
      "/ingredient/IngMeatboli.png",
  },
].map((ingridient, idx) => {
  return { ...ingridient, id: idx + 1 };
});
export const product = [
  {
    name: "Омлет с ветчиной и грибами",
    imageUrl:
      // "https://media.dodostatic.net/image/r:292x292/11EE7970321044479C1D1085457A36EB.webp",
      "/product/ProdOmletSVetchinoiIGribami.webp",
    categoryId: 2,
  },
  {
    name: "Омлет с пепперони",
    imageUrl:
      // "https://media.dodostatic.net/image/r:292x292/11EE94ECF33B0C46BA410DEC1B1DD6F8.webp",
      "/product/ProdOmletSPepperoni.webp",
    categoryId: 2,
  },
  {
    name: "Кофе Латте",
    imageUrl:
      // "https://media.dodostatic.net/image/r:292x292/11EE7D61B0C26A3F85D97A78FEEE00AD.webp",
      "/product/ProdKofeLatte.webp",
    categoryId: 2,
  },
  {
    name: "Дэнвич ветчина и сыр",
    imageUrl:
      // "https://media.dodostatic.net/image/r:292x292/11EE796FF0059B799A17F57A9E64C725.webp",
      "/product/ProdDenvichVetchinaISir.webp",
    categoryId: 3,
  },
  {
    name: "Куриные наггетсы",
    imageUrl:
      // "https://media.dodostatic.net/image/r:292x292/11EE7D618B5C7EC29350069AE9532C6E.webp",
      "/product/ProdKyrinnieNaggetsi.webp",
    categoryId: 3,
  },
  {
    name: "Картофель из печи с соусом 🌱",
    imageUrl:
      // "https://media.dodostatic.net/image/r:292x292/11EED646A9CD324C962C6BEA78124F19.webp",
      "/product/ProdKartofelIzPechiSSoysom.webp",
    categoryId: 3,
  },
  {
    name: "Додстер",
    imageUrl:
      // "https://media.dodostatic.net/image/r:292x292/11EE796F96D11392A2F6DD73599921B9.webp",
      "/product/ProdDodster.webp",
    categoryId: 3,
  },
  {
    name: "Острый Додстер 🌶️🌶️",
    imageUrl:
      // "https://media.dodostatic.net/image/r:292x292/11EE796FD3B594068F7A752DF8161D04.webp",
      "/product/ProdOstriiDodster.webp",
    categoryId: 3,
  },
  {
    name: "Банановый молочный коктейль",
    imageUrl:
      // "https://media.dodostatic.net/image/r:292x292/11EEE20B8772A72A9B60CFB20012C185.webp",
      "/product/ProdBananoviiMolochniiKokteil.webp",
    categoryId: 4,
  },
  {
    name: "Карамельное яблоко молочный коктейль",
    imageUrl:
      // "https://media.dodostatic.net/image/r:292x292/11EE79702E2A22E693D96133906FB1B8.webp",
      "/product/ProdKaramelnoeYablokoMolochniiKokteil.webp",
    categoryId: 4,
  },
  {
    name: "Молочный коктейль с печеньем Орео",
    imageUrl:
      // "https://media.dodostatic.net/image/r:292x292/11EE796FA1F50F8F8111A399E4C1A1E3.webp",
      "/product/ProdMolochniiKokteilSPecheniemOreo.webp",
    categoryId: 4,
  },
  {
    name: "Классический молочный коктейль 👶",
    imageUrl:
      // "https://media.dodostatic.net/image/r:292x292/11EE796F93FB126693F96CB1D3E403FB.webp",
      "/product/ProdKlassicheskiiMolochniiKokteil.webp",
    categoryId: 4,
  },
  {
    name: "Ирландский Капучино",
    imageUrl:
      // "https://media.dodostatic.net/image/r:292x292/11EE7D61999EBDA59C10E216430A6093.webp",
      "/product/ProdIrlandskiiKapuchino.webp",
    categoryId: 5,
  },
  {
    name: "Кофе Карамельный капучино",
    imageUrl:
      // "https://media.dodostatic.net/image/r:292x292/11EE7D61AED6B6D4BFDAD4E58D76CF56.webp",
      "/product/ProdKofeKaramelniiKapuchino.webp",
    categoryId: 5,
  },
  {
    name: "Кофе Кокосовый латте",
    imageUrl:
      // "https://media.dodostatic.net/image/r:292x292/11EE7D61B19FA07090EE88B0ED347F42.webp",
      "/product/ProdKofeKokosoviiLatte.webp",
    categoryId: 5,
  },
  {
    name: "Кофе Американо",
    imageUrl:
      // "https://media.dodostatic.net/image/r:292x292/11EE7D61B044583596548A59078BBD33.webp",
      "/product/ProdKofeAmerikano.webp",
    categoryId: 5,
  },
  {
    name: "Кофе Латте",
    imageUrl:
      // "https://media.dodostatic.net/image/r:292x292/11EE7D61B0C26A3F85D97A78FEEE00AD.webp",
      "/product/ProdKofeLatte.webp",
    categoryId: 5,
  },
];

export const stories = [
  {
    imgUrl:
      // "https://cdn.inappstory.ru/story/xep/xzh/zmc/cr4gcw0aselwvf628pbmj3j/custom_cover/logo-350x440.webp?k=IgAAAAAAAAAE&v=3101815496",
      "/story/Stor1-350x440.webp",
  },
  {
    imgUrl:
      // "https://cdn.inappstory.ru/story/km2/9gf/jrn/sb7ls1yj9fe5bwvuwgym73e/custom_cover/logo-350x440.webp?k=IgAAAAAAAAAE&v=3074015640",
      "/story/Stor2-350x440.webp",
  },
  {
    imgUrl:
      // "https://cdn.inappstory.ru/story/quw/acz/zf5/zu37vankpngyccqvgzbohj1/custom_cover/logo-350x440.webp?k=IgAAAAAAAAAE&v=1336215020",
      "/story/Stor3-350x440.webp",
  },
  {
    imgUrl:
      // "https://cdn.inappstory.ru/story/7oc/5nf/ipn/oznceu2ywv82tdlnpwriyrq/custom_cover/logo-350x440.webp?k=IgAAAAAAAAAE&v=38903958",
      "/story/Stor4-350x440.webp",
  },
  {
    imgUrl:
      // "https://cdn.inappstory.ru/story/q0t/flg/0ph/xt67uw7kgqe9bag7spwkkyw/custom_cover/logo-350x440.webp?k=IgAAAAAAAAAE&v=2941222737",
      "/story/Stor5-350x440.webp",
  },
  {
    imgUrl:
      // "https://cdn.inappstory.ru/story/lza/rsp/2gc/xrar8zdspl4saq4uajmso38/custom_cover/logo-350x440.webp?k=IgAAAAAAAAAE&v=4207486284",
      "/story/Stor6-350x440.webp",
  },
];

const storyItem = [
  {
    storyId: 1,
    imgUrl:
      // "https://cdn.inappstory.ru/file/dd/yj/sx/oqx9feuljibke3mknab7ilb35t.webp?k=IgAAAAAAAAAE",
      "/story/StorItem1.webp",
  },
  {
    storyId: 1,
    imgUrl:
      // "https://cdn.inappstory.ru/file/jv/sb/fh/io7c5zarojdm7eus0trn7czdet.webp?k=IgAAAAAAAAAE",
      "/story/StorItem2.webp",
  },
  {
    storyId: 1,
    imgUrl:
      // "https://cdn.inappstory.ru/file/ts/p9/vq/zktyxdxnjqbzufonxd8ffk44cb.webp?k=IgAAAAAAAAAE",
      "/story/StorItem3.webp",
  },
  {
    storyId: 1,
    imgUrl:
      // "https://cdn.inappstory.ru/file/ur/uq/le/9ufzwtpdjeekidqq04alfnxvu2.webp?k=IgAAAAAAAAAE",
      "/story/StorItem4.webp",
  },
  {
    storyId: 1,
    imgUrl:
      // "https://cdn.inappstory.ru/file/sy/vl/c7/uyqzmdojadcbw7o0a35ojxlcul.webp?k=IgAAAAAAAAAE",
      "/story/StorItem5.webp",
  },
];
export const storyItems = stories
  .map((s, i) => {
    return storyItem.map((item) => ({ ...item, storyId: i + 1 }));
  })
  .flat(Infinity) as typeof storyItem;
