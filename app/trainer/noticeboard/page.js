"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TrainerNoticeboardRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/noticeboard");
  }, [router]);
  return null;
}
