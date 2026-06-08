const ERROR_MESSAGES = {
  member_exists: "You're already subscribed! Check your inbox.",
  email_invalid: 'Please enter a valid email address.',
  email_blocked: 'This email address cannot be subscribed.',
  rate_limited: 'Too many requests. Please wait a moment and try again.',
  default: 'Something went wrong. Please try again.'
};

const parseBody = (req) => {
  if (!req?.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed', code: 'method_not_allowed' });
    return;
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID || process.env.MAILCHIMP_LIST_ID;

  if (!apiKey || !serverPrefix || !audienceId) {
    console.error('Mailchimp config missing');
    res.status(500).json({ success: false, message: 'Server configuration error', code: 'config_error' });
    return;
  }

  const { email, referrer_url } = parseBody(req);

  if (!email) {
    res.status(400).json({ success: false, message: 'Email is required', code: 'email_empty' });
    return;
  }

  try {
    const mailchimpResponse = await fetch(
      `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
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
      }
    );

    const data = await mailchimpResponse.json().catch(() => ({}));

    if (mailchimpResponse.ok) {
      const message = "Welcome aboard! You're now subscribed.";
      res.status(201).json({ success: true, message });
      return;
    }

    let errorCode = 'default';
    if (data?.title === 'Member Exists') {
      errorCode = 'member_exists';
    } else if (data?.title === 'Invalid Resource' || /invalid email/i.test(data?.detail || '')) {
      errorCode = 'email_invalid';
    } else if (mailchimpResponse.status === 429) {
      errorCode = 'rate_limited';
    }

    res.status(mailchimpResponse.status).json({
      success: false,
      message: ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.default,
      code: errorCode
    });
  } catch (error) {
    console.error('Mailchimp API error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to subscribe at this time. Please try again later.',
      code: 'server_error'
    });
  }
}
