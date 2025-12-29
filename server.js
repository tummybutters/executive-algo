import express from 'express';
import { createServer as createViteServer } from 'vite';
import fetch from 'node-fetch';

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3000;

async function createServer() {
    const app = express();

    // Parse JSON bodies
    app.use(express.json());

    // Newsletter subscription endpoint - proxies to Buttondown
    app.post('/api/subscribe', async (req, res) => {
        const apiKey = process.env.BUTTONDOWN_API_KEY;

        if (!apiKey) {
            console.error('BUTTONDOWN_API_KEY not set');
            return res.status(500).json({
                success: false,
                message: 'Server configuration error',
                code: 'config_error'
            });
        }

        const { email, metadata, referrer_url } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required',
                code: 'email_empty'
            });
        }

        try {
            const buttondownResponse = await fetch('https://api.buttondown.com/v1/subscribers', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${apiKey}`,
                    'Content-Type': 'application/json',
                    'X-Buttondown-Collision-Behavior': 'add'
                },
                body: JSON.stringify({
                    email_address: email.toLowerCase().trim(),
                    type: 'regular',
                    tags: ['website-signup', 'executive-algorithm'],
                    utm_source: 'website',
                    utm_medium: 'signup-form',
                    utm_campaign: 'executive-algorithm',
                    referrer_url: referrer_url || '',
                    metadata: metadata || {}
                })
            });

            const data = await buttondownResponse.json();

            if (buttondownResponse.status === 201) {
                return res.status(201).json({
                    success: true,
                    message: "Welcome aboard! You're now subscribed."
                });
            }

            // Handle error responses
            const errorMessages = {
                email_already_exists: "You're already subscribed! Check your inbox.",
                subscriber_already_exists: "You're already subscribed! Check your inbox.",
                email_invalid: "Please enter a valid email address.",
                email_blocked: "This email address cannot be subscribed.",
                rate_limited: "Too many requests. Please wait a moment and try again.",
                default: "Something went wrong. Please try again."
            };

            const errorCode = data.code || 'default';
            return res.status(buttondownResponse.status).json({
                success: false,
                message: errorMessages[errorCode] || errorMessages.default,
                code: errorCode
            });

        } catch (error) {
            console.error('Buttondown API error:', error);
            return res.status(500).json({
                success: false,
                message: 'Unable to subscribe at this time. Please try again later.',
                code: 'server_error'
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
