module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return res.status(200).json({ count: 2400 });

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts?limit=1&offset=0', {
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
      },
    });

    if (!response.ok) throw new Error(`Brevo API error: ${response.status}`);

    const data = await response.json();
    const count = data?.count ?? 2400;

    return res.status(200).json({ count });
  } catch (err) {
    console.error('Waitlist count error:', err.message);
    return res.status(200).json({ count: 2400 });
  }
};
