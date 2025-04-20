import Image from "next/image";
import { getAllboards } from "@/api/board/board.api";
import { useEffect, useState } from "react";
export default function Board() {
  const [error, setError] = useState(null);
  const handleLoad = async () => {
    try {
      const result = await getAllboards();
      setBoards(Array.isArray(result) ? result : []);
    } catch (e) {
      console.error(e);
      setError("게시글을 불러오지 못함");
      setBoards([]);
    }
  };
  useEffect(() => {
    handleLoad();
  }, []);
  const [boards, setBoards] = useState([]);
  return (
    <div>
      <div className="w-full flex justify-center">
        <div className="w-[1200px] mb-[40px]">
          <p className="font-bold mb-[24px] text-[20px] leading-[100%] tracking-[0%] align-middle font-pretendard">
            베스트 게시글
          </p>
          <div className="flex gap-[20px] w-[384px] h-[169px]">
            {boards.map((board, i) => (
              <div
                key={i}
                className="w-[384px] h-[169px] rounded-[8px] pr-[24px] pl-[24px] bg-[#F9FAFB]"
              >
                <div className=" flex w-[102px] h-[30px] px-[24px] py-[2px] rounded-b-[16px] bg-[#3692FF] ">
                  <Image
                    src="/ic-medal.png"
                    width={54}
                    height={26}
                    alt="Medal Icon"
                  />
                </div>
                <div className="flex w-[336px] h-[72px] items-center">
                  <p className="w-[256px] h-[64px] tracking-[0px] leading-[32px] font-semibold text-[20px] text-gray-800 font-pretendard line-clamp-2">
                    {board.title}
                  </p>
                  <Image
                    src="/labtop.svg"
                    width={72}
                    height={72}
                    alt="랩탑 이미지"
                  />
                </div>
                <p className="font-pretendard font-normal text-[14px] leading-[24px] tracking-[0%] text-[#4B5563]">
                  총명한판다
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center">
        <div className="w-[1200px]">
          <div className="flex justify-between items-center h-[42px] mb-[24px]">
            <p className="font-bold text-[20px] leading-[100%] tracking-[0%] align-middle font-pretendard">
              게시글
            </p>
            <button className="bg-[#3692FF] text-white w-[88px] h-[42px] rounded-[8px] font-pretendard font-semibold text-[16px]">
              글쓰기
            </button>
          </div>
          <div className="flex justify-between items-center h-[42px] mb-[24px]">
            <div className="w-[1054px] h-[42px] flex items-center gap-[10px] rounded-[12px] px-[16px] py-[9px] bg-gray-100">
              <Image
                src="/ic-search.png"
                width={24}
                height={24}
                alt="검색 아이콘"
              />
              <input
                type="text"
                placeholder="검색할 상품을 입력해주세요"
                className="bg-transparent outline-none text-sm text-gray-800 flex-1"
              />
            </div>

            <p>최신순</p>
          </div>
          {boards.map((board, i) => (
            <div className="w-[1200px] h-[138px] bg-[#FCFCFC] mb-[24px] border-b border-gray-200">
              <div className="flex justify-between">
                <p className=" font-semibold text-[20px] font-pretendard">
                  {board.title}
                </p>
                <Image
                  src="/labtop.svg"
                  width={72}
                  height={72}
                  alt="랩탑 이미지"
                  className="mb-[16px]"
                />
              </div>
              <div className="flex justify-between items-center h-[26px]">
                <div className="flex items-center">
                  <Image
                    src="/profile.png"
                    width={24}
                    height={24}
                    className="mr-[8px]"
                  />
                  <p className="mr-[8px] font-pretendard font-normal text-sm leading-[24px] tracking-normal text-gray-600">
                    총명한 판다
                  </p>
                  <p className=" mr-[8px] font-pretendard font-normal text-sm leading-[24px] tracking-normal text-gray-400">
                    2024. 04. 16
                  </p>
                </div>
                <div className="flex items-center">
                  <Image
                    src="/heart.png"
                    width={24}
                    height={24}
                    className="mr-[8px]"
                  />
                  <p className="font-pretendard font-normal text-base leading-[26px] tracking-normal text-gray-500">
                    9999+
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
