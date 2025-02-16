import { notFound, redirect } from "next/navigation";

interface AccountPageProps {
  params: {
    account: string;
  };
}

// 验证账号是否存在的函数
const isValidAccount = async (account: string) => {
  try {
    // TODO: 这里需要根据实际情况实现账号验证逻辑
    // 例如：检查数据库中是否存在该账号
    // 返回 true 表示账号存在，false 表示账号不存在
    return true;
  } catch (error) {
    return false;
  }
};

export default async function AccountPage({ params }: AccountPageProps) {
  const accountExists = await isValidAccount(params.account);

  if (!accountExists) {
    notFound(); // 如果账号不存在，跳转到 404 页面
  }
  // 重定向到该账户的收件箱
  redirect(`/${params.account}/inbox`);
}
