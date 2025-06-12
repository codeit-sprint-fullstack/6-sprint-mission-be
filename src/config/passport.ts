import passport from "passport";
import googleStrategy from "../middlewares/passport/googleStrategy";
import kakaoStrategy from "../middlewares/passport/kakaoStrategy";

passport.use("google", googleStrategy);
passport.use("kakao", kakaoStrategy);
