import { redirect } from "next/navigation";
import { accounts } from "./data";

export default async function HomePage() {
  // 获取第一个账户的邮箱用户名作为默认账户
  const defaultAccount = accounts[0].email.split("@")[0];
  // 重定向到默认账户的收件箱
  redirect(`/${defaultAccount}/inbox`);
}
