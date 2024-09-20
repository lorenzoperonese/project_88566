import crypto from "crypto"

const EXPIRATION_TIME = 7 * 24 * 60 * 60 * 10000

export interface Session {
  user_id: string,
  username: string,
  expiration: Date
};

export async function newAuthSession(user_id: string, username: string): Promise<string> {
  console.log("Creating new session for user: ", username)

  const uuid = crypto.randomUUID().toString();

  const now = new Date();
  const session: Session = {
    user_id: user_id,
    username: username,
    expiration: new Date(now.getTime() + EXPIRATION_TIME)
  }
  await useStorage().setItem<Session>(`session:${uuid}`, session)

  return uuid
}

export async function getAuthSession(id: string): Promise<Session | null> {
  return await useStorage().getItem<Session>(`session:${id}`);
}

export function isAuthSessionExpired(s: Session): boolean {
  return s.expiration.getTime() <= Date.now()
}
