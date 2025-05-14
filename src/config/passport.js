import passport from "passport";
import googleStrategy from "../middlewares/passport/googleStrategy.js";
import kakaoStrategy from "../middlewares/passport/kakaoStrategy.js";

passport.use("google", googleStrategy);
passport.use("kakao", kakaoStrategy);
