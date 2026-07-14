import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 },
      );
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters" },
        { status: 400 },
      );
    }

    const toEmail = process.env.SMTP_TO || process.env.SMTP_USER;

    await sendEmail({
      to: toEmail!,
      subject: subject
        ? `Contact Form: ${subject}`
        : `New Contact Form Submission from ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Name:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td>
            </tr>
            ${subject ? `<tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Subject:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${subject}</td></tr>` : ""}
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Message:</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${message}</td>
            </tr>
          </table>
          <hr style="margin: 20px 0;" />
          <p style="color: #666; font-size: 12px;">Sent from DIMATA IT Solutions website contact form</p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please try again later." },
      { status: 500 },
    );
  }
}
