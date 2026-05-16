export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const LIST_ID = '09df127974';
  const DATACENTER = API_KEY.split('-').pop();

  try {
    const response = await fetch(
      `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
        }),
      }
    );

    const data = await response.json();

    if (response.ok || data.title === 'Member Exists') {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: data.detail || 'Mailchimp error' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}
