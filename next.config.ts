import type { NextConfig } from "next";

// The portfolio itself lives at https://ekupekuai.github.io (static, GitHub Pages).
// This deployment stays up only as its API backend (/api/contact, /api/github-*),
// which needs a server for the Resend and GitHub secrets. Visitors who land on the
// old homepage are sent to the real site. Temporary (307) so it can be undone
// without browsers caching it.
const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/", destination: "https://ekupekuai.github.io/", permanent: false }];
  },
};

export default nextConfig;
