import { redirect } from "next/navigation"

interface AccountPageProps {
  params: {
    account: string
  }
}

export default function AccountPage({ params }: AccountPageProps) {
  // 重定向到该账户的收件箱
  redirect(`/${params.account}/inbox`)
}
