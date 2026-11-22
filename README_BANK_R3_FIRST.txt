MICKY HQ — BANK OF MICKY R3 VISIBILITY REPAIR (NOVEMBER 22, 2026)

WHY YOU STILL COULD NOT SEE BANK
The previous R2 HQ archive already contained a bank view, but its sidebar button was under several other features in a scrollable list. More importantly, if the HQ website still does not show the Bank button, the live page is NOT serving the new index.html/mikael-hq.html. A previous GitHub Pages problem with this same HQ was due to a stale root index.html. No local code can change the live site without you deploying it.

THIS PACKAGE
One updated-files-only ZIP for MAIN MICKY HQ. 20 site files. It includes ALL R2 Part 1 / 2 / 3 / Assistant files plus the R3 Bank visibility repair. It does not replace V3 or the Cloudflare Worker, and does not reset KV or bank records.

INSTALL IN THE ACTUAL MAIN MICKY HQ REPOSITORY
1. Back up current MAIN HQ repository and note the branch/folder used to serve the real HQ website.
2. EXTRACT MAIN_HQ_R3_BANK_VISIBLE_ALL_UPDATED_FILES_ONLY.zip.
3. COPY ALL its contents directly into the CURRENT MickyHQ-main website root, replacing same-name files. CRITICALLY replace BOTH index.html and mikael-hq.html; use the existing unchanged files/assets as before. Do not nest inside another folder.
4. Commit/push/deploy the changed website files to the exact branch/folder serving the actual HQ URL. This might be GitHub Pages (as in earlier main HQ versions) or Cloudflare Pages depending on your configuration. Never upload the changed-files ZIP by itself as the entire website.
5. Do a hard refresh (Ctrl+Shift+R on desktop) or open the published HQ in a fresh private browser session, then log in.
6. You should now see a prominent '💰 Bank Disputes' shortcut in the top bar, an entry at the VERY TOP of the HQ side menu, and a Bank card on the Letters screen. You can also add #bank to the end of your actual HQ URL and log in to open Bank directly.
7. VERIFY THE BUILD: open View Page Source for the HQ homepage (Ctrl+U), search for 'hq-bank-release'. It MUST say '20261122-bank-r3-visible'. If not, the deployment is serving an OLD or DIFFERENT index.html. Check the hosting repository/branch/root. Cached files will also have the matching '?v=20261122-bank-r3-visible' parameter.
8. Once the Bank shows, check that it displays the 'Connected to LizzyOS V3 Bank of Micky' status and disputes. If it shows a missing-banking-script error, ensure presidential-part3-hq.js was uploaded to the same directory. If it shows a network/authorisation error, confirm the production Worker is the R2-or-later merged Worker, LIZZY_CLAIMS/KV binding and MIKAEL_HQ_KEY secret; it is NOT a visibility problem.
9. TEST WITH A NEW PRODUCTION DISPUTE FROM LIZZY'S LIVE V3: submit a debit dispute, refresh HQ Bank, write a reason and approve a refund; confirm the result before checking actual wallet credit in original browser. File another dispute and reject it with a reason. Don't create test transactions with real money. A TESTR dispute lives in TESTR and will not automatically show up on MAIN HQ.

RELEASE POLICY
- The full R2 V3 website and production Worker are unchanged in this R3 visibility patch; do not overwrite them just to restore HQ navigation.
- No live website has been remotely changed by the assistant.
- If source marker does match R3 but Bank is still missing, provide the actual HQ webpage URL and a screenshot of the page after login. We can then inspect the served page and browser errors, rather than issuing another speculative ZIP.

LOCAL TESTS
- index.html desktop and mobile: Bank header, first nav item, dispute queue, approve and reject mock backend receipts.
- mikael-hq.html desktop and mobile: same tests.
- Missing bank JS: meaningful message instead of an empty section.
- 5 isolated browser checks passed with mocked production Worker responses and no JS page errors. Local hosted full-site navigation was blocked by execution-environment network policy, so REAL live deployment and real production Worker delivery have NOT been verified.
