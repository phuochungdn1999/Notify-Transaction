export const getDiscountInfo = (box: any) => {
  if (box?.discounts?.length === 0) {
    return {};
  }
  const arrTimeExpires = box?.discounts?.map((el: any) => el.endTime);
  const timeNow = new Date().getTime();
  const timeExpires1 = new Date(
    arrTimeExpires ? arrTimeExpires[0] : ""
  ).getTime();
  const timeExpires2 = new Date(
    arrTimeExpires ? arrTimeExpires[1] : ""
  ).getTime();

  if (timeNow > timeExpires1 && timeNow > timeExpires2) return {};
  if (timeNow < timeExpires1 && timeNow < timeExpires2) {
    return {
      amount: (
        (box?.discounts ? box.discounts[0].discountPrice * 100 : 0) / box.price
      ).toString(),
      expiredAt: timeExpires1.toString(),
      baseNativePrice: box.price.toString(),
    };
  }
  return {
    amount: (
      (box?.discounts ? box.discounts[1].discountPrice * 100 : 0) / box.price
    ).toString(),
    expiredAt: timeExpires2.toString(),
    baseNativePrice: box?.price.toString(),
  };
};
