import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import userService from "../../services/userService";

const googleStrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL: "/auth/google/callback",
};

async function verify(
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback
): Promise<void> {
  const user = await userService.oauthUser(
    profile.provider,
    profile.id,
    profile.emails?.[0].value ?? "",
    profile.displayName
  );
  done(null, user); // req.user = user;
}

const googleStrategy = new GoogleStrategy(googleStrategyOptions, verify);

export default googleStrategy;
