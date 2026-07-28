const repo = 'akashroy8210/Anka-web-App';
const issues = [
  {
    title: '[CRITICAL] Asynchronous Background Email & SMS Queueing (BullMQ + Redis)',
    labels: 'critical,backend,performance',
    body: `### Description
Currently, Nodemailer is invoked synchronously inside \`server/controllers/payments.js\` during Razorpay payment verification. If the SMTP server experiences latency or network timeouts, the HTTP response to the client is delayed, causing potential payment confirmation timeouts.

### Impact
- Slow post-checkout user experience.
- Unhandled SMTP failure could cause request cancellation.

### Proposed Solution
- Implement BullMQ + Redis background worker queue.
- Offload Nodemailer email dispatches to a background worker.
- Add retry policies and dead-letter queueing.

### Affected Files
- \`server/controllers/payments.js\`
- \`server/services/emailService.js\``
  },
  {
    title: '[CRITICAL] Multi-Surprise Customer Account Dashboard (/dashboard)',
    labels: 'critical,feature-request,frontend,auth',
    body: `### Description
The Customer Mini Panel (\`CustomerMiniPanel.jsx\`) relies on per-instance credentials (\`instanceId\` + \`password\`). Users who purchase multiple surprises cannot manage or view all their purchases under a single unified customer account.

### Impact
- Fragmented customer experience.
- Customer support overhead for lost surprise passwords.

### Proposed Solution
- Implement a unified Customer Account Dashboard at \`/dashboard\`.
- Allow customers to register/login via Email + Password or Google OAuth.
- Associate multiple \`SurpriseInstance\` documents with a single \`User\` account ID.

### Affected Files
- \`client/src/pages/CustomerMiniPanel.jsx\`
- \`server/models/SurpriseInstance.js\`
- \`server/models/User.js\`
- \`server/controllers/instances.js\``
  },
  {
    title: '[HIGH] Socket.io Redis Adapter for Multi-Server Horizontal Scaling',
    labels: 'high,backend,scalability,websockets',
    body: `### Description
The current Socket.io server instance (\`server/server.js\`) uses memory-backed room state. When scaling the Node.js backend across multiple instances/containers (e.g. Render, AWS ECS, Heroku), client sockets on different server instances cannot exchange live control actions.

### Impact
- Breakage of real-time Live Control Room features when running in a multi-pod or load-balanced cluster environment.

### Proposed Solution
- Integrate \`@socket.io/redis-adapter\`.
- Use Redis Pub/Sub to synchronize Socket.io events across all backend nodes.

### Affected Files
- \`server/server.js\``
  },
  {
    title: '[HIGH] WhatsApp & SMS Instant Credentials Delivery API',
    labels: 'high,feature-request,notifications',
    body: `### Description
Customers frequently prefer receiving surprise link credentials and instance credentials on WhatsApp or SMS in addition to Email.

### Proposed Solution
- Integrate Twilio or WATI (WhatsApp Business API) in \`payments.js\`.
- Send an automated WhatsApp message with the Surprise Link (\`/s/:instanceId\`), Password, and Live Control Room access link immediately upon payment success.

### Affected Files
- \`server/controllers/payments.js\``
  },
  {
    title: '[HIGH] Centralized Logging & Real-time Exception Monitoring (Sentry + Winston)',
    labels: 'high,devops,security,monitoring',
    body: `### Description
Errors in production are currently logged using basic \`console.error\`. There is no centralized error tracking or crash analytics for frontend or backend exceptions.

### Proposed Solution
- Integrate Sentry (\`@sentry/react\` on client and \`@sentry/node\` on server).
- Configure Winston logger on Node.js backend for structured log rotation.

### Affected Files
- \`client/src/main.jsx\`
- \`server/server.js\``
  },
  {
    title: '[MEDIUM] Custom Subdomain & Personalized Link Support for Premium Tier',
    labels: 'medium,feature-request,premium-perk',
    body: `### Description
Premium tier buyers want personalized custom URLs (e.g., \`alex-and-sam.anka.app\` or custom domain CNAME) instead of standard generated IDs (\`/s/s-x8f2a1\`).

### Proposed Solution
- Add \`customSlug\` field to \`SurpriseInstance\` schema.
- Support wildcard routing or CNAME mapping for Premium instances.

### Affected Files
- \`server/models/SurpriseInstance.js\`
- \`client/src/App.jsx\``
  },
  {
    title: '[MEDIUM] Self-Serve Password Reset & Email Recovery Flow',
    labels: 'medium,ux,auth',
    body: `### Description
If a buyer forgets their generated surprise password, there is currently no automated password reset form on the Customer Mini Panel login screen.

### Proposed Solution
- Add "Forgot Password?" link on \`CustomerMiniPanel.jsx\`.
- Send a one-time password reset link to the customer's email.

### Affected Files
- \`client/src/pages/CustomerMiniPanel.jsx\`
- \`server/controllers/auth.js\``
  },
  {
    title: '[MEDIUM] Strict File Upload Validation & Media Quotas',
    labels: 'medium,security,media',
    body: `### Description
The file upload route (\`server/routes/uploads.js\`) should enforce strict MIME-type checking (magic bytes validation) and tier-based max file size limits (10MB for audio, 50MB for video) prior to uploading to Cloudinary or disk storage.

### Proposed Solution
- Implement multer file filter checking magic bytes.
- Enforce strict size limits based on \`tierPermissions.js\`.

### Affected Files
- \`server/routes/uploads.js\`
- \`client/src/components/shared/ReusableUploader.jsx\``
  },
  {
    title: '[LOW] Instance Expiration & Archival Strategy',
    labels: 'low,database,maintenance',
    body: `### Description
Currently, all \`SurpriseInstance\` documents remain active in MongoDB indefinitely.

### Proposed Solution
- Implement hosting duration limits based on tier (e.g. Basic: 6 months, Premium: Lifetime).
- Add cron job script to archive inactive instances after expiration.

### Affected Files
- \`server/models/SurpriseInstance.js\``
  },
  {
    title: '[LOW] Admin RBAC & Activity Audit Logging',
    labels: 'low,admin,security',
    body: `### Description
The Admin Panel (\`AdminPage.jsx\`) allows full access for any authenticated admin user. Adding granular Role-Based Access Control (Super Admin vs Support Agent) and Audit Logs will improve enterprise security.

### Proposed Solution
- Add \`role\` field to \`User\` schema (\`superadmin\` | \`support\` | \`content_manager\`).
- Implement \`AuditLog\` collection tracking admin deletions, coupon creations, and tier updates.

### Affected Files
- \`server/models/User.js\`
- \`client/src/pages/AdminPage.jsx\``
  }
];

issues.forEach((iss, idx) => {
  const url = 'https://github.com/' + repo + '/issues/new?title=' + encodeURIComponent(iss.title) + '&labels=' + encodeURIComponent(iss.labels) + '&body=' + encodeURIComponent(iss.body);
  console.log(`### Issue ${idx + 1}: ${iss.title}`);
  console.log(`👉 **[Click to Create Issue #${idx + 1} on GitHub](${url})**\n`);
});
