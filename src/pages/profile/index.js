import { useRouter } from "next/router";
import { useEffect } from "react";



export default function ProfileIndex() {
  const router = useRouter();
  useEffect(() => {
    const username = localStorage.getItem('username')
    router.push(`/profile/${username}`)
  }, [])
}
