# Whitsundays 2027 — deployment

1. Keep Iceland project and its Google Sheet untouched. Create a **separate** Google Sheet for Whitsundays.
2. In that Sheet choose Extensions → Apps Script. Paste `Code.gs` into the script editor.
3. Set Apps Script **Script properties**: `GOOGLE_CLIENT_ID` (Google OAuth Web Client ID), `OWNER_EMAIL` (your Gmail), and `DRIVE_FOLDER_ID` (the ID of your existing Google Drive folder `Trips planning / 2027 Whitsunday` for uploaded documents).
4. Deploy → New deployment → Web app → Execute as **Me**, access **Anyone**. Copy the `/exec` URL.
5. In `data.js`, replace `CONFIG.api` with that URL and ensure `CONFIG.gclient` matches the OAuth client ID. Add your GitHub Pages origin to the OAuth client’s authorized JavaScript origins.
6. Upload the website files to GitHub Pages. Do not upload `Code.gs`, Iceland source files, or confidential bookings to the public repository.
7. Test: signed-out landing, sign-in, pending member, owner, checklist sync across two devices, document upload and download, and sign-out.

**Privacy:** GitHub Pages source is public. Hiding the itinerary behind a JavaScript login overlay is a UI restriction, not a security boundary. The public `data.js` contains itinerary content. For truly private itinerary data, move it into the authenticated Apps Script API.

**Scope:** This is an independent, deployable Whitsundays app with an Iceland-inspired UI and independent backend. It is **not** a verified 1:1 transplant of the 537 KB Iceland HTML app. The original Iceland files are included only as offline reference in the `iceland-reference/` directory. They are not part of the deployable website.
