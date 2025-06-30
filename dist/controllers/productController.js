"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productService_1 = __importDefault(require("../services/productService"));
const auth_1 = __importDefault(require("../middlewares/auth"));
// import upload from "../middlewares/images";
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../types/errors");
const product_dto_1 = require("../dto/product.dto");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const client_s3_2 = require("@aws-sdk/client-s3"); //s3에 접근하기 위해 사용됨
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const productController = express_1.default.Router();
const productCommentController = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: 상품 및 상품 댓글 관련 API
 */
/**
 * @swagger
 * /products:
 *   post:
 *     summary: 상품 등록
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               tags:
 *                 type: string
 *                 example: ["태그1", "태그2"]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 상품 등록 성공
 */
/**
 * @swagger
 * /products:
 *   get:
 *     summary: 전체 상품 목록 조회
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 페이지 번호
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: 페이지당 항목 수
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [recent, favorite]
 *         description: 정렬 기준
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 상품 검색 키워드
 *     responses:
 *       200:
 *         description: 상품 목록 반환
 */
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: 상품 상세 조회
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 상품 정보 및 댓글 목록 반환
 *       404:
 *         description: 상품을 찾을 수 없음
 */
/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: 상품 수정
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: 수정된 상품 반환
 *       404:
 *         description: 상품을 찾을 수 없음
 */
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: 상품 삭제
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 삭제된 상품 정보 반환
 *       404:
 *         description: 상품을 찾을 수 없음
 */
/**
 * @swagger
 * /products/{id}/comments:
 *   post:
 *     summary: 상품에 댓글 등록
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 등록된 댓글 반환
 */
/**
 * @swagger
 * /products/{id}/comments:
 *   get:
 *     summary: 상품 댓글 조회
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 댓글 목록 반환
 */
// app.use("/uploads", express.static("uploads")); 이 코드는 express가 직접 이미지를 제공하겠다는 뜻
// 그래서 이제 s3가 이미지 응답을 대신해줄거라서 s3 클라이언트를 생성하는 코드를 만들어야 함
const s3 = new client_s3_2.S3Client({
    region: "ap-northeast-2",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
// const upload = multer({dest:"uploads/"}); destination에 업로드를 해주는 코드
//dest 대신에 storage라는 속성을 이용해서 업로드의 위치처리를 multer-s3가 해줌.
const upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        key: (req, file, cb) => {
            var _a;
            // ?access=private 인 경우 업로드 위치를 private/ 폴더로 지정(분기처리)
            const isPrivate = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.access) === "private";
            const folder = isPrivate ? "private/" : "public/";
            cb(null, `${folder}${Date.now()}_${file.originalname}`); //업로드되는 위치1
        },
    }),
});
// 상품 등록, 전체 상품 조회
productController
    .route("/")
    .post(auth_1.default.verifyAccessToken, upload.single("image"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const parsedTags = (() => {
            // const parsed = ProductBodySchema.safeParse(req.body);
            const tags = req.body.tags;
            if (Array.isArray(tags))
                return tags.flat();
            return typeof tags === "string" ? [tags] : [];
        })();
        const isPrivate = req.query.access === "private"; //private 요청이 온 경우로 t/f
        const { location, key } = req.file; //multer 미들웨어를 통해 생성된(d.ts에 타입명시함)
        const accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET_KEY);
        const parsed = product_dto_1.ProductBodySchema.safeParse(Object.assign(Object.assign({}, req.body), { price: Number(req.body.price), tags: parsedTags, 
            //imageUrl: `http://localhost:3000/uploads/${req.file?.filename}`, 이거 대신 multer-s3 사용
            imageUrl: location, authorId: decoded.userId }));
        if (!parsed.success)
            throw new errors_1.ValidationError("상품 데이터가 유효하지 않습니다.");
        const createProduct = yield productService_1.default.create(parsed.data);
        // private이면 presigned URL 생성
        let presignedUrl = null;
        if (isPrivate) {
            const command = new client_s3_1.GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: key,
            });
            presignedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 60 * 1 }); // 1분
        }
        res.json(Object.assign(Object.assign({}, createProduct), { presignedUrl }));
    }
    catch (error) {
        next(error);
    }
}))
    .get((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedQuery = product_dto_1.ProductQuerySchema.safeParse(req.query);
        if (!parsedQuery.success)
            throw new errors_1.ValidationError("유효한 형식으로 작성해주세요");
        const { page = 1, pageSize = 10, orderBy = "recent", keyword = "", } = parsedQuery.data;
        const take = pageSize;
        const skip = (page - 1) * take;
        const orderField = orderBy === "recent"
            ? "createdAt"
            : orderBy === "favorite"
                ? "favorite"
                : "createdAt";
        const validOrderOption = ["recent", "favorite"];
        if (!validOrderOption.includes(orderBy)) {
            res.status(400).json({ message: "잘못된  요청입니다." });
        }
        if (typeof keyword !== "string") {
            res.status(400).json({ message: "잘못된 요청입니다." });
            return;
        }
        const product = yield productService_1.default.getAll({
            order: orderField,
            skip,
            take,
            keyword,
        });
        if (!product)
            throw new errors_1.NotFoundError("해당 상품을 찾을 수 없습니다.");
        res.json(product);
    }
    catch (error) {
        next(error);
    }
}));
//상품 상세 조회
productController.get("/:id", auth_1.default.verifyAccessToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = Number(req.params.id);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const product = yield productService_1.default.getById(id, userId);
        if (!product)
            throw new errors_1.NotFoundError("제품을 찾을 수 없습니다.");
        const productCommets = yield productService_1.default.getAllProductComment(id);
        res.json({ product, productCommets });
    }
    catch (error) {
        next(error);
    }
}));
//상품 수정, 삭제하기
productController
    .route("/:id")
    .all(auth_1.default.verifyAccessToken)
    .patch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const parsedBody = product_dto_1.ProductUpdateSchema.safeParse(req.body);
    if (!parsedBody.success)
        throw new errors_1.ValidationError("유효한 형식이 아닙니다");
    const id = req.params.id;
    const accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET_KEY);
    try {
        const updatedProduct = yield productService_1.default.update(id, req.body);
        if (!updatedProduct)
            throw new errors_1.NotFoundError("업데이트할 수 없습니다.");
        res.json(updatedProduct);
    }
    catch (error) {
        next(error);
    }
}))
    .delete((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const deletedProduct = yield productService_1.default.deleteById(id);
    try {
        if (!deletedProduct) {
            throw new errors_1.NotFoundError("존재하지 않는 상품입니다.", 404);
        }
        res.json(deletedProduct);
    }
    catch (error) {
        next(error);
    }
}));
//상품에 댓글등록, 가져오기
productCommentController
    .route("/:id/comments")
    .post(auth_1.default.verifyAccessToken, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.auth)
        throw new errors_1.AuthenticationError("사용자가 아닙니다.");
    const { userId } = req.auth;
    const id = Number(req.params.id);
    try {
        const createdComment = yield productService_1.default.createProductComment(Object.assign(Object.assign({}, req.body), { productId: id, authorId: userId }));
        res.json(createdComment);
    }
    catch (error) {
        next(error);
    }
}))
    .get((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const productComments = yield productService_1.default.getAllProductComment(id);
        res.json(productComments);
    }
    catch (error) {
        next(error);
    }
}));
//중복 컨트롤러 병합
productController.use("/", productCommentController);
exports.default = productController;
//# sourceMappingURL=productController.js.map