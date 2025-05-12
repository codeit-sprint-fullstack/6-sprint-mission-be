import * as commentRepository from '../repositories/commentRepository.js';
import { HttpError } from '../middlewares/HttpError.js';

// 게시글 댓글 생성
export async function createArticleComment(userId, articleId, content) {
    if (!content || typeof content !== 'string') {
        throw new HttpError(400, '댓글 내용을 입력해주세요');
    }
    return await commentRepository.Create({
        content,
        userId,
        articleId,
        tableId: articleId,
        type: 'article',
    });
}

// 상품 댓글 생성
export async function createProductComment(userId, productId, content) {
    if (!content || typeof content !== 'string') {
        throw new HttpError(400, '댓글 내용을 입력해주세요');
    }
    return await commentRepository.Create({
        content,
        userId,
        productId,
        tableId: productId,
        type: 'product',
    });
}

// 게시글 댓글 수정
export async function updateArticleComment(commentId, userId, content) {
    const existing = await commentRepository.getById(commentId); // ✅ 수정
    if (existing.userId !== userId) {
        throw new HttpError(403, '댓글 수정 권한이 없습니다');
    }
    return await commentRepository.Update(commentId, { content });
}

// 상품 댓글 수정
export async function updateProductComment(commentId, userId, content) {
    const existing = await commentRepository.getById(commentId); // ✅ 수정
    if (existing.userId !== userId) {
        throw new HttpError(403, '댓글 수정 권한이 없습니다');
    }
    return await commentRepository.Update(commentId, { content });
}

// 게시글 댓글 삭제
export async function deleteArticleComment(commentId, userId) {
    const existing = await commentRepository.getById(commentId);
    if (existing.userId !== userId) {
        throw new HttpError(403, '댓글 삭제 권한이 없습니다');
    }
    await commentRepository.Delete(commentId);
}

// 상품 댓글 삭제
export async function deleteProductComment(commentId, userId) {
    const existing = await commentRepository.getById(commentId); // ✅ 여기 반드시 수정 필요
    if (existing.userId !== userId) {
        throw new HttpError(403, '댓글 삭제 권한이 없습니다');
    }
    await commentRepository.Delete(commentId);
}

// 게시글 댓글 목록 조회
export async function getArticleComments(tableId, { cursor, limit }) {
    return await commentRepository.fetchComments({
        type: 'article',
        tableId,
        cursor,
        limit,
    });
}

// 상품 댓글 목록 조회
export async function getProductComments(tableId, { cursor, limit }) {
    return await commentRepository.fetchComments({
        type: 'product',
        tableId,
        cursor,
        limit,
    });
}
