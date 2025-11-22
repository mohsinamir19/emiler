import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

FROM_EMAIL = "mohsinamir6789@gmail.com"

def send_bulk_emails(email_list, subject):
    """
    email_list: List of dictionaries with keys 'email' and 'rendered_body'
    subject: email subject
    """
    sg = SendGridAPIClient(api_key=os.getenv("SENDGRID_API_KEY"))

    for item in email_list:
        email = item.get("email")
        body = item.get("rendered_body")
        if not email or not body:
            continue

        msg = Mail(
            from_email=FROM_EMAIL,
            to_emails=email,
            subject=subject,
            plain_text_content=body
        )

        try:
            response = sg.send(msg)
            print(f"Sent to {email} | Status: {response.status_code}")
        except Exception as e:
            print(f"Error sending to {email}: {e}")
