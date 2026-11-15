# RecyTech website

The statutes at `documents/statutes/statuts-recytech.pdf` remain public.
Committee and general-meeting documents are served by the Shop application at
`https://shop.recytech.me/association-documents/`, using its existing admin
accounts, SQLite database, and sessions. No credentials are stored on this site.

## Deployment order

1. Deploy the companion Shop document routes and PDFs first.
2. Verify that anonymous requests to both private listings and direct PDFs
   redirect to login, and that a current shop account can read them.
3. Deploy this site with FTP synchronization. The old committee/general-meeting
   PDFs must be deleted from the server, not merely unlinked from the pages.
4. Check that old direct PDF URLs redirect to the authenticated shop or return
   404. They must never still return PDF content. Apache `.htaccess` provides
   redirects for old bookmarks; removal of the PDFs also protects hosts where
   static files bypass Apache. Purge CDN caches of the old private PDF URLs.
5. Verify the statutes still return 200 without a login.

Keep private documents out of this site's static root. The Shop stores them
outside its public static directory and checks the current account on every
request. Already published Git history, external caches, and previous downloads
remain outside this website access control.

Run the publication checks with `python3 -m unittest discover -s tests`.

## Security maintenance

Deployment requires strict FTPS certificate verification. If the hosting account
cannot provide a trusted FTPS certificate, fix its configuration; do not switch
back to plain FTP or disable certificate verification.

Security HTTP headers and private-file rules are in `.htaccess`. Front proxies
must enforce equivalent rules if they serve static files without Apache.
The browser regression tests run with `npm ci`,
`npx playwright install chromium`, and `npm test`.

See `docs/security-audit-2026-11-15.md` for scope, findings and remaining operator
items. Historical WooCommerce credentials are known and must be revoked if still
active. Gitleaks includes a custom rule and exempts only the two immutable old
commits identified during the audit; new commits are always scanned.

The FTP service certificate identifies `plesk.librahost.fr`; deployment uses that
hostname only after verifying it resolves to the configured FTP_SERVER endpoint.
