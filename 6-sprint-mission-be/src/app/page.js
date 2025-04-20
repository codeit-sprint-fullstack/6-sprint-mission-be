"use client";

import Image from "next/image";
import Post from "@/components/post";
import Board from "@/components/board";

export default function Home() {
  return (
    <div>
      <div className="flex">
        <Image
          src="/pandaLogo.png"
          width={153}
          height={51}
          className="mt-[10px] mb-[9px] ml-[200px] mr-[32px]"
          alt="판다로고"
        />
        <Image src="/board.png" width={109} height={69} alt="자유게시판" />
        <Image src="/market.png" width={109} height={69} alt="중고마켓" />
      </div>
      <hr className="border-gray-100 mb-[24px]" />
      <Board />
      <Post />
    </div>
  );
}
