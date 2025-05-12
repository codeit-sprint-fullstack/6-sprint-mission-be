import jwt from 'jsonwebtoken';

// JWT 토큰을 검증하고 userId를 요청 객체에 추가하는 미들웨어
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; 

  if (!token) {
    return res.status(403).json({ message: '토큰이 없습니다.' });
  }

  jwt.verify(token, 'SECRET_KEY', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }
    req.userId = decoded.id;  
    next();  
  });
};

export default verifyToken;
