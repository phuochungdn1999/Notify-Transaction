/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpException } from "@/exceptions/HttpException";
import FindBoxService from "@/services/external/box/find.service";
import FindDiscountCodeService from '@/services/external/discountCode/find.service';

export default class CheckDiscountCodeService {
  private findBoxService = new FindBoxService();
  private findDiscountCodeService = new FindDiscountCodeService();

  async checkDiscountCode(discountCode: string): Promise<any> {

    let discountCodeDetail: any;

    if (discountCode.toUpperCase() !== 'NULL') {
      discountCodeDetail = await this.findDiscountCodeService.findOne(discountCode);
    } else {
      throw new HttpException(
        400,
        `This discount code is invalid`,
        "INVALID_DISCOUNT_CODE"
      );
    }

    if (discountCodeDetail) {
      if (discountCodeDetail?.data.status === "COMMING" || discountCodeDetail?.data.status === "EXPIRED") {
        throw new HttpException(
          400,
          `This discount code is ${discountCodeDetail?.data.status.toLowerCase()}`,
          "INVALID_DISCOUNT_CODE"
        );
      }
    }

    return {
      ...discountCodeDetail,
    };
  }


}
