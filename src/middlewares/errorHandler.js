import superstruct from 'superstruct';
import { Prisma } from '@prisma/client';

export function errorHandler(handler) {
    return async function (req, res) {
        try {
            await handler(req, res);
        } catch (e) {
            handleException(e, res);
        }
    };
}

function handleException(e, res) {
    console.error('Error caught:', e);

    // 🟡 요청 validation 에러
    if (e instanceof superstruct.StructError) {
        return res.status(400).send({
            name: 'BadRequest',
            message: 'Validation failed: ' + e.message,
        });
    }

    // 🔴 Prisma에서 알려진 요청 에러 (예: unique constraint violation)
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(400).send({
            name: 'PrismaKnownRequestError',
            message: e.message,
        });
    }

    // 🔵 서비스에서 던진 not found 에러 (string message로 구분)
    if (e.message && e.message.includes('not found')) {
        return res.status(404).send({
            name: 'NotFound',
            message: e.message,
        });
    }

    // 🟠 Prisma 쿼리 실행 에러
    if (e instanceof Prisma.PrismaClientUnknownRequestError) {
        return res.status(500).send({
            name: 'PrismaUnknownRequestError',
            message: 'Database unknown error: ' + e.message,
        });
    }

    // 🟣 기타 에러
    res.status(500).send({
        name: 'InternalServerError',
        message: 'Internal server error: ' + e.message,
    });
}
