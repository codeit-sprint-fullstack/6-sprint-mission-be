import { StructError } from 'superstruct';
import { Prisma } from '@prisma/client';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export function errorHandler(handler: RequestHandler): RequestHandler {
    return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await handler(req, res, next);
        } catch (e: any) {
            handleException(e, res);
        }
    };
}

function handleException(e: any, res: Response): void {
    console.error('Error caught:', e);

    // 🟡 요청 validation 에러
    if (e instanceof StructError) {
        res.status(400).send({
            name: 'BadRequest',
            message: 'Validation failed: ' + e.message,
        });
        return;
    }

    // 🔴 Prisma Known 에러
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(400).send({
            name: 'PrismaKnownRequestError',
            message: e.message,
        });
        return;
    }

    // 🔵 not found 포함된 일반 메시지 에러
    if (e.message && typeof e.message === 'string' && e.message.includes('not found')) {
        res.status(404).send({
            name: 'NotFound',
            message: e.message,
        });
        return;
    }

    // 🟠 Prisma Unknown 에러
    if (e instanceof Prisma.PrismaClientUnknownRequestError) {
        res.status(500).send({
            name: 'PrismaUnknownRequestError',
            message: 'Database unknown error: ' + e.message,
        });
        return;
    }

    // 🟣 기타 에러
    res.status(500).send({
        name: 'InternalServerError',
        message: 'Internal server error: ' + (e?.message ?? 'Unknown error'),
    });
}
