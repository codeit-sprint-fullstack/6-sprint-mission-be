import { Strategy as KakaoStrategy } from "passport-kakao";
import userService from "../../services/userService.js";

const kakaoStrategyOptions = {
  clientID: process.env.KAKAO_CLIENT_ID,
  clientSecret: process.env.KAKAO_CLIENT_SECRET,
  callbackURL: "/auth/kakao/callback",
};

async function verify(accessToken, refreshToken, profile, done) {
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
