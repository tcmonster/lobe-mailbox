import { cookies } from "next/headers";
import { MailLayout } from "@/components/mail-layout";
import { accounts, mails } from "@/app/data";

interface MailboxPageProps {
  params: {
    account: string;
    mailbox: string;
  };
}

export default async function MailboxPage({ params }: MailboxPageProps) {
  const cookieStore = await cookies();
  const layout = cookieStore.get("react-resizable-panels:layout:mail");
  const collapsed = cookieStore.get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

  return (
    <MailLayout
      accounts={accounts}
      mails={mails}
      navCollapsedSize={2}
      currentAccount={params.account}
      currentMailbox={params.mailbox}
      defaultLayout={defaultLayout}
      defaultCollapsed={defaultCollapsed}
    />
  );
}
