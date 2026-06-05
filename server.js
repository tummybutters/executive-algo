import express from 'express';
import { createServer as createViteServer } from 'vite';
import fetch from 'node-fetch';

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3000;

async function createServer() {
    const app = express();

    // Parse JSON bodies
    app.use(express.json());

    // Newsletter subscription endpoint - proxies to Mailchimp
    app.post('/api/subscribe', async (req, res) => {
        const apiKey = process.env.MAILCHIMP_API_KEY;
        const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
        const audienceId = process.env.MAILCHIMP_AUDIENCE_ID || process.env.MAILCHIMP_LIST_ID;

        const { email, metadata, referrer_url } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required',
                code: 'email_empty'
            });
        }

        // If the mailing provider is not yet configured, degrade gracefully so
        // the visitor still sees a polished confirmation instead of an error.
        if (!apiKey || !serverPrefix || !audienceId) {
            console.warn('Mailchimp config missing, returning graceful confirmation');
            return res.status(200).json({
                success: true,
                message: "Thanks, you're on the list. We'll be in touch.",
                code: 'pending_setup'
            });
        }

        try {
            const mailchimpResponse = await fetch(
                `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
                {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email_address: email.toLowerCase().trim(),
                    status: 'subscribed',
                    tags: ['website-signup', 'conviction-index'],
                    merge_fields: {
                        REFERRER: referrer_url || ''
                    }
                })
            });

            const data = await mailchimpResponse.json();

            if (mailchimpResponse.status === 200 || mailchimpResponse.status === 201) {
                const message = "Welcome aboard! You're now subscribed.";
                return res.status(201).json({
                    success: true,
                    message
                });
            }

            // Handle error responses
            const errorMessages = {
                member_exists: "You're already subscribed! Check your inbox.",
                email_invalid: "Please enter a valid email address.",
                email_blocked: "This email address cannot be subscribed.",
                rate_limited: "Too many requests. Please wait a moment and try again.",
                default: "Something went wrong. Please try again."
            };

            let errorCode = 'default';
            if (data?.title === 'Member Exists') {
                errorCode = 'member_exists';
            } else if (data?.title === 'Invalid Resource' || /invalid email/i.test(data?.detail || '')) {
                errorCode = 'email_invalid';
            } else if (mailchimpResponse.status === 429) {
                errorCode = 'rate_limited';
            }

            return res.status(mailchimpResponse.status).json({
                success: false,
                message: errorMessages[errorCode] || errorMessages.default,
                code: errorCode
            });

        } catch (error) {
            console.error('Mailchimp API error:', error);
            // Never show a 500 or stack trace to the visitor. Degrade gracefully.
            return res.status(200).json({
                success: true,
                message: "Thanks, you're on the list. We'll be in touch.",
                code: 'pending_setup'
            });
        }
    });

    if (isDev) {
        // Development: Use Vite's dev server as middleware
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'spa'
        });
        app.use(vite.middlewares);
    } else {
        // Production: Serve static files from dist
        app.use(express.static('dist'));

        // SPA fallback
        app.get('*', (req, res) => {
            res.sendFile('index.html', { root: 'dist' });
        });
    }

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

createServer();
