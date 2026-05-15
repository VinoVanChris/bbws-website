import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { service_type, first_name, last_name, email, message } = req.body;

  if (!email || !first_name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const name = [first_name, last_name].filter(Boolean).join(' ');
  const subject = service_type
    ? `Som Intake — ${service_type} from ${name}`
    : `Som Intake — Enquiry from ${name}`;

  try {
    await resend.emails.send({
      from: 'Som <som@broadwaybeerwine.ca>',
      to: ['hello@broadwaybeerwine.ca'],
      reply_to: email,
      subject,
      text: [
        `From: ${name} <${email}>`,
        `Service: ${service_type || '—'}`,
        '',
        message,
      ].join('\n'),
      html: [
        `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p>`,
        `<p><strong>Service:</strong> ${service_type || '—'}</p>`,
        `<hr>`,
        `<pre style="font-family:sans-serif;white-space:pre-wrap;">${message}</pre>`,
      ].join('\n'),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
