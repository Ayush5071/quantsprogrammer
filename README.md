# Folder Structure

The folder structure for the project is as follows:

- `src/`
  - `api/` - Contains all API-related code.
  - `auth/` - Contains all authentication-related routes.
    - `login/` - Login route.
    - `signup/` - Signup route.
    - `forgotpassword/` - Forgot password route.
    - `resetpassword/` - Reset password route.
    - `resendverification/` - Resend verification email route.
    - `verifyemail/` - Verify email route.
    - `remindverify/` - Remind to verify email route.
  - `config/` - Configuration files.
  - `controllers/` - Route controllers.
  - `middlewares/` - Custom middleware functions.
  - `models/` - Database models.
  - `routes/` - Application routes.
  - `services/` - Business logic and service layer.
  - `utils/` - Utility functions and helpers.
  - `views/` - View templates for the application.
  - `public/` - Publicly accessible files (e.g., images, stylesheets).
  - `tests/` - Automated tests for the application.
  - `docs/` - Documentation files.
  - `scripts/` - Scripts for automation or setup.
  - `logs/` - Log files.
  - `uploads/` - Uploaded files (e.g., profile pictures, documents).
  - `locales/` - Localization files for internationalization.
  - `node_modules/` - Installed npm packages.
  - `.env` - Environment variables.
  - `.gitignore` - Files and directories to be ignored by Git.
  - `package.json` - Project metadata and dependencies.
  - `README.md` - Project documentation and setup instructions.