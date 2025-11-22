from jinja2 import Environment, meta

def render_email_template(template_str: str, recipient: dict):
    env = Environment()
    template = env.from_string(template_str)

    ast = env.parse(template_str)
    placeholders = meta.find_undeclared_variables(ast)

    for ph in placeholders:
        if ph not in recipient:
            raise ValueError(f"Missing '{ph}' in data.")

    return template.render(**recipient)


def generate_personalized_emails(template_str: str, recipients: list, mode="personalized"):
    results = []

    if mode == "single":
        base = recipients[0]
        body = render_email_template(template_str, base)
        for r in recipients:
            results.append({"email": r["email"], "rendered_body": body})
    else:
        for r in recipients:
            body = render_email_template(template_str, r)
            results.append({"email": r["email"], "rendered_body": body})

    return results
