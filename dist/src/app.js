"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./swagger"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const product_route_1 = __importDefault(require("./routes/product.route"));
const comment_route_1 = __importDefault(require("./routes/comment.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const article_route_1 = __importDefault(require("./routes/article.route"));
const image_route_1 = __importDefault(require("./routes/image.route")); // 이 라우터는 로컬 파일 처리였다면 S3 처리로 수정하거나 필요시 제거
const error_middleware_1 = require("./middlewares/error.middleware");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
// S3 업로드를 위해 추가된/변경된 임포트
const multer_1 = __importDefault(require("multer"));
const client_s3_1 = require("@aws-sdk/client-s3"); // AWS SDK v3의 S3Client
const multer_s3_1 = __importDefault(require("multer-s3"));
// import path from "path"; // 파일 이름 처리를 위해 필요 (사용하지 않으므로 주석 처리)
const app = (0, express_1.default)();
// --- S3 관련 설정 시작 ---
// AWS S3 객체 생성 (AWS SDK v3 방식)
// EC2 인스턴스에 S3 접근 권한을 가진 IAM Role이 연결되어 있다면,
// 여기에 accessKeyId와 secretAccessKey를 명시할 필요 없이
// AWS SDK가 자동으로 인스턴스 프로파일에서 자격 증명을 가져옵니다.
const s3 = new client_s3_1.S3Client({
    region: 'ap-northeast-2' // **TODO: S3 버킷이 위치한 실제 AWS 리전으로 변경하세요. (예: 'us-east-1')**
});
// S3 버킷 이름 설정
const S3_BUCKET_NAME = 'your-actual-s3-bucket-name'; // **TODO: 실제 S3 버킷 이름으로 변경하세요.**
// Multer-S3를 사용한 파일 업로드 설정
const upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3, // S3Client 객체 할당
        bucket: S3_BUCKET_NAME,
        acl: 'public-read', // **TODO: 필요에 따라 접근 권한 설정 (예: 'private', 'authenticated-read' 등)**
        // 웹에서 이미지 URL로 직접 접근하게 하려면 'public-read'가 필요합니다.
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE, // 파일의 MIME 타입 자동 감지
        metadata: function (_, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (_, file, cb) {
            // 파일을 'image/' 폴더 안에 저장하도록 경로 설정
            // 예: 'image/1719549304000-myimage.png'
            cb(null, `image/${Date.now().toString()}-${file.originalname}`);
        }
    })
});
// --- S3 관련 설정 끝 ---
// 기존 미들웨어 및 라우터 설정
app.use((0, morgan_1.default)("dev"));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// 로컬 파일 서빙은 S3로 직접 업로드하므로 더 이상 필요 없을 수 있습니다.
// app.use("/" + UPLOADS_DIR, express.static(UPLOADS_DIR)); // 주석 처리 또는 삭제 고려
app.use("/auth", auth_route_1.default);
app.use("/users", user_route_1.default);
app.use("/products", product_route_1.default);
app.use("/comments", comment_route_1.default);
app.use("/articles", article_route_1.default);
app.use("/images", image_route_1.default); // 이 라우터가 로컬 파일 처리에 의존하고 있었다면 수정 필요
// 이미지 업로드를 위한 POST 라우트
// S3에 직접 업로드하고, 업로드된 파일의 URL을 반환합니다.
app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        // 파일이 없을 경우 400 Bad Request 응답 후 함수 종료
        res.status(400).send({ message: "No image file uploaded." });
        return;
    }
    // multer-s3가 업로드 후 req.file에 S3 파일 정보를 추가합니다.
    // TypeScript 환경에서 req.file의 정확한 타입을 보장하기 위해 단언(assertion)을 사용합니다.
    const fileUrl = req.file.location;
    if (fileUrl) {
        // 업로드된 파일의 S3 URL을 200 OK 응답으로 반환 후 함수 종료
        res.status(200).send({ url: fileUrl });
        return;
    }
    else {
        // 알 수 없는 이유로 파일 URL을 얻지 못했을 경우 500 Internal Server Error 응답 후 함수 종료
        res.status(500).send({ message: "파일 업로드에 실패했습니다." });
        return;
    }
});
// Swagger API 문서 라우트
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
// 에러 처리 미들웨어
app.use(error_middleware_1.errorConverter);
app.use(error_middleware_1.errorHandler);
exports.default = app; // 앱 객체를 내보냅니다.
