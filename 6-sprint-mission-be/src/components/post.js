export default function Post() {
  return (
    <div>
      <div className="flex justify-between items-center h-[42px] mb-[24px]">
        <p className="mb-[37px] font-bold text-[20px] leading-[100%] tracking-[0%] align-middle font-pretendard">
          게시글
        </p>
        <button className="bg-[#9CA3AF] text-white w-[88px] h-[42px] rounded-[8px] font-pretendard font-semibold text-[16px]">
          등록
        </button>
      </div>
      ;
      <p className="mb-[12px] font-bold text-[20px] leading-[100%] tracking-[0%] align-middle font-pretendard">
        *제목
      </p>
      <input
        type="text"
        placeholder="제목을 입력해주세요"
        className="w-[1200px] h-[56px] bg-transparent outline-none text-sm text-gray-800 flex-1"
      />
      <p className="font-bold text-[20px] leading-[100%] tracking-[0%] align-middle font-pretendard">
        *내용
      </p>
      <input
        type="text"
        placeholder="내용을 입력해주세요"
        className="w-[1200px] h-[282px] bg-transparent outline-none text-sm text-gray-800 flex-1"
      />
    </div>
  );
}
