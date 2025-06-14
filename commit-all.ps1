git add src/models/roadmapModel.ts src/models/userModel.ts
git commit -m "Update roadmap and user models for new fields and progress tracking"

git add src/components/component/Certificate.tsx src/app/profile/certificate.tsx
git commit -m "Add professional certificate component and download logic"

git add src/models/certificationModel.ts
if (Test-Path src/app/profile/CertificateIntegration.txt) { git rm src/app/profile/CertificateIntegration.txt }
git commit -m "Remove certificate DB logic and profile display from profile page"

git add src/app/explore/roadmap/[id]/page.tsx
git commit -m "Refactor roadmap detail page: modern UI, progress tracking, certificate display"

git add src/app/explore/page.tsx src/components/component/Card.tsx
git commit -m "Redesign explore page and roadmap cards for modern look"

git add src/app/profile/page.tsx
git commit -m "Redesign profile page, make all fields editable except email"

git add src/app/admin/admin-panel/page.tsx src/app/admin/admin-panel/roadmap-create/page.tsx src/app/admin/admin-panel/AdminNavbar.tsx
git commit -m "Improve admin panel and roadmap creation forms and UI"

git add src/app/api/roadmap/progress/ src/app/api/users/updateprofile/ src/app/api/users/[id]/ src/app/api/roadmap/[id]/edit.ts src/app/api/roadmap/[id]/edit/
git commit -m "Add/update API routes for roadmap progress and user profile"

git add package.json package-lock.json
git commit -m "Install and integrate html2canvas and react-confetti for certificate and effects"

git add src/app/api/roadmap/create/route.ts src/app/api/admin/admin-panel/route.ts
git commit -m "Miscellaneous cleanup and improvements"
