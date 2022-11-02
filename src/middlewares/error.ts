import { HttpException } from '@/exceptions/HttpException';
// import DiscordService from '@/services/common/discord.service';
import { logger } from '@/utils/logger';
import { NextFunction, Request, Response } from 'express';

// const discordService: DiscordService | null = DiscordService.getInstance();
const errorMiddleware = async (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong. Please try again!';
    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);

    res.status(status).json({
      error: {
        message,
        code: error.code,
        data: error.data
      }
    });
  } catch (err) {
    next(err);
  }
};

export default errorMiddleware;
