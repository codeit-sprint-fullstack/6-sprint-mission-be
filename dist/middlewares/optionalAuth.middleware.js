import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.JWT_SECRET || "panda-secret";
// Express Request 타입이 이미 auth.middleware.ts에서 전역으로 확장되었으므로 여기서는 선언할 필요가 없습니다.
export function optionalVerifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            req.user = decoded;
        }
        catch (e) {
            // 토큰이 유효하지 않아도 에러를 발생시키지 않고 다음 미들웨어로 진행
        }
    }
    next();
}
