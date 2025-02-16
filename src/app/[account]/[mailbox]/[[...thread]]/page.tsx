import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { MailLayout } from "@/components/mail-layout";
import { accounts, mails } from "@/app/data";

interface MailboxPageProps {
  params: {
    account: string;
    mailbox: string;
    thread?: string[];
  };
}

const isValidMailbox = (mailbox: string) => {
  const validMailboxes = ["inbox", "sent", "drafts", "trash", "spam"];
  return validMailboxes.includes(mailbox.toLowerCase());
};

const isValidThread = (mailbox: string, threadId: string) => {
  // return mails[mailbox]?.some((mail) => mail.id === threadId);
  // TODO: 这里需要根据实际情况实现账号验证逻辑
  // 例如：检查数据库中是否存在该账号
  // 返回 true 表示账号存在，false 表示账号不存在
  return false;
};

export default async function MailboxPage({ params }: MailboxPageProps) {
  const paramsData = await Promise.resolve(params);
  const { account, mailbox, thread } = paramsData;

  // 验证 mailbox 是否存在
  if (!isValidMailbox(mailbox)) {
    notFound();
  }

  // 如果存在 thread 参数，验证其有效性
  // const threadId = thread?.[0];
  // if (threadId && !isValidThread(mailbox, threadId)) {
  //   notFound();
  // }

  const cookieStore = await cookies();
  const layout = cookieStore.get("react-resizable-panels:layout:mail");
  const collapsed = cookieStore.get("react-resizable-panels:collapsed");
  const scrollPosition = cookieStore.get("mail-list-scroll-position");

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;
  const defaultScrollPosition = scrollPosition
    ? Number(scrollPosition.value)
    : 0;

  return (
    <MailLayout
      accounts={accounts}
      mails={mails}
      navCollapsedSize={2}
      currentAccount={account}
      currentMailbox={mailbox}
      currentThread={thread?.[0]}
      defaultLayout={defaultLayout}
      defaultCollapsed={defaultCollapsed}
      defaultScrollPosition={defaultScrollPosition}
    />
  );
}
