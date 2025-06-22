import superstruct from 'superstruct';
import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../../exceptions/HttpException.js';
import { BadRequestException } from '../../exceptions/BadRequestException.js';
import { InternalServerErrorException } from '../../exceptions/InternalServerErrorException.js';

export function asyncErrorHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await handler(req, res, next);
    } catch (e) {
      const httpException = mapToHttpException(e);
      handleHttpException(httpException, res);
    }
  };
}

function handleHttpException(httpError: HttpException, res: Response) {
    res.status(httpError.status).send({
        name: httpError.name,
        message: httpError.message,
    });
}

/**
 * [에러로직 일관화를 위한, Exception 변환 메서드]
 *
 * 해당 메서드는 항상 HttpException 을 반환합니다.
 *
 * 동작:
 *   1. HttpException 이라면 그대로 반환합니다.
 *   2. Known Error 라면, 해당 에러에 맞는 HttpException 으로 변환합니다.
 *   3. Unknown Error 라면, InternalServerErrorException 으로 변환합니다.
 */
function mapToHttpException(e: unknown): HttpException {
      if (e instanceof HttpException) {
        return e;
      }

    // Known Error
    if (e instanceof superstruct.StructError) {
        return new BadRequestException('Validation Failed', e.message);
    }

    // 마지막까지 처리되지 않았다면, Unknown Error 입니다.
    // InternalServerErrorException 으로 변환합니다.
    return new InternalServerErrorException('Internal Server Error', (e as Error).message);
}
