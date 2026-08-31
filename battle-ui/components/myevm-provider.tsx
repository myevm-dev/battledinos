 "use client";

import {
  PrivyProvider,
  usePrivy,
} from "@privy-io/react-auth";

import {
  createMyevmIdentityClient,
} from "@myevm/ecosystem";

import {
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

import ecosystemConfig from "@/ecosystem.config";

export function MyevmProvider({
  children,
}: {
  children: ReactNode;
}) {
  const appId =
    process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!appId) {
    throw new Error(
      "NEXT_PUBLIC_PRIVY_APP_ID is not configured",
    );
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: [
          "email",
          "wallet",
        ],

        appearance: {
          theme: "dark",
          accentColor: "#8b5cf6",
        },
      }}
    >
      <MyevmIdentitySync>
        {children}
      </MyevmIdentitySync>
    </PrivyProvider>
  );
}

function MyevmIdentitySync({
  children,
}: {
  children: ReactNode;
}) {
  const {
    ready,
    authenticated,
    user,
    getAccessToken,
  } = usePrivy();

  const linkedAccountTypes = useMemo(() => {
    if (!user) {
      return [];
    }

    return Array.from(
      new Set(
        user.linkedAccounts.map(
          (account) => account.type,
        ),
      ),
    );
  }, [user]);

  useEffect(() => {
    if (
      !ready ||
      !authenticated ||
      !user
    ) {
      return;
    }

    async function syncMyevm() {
      try {
        const myevm =
          createMyevmIdentityClient({
            config: ecosystemConfig,
            getAccessToken,
          });

        await myevm.ensureUser({
          email:
            user?.email?.address ??
            null,

          walletAddress:
            user?.wallet?.address ??
            null,

          linkedAccountTypes,
        });

        console.log(
          "[myevm] ecosystem account synced",
        );
      } catch (error) {
        console.error(
          "[myevm] ecosystem sync failed",
          error,
        );
      }
    }

    void syncMyevm();
  }, [
    ready,
    authenticated,
    user,
    getAccessToken,
    linkedAccountTypes,
  ]);

  return children;
}