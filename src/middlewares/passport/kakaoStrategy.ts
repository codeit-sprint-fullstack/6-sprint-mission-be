import { Strategy as KakaoStrategy, Profile } from "passport-kakao";
import userService from "../../services/userService";

const kakaoStrategyOptions = {
  clientID: process.env.KAKAO_CLIENT_ID as string,
  clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
  callbackURL: "/auth/kakao/callback",
};

async function verify(
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: (error: any, user?: any) => void
) {
  const user = await userService.oauthUser(
    profile.provider,
    profile.id.toString(),
    profile._json.kakao_account.email,
    profile.displayName || profile._json.properties.nickname
  );
  done(null, user); // req.user = user;
}

const kakaoStrategy = new KakaoStrategy(kakaoStrategyOptions, verify);

export default kakaoStrategy;
